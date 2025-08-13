import { cn, formatDate } from "@/lib/utils";

interface Props {
	createdDate: string;
	lastUpdatedDate: string;
	types: string[];
	className?: string;
}

const MetadataTable = ({
	createdDate,
	lastUpdatedDate,
	types,
	className,
}: Props) => {
	return (
		<div className={cn("w-full", className)}>
			{/* Title */}
			<div className="text-base-500 mb-2 text-xs font-medium tracking-wide uppercase">
				DETAILS
			</div>

			{/* Horizontal separator */}
			<div className="flex">
				<div className="border-base-100 h-2 w-full flex-1 border-x border-t" />
				<div className="border-base-100 h-2 w-full flex-1 border-t border-r" />
			</div>

			{/* Dates */}
			<div className="mt-1 flex">
				<div className="flex-1">
					<div className="text-base-400 text-[10px] tracking-wide">Created</div>
					<div className="text-base-700 font-mono text-xs">
						{formatDate(createdDate)}
					</div>
				</div>
				<div className="flex-1">
					<div className="text-base-400 text-[10px] tracking-wide">
						Last Updated
					</div>
					<div className="text-base-700 font-mono text-xs">
						{formatDate(lastUpdatedDate)}
					</div>
				</div>
			</div>

			{/* Horizontal separator */}
			<div className="border-base-100 mt-4 h-2 w-full border-x border-t" />

			{/* Types */}
			<div className="mt-1">
				<div className="text-base-400 mb-1 text-[10px] tracking-wide">
					Types
				</div>
				<div className="flex flex-wrap gap-1">
					{types.map((type) => (
						<span
							key={type}
							className="border-base-300/30 text-base-500 hover:bg-base-300/30 inline-block border px-3 py-1 font-mono text-[10px] transition-colors duration-200 select-none hover:border-transparent"
						>
							{`${type.slice(0, 1).toUpperCase()}${type.slice(1)}`}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default MetadataTable;
