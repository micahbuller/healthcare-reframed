"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ThreeScene from "@/components/ThreeScene";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				const start = performance.now();
				const duration = 1800;
				const tick = (now: number) => {
					const t = Math.min((now - start) / duration, 1);
					const ease = 1 - Math.pow(1 - t, 3);
					setCount(Math.round(ease * to));
					if (t < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			},
			{ threshold: 0.5 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [to]);
	return <span ref={ref}>{count}{suffix}</span>;
}

const team = [
	{
		name: "Judson Howe",
		role: "Host",
		linkedin: "https://www.linkedin.com/in/judson-howe",
		desc: `Judson is a healthcare executive with more than a decade of leadership experience as a hospital COO, CFO, and CEO, primarily in Northern California. He has seen first-hand the pressures facing our organizational leaders as they try to make high-quality healthcare a core value in our communities. Judson's passion for understanding the forces shaping our healthcare system and for seeking new insights into how to create change are the driving forces behind this podcast series.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752162032/healthcare%20reframed/Website/Bios/IMG_0018-2_ymvcnv.jpg",
	},
	{
		name: "Micah Buller",
		role: "Creative Director",
		linkedin: "https://www.linkedin.com/in/micahbuller",
		desc: `Micah is shaping every story, video, and teaser so our mission comes to life on screen. A seasoned software developer and multi-disciplinary storyteller, he built the very website you're exploring. Micah channels his "jack-of-all-trades" skill set into helping people everywhere live happier, healthier lives.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752111630/healthcare%20reframed/Website/Bios/IMG_9760_iih4h2.jpg",
	},
	{
		name: "Lindsay Hunt",
		role: "Co-Producer",
		linkedin: "https://www.linkedin.com/in/lindsay-hunt-healthcare",
		desc: `Lindsay is a healthcare leader with over 20 years of experience in quality improvement, change management, and system transformation. She has designed and led major initiatives at the Institute for Healthcare Improvement (IHI) and the Harvard Medical School Center for Primary Care. Most recently, she has partnered with rural health systems to develop collaborative strategies that strengthen clinician and staff recruitment and retention.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752527102/healthcare%20reframed/Website/Bios/Lindsay_awueiu.jpg",
	},
	{
		name: "Todd Carpenter",
		role: "Co-Producer",
		linkedin: "https://www.linkedin.com/in/todd-carpenter-md",
		desc: `Todd is a pediatric intensive care physician, with almost 30 years of experience in clinical medicine and research, and over 100 academic publications. His deep experience as a leader in the high-tech, high-stakes world of intensive care medicine, coupled with personal experiences as a caregiver and patient, fuel his energy for making our healthcare system smarter, safer, and more patient-centered.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752527139/healthcare%20reframed/Website/Bios/Todd-2_ywmnrq.jpg",
	},
];

