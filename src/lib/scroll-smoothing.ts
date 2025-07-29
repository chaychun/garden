import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function setupHorizontalScrollSmoothing(containerSelector: string) {
	const scrollContainer = document.querySelector(
		containerSelector,
	) as HTMLElement;
	if (!scrollContainer) return () => {};

	let smoothScrollTween: gsap.core.Tween | null = null;

	const handleWheel = (e: WheelEvent) => {
		if (e.shiftKey) return;

		e.preventDefault();

		const hasHorizontalScroll =
			scrollContainer.scrollWidth > scrollContainer.offsetWidth;
		const hasVerticalScroll =
			scrollContainer.scrollHeight > scrollContainer.offsetHeight;

		if (
			!e.shiftKey &&
			e.deltaY !== 0 &&
			hasHorizontalScroll &&
			!hasVerticalScroll
		) {
			if (smoothScrollTween) {
				smoothScrollTween.kill();
			}
			const currentScrollLeft = scrollContainer.scrollLeft;
			const scrollDelta = e.deltaY * 1.5;
			const targetScrollLeft = Math.max(
				0,
				Math.min(
					scrollContainer.scrollWidth - scrollContainer.offsetWidth,
					currentScrollLeft + scrollDelta,
				),
			);
			smoothScrollTween = gsap.to(scrollContainer, {
				scrollTo: { x: targetScrollLeft, autoKill: false },
				duration: 0.6,
				ease: "power2.out",
				onComplete: () => {
					smoothScrollTween = null;
				},
			});
		}
	};

	const handleShiftWheel = (e: WheelEvent) => {
		if (e.shiftKey && (e.deltaY !== 0 || e.deltaX !== 0)) {
			e.preventDefault();
			if (smoothScrollTween) {
				smoothScrollTween.kill();
			}
			const scrollDelta = (e.deltaY || e.deltaX) * 1.5;
			const currentScrollLeft = scrollContainer.scrollLeft;
			const targetScrollLeft = Math.max(
				0,
				Math.min(
					scrollContainer.scrollWidth - scrollContainer.offsetWidth,
					currentScrollLeft + scrollDelta,
				),
			);
			smoothScrollTween = gsap.to(scrollContainer, {
				scrollTo: { x: targetScrollLeft, autoKill: false },
				duration: 0.5,
				ease: "power2.out",
				onComplete: () => {
					smoothScrollTween = null;
				},
			});
		}
	};

	scrollContainer.addEventListener("wheel", handleWheel, {
		passive: false,
	});

	scrollContainer.addEventListener("wheel", handleShiftWheel, {
		passive: false,
	});

	return () => {
		scrollContainer.removeEventListener("wheel", handleWheel);
		scrollContainer.removeEventListener("wheel", handleShiftWheel);
		if (smoothScrollTween) {
			smoothScrollTween.kill();
		}
	};
}

export function setupVerticalScrollSmoothing() {
	let smoothScrollTween: gsap.core.Tween | null = null;

	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();

		if (smoothScrollTween) {
			smoothScrollTween.kill();
		}

		const currentScrollTop =
			window.pageYOffset || document.documentElement.scrollTop;
		const scrollDelta = e.deltaY * 1.5;
		const targetScrollTop = Math.max(
			0,
			Math.min(
				document.documentElement.scrollHeight - window.innerHeight,
				currentScrollTop + scrollDelta,
			),
		);

		smoothScrollTween = gsap.to(window, {
			scrollTo: { y: targetScrollTop, autoKill: false },
			duration: 0.6,
			ease: "power2.out",
			onComplete: () => {
				smoothScrollTween = null;
			},
		});
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
