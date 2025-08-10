import type { FilterType } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useRef } from "react";

interface FilterMenuProps {
	activeFilter: FilterType;
	availableFilters: FilterType[];
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (filter: FilterType) => void;
	className?: string;
}

const menuContainerVariants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.06, delayChildren: 0.04 },
	},
};

const menuItemVariants = {
	hidden: { opacity: 0, y: -8 },
	show: { opacity: 1, y: 0 },
};

export function FilterMenu({
	activeFilter,
	availableFilters,
	isOpen,
	onOpenChange,
	onSelect,
	className,
}: FilterMenuProps) {
	const triggerId = useId();
	const menuId = useId();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isOpen) {
			menuRef.current?.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const onPointerDown = (event: PointerEvent) => {
			const container = containerRef.current;
			if (!container) return;
			const target = event.target as Node | null;
			if (target && !container.contains(target)) {
				onOpenChange(false);
			}
		};

		document.addEventListener("pointerdown", onPointerDown, { passive: true });
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
		};
	}, [isOpen, onOpenChange]);

	return (
		<div className={cn("relative", className)} ref={containerRef}>
			<button
				type="button"
				onClick={() => onOpenChange(!isOpen)}
				className="text-base-900 flex cursor-pointer items-end gap-1 md:gap-2"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls={menuId}
				id={triggerId}
			>
				<motion.span
					key={activeFilter}
					layoutId={`filter-${activeFilter}`}
					className="text-4xl font-medium tracking-tight md:text-5xl"
				>
					{activeFilter}
				</motion.span>

				<motion.span layout key="chevron">
					<ChevronRight
						aria-hidden="true"
						className={cn(
							"h-8 w-8 transition-transform duration-200 md:h-9 md:w-9 md:stroke-3",
							isOpen ? "rotate-90" : "rotate-0",
						)}
					/>
				</motion.span>
			</button>

			{isOpen ? (
				<motion.div
					role="menu"
					className="absolute top-full left-0"
					variants={menuContainerVariants}
					initial="hidden"
					animate="show"
					id={menuId}
					aria-labelledby={triggerId}
					tabIndex={-1}
					ref={menuRef}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							onOpenChange(false);
						}
					}}
				>
					{availableFilters
						.filter((option) => option !== activeFilter)
						.map((filterOption) => (
							<motion.button
								key={filterOption}
								type="button"
								onClick={() => onSelect(filterOption)}
								className="block cursor-pointer text-left"
								role="menuitem"
								variants={menuItemVariants}
							>
								<span className="text-base-500 hover:text-base-900 flex items-end gap-1 transition-colors duration-300 md:gap-2">
									<motion.span
										layoutId={`filter-${filterOption}`}
										className="text-4xl font-medium tracking-tight md:text-5xl"
									>
										{filterOption}
									</motion.span>
								</span>
							</motion.button>
						))}
				</motion.div>
			) : null}
		</div>
	);
}

export default FilterMenu;
