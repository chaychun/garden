import { getDescriptionForFilter, type FilterType } from "@/lib/content-types";
import { useFilterStore } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface FilterDescriptionProps {
	className?: string;
}

export function FilterDescription({ className }: FilterDescriptionProps) {
	const { activeFilter } = useFilterStore();
	const description = getDescriptionForFilter(activeFilter as FilterType) ?? "";
	return (
		<motion.p
			className={cn(className)}
			initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			{description}
		</motion.p>
	);
}
