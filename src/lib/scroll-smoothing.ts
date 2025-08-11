import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

function clampScrollValue(current: number, delta: number, max: number): number {
	return Math.max(0, Math.min(max, current + delta));
}

function createSmoothScrollTween(
	target: HTMLElement | Window,
	scrollTo: { x?: number; y?: number },
	duration: number = 0.6,
	onComplete?: () => void,
): gsap.core.Tween {
	return gsap.to(target, {
		scrollTo: { ...scrollTo, autoKill: false },
		duration,
		ease: "power2.out",
		onComplete,
	});
}

export function setupHorizontalScrollSmoothing(containerSelector: string) {
	const scrollContainer = document.querySelector(
		containerSelector,
	) as HTMLElement;
	if (!scrollContainer) return () => {};

	let smoothScrollTween: gsap.core.Tween | null = null;

	const handleWheel = (e: WheelEvent) => {
		const hasHorizontalScroll =
			scrollContainer.scrollWidth > scrollContainer.offsetWidth;
		const hasVerticalScroll =
			scrollContainer.scrollHeight > scrollContainer.offsetHeight;

		const isShiftWheel = e.shiftKey && (e.deltaY !== 0 || e.deltaX !== 0);
		const isNormalWheel =
			!e.shiftKey &&
			e.deltaY !== 0 &&
			hasHorizontalScroll &&
			!hasVerticalScroll;

		if (isShiftWheel || isNormalWheel) {
			e.preventDefault();

			if (smoothScrollTween) {
				smoothScrollTween.kill();
			}

			const scrollDelta = isShiftWheel
				? (e.deltaY || e.deltaX) * 1.5
				: e.deltaY * 1.5;
			const currentScrollLeft = scrollContainer.scrollLeft;
			const maxScrollLeft =
				scrollContainer.scrollWidth - scrollContainer.offsetWidth;
			const targetScrollLeft = clampScrollValue(
				currentScrollLeft,
				scrollDelta,
				maxScrollLeft,
			);

			smoothScrollTween = createSmoothScrollTween(
				scrollContainer,
				{ x: targetScrollLeft },
				0.6,
				() => {
					smoothScrollTween = null;
				},
			);
		}
	};

	scrollContainer.addEventListener("wheel", handleWheel, {
		passive: false,
	});

	return () => {
		scrollContainer.removeEventListener("wheel", handleWheel);
		if (smoothScrollTween) {
			smoothScrollTween.kill();
		}
	};
}

export function setupVerticalScrollSmoothing() {
	let smoothScrollTween: gsap.core.Tween | null = null;

	const handleWheel = (e: WheelEvent) => {
		const isMobileMenuOpen =
			document.documentElement.classList.contains("mobile-menu-open");
		if (isMobileMenuOpen) {
			return;
		}

		e.preventDefault();

		if (smoothScrollTween) {
			smoothScrollTween.kill();
		}

		const currentScrollTop =
			window.pageYOffset || document.documentElement.scrollTop;
		const scrollDelta = e.deltaY * 1.5;
		const maxScrollTop =
			document.documentElement.scrollHeight - window.innerHeight;
		const targetScrollTop = clampScrollValue(
			currentScrollTop,
			scrollDelta,
			maxScrollTop,
		);

		smoothScrollTween = createSmoothScrollTween(
			window,
			{ y: targetScrollTop },
			0.6,
			() => {
				smoothScrollTween = null;
			},
		);
	};

	document.addEventListener("wheel", handleWheel, {
		passive: false,
	});

	return () => {
		document.removeEventListener("wheel", handleWheel);
		if (smoothScrollTween) {
			smoothScrollTween.kill();
		}
	};
}
