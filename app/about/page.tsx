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
		desc: `Micah captures the conversations in this series, but he is much more than just “the tech guy.” He is a wellness enthusiast constantly looking to learn more about creating health and well-being in his own life and helping others to do the same. He also has his own podcast series on healthy living in development.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752111630/healthcare%20reframed/Website/Bios/IMG_9760_iih4h2.jpg", // Replace with your image path
	},
	{
		name: "Lindsay Hunt",
		role: "Co-Producer",
		desc: `Lindsay is a healthcare leader with extensive experience in patient safety, quality improvement, and system transformation, both during a stint at the Institute for Healthcare Improvement (IHI) and as an independent consultant. Her insights into building innovative cross-sector programs, and her extensive connections within the healthcare community have been instrumental in developing this series.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752111630/healthcare%20reframed/Website/Bios/IMG_9760_iih4h2.jpg", // Replace with your image path
	},
	{
		name: "Todd Carpenter",
		role: "Co-Producer",
		desc: `Todd is a pediatric intensive care physician, with almost 30 years of experience in clinical medicine and research, and over 100 academic publications. His deep experience as a leader in the high-tech, high-stakes world of intensive care medicine, coupled with personal experiences as a caregiver and patient, fuel his energy for making our healthcare system smarter, safer, and more patient-centered.`,
		img: "https://res.cloudinary.com/mindflip/image/upload/v1752111630/healthcare%20reframed/Website/Bios/IMG_9760_iih4h2.jpg", // Replace with your image path
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
		<div className="max-w-5xl mx-auto px-6 py-16 font-sans">
			<h1 className="text-5xl font-bold text-[#2F2C2C] mb-8 tracking-tight uppercase">
				About us
			</h1>
			<div
				ref={aboutRef}
				className="prose prose-lg max-w-none text-[#2F2C2C] mb-16"
			>
				<p>
					Health and the delivery of healthcare are topics of importance around
					the globe. There is little debate that much of the world, and much of
					the United States, feels that their healthcare system needs to improve
					and perhaps even to change dramatically. The US healthcare system is our
					focus, and it has the dubious distinction of generating worse outcomes
					at greater cost than any peer nation. Why is that? What can we do about
					it? Why have we all been talking about this for what seems like forever
					and not made things better yet? If you share our passion for digging
					into these topics, gathering ideas and insights into how to change the
					system, and maybe want to stretch your world view a bit, you have come
					to the right place.
				</p>
				<p>
					We have each been fortunate to have the time and space to talk with each
					other and to learn and think hard about our experiences and insights
					into the world of healthcare. We created this site and this podcast
					series to share our reflective conversations with smart, experienced
					and insightful healthcare leaders who are passionate about making the
					world a better place, to amplify their important voices, and to share
					what we have learned about the issues and ideas that these interviews
					led us to explore more deeply. For each episode, we have also created a
					scrollstory to share additional background and context for a selection
					of the topics discussed during the interviews between Judson and our
					guests. Working to put together all of this content has been hugely
					energizing and enlightening for us, and we are eager to share what we
					have learned with you.
				</p>
				<p>
					The world definitely does not have a shortage of healthcare related
					information available on the internet. Between all of the podcasts and
					websites and news articles and magazines and corporate websites and
					government websites and published medical research, we often seem to be
					drowning in healthcare related information. And it is not always easy
					to tell who is creating and curating that content, or how much of the
					information provided is really designed to generate clicks and views
					and to sell you things. You will find no ads or corporate sponsors or
					paywalls on this site, no attempt to monetize your interest. But we do
					have to keep the lights on, so if you find our efforts here
					interesting and maybe even useful, please consider making a donation of
					whatever size seems appropriate to you.
				</p>
			</div>
			<h2 className="text-3xl font-bold text-[#2F2C2C] mb-8 uppercase tracking-wide">
				Our team
			</h2>
			<div ref={teamRef} className="grid gap-10 md:grid-cols-2">
				{team.map((member) => (
					<div
						key={member.name}
						className="flex flex-col items-center"
						style={{ position: "relative" }}
					>
						<div className="relative w-full flex justify-center">
							<Image
								src={member.img}
								alt={member.name}
								width={320}
								height={320}
								className=" w-64 h-64 object-cover rounded-3xl shadow-lg shadow-[#EC7A5B]"
							/>
							<div className="absolute left-4 bottom-4 bg-[#EC7A5B] text-white px-4 py-1 rounded-xl flex flex-col items-start">
								<span className="font-bold text-lg">{member.name}</span>
								<span className="text-xs font-mono">{member.role}</span>
							</div>
						</div>
						<p className="mt-8 text-base text-[#2F2C2C] text-left w-full">
							{member.desc}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}