import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface StackControlsProps {
	isMobile: boolean;
	activeIndex: number;
	numCards: number;
	onAddCard: () => void;
	onRemoveCard: () => void;
}

const StackControls = ({
	isMobile,
	activeIndex,
	numCards,
	onAddCard,
	onRemoveCard,
}: StackControlsProps) => {
	return (
		<div
			className={cn(
				"absolute bottom-4 left-4 z-1000",
				isMobile ? "flex flex-col" : "flex flex-col gap-1",
			)}
		>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onAddCard();
				}}
				className={cn(
					isMobile
						? "bg-base-50 text-base-900 active:bg-base-100 flex h-14 w-14 cursor-pointer items-center justify-center"
						: "inline-block cursor-pointer border bg-transparent p-2 font-mono text-[10px] transition-colors duration-300 select-none",
					!isMobile &&
						(isMobile && activeIndex >= 0
							? "border-base-300/30 text-base-500 hover:bg-base-300/30 hover:border-transparent"
							: "border-white/30 text-white hover:border-transparent hover:bg-white/30"),
				)}
			>
				<Plus
					className={cn(isMobile ? "text-base-500 h-7 w-7" : "h-3 w-3")}
					strokeWidth={1.5}
				/>
			</button>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onRemoveCard();
				}}
				disabled={numCards <= 0}
				className={cn(
					isMobile
						? "bg-base-50 text-base-900 border-base-200 active:bg-base-100 flex h-14 w-14 cursor-pointer items-center justify-center border-t-2 disabled:cursor-not-allowed disabled:opacity-50"
						: "inline-block cursor-pointer border bg-transparent p-2 font-mono text-[10px] transition-colors duration-300 select-none disabled:cursor-not-allowed disabled:opacity-50",
					!isMobile &&
						(isMobile && activeIndex >= 0
							? "border-base-300/30 text-base-500 hover:bg-base-300/30 hover:border-transparent"
							: "border-white/30 text-white hover:border-transparent hover:bg-white/30"),
				)}
			>
				<Minus
					className={cn(isMobile ? "text-base-500 h-7 w-7" : "h-3 w-3")}
					strokeWidth={1.5}
				/>
			</button>
		</div>
	);
};

export default StackControls;
