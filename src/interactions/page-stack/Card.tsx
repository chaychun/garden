import { cn } from "@/lib/utils";
import { motion, useAnimate } from "motion/react";
import { type ReactNode } from "react";

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
	children?: ReactNode | ReactNode[];
}

const Card = ({
	pos,
	orientation,
	onMouseEnter,
	onMouseLeave,
	onClick,
	className,
	children,
	isDraggable = false,
	threshold = 120,
	onRequestClose,
	onRequestOpen,
	transitionDelay = 0,
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
					// Restrict direction only for close (downwards). Upwards drag has no constraint to avoid jump.
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

						// bounce back to original pos if threshold not reached
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
			initial={isHorizontal ? { x: "100vw", y: 0 } : { y: "100vh", x: 0 }}
			animate={isHorizontal ? { x: pos, y: 0 } : { y: pos, x: 0 }}
			exit={isHorizontal ? { x: "100vw", y: 0 } : { y: "100vh", x: 0 }}
			transition={{
				type: "tween",
				duration: 1,
				ease: [0.19, 1, 0.22, 1],
				delay: transitionDelay,
			}}
			ref={scope}
			className={cn(
				"absolute inset-0 overflow-x-auto overflow-y-hidden",
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
			{children}
		</motion.section>
	);
};

export default Card;
