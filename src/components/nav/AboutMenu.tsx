import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface AboutMenuProps {
	isOpen: boolean;
	title?: string;
}

export default function AboutMenu({
	isOpen,
	title = "Chayut",
}: AboutMenuProps) {
	return (
		<motion.div
			aria-hidden={!isOpen}
			initial={false}
			animate={{
				clipPath: isOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
			}}
			transition={{ type: "spring", duration: 1, bounce: 0 }}
			className={cn(
				"fixed inset-0 z-50 bg-[#B4BAB4]",
				isOpen ? "pointer-events-auto" : "pointer-events-none",
			)}
			style={{ willChange: "clip-path" }}
		>
			<div className="p-3">
				<h1 className="text-base-900 text-5xl font-semibold tracking-tight">
					{title}
				</h1>
			</div>
		</motion.div>
	);
}
