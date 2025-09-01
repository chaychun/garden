import { cn } from "@/lib/utils";
import { motion, useAnimate } from "motion/react";

interface CardProps {
	pos: number;
	orientation: "horizontal" | "vertical";
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onClick: () => void;
	className?: string;
	isDraggable?: boolean;
	threshold?: number;
	onRequestClose?: () => void;
	onRequestOpen?: () => void;
	transitionDelay?: number;
	isActive?: boolean;
	index: number;
	isReady?: boolean;
}

const Card = ({
	pos,
	orientation,
	onMouseEnter,
	onMouseLeave,
	onClick,
	className,
	isDraggable = false,
	threshold = 120,
	onRequestClose,
	onRequestOpen,
	transitionDelay = 0,
	isActive = false,
	index,
	isReady = true,
}: CardProps) => {
	const isHorizontal = orientation === "horizontal";

	const [scope, animate] = useAnimate();

	const hasClose = typeof onRequestClose === "function";
	const hasOpen = typeof onRequestOpen === "function";

	const dragProps =
		!isHorizontal && isDraggable && (hasClose || hasOpen)
			? {
					drag: "y" as const,
					dragMomentum: false,
					dragSnapToOrigin: false,
					...(hasClose && !hasOpen ? { dragConstraints: { top: 0 } } : {}),
					dragElastic: 0,
					onDragEnd: (
						_e: PointerEvent | MouseEvent | TouchEvent,
						info: { offset: { x: number; y: number } },
					) => {
						if (hasClose && info.offset.y > threshold) {
							onRequestClose?.();
							return;
						}

						if (hasOpen && info.offset.y < -threshold) {
							onRequestOpen?.();
							return;
						}

						if (scope.current) {
							animate(
								scope.current,
								{ y: pos },
								{ type: "tween", duration: 1, ease: [0.19, 1, 0.22, 1] },
							);
						}
					},
				}
			: {};

	return (
		<motion.section
			initial={isHorizontal ? { x: "100%", y: 0 } : { y: "100%", x: 0 }}
			animate={
				isHorizontal
					? isReady
						? { x: pos, y: 0 }
						: { x: "100%", y: 0 }
					: isReady
						? { y: pos, x: 0 }
						: { y: "100%", x: 0 }
			}
			exit={isHorizontal ? { x: "100%", y: 0 } : { y: "100%", x: 0 }}
			transition={{
				type: "tween",
				duration: 1,
				ease: [0.19, 1, 0.22, 1],
				delay: transitionDelay,
			}}
			ref={scope}
			className={cn(
				"group absolute inset-0 overflow-x-auto overflow-y-hidden transition-colors duration-300 ease-in-out",
				!isHorizontal
					? "bg-base-100"
					: isActive
						? "bg-base-100"
						: "bg-base-200",
				className,
			)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={onClick}
			style={{
				boxShadow:
					"-8px 0 16px -2px rgba(0,0,0,0.08), 0 -8px 16px -2px rgba(0,0,0,0.08), -1px -1px 4px 0 rgba(0,0,0,0.06)",
				...(!isHorizontal && isDraggable ? { touchAction: "none" } : {}),
			}}
			{...dragProps}
		>
			<span
				className={cn(
					"border-base-300/30 text-base-500 absolute px-3 py-1 font-mono text-[10px] transition-colors duration-200 select-none",
					isHorizontal
						? "group-hover:bg-base-300/30 top-4 left-4 border group-hover:border-transparent"
						: "top-7 left-1/2 -translate-x-1/2 text-xs",
				)}
			>
				Page {index + 1}
			</span>
		</motion.section>
	);
};

export default Card;
