import { UnderlineLink } from "@/components/ui/underline-link";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { motion } from "motion/react";
import Sidebar from "./Sidebar";

interface FullPageSidebarProps {
	scrollAreaId: string;
	title: string;
}

export default function FullPageSidebar({
	scrollAreaId,
	title,
}: FullPageSidebarProps) {
	const { toggleMobileMenu } = useSidebarStore();

	const desktopContent = (
		<>
			<div className="flex w-full items-center justify-between p-4">
				<a href="/" className="text-base-900 text-lg font-semibold">
					Back to Home
				</a>
				<UnderlineLink
					href="/"
					className="text-base-500 hover:text-base-700 text-sm transition-colors duration-300"
				>
					Home
				</UnderlineLink>
			</div>
			<div className="flex w-full items-center gap-4 p-4">
				<p className="text-base-300 flex w-[32px] flex-shrink-0 items-center font-mono text-sm">
					<span>(</span>
					<span>1</span>
					<span>)</span>
				</p>
				<motion.div
					className="flex w-[280px] flex-col gap-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ type: "spring", duration: 0.5, bounce: 0 }}
				>
					<div className="text-base-900 text-5xl font-light">{title}</div>
				</motion.div>
			</div>
		</>
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
				<UnderlineLink
					href="/"
					className="text-base-500 hover:text-base-700 w-min text-5xl font-light transition-colors duration-300"
				>
					Back to Home
				</UnderlineLink>
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