export default function AboutClient() {
	const [selectedMember, setSelectedMember] = useState(team[0]);

	return (
		<div className="bg-background text-foreground">

			{/* ── Hero ──────────────────────────────────────────────────── */}
			<div className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
				<ThreeScene className="absolute inset-0" />
				<div className="absolute inset-0 bg-[#EC7A5B]/20" />
				<div className="relative z-10 flex flex-col justify-end h-full min-h-[60vh] px-6 md:px-12 pb-16 pt-32 max-w-7xl mx-auto">
					<p className="font-sans uppercase text-xs tracking-widest text-[#2F2C2C]/60 mb-4">Healthcare Reframed</p>
					<h1 className="font-mono uppercase text-6xl md:text-8xl text-[#2F2C2C] leading-none">ABOUT</h1>
					<p className="font-sans text-lg md:text-xl text-[#2F2C2C]/70 mt-4 max-w-2xl leading-relaxed">
						Amplifying voices of change to build a stronger, more humane healthcare system.
					</p>
				</div>
			</div>

			{/* ── Editorial statement ───────────────────────────────────── */}
			<div className="px-6 md:px-12 pt-20 pb-12 max-w-7xl mx-auto">
				<p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-8">Our Story</p>
				<h2 className="font-mono text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.92] text-[#2F2C2C] max-w-5xl">
					The system is{" "}
					<em className="not-italic text-[#EC7A5B]">broken.</em>
					<br />We&apos;re finding people<br />
					who can <em className="not-italic text-[#EC7A5B]">fix it.</em>
				</h2>
			</div>

			{/* ── Dark band: why it matters ─────────────────────────────── */}
			{/* px applied to inner div to align text with all other page sections */}
			<div className="bg-[#2F2C2C] py-20">
				<div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-start">
					<div className="space-y-6">
						<p className="font-sans text-base md:text-lg text-background/75 leading-relaxed">
							Health and the delivery of healthcare are topics of importance around the globe.
							There is little debate that much of the world, and much of the United States,
							feels that their healthcare system needs to improve and perhaps even to change dramatically.
						</p>
						<p className="font-sans text-base md:text-lg text-background/75 leading-relaxed">
							The US healthcare system is our focus, and it has the dubious distinction of generating
							worse outcomes at greater cost than any peer nation. Why is that? What can we do about it?
							Why have we all been talking about this for what seems like forever and not made things better yet?
						</p>
					</div>
					<div className="border-l-4 border-[#EC7A5B] pl-10">
						<p className="font-mono text-xl md:text-2xl uppercase text-background leading-snug">
							&ldquo;If you share our passion for digging into these topics&hellip; you have come to the right place.&rdquo;
						</p>
					</div>
				</div>
			</div>

			{/* ── Founding story / History ───────────────────────────────── */}
			<div className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
				<div className="grid md:grid-cols-3 gap-16 items-start">
					<div className="md:col-span-2 space-y-8">
						<p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B]">How We Started</p>
						<h2 className="font-mono text-3xl md:text-4xl uppercase text-[#2F2C2C] leading-tight">
							Born from three decades<br />inside the system
						</h2>
						<p className="font-sans text-base md:text-lg leading-relaxed text-[#2F2C2C]/80">
							Healthcare Reframed was founded in 2025 by three experienced healthcare leaders — a hospital executive, a quality improvement expert, and a physician — who had spent their careers inside the very system they were trying to change.
						</p>
						<p className="font-sans text-base leading-relaxed text-[#2F2C2C]/70">
							Having seen first-hand the pressures, the paradoxes, and the extraordinary people working to make things better, they recognized a gap: the voices of change weren&apos;t connecting. Brilliant innovators were building better models of care. Courageous leaders were rethinking incentives and restoring trust. But these stories weren&apos;t reaching the broader community of practitioners, leaders, and communities who needed to hear them.
						</p>
						<p className="font-sans text-base leading-relaxed text-[#2F2C2C]/70">
							Healthcare Reframed was their answer: a multimedia platform built to amplify those voices, share those stories, and spark the ideas and relationships that can forge a stronger, more humane healthcare system in the US and beyond.
						</p>
					</div>
					<div className="bg-[#EC7A5B] p-8 rounded-3xl flex flex-col justify-center">
						<p className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/60 mb-3">Our Mission</p>
						<p className="font-mono text-lg uppercase text-[#2F2C2C] leading-snug">
							Healthcare Reframed is a 501(c)3 nonprofit organization founded in 2025 with a mission to amplify voices of change by sharing stories that inspire, connect, and empower healthcare leaders, practitioners, and communities to take action.
						</p>
					</div>
				</div>
			</div>

			{/* ── Stats ────────────────────────────────────────────────── */}
			<div className="border-t-2 border-b-2 border-[#2F2C2C] py-4">
				<div className="max-w-xs mx-auto px-6 flex flex-col divide-y-2 divide-[#2F2C2C]/20 text-center">
					<div className="py-8">
						<p className="font-mono text-5xl md:text-7xl text-[#EC7A5B] mb-2">
							<CountUp to={12} />
						</p>
						<p className="font-sans text-xs uppercase tracking-widest">Episodes</p>
					</div>
					<div className="py-8">
						<p className="font-mono text-5xl md:text-7xl text-[#EC7A5B] mb-2">
							<CountUp to={10} suffix="K+" />
						</p>
						<p className="font-sans text-xs uppercase tracking-widest">Subscribers</p>
					</div>
					<div className="py-8">
						<p className="font-mono text-5xl md:text-7xl text-[#EC7A5B] mb-2">
							<CountUp to={200} suffix="K+" />
						</p>
						<p className="font-sans text-xs uppercase tracking-widest">Views</p>
					</div>
				</div>
			</div>

			{/* ── Team ─────────────────────────────────────────────────── */}
			<div className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
				<p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-3">Our Team</p>
				<h2 className="font-mono text-4xl md:text-6xl uppercase text-[#2F2C2C] mb-12 leading-none">
					The People Behind<br />the Conversation
				</h2>

				{/* Photo grid — click to reveal bio */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					{team.map((member) => {
						const isSelected = selectedMember.name === member.name;
						return (
							<button
								key={member.name}
								onClick={() => setSelectedMember(member)}
								className={`relative group overflow-hidden rounded-2xl text-left focus:outline-none ${
									isSelected ? "ring-4 ring-[#EC7A5B]" : ""
								}`}
								style={{ aspectRatio: "3/4" }}
							>
								<Image
									src={member.img}
									alt={member.name}
									fill
									style={{ objectFit: "cover" }}
									className={`transition-all duration-500 ${
										isSelected ? "" : "grayscale group-hover:grayscale-0 group-hover:scale-105"
									}`}
									sizes="(max-width: 768px) 50vw, 25vw"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
									<p className="font-mono text-sm uppercase text-white leading-tight">{member.name}</p>
									<p className="font-mono text-xs uppercase text-[#EC7A5B] mt-1">{member.role}</p>
								</div>
							</button>
						);
					})}
				</div>

				{/* Bio panel */}
				<div className="bg-[#2F2C2C] rounded-3xl p-8 md:p-12 transition-all duration-300">
					<div className="grid md:grid-cols-3 gap-8 items-start">
						<div>
							<p className="font-mono text-xs uppercase text-[#EC7A5B] tracking-widest mb-3">
								{selectedMember.role}
							</p>
							<h3 className="font-mono text-3xl md:text-4xl uppercase text-background leading-tight mb-4">
								{selectedMember.name}
							</h3>
							{selectedMember.linkedin && (
								<Link
									href={selectedMember.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-background/60 border border-background/20 rounded-full px-4 py-2 hover:text-[#EC7A5B] hover:border-[#EC7A5B]/40 transition-colors"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
									LinkedIn
								</Link>
							)}
						</div>
						<div className="md:col-span-2">
							<p className="font-sans text-base text-background/70 leading-relaxed">
								{selectedMember.desc}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* ── Gradient quote band ───────────────────────────────────── */}
			<div className="relative overflow-hidden py-24 px-6 md:px-12">
				<div className="absolute inset-0 bg-linear-to-br from-[#EC7A5B] to-[#c4513b]" />
				<div className="relative max-w-7xl mx-auto text-center">
					<p className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/60 mb-6">Our Commitment</p>
					<blockquote className="font-mono text-2xl md:text-4xl uppercase text-[#2F2C2C] max-w-3xl mx-auto leading-tight">
						&ldquo;No ads. No corporate sponsors. No paywalls. Just honest conversations.&rdquo;
					</blockquote>
				</div>
			</div>

			{/* ── Our Approach ─────────────────────────────────────────── */}
			<div className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
				<div className="grid md:grid-cols-2 gap-16">
					<div>
						<p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-3">Our Approach</p>
						<h3 className="font-mono text-2xl uppercase mb-8 tracking-wide">How We Tell the Story</h3>
						<div className="space-y-6">
							<p className="font-sans text-base leading-relaxed text-[#2F2C2C]/80">
								Our strategy for this work has been to build out a multimedia, multi-platform approach to sharing important conversations and ideas in a thoughtful and accessible way. Our core product is a video podcast featuring honest, authentic conversations with healthcare leaders, innovators, and trailblazers about opportunities for improvement in our system and potential leverage points for change.
							</p>
							<p className="font-sans text-base leading-relaxed text-[#2F2C2C]/80">
								The core videos are supported by multiple short-form video excerpts and social media products designed to build engagement among busy professionals. A{" "}
								<Link href="https://healthcarereframed.substack.com" target="_blank" rel="noopener noreferrer"
									className="underline hover:text-[#EC7A5B] transition-colors">
									Substack site
								</Link>{" "}
								(healthcarereframed.substack.com) and newsletter and Shorthand &ldquo;scrollstories&rdquo; provide supporting written content.
							</p>
						</div>
					</div>
					<div className="border-2 border-[#EC7A5B] p-8 rounded-3xl flex flex-col justify-center">
						<h3 className="font-mono text-2xl uppercase mb-6 tracking-wide">Support Us</h3>
						<p className="font-sans text-base leading-relaxed mb-6 text-[#2F2C2C]/80">
							If you find our work meaningful, please consider making a donation to help keep
							these conversations alive.
						</p>
						<a href="#" className="font-mono uppercase text-sm px-8 py-4 bg-[#EC7A5B] text-white text-center hover:opacity-80 transition-opacity rounded-full self-start">
							Donate
						</a>
					</div>
				</div>
			</div>

		</div>
	);
}


