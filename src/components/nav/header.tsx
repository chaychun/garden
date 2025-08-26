import { AVAILABLE_FILTERS, type FilterType } from "@/lib/content-types";
import { useFilterStore } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

interface HeaderProps {
	title: string;
	filterCounts: Record<string, number>;
}

export default function Header({ title, filterCounts }: HeaderProps) {
	const { activeFilter, setActiveFilter } = useFilterStore();

	const handleFilterClick = (filter: FilterType) => {
		setActiveFilter(filter);
	};

	const getFilterCount = (filter: FilterType): number => {
		if (filter === "All") {
			return Object.values(filterCounts).reduce((sum, count) => sum + count, 0);
		}
		return filterCounts[filter] || 0;
	};

	return (
		<header className="p-4">
			<div className="border-base-100 bg-base-50 fixed top-0 right-0 left-0 z-40 border-b md:hidden">
				<div className="mx-auto px-4 py-3">
					<div className="flex justify-between">
						{AVAILABLE_FILTERS.map((filter) => (
							<button
								key={filter}
								onClick={() => handleFilterClick(filter)}
								className={cn(
									"flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors duration-200",
									activeFilter === filter
										? "text-base-900"
										: "text-base-300 hover:text-base-700",
								)}
							>
								<span>{filter.toLowerCase()}</span>
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="h-14 md:hidden" />
			{/* Desktop Layout */}
			<div className="hidden grid-cols-5 items-start gap-2.5 md:grid">
				<div className="text-base-900 text-xl font-medium">{title}.</div>

				<div className="flex gap-2.5">
					<div className="flex flex-col">
						{AVAILABLE_FILTERS.map((filter) => (
							<button
								key={filter}
								onClick={() => handleFilterClick(filter)}
								className={cn(
									"relative text-left text-xs leading-[1.1] font-semibold uppercase transition-colors duration-200",
									activeFilter === filter
										? "text-base-900"
										: "text-base-300 hover:text-base-700",
								)}
							>
								{activeFilter === filter && (
									<span className="text-base-900 absolute -left-6 text-xs leading-[1.1] font-semibold">
										({getFilterCount(filter)})
									</span>
								)}
								<span className="flex items-center">
									{filter.toLowerCase()}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Description Section (spans 2 columns) */}
				<div className="col-span-2 flex flex-col gap-1">
					<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
						I'm a self-taught designer-builder exploring interesting patterns on
						the web.
					</div>

					<div className="mt-2 flex items-center gap-1">
						<span className="text-base-500 text-xs leading-[1.1] font-semibold uppercase">
							More info
						</span>
						<ArrowDown className="text-base-500 h-3 w-3" strokeWidth={2.5} />
					</div>
				</div>

				{/* Contact */}
				<a
					href="mailto:chun.chayut@gmail.com"
					className="text-base-900 hover:text-base-600 cursor-pointer text-right text-xs leading-[1.1] font-semibold uppercase transition-colors"
				>
					Contact
				</a>
			</div>

			<div className="flex flex-col gap-4 md:hidden">
				<div className="grid grid-cols-5 items-start gap-2.5">
					<div className="text-base-900 col-span-2 text-xl font-medium">
						{title}.
					</div>

					{/* Description Section (spans 3 columns) */}
					<div className="col-span-3 flex flex-col gap-1">
						<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
							I'm a self-taught designer-builder exploring interesting patterns
							on the web.
						</div>

						<div className="mt-2 flex items-center gap-1">
							<span className="text-base-500 text-xs leading-[1.1] font-semibold uppercase">
								More info
							</span>
							<ArrowDown className="text-base-500 h-3 w-3" strokeWidth={2.5} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
