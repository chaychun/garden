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
				"fixed inset-0 z-50 overflow-y-auto bg-[#D6D7CB] md:overflow-y-hidden",
				isOpen ? "pointer-events-auto" : "pointer-events-none",
			)}
			style={{ willChange: "clip-path" }}
		>
			<div className="flex h-full flex-col p-3">
				<h1 className="text-base-900 text-5xl font-semibold tracking-tight md:text-7xl">
					Chayut Chunsamphran
				</h1>
				<div className="mt-16 w-full flex-1 md:flex">
					<div className="flex flex-col gap-16 md:flex-2 md:justify-between">
						<p className="text-base-900 md:clamp-[text,24px,40px,md,2xl] text-[28px] leading-none">
							I build thoughtful interactive websites and web apps that enhance
							our experiences with technologies. My work explores calm design
							patterns, experimental UI paradigms, and the intersection of
							technology and human behavior.
						</p>
						<img
							src={profile}
							alt="Chayut's portrait"
							className="w-3/4 max-w-[400px]"
							loading="lazy"
						/>
					</div>
					<div className="mt-16 flex flex-col md:mt-0 md:flex-3 md:justify-between">
						<div className="grid grid-cols-4 gap-y-4 md:grid-cols-3">
							<div className="text-base-500 col-start-1 font-mono text-xs md:mr-12 md:justify-self-end md:text-sm">
								Vision
							</div>
							<div className="text-base-900 md:clamp-[text,lg,2xl,md,2xl] col-span-3 col-start-2 space-y-2 leading-none!">
								<p>
									I believe technology should adapt to our needs, supporting the
									way we think, work, and live. With the right patterns, it can
									evoke clarity, encourage curiosity, and act as a true
									facilitator for our ideas.
								</p>
								<p>
									Many tools today are still shaped by the constraints of the
									machine, asking us to match its logic instead of our own. No
									one has folders in their brain. Our thoughts branch, connect,
									and evolve in ways far more organic. Improvements in computing
									means that future software interfaces can be fluid, perhaps
									adapting to the thought pattern of each user. I'm exploring
									ways to make this a reality.
								</p>
							</div>

							<div className="text-base-500 col-start-1 row-start-3 font-mono text-xs md:mr-12 md:justify-self-end md:text-sm">
								Details
							</div>
							<p className="text-base-900 md:clamp-[text,lg,2xl,md,2xl] col-span-3 col-start-2 row-start-3 leading-none!">
								I build content-first websites and web apps, working mainly with{" "}
								<UnderlineLink
									href="https://astro.build"
									className="text-base-700"
								>
									Astro
								</UnderlineLink>{" "}
								and{" "}
								<UnderlineLink
									href="https://react.dev"
									className="text-base-700"
								>
									React
								</UnderlineLink>
								. My approach combines creative layouts with purposeful
								interaction, drawing on my strength in motion design to create
								smooth, seamless animations with libraries like{" "}
								<UnderlineLink
									href="https://motion.dev"
									className="text-base-700"
								>
									Motion
								</UnderlineLink>{" "}
								and{" "}
								<UnderlineLink
									href="https://gsap.com"
									className="text-base-700"
								>
									GSAP
								</UnderlineLink>
								. I work across both structure and presentation, aiming for
								projects that are fast, focused, and enjoyable to use.
							</p>
						</div>
						<div className="clamp-[text,24px,32px,375px,1024px] text-base-900 mt-16 flex w-full justify-between leading-[1.1]">
							<UnderlineLink href="mailto:chun.chayut@gmail.com">
								chun.chayut@gmail.com
							</UnderlineLink>
							<UnderlineLink href="https://github.com/chaychun">
								Github
							</UnderlineLink>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
