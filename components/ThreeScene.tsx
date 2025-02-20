"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (WebGL.isWebGL2Available()) {
      // Initiate function or other initializations here
      if (typeof window !== "undefined") {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        const controls = new OrbitControls( camera, renderer.domElement );

        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.domElement);
        camera.position.set(0, 0, 1);
        controls.update()

        // Create Plane
        const geometry = new THREE.PlaneGeometry(1, 1, 300, 300);
        const material = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          wireframe: true,
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Light
        const light1 = new THREE.AmbientLight(0x666666, 0.5);
        scene.add(light1);
        const light2 = new THREE.AmbientLight(0x666666,0.5);
        light2.position.set(0.5,0,0.866);
        scene.add(light2)

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
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        }
        animate();
      }
    } else {
      const warning = WebGL.getWebGL2ErrorMessage();
      console.warn(warning);
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
