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
				<div className="mt-16 w-full flex-1 md:flex md:gap-12">
					<div className="flex flex-col gap-16 md:flex-2 md:justify-between">
						<p className="text-base-900 md:clamp-[text,24px,40px,md,2xl] text-[28px] leading-none">
							Tempor fugiat velit voluptate dolor nisi. Et non et eiusmod
							adipisicing Lorem. Consequat ad laboris ipsum commodo do nostrud
							ad consectetur quis eu reprehenderit esse occaecat officia.
						</p>
						<img
							src={profile}
							alt="Chayut's portrait"
							className="w-3/4 max-w-[400px]"
						/>
					</div>
					<div className="mt-16 flex flex-col md:mt-0 md:flex-3 md:justify-between">
						<div className="grid grid-cols-4 gap-y-4">
							<div className="text-base-500 col-start-1 font-mono text-xs md:text-sm">
								Category
							</div>
							<p className="text-base-900 col-span-3 col-start-2 leading-none md:text-xl">
								Ea labore cillum occaecat commodo magna nisi mollit. Quis
								laborum sit ipsum deserunt cupidatat aliquip dolore adipisicing.
								Officia esse sint consectetur excepteur exercitation
								adipisicing.
							</p>
							<div className="text-base-500 col-start-1 row-start-2 font-mono text-xs md:text-sm">
								More
							</div>
							<p className="text-base-900 col-span-3 col-start-2 row-start-2 leading-none md:text-xl">
								Commodo commodo elit dolor ullamco veniam veniam tempor tempor.
								Consectetur laborum quis esse Lorem esse. Consectetur ex
								excepteur culpa. Anim ex dolore aliqua id fugiat anim.
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
