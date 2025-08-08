import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ChevronRight } from "lucide-react";
import { AnimatedMenuIcon } from "../ui/animated-menu-icon";

interface TopBarProps {
	title?: string;
}

export default function TopBar({ title = "Chayut" }: TopBarProps) {
	return (
		<div className="fixed top-0 right-0 left-0 z-40">
			<ProgressiveBlur
				className="from-base-50 via-base-50/70 absolute top-0 right-0 left-0 z-0 h-[120%] bg-gradient-to-b to-transparent"
				direction="top"
				blurLayers={8}
				blurIntensity={3}
			/>
			<div className="relative z-10 grid grid-cols-4 grid-rows-2 items-end p-2 md:grid-cols-6 md:grid-rows-1 lg:grid-cols-5">
				<h1 className="text-base-900 col-span-2 col-start-1 row-start-1 text-5xl font-semibold tracking-tight md:col-span-1">
					{title}
				</h1>
				<div className="text-base-700 col-start-1 row-start-2 text-3xl font-medium tracking-tight md:col-start-3 md:row-start-1 md:mr-6 md:justify-self-end md:text-4xl">
					(42)
				</div>
				<div className="relative col-span-3 col-start-2 row-start-2 md:col-span-3 md:col-start-4 md:row-start-1">
					<div className="text-base-900 flex items-end md:gap-2">
						<div className="text-4xl font-medium tracking-tight md:text-5xl">
							Interactions
						</div>
						<ChevronRight className="h-8 w-8 md:h-9 md:w-9 md:stroke-3" />
					</div>
					<div className="absolute bottom-0 left-0 hidden translate-y-full">
						Articles
					</div>
				</div>
				<button className="border-base-300/30 bg-base-50/50 text-base-500 hover:text-base-700 hover:bg-base-300/30 z-1 -col-start-2 row-start-1 flex h-fit w-fit items-center justify-center self-center justify-self-end border px-3 py-1 backdrop-blur-sm transition-colors duration-300 hover:border-transparent">
					<AnimatedMenuIcon isOpen={false} className="stroke-1" />
				</button>
			</div>
		</div>
	);
}
