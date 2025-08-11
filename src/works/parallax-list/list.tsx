import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

interface Work {
	title: string;
	description: string;
	image: string;
}

// GSAP should only be registered on the client to avoid SSR errors
if (typeof window !== "undefined") {
	gsap.registerPlugin(useGSAP);
}

const ParallaxList = ({ works }: { works: Work[] }) => {
	const listRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const prevActiveIndexRef = useRef<number | null>(null);

	// Mousemove animations (list & image y-position)
	useGSAP(
		(_, contextSafe) => {
			if (!listRef.current) return;

			const handleMouseMove = contextSafe!((e: Event) => {
				const mouseEvent = e as MouseEvent;
				const listEl = listRef.current;
				const containerEl = listEl?.parentElement;

				if (!listEl || !containerEl) return;

				// List positioning
				const paddingAmount = 24 * 4; // 96px bottom padding
				const scrollableDistance =
					listEl.scrollHeight - containerEl.clientHeight + paddingAmount;

				if (scrollableDistance > 0) {
					// Use mouse position relative to container
					const containerRect = containerEl.getBoundingClientRect();
					const mouseY = mouseEvent.clientY - containerRect.top;
					const ratio = mouseY / containerEl.clientHeight;
					const targetY = -scrollableDistance * ratio;

					gsap.to(listEl, {
						y: targetY,
						ease: "power2.out",
						duration: 0.4,
					});
				}

				// Image positioning
				if (imageRef.current) {
					const imgHeight = imageRef.current.clientHeight;
					if (imgHeight > 0) {
						const containerRect = containerEl.getBoundingClientRect();
						const imagePadding = 8 * 4;

						const maxTranslateY =
							containerEl.clientHeight - imgHeight - imagePadding * 2;

						// Guard against negative values when the image height exceeds the usable viewport
						if (maxTranslateY > 0) {
							const mouseY = mouseEvent.clientY - containerRect.top;
							const ratio = mouseY / containerEl.clientHeight;
							const targetImgY = maxTranslateY * ratio;

							gsap.to(imageRef.current, {
								y: targetImgY,
								ease: "power2.out",
								duration: 0.4,
							});
						}
					}
				}
			});

			// Always attach to the parent container
			const containerEl = listRef.current?.parentElement;
			containerEl?.addEventListener("mousemove", handleMouseMove);

			return () => {
				containerEl?.removeEventListener("mousemove", handleMouseMove);
			};
		},
		{ scope: listRef },
	);

	// Fade and scale animation when the preview image changes
	useGSAP(
		() => {
			if (imageRef.current) {
				gsap.fromTo(
					imageRef.current,
					{ opacity: 0, scale: 0.96 },
					{ opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
				);
			}
		},
		{ dependencies: [activeIndex] },
	);

	// Play overlay reveal/hide animations whenever the hovered index changes
	useGSAP(
		() => {
			const prev = prevActiveIndexRef.current;
			const current = activeIndex;

			// Determine animation direction: "down" (moving to a lower index) or "up" (moving to a higher index)
			let direction: "down" | "up" = "down";
			if (prev !== null && current !== null) {
				direction = current > prev ? "down" : "up";
			}

			// Pre-compute clip-path values based on direction
			const revealFromClip =
				direction === "down"
					? "inset(0% 0% 100% 0%)" // enter from the top
					: "inset(100% 0% 0% 0%)"; // enter from the bottom

			const exitToClip =
				direction === "down"
					? "inset(100% 0% 0% 0%)" // hide upward
					: "inset(0% 0% 100% 0%)"; // hide downward

			// Exit animation for the previously hovered item
			if (prev !== null && prev !== current) {
				const prevEl = overlayRefs.current[prev];
				if (prevEl) {
					gsap.killTweensOf(prevEl);
					gsap.to(prevEl, {
						clipPath: exitToClip,
						duration: 0.4,
						ease: "power2.out",
						onComplete: () => {
							// Reset for next reveal to the opposite direction start state
							gsap.set(prevEl, { clipPath: revealFromClip });
						},
					});
				}
			}

			// Reveal animation for the newly hovered item
			if (current !== null) {
				const currentEl = overlayRefs.current[current];
				if (currentEl) {
					gsap.killTweensOf(currentEl);
					gsap.fromTo(
						currentEl,
						{ clipPath: revealFromClip },
						{
							clipPath: "inset(0% 0% 0% 0%)",
							duration: 0.4,
							ease: "power2.out",
						},
					);
				}
			}

			// Update the ref for next render cycle
			prevActiveIndexRef.current = current;
		},
		{ dependencies: [activeIndex], scope: listRef },
	);

	return (
		<div className="clamp-[ml,8,60,@64rem,@96rem] selection:bg-base-50 selection:text-base-900 flex h-full">
			{/* Preview image pinned to the top-right corner */}
			{works[activeIndex] && (
				<img
					ref={imageRef}
					src={works[activeIndex].image}
					alt={works[activeIndex].title}
					className="pointer-events-none absolute top-8 right-8 z-10 w-[30cqw] max-w-[30cqw] object-cover select-none"
				/>
			)}

			<div
				id="list"
				ref={listRef}
				className="clamp-[gap,8,12,@64rem,@96rem] flex max-w-[60%] flex-1 flex-col py-24"
			>
				{works.map((work, index) => {
					const isActive = activeIndex === index;

					return (
						<div
							key={work.title}
							className="relative select-none"
							onMouseEnter={() => setActiveIndex(index)}
						>
							{/* Wrapper to stack default and overlay copies of the title */}
							<h3 className="clamp-[text,4xl,7xl,@64rem,@96rem] relative inline-block leading-none font-medium">
								{/* Default (ash) title */}
								<span className="text-base-500">{work.title}</span>
								{/* Overlay (paper) title that will be revealed via clip-path */}
								<span
									className="text-base-50 pointer-events-none absolute inset-0 block"
									ref={(el) => {
										overlayRefs.current[index] = el;
									}}
									style={{ clipPath: "inset(0% 0% 100% 0%)" }}
								>
									{work.title}
								</span>
							</h3>

							{/* Description paragraph */}
							<p
								className={cn(
									"text-base-300 clamp-[text,xs,sm,@64rem,@96rem] absolute font-mono transition-opacity duration-400 @[80rem]:-bottom-6 @[80rem]:left-0 @[96rem]:bottom-1 @[96rem]:-left-8 @[96rem]:-translate-x-full",
									isActive ? "opacity-100" : "opacity-0",
								)}
							>
								{work.description}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ParallaxList;
