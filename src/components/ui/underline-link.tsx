import { motion, MotionConfig } from "motion/react";
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
		<MotionConfig transition={transition}>
			<a
				href={href}
				className={`relative inline-flex items-baseline overflow-hidden ${className}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{children}

				{/* Idle underline */}
				<motion.span
					className="absolute bottom-0 left-0 h-[0.0625em] bg-current"
					style={{ width: "100%" }}
					animate={{
						x: isHovered ? "150%" : "0%",
						transition: { ...transition, delay: isHovered ? 0 : 0.1 },
					}}
				/>

				{/* New underline that animates in from left */}
				<motion.span
					className="absolute bottom-0 left-0 h-[0.0625em] bg-current"
					style={{ width: "100%" }}
					initial={{ x: "-100%" }}
					animate={{
						x: isHovered ? "0%" : "-150%",
						transition: { ...transition, delay: isHovered ? 0.1 : 0 },
					}}
				/>
			</a>
		</MotionConfig>
	);
}
