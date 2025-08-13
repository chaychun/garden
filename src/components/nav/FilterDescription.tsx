import { getDescriptionForFilter, type FilterType } from "@/lib/content-types";
import { useFilterStore } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";

interface FilterDescriptionProps {
	className?: string;
}

export function FilterDescription({ className }: FilterDescriptionProps) {
	const { activeFilter } = useFilterStore();
	const description = getDescriptionForFilter(activeFilter as FilterType) ?? "";
	return <p className={cn(className)}>{description}</p>;
}
