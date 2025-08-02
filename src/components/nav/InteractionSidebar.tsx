import MetadataTable from "@/components/ui/metadata-table";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./Sidebar";

interface InteractionSidebarProps {
	scrollAreaId?: string;
	title: string;
	description: string;
	createdDate: string;
	lastUpdatedDate: string;
	technologies: string[];
	children?: React.ReactNode;
}

export default function InteractionSidebar({
	scrollAreaId = "interaction-scroll-area",
	title,
	description,
	createdDate,
	lastUpdatedDate,
	technologies,
	children,
}: InteractionSidebarProps) {
	const desktopContent = (
		<div className="flex h-full flex-1 flex-col justify-between gap-2">
			<div className="flex flex-col gap-16">
				<div className="flex w-full items-center justify-between p-4">
					<button
						onClick={() => history.back()}
						className="text-base-500 hover:text-base-700 group flex cursor-pointer items-center gap-2 text-sm"
					>
						<span className="transition-transform duration-500 group-hover:-translate-x-[3px]">
							<ArrowLeft size={18} />
						</span>
						<span>Back</span>
					</button>
				</div>
				<div className="flex w-full flex-col gap-2 p-4">
					<h1 className="text-base-900 font-cabinet text-4xl">{title}</h1>
					<p className="text-base-500 text-sm">{description}</p>
				</div>
				{children && (
					<div className="flex w-full flex-col gap-4 p-4">
						<div className="text-base-500 text-sm">{children}</div>
					</div>
				)}
			</div>
			<MetadataTable
				className="px-6"
				createdDate={createdDate}
				lastUpdatedDate={lastUpdatedDate}
				technologies={technologies}
			/>
		</div>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={title}
			desktopContent={desktopContent}
		/>
	);
}
