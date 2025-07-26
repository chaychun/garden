import { motion } from "motion/react";

interface AnimatedMenuIconProps {
	isOpen: boolean;
	size?: number;
	className?: string;
}

export function AnimatedMenuIcon({
	isOpen,
	size = 24,
	className = "",
}: AnimatedMenuIconProps) {
	return (
		<motion.svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			initial={false}
			animate={isOpen ? "open" : "closed"}
		>
			{/* Top line */}
			<motion.path
				d="M3 6L21 6"
				variants={{
					closed: { d: "M3 6L21 6" },
					open: { d: "M18 6L6 18" },
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			/>

			{/* Middle line */}
			<motion.path
				d="M3 12L21 12"
				variants={{
					closed: {
						d: "M3 12L21 12",
						opacity: 1,
					},
					open: {
						d: "M12 12L12 12",
						opacity: 0,
					},
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			/>

			{/* Bottom line */}
			<motion.path
				d="M3 18L21 18"
				variants={{
					closed: { d: "M3 18L21 18" },
					open: { d: "M6 6L18 18" },
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			/>
		</motion.svg>
	);
}
