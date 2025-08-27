import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { AVAILABLE_FILTERS, type FilterType } from "@/lib/content-types";
import { useFilterStore } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useState } from "react";

interface HeaderProps {
	title: string;
	filterCounts: Record<string, number>;
}

export default function Header({ title, filterCounts }: HeaderProps) {
	const { activeFilter, setActiveFilter } = useFilterStore();
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	const handleFilterClick = (filter: FilterType) => {
		setActiveFilter(filter);
	};

	const infoButton = useMemo(
		() => (
			<div className="relative mt-2 flex items-center gap-1">
				<button
					onClick={() => setIsInfoOpen((v) => !v)}
					className="text-base-500 hover:text-base-700 inline-flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors"
				>
					<span>{isInfoOpen ? "Less info" : "More info"}</span>
					{isInfoOpen ? (
						<ArrowUp className="h-3 w-3" strokeWidth={2.5} />
					) : (
						<ArrowDown className="h-3 w-3" strokeWidth={2.5} />
					)}
				</button>
				{isInfoOpen && (
					<div className="absolute top-full right-0 left-0 z-50 mt-6 max-w-[min(92vw,720px)]">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="text-base-900 flex flex-col gap-2 text-xs leading-[1.35]">
								<div className="font-semibold uppercase">About OS</div>
								<p>
									An independent design engineering studio for the web. We solve
									the gap between creative vision and technical execution.
								</p>
								<a className="underline" href="#">
									Learn more
								</a>
							</div>
							<div className="text-base-900 flex flex-col gap-2 text-xs leading-[1.35]">
								<div className="font-semibold uppercase">Philosophy</div>
								<ul className="list-disc pl-5">
									<li>Win in the details</li>
									<li>Build to elevate, not just execute</li>
									<li>Extension of teams, not external vendors</li>
								</ul>
								<a className="underline" href="#">
									Contact
								</a>
							</div>
						</div>
					</div>
				)}
			</div>
		),
		[isInfoOpen],
	);

	const getFilterCount = (filter: FilterType): number => {
		if (filter === "All") {
			return Object.values(filterCounts).reduce((sum, count) => sum + count, 0);
		}
		return filterCounts[filter] || 0;
	};

	return (
		<header className="relative z-50 p-4">
			{isInfoOpen && (
				<div
					className="from-base-50/50 fixed inset-0 z-30 bg-gradient-to-b to-transparent"
					onClick={() => setIsInfoOpen(false)}
				>
					<ProgressiveBlur
						className="h-full w-full"
						direction="top"
						blurIntensity={2}
					/>
				</div>
			)}
			<div className="relative z-50">
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
							I'm a self-taught designer-builder exploring interesting patterns
							on the web.
						</div>

						{infoButton}
					</div>

					{/* Contact */}
					<a
						href="mailto:chun.chayut@gmail.com"
						className="text-base-900 hover:text-base-600 cursor-pointer text-right text-xs leading-[1.1] font-semibold uppercase transition-colors"
					>
						Contact
					</a>
				</div>

				{/* Mobile Layout */}
				<div className="flex flex-col gap-4 md:hidden">
					<div className="grid grid-cols-5 items-start gap-2.5">
						<div className="text-base-900 col-span-2 text-xl font-medium">
							{title}.
						</div>

						{/* Description Section (spans 3 columns) */}
						<div className="col-span-3 flex flex-col gap-1">
							<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
								I'm a self-taught designer-builder exploring interesting
								patterns on the web.
							</div>

							{infoButton}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
