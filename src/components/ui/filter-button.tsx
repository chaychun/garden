import { motion } from "motion/react";
import React from "react";

type FilterButtonProps = {
	active: boolean;
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	ariaLabel?: string;
};

export function FilterButton({
	active,
	onClick,
	children,
	className = "",
	disabled = false,
	ariaLabel,
}: FilterButtonProps) {
	return (
		<motion.button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-pressed={active}
			aria-label={ariaLabel}
			className={`group relative isolate inline-flex items-center overflow-hidden rounded-full whitespace-nowrap focus:outline-none ${
				active
					? "bg-base-900 text-base-100 py-1.5 pr-3 pl-6"
					: "bg-base-900 text-base-900 px-3 py-1.5"
			} transition-[color,padding] duration-300 ${className}`}
			layout
		>
			<span className="relative z-10">{children}</span>
			<motion.span
				aria-hidden
				className="bg-base-100 group-hover:bg-base-50 absolute inset-[1px] z-0 transition-colors duration-300"
				initial={false}
				animate={{
					clipPath: active
						? "inset(calc(50% - 0.45em) calc(100% - 0.4rem - 0.9em) calc(50% - 0.45em) 0.4rem round 9999px)"
						: "inset(0% 0% 0% 0% round 9999px)",
				}}
				transition={{ type: "spring", duration: 0.6, bounce: 0 }}
				style={{ willChange: "clip-path" }}
			/>
		</motion.button>
	);
}
