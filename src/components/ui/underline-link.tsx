import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface UnderlineLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

export function UnderlineLink({
	href,
	children,
	className = "",
}: UnderlineLinkProps) {
	const [isHovered, setIsHovered] = useState(false);

	const transition = {
		type: "spring" as const,
		duration: 0.3,
		bounce: 0,
	};

	return (
		<AnimatePresence>
			<motion.a
				href={href}
				className={`relative inline-block overflow-hidden before:absolute before:bottom-0 before:left-0 before:h-[0.0625em] before:w-full before:origin-left before:scale-x-[var(--left-scale)] before:bg-red-500 after:absolute after:right-0 after:bottom-0 after:h-[0.0625em] after:w-full after:origin-right after:scale-x-[var(--right-scale)] after:bg-current ${className}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				initial={{
					"--left-scale": "0",
					"--right-scale": "1",
				}}
				animate={{
					"--left-scale": isHovered ? "1" : "0",
					"--right-scale": isHovered ? "0" : "1",
				}}
				transition={{
					"--left-scale": { ...transition, delay: isHovered ? 0.15 : 0 },
					"--right-scale": { ...transition, delay: isHovered ? 0 : 0.15 },
				}}
			>
				{children}
			</motion.a>
		</AnimatePresence>
	);
}
