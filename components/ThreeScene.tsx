"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import gsap from "gsap";

const pallete = ["#EC7A5B","#EB795C","#FDE8A6","#EEB7D5","#FEF8E5"] 

const newPallete = pallete.map((color:string) => new THREE.Color(color))

const vertexShader: string = `uniform float time;
uniform vec3 uColor[5];
varying vec2 vUv;
varying vec3 vColor;


//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {

  vec2 noiseCoord = uv*vec2(5.,8.);

  float tilt = -5.*uv.y;

  float incline = uv.x*0.5;

  float offset = incline*mix(-.25,0.25,uv.y);

  float noise = snoise(vec3(noiseCoord.x + time*3., noiseCoord.y, time*10.));
  noise = max(0.,noise);

  vec3 pos = vec3(position.x,position.y,position.z + noise * 1. + tilt + incline + offset);

  vColor = uColor[4];

  for(int i = 0; i < 5; i++){
    float noiseFlow = 5. * float(i)*0.3;
    float noiseSpeed = 10. + float(i)*0.3;
    float noiseSeed = 1. + float(i)*10.;
    vec2 noiseFreq = vec2(0.4,0.6);

    float noiseFloor = 0.1;
    float noiseCeil = 0.8 + float(i)*0.07;

    float noise = smoothstep(noiseFloor, noiseCeil, snoise(vec3(noiseCoord.x*noiseFreq.x + time*noiseFlow, noiseCoord.y*noiseFreq.y, time * noiseSpeed + noiseSeed)));

    vColor = mix(vColor, uColor[i], noise);
  }

  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;


}`;

const fragmentShader: string = `
precision mediump float;
varying vec2 vUv;
varying vec3 vColor;

vec3 colorA = vec3(0.912,0.191,0.652);
vec3 colorB = vec3(1.000,0.777,0.052);

void main() {
  vec3 color = mix(colorA, colorB, vUv.x);

  gl_FragColor = vec4(color,1.0);
  gl_FragColor = vec4(vColor,1.0);

  
}`;

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (WebGL.isWebGL2Available()) {
      // Initiate function or other initializations here
      if (typeof window !== "undefined") {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        let time: number = 0.01;

        renderer.setClearColor(0xffffff, 0);

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);
        camera.position.set(0, 0, 0.2);

        // Create Plane
        const geometry = new THREE.PlaneGeometry(20, 20, 200, 200);
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
          // wireframe: true,
          uniforms: { 
            time: { value: 0.0 },
            uColor: {value: newPallete}
          },
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Light
        const light1 = new THREE.AmbientLight(0x666666, 0.5);
        scene.add(light1);
        const light2 = new THREE.AmbientLight(0x666666, 0.5);
        light2.position.set(0.5, 0, 0.866);
        scene.add(light2);

        // Resize Handling
        const handleResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        // Animation Loop
        function animate() {
          time += 0.00005;
          material.uniforms.time.value = time;
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }
        animate();

         // Apply Fade-in Effect with GSAP
         gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 2, delay: 0.5 }
        );
      }
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      console.warn(warning);
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
