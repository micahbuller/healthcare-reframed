"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";


const team = [
	{
		name: "Judson Howe",
		role: "Host",
		desc: `Judson is a healthcare executive with more than a decade of leadership experience as a hospital COO, CFO, and CEO, primarily in Northern California. He has seen first-hand the pressures facing our organizational leaders as they try to make high-quality healthcare a core value in our communities. Judson’s passion for understanding the forces shaping our healthcare system and for seeking new insights into how to create change are the driving forces behind this podcast series.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752162032/healthcare%20reframed/Website/Bios/IMG_0018-2_ymvcnv.jpg", // Replace with your image path
	},
	{
		name: "Micah Buller",
		role: "Creative Director",
		desc: `Micah is shaping every story, video, and teaser so our mission comes to life on screen. A seasoned software developer and multi-disciplinary storyteller, he built the very website you’re exploring. Micah channels his “jack-of-all-trades” skill set into helping people everywhere live happier, healthier lives.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752111630/healthcare%20reframed/Website/Bios/IMG_9760_iih4h2.jpg", // Replace with your image path
	},
	{
		name: "Lindsay Hunt",
		role: "Co-Producer",
		desc: `Lindsay is a healthcare leader with over 20 years of experience in quality improvement, change management, and system transformation. She has designed and led major initiatives at the Institute for Healthcare Improvement (IHI) and the Harvard Medical School Center for Primary Care. Most recently, she has partnered with rural health systems to develop collaborative strategies that strengthen clinician and staff recruitment and retention. Lindsay contributes her deep experience and thoughtful perspective to help guide the podcast development.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752527102/healthcare%20reframed/Website/Bios/Lindsay_awueiu.jpg", // Replace with your image path
	},
	{
		name: "Todd Carpenter",
		role: "Co-Producer",
		desc: `Todd is a pediatric intensive care physician, with almost 30 years of experience in clinical medicine and research, and over 100 academic publications. His deep experience as a leader in the high-tech, high-stakes world of intensive care medicine, coupled with personal experiences as a caregiver and patient, fuel his energy for making our healthcare system smarter, safer, and more patient-centered.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752527139/healthcare%20reframed/Website/Bios/Todd-2_ywmnrq.jpg", // Replace with your image path
	},
];

