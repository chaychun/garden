import MetadataTable from "@/components/ui/metadata-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./Sidebar";

interface WorkSidebarProps {
	scrollAreaId?: string;
	title: string;
	description: string;
	createdDate: string;
	lastUpdatedDate: string;
	technologies: string[];
	children?: React.ReactNode;
	disableClickOutside?: boolean;
}

export default function WorkSidebar({
	scrollAreaId = "work-scroll-area",
	title,
	description,
	createdDate,
	lastUpdatedDate,
	technologies,
	children,
	disableClickOutside,
}: WorkSidebarProps) {
	const desktopContent = (
		<>
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
			<ScrollArea className="flex h-full flex-1 flex-col overflow-y-auto">
				<div className="flex flex-col">
					<div className="flex w-full flex-col gap-2 p-6">
						<h1 className="text-base-900 font-cabinet text-4xl font-medium">
							{title}
						</h1>
						<p className="text-base-500 font-mono">{description}</p>
					</div>
					{children && (
						<div className="text-base-700 [&_a]:text-base-500 flex w-full flex-col gap-4 p-6 text-sm [&_a]:underline">
							{children}
						</div>
					)}
				</div>
				<MetadataTable
					className="mt-12 px-6"
					createdDate={createdDate}
					lastUpdatedDate={lastUpdatedDate}
					technologies={technologies}
				/>
			</ScrollArea>
		</>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={title}
			desktopContent={desktopContent}
			disableClickOutside={disableClickOutside}
		/>
	);
}
