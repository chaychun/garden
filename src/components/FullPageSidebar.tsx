import { navigate } from "astro:transitions/client";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Sidebar from "./Sidebar";
import MetadataTable from "./ui/metadata-table";

interface FullPageSidebarProps {
	scrollAreaId: string;
	title: string;
	description: string;
	createdDate: string;
	lastUpdatedDate: string;
	technologies: string[];
}

export default function FullPageSidebar({
	scrollAreaId,
	title,
	description,
	createdDate,
	lastUpdatedDate,
	technologies,
}: FullPageSidebarProps) {
	const handleBackClick = () => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			navigate("/test-preview-block");
		}
	};

	const desktopContent = (
		<div className="flex flex-1 flex-col justify-between gap-2">
			<div className="flex flex-col gap-16">
				<div className="flex w-full items-center justify-between p-4">
					<button
						onClick={handleBackClick}
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
			</div>
			<MetadataTable
				className="px-6"
				createdDate={createdDate}
				lastUpdatedDate={lastUpdatedDate}
				technologies={technologies}
			/>
		</div>
	);

	const mobileContent = (
		<div className="h-full p-6">
			<div className="flex w-[280px] flex-col gap-2">
				<motion.div
					className="text-base-900 text-5xl font-light"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", duration: 0.5, bounce: 0 }}
				>
					{title}
				</motion.div>
			</div>
			<div className="mt-24 flex flex-col gap-3">
				<button
					onClick={handleBackClick}
					className="text-base-500 hover:text-base-700 w-min text-5xl font-light transition-colors duration-300"
				>
					Back to Home
				</button>
			</div>
		</div>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={title}
			desktopContent={desktopContent}
			mobileContent={mobileContent}
			number={1}
		/>
	);
}