export default function AboutPage() {
	const aboutRef = useRef<HTMLDivElement>(null);
	const teamRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (aboutRef.current) {
			gsap.set(aboutRef.current, { opacity: 0, y: 40 });
			gsap.to(aboutRef.current, {
				opacity: 1,
				y: 0,
				duration: 1,
				ease: "power2.out",
			});
		}
		if (teamRef.current) {
			const cards = Array.from(teamRef.current.children);
			gsap.set(cards, { opacity: 0, y: 40 });
			gsap.to(cards, {
				opacity: 1,
				y: 0,
				stagger: 0.2,
				duration: 1,
				ease: "power2.out",
				delay: 0.5,
			});
		}
	}, []);

	return (
		<div className="max-w-6xl mx-auto px-6 py-16 font-sans">
			{/* Header Section - USAL Style */}
			<div className="mb-24">
				<h1 className="text-6xl md:text-8xl font-mono text-[#2F2C2C] mb-8 tracking-tight uppercase">
					ABOUT
				</h1>
			</div>

			{/* Mission Statement - Clean blocks */}
			<div ref={aboutRef} className="mb-32">
				<div className="grid md:grid-cols-3 gap-12">
					<div className="md:col-span-2">
						<div className="space-y-8 text-[#2F2C2C]">
							<div className="border-l-4 border-[#EC7A5B] pl-8">
								<p className="text-lg font-sans leading-relaxed">
									Health and the delivery of healthcare are topics of importance around
									the globe. There is little debate that much of the world, and much of
									the United States, feels that their healthcare system needs to improve
									and perhaps even to change dramatically.
								</p>
							</div>
							<div className="border-l-4 border-[#2F2C2C] pl-8">
								<p className="text-lg font-sans leading-relaxed">
									The US healthcare system is our focus, and it has the dubious distinction 
									of generating worse outcomes at greater cost than any peer nation. Why is 
									that? What can we do about it? Why have we all been talking about this for 
									what seems like forever and not made things better yet?
								</p>
							</div>
							<div className="border-l-4 border-[#EC7A5B] pl-8">
								<p className="text-lg font-sans leading-relaxed">
									If you share our passion for digging into these topics, gathering ideas 
									and insights into how to change the system, and maybe want to stretch your 
									world view a bit, you have come to the right place.
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center">
						<div className="border-2 border-[#2F2C2C] p-8">
							<h3 className="font-mono text-xl uppercase text-[#2F2C2C] mb-4">Our Mission</h3>
							<p className="font-sans text-sm text-[#2F2C2C] uppercase tracking-wide">
								Amplifying important voices and sharing insights to transform healthcare
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Team Section */}
			<div className="mb-16">
				<h2 className="text-4xl md:text-6xl font-mono text-[#2F2C2C] mb-16 uppercase tracking-wide">
					TEAM
				</h2>
				<div ref={teamRef} className="space-y-16">
					{team.map((member, index) => (
						<div
							key={member.name}
							className={`grid md:grid-cols-2 gap-12 items-center ${
								index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
							}`}
						>
							{/* Image Section */}
							<div className={`relative ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
								<div className="relative">
									<Image
										src={member.img}
										alt={member.name}
										width={400}
										height={400}
										className="w-full h-80 md:h-96 object-cover border-4 border-[#2F2C2C]"
									/>
									{/* Name Tag - Angular overlay */}
									<div className="absolute bottom-0 left-0 bg-[#EC7A5B] text-white p-6 border-4 border-[#2F2C2C] border-b-0 border-l-0">
										<span className="font-mono text-lg uppercase tracking-wide">{member.name}</span>
									</div>
								</div>
							</div>
							
							{/* Content Section */}
							<div className={`${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
								<div className="border-2 border-[#2F2C2C] p-8">
									<div className="mb-6">
										<span className="font-mono text-sm uppercase text-[#EC7A5B] tracking-widest">{member.role}</span>
									</div>
									<p className="font-sans text-base text-[#2F2C2C] leading-relaxed">
										{member.desc}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Additional Mission Content */}
			<div className="mt-32 border-t-4 border-[#2F2C2C] pt-16">
				<div className="grid md:grid-cols-2 gap-16">
					<div>
						<h3 className="font-mono text-2xl uppercase text-[#2F2C2C] mb-8 tracking-wide">
							Our Approach
						</h3>
						<div className="space-y-6">
							<p className="font-sans text-base text-[#2F2C2C] leading-relaxed">
								We have each been fortunate to have the time and space to talk with each
								other and to learn and think hard about our experiences and insights
								into the world of healthcare. We created this site and this podcast
								series to share our reflective conversations with smart, experienced
								and insightful healthcare leaders who are passionate about making the
								world a better place.
							</p>
							<p className="font-sans text-base text-[#2F2C2C] leading-relaxed">
								For each episode, we have also created a scrollstory to share additional 
								background and context for a selection of the topics discussed during the 
								interviews between Judson and our guests.
							</p>
						</div>
					</div>
					<div>
						<h3 className="font-mono text-2xl uppercase text-[#2F2C2C] mb-8 tracking-wide">
							Our Commitment
						</h3>
						<div className="border-2 border-[#EC7A5B] p-8">
							<p className="font-sans text-base text-[#2F2C2C] leading-relaxed mb-4">
								You will find no ads or corporate sponsors or paywalls on this site, 
								no attempt to monetize your interest. 
							</p>
							<p className="font-sans text-sm text-[#2F2C2C] uppercase tracking-wide">
								But we do have to keep the lights on, so if you find our efforts here
								interesting and maybe even useful, please consider making a donation.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}