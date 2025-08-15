import { UnderlineLink } from "@/components/ui/underline-link";
import { cn } from "@/lib/utils";
import { getCldImageUrl } from "astro-cloudinary/helpers";
import { motion } from "motion/react";
import { useEffect } from "react";

interface AboutMenuProps {
	isOpen: boolean;
}

export default function AboutMenu({ isOpen }: AboutMenuProps) {
	const profile = getCldImageUrl({
		src: "profile-square_hnctm1",
		width: 500,
		grayscale: true,
	});

	useEffect(() => {
		if (isOpen) {
			document.documentElement.classList.add("mobile-menu-open");
		} else {
			document.documentElement.classList.remove("mobile-menu-open");
		}

		return () => {
			document.documentElement.classList.remove("mobile-menu-open");
		};
	}, [isOpen]);

	return (
		<motion.div
			role="dialog"
			aria-modal="true"
			aria-hidden={!isOpen}
			initial={false}
			animate={{
				clipPath: isOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
			}}
			transition={{ type: "spring", duration: 1, bounce: 0 }}
			className={cn(
				"fixed inset-0 z-50 overflow-y-auto bg-[#D6D7CB] lg:overflow-y-hidden",
				isOpen ? "pointer-events-auto" : "pointer-events-none",
			)}
			style={{ willChange: "clip-path" }}
		>
			<div className="flex flex-col gap-16 p-3 lg:h-full lg:gap-32 lg:pb-24">
				<div className="flex w-full flex-col gap-16 lg:flex-row lg:gap-0">
					<h1 className="text-base-900 selection:bg-base-900 lg:clamp-[text,6xl,8xl,1024px,1920px] clamp-[text,5xl,6xl,375px,1024px] flex-1 leading-none font-semibold tracking-tight">
						Chayut
						<br />
						Chunsamphran
					</h1>
					<p className="text-base-900 selection:bg-base-900 lg:clamp-[text,28px,40px,1024px,1920px] clamp-[text,24px,40px,375px,1024px] flex-1 leading-none lg:mr-10">
						I build interactive websites and web apps that enhance our
						experiences with technologies. My work explores calm design
						patterns, experimental UI paradigms, and the intersection of
						technology and human behavior.
					</p>
				</div>
				<div className="flex w-full flex-col gap-16 lg:flex-row lg:gap-0">
					<div className="flex-1">
						<img
							src={profile}
							alt="Chayut's portrait"
							className="aspect-square h-auto w-3/4 max-w-[400px] min-w-[200px] lg:w-1/2"
							loading="lazy"
						/>
					</div>
					<div className="text-base-900 lg:clamp-[text,lg,2xl,1024px,1920px] clamp-[text,base,xl,375px,1024px] selection:bg-base-900 lg:clamp-[mr,6,24,1024px,1920px] clamp-[mr,0,24,375px,1024px] order-2 grid flex-1 grid-cols-4 space-y-4 leading-none! lg:order-3 lg:grid-cols-1">
						<p className="col-span-3 col-start-2 lg:col-span-1 lg:col-start-1">
							I believe technology should adapt to our needs, supporting the way
							we think, work, and live, instead of asking us to match its logic.
							Future software interfaces can be fluid. They can evoke clarity,
							encourage curiosity, and act as a true facilitator for our ideas.
						</p>

						<p className="col-span-3 col-start-2 lg:col-span-1 lg:col-start-1">
							This site is a series of small experiments in interface design,
							aimed at creating structures that are both intuitive and
							adaptable. I focus on designs and interactions that guide without
							imposing, allowing the technology to recede into the background.
							Each project is an opportunity to explore how technology can fit
							more naturally into the ways we already think.
						</p>
					</div>

					<div className="text-base-900 selection:bg-base-900 lg:clamp-[text,xl,4xl,1024px,1920px] clamp-[text,lg,2xl,375px,1024px] order-3 flex w-full flex-1 flex-row justify-between gap-4 lg:order-2 lg:flex-col lg:justify-start lg:gap-0">
						<UnderlineLink
							href="mailto:chun.chayut@gmail.com"
							className="w-min"
						>
							chun.chayut@gmail.com
						</UnderlineLink>
						<UnderlineLink href="https://github.com/chaychun" className="w-min">
							Github
						</UnderlineLink>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
