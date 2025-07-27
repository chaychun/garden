import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { motion } from "motion/react";

interface FullContentAreaProps {
	children: React.ReactNode;
}

export default function FullContentArea({ children }: FullContentAreaProps) {
	const { isExpanded } = useSidebarStore();

	return (
		<motion.div
			className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200"
			animate={{
				marginTop: isExpanded ? "1rem" : "0rem",
				marginRight: isExpanded ? "1rem" : "0rem",
				marginBottom: isExpanded ? "1rem" : "0rem",
				height: isExpanded ? "calc(100vh - 2rem)" : "100vh",
			}}
			transition={{
				type: "spring",
				duration: 0.8,
				bounce: 0,
			}}
		>
			{children}
		</motion.div>
	);
}
