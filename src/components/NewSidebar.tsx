import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "../lib/utils";
import Sidebar from "./Sidebar";

interface NewSidebarProps {
	scrollAreaId: string;
	title: string;
}

type MenuType = "Overview" | "Features" | "About";

const menuItems = {
	Overview: 3,
	Features: 5,
	About: 2,
};

export default function NewSidebar({ scrollAreaId }: NewSidebarProps) {
	const [activeMenu, setActiveMenu] = useState<MenuType>("Overview");
	const { toggleMobileMenu } = useSidebarStore();

	const menuOptions: MenuType[] = ["Overview", "Features", "About"];

	const getMenuListOffset = () => {
		const activeIndex = menuOptions.indexOf(activeMenu);
		const itemHeight = 48;
		const gap = 8;
		const totalItemHeight = itemHeight + gap;
		const middleIndex = Math.floor(menuOptions.length / 2);
		return (middleIndex - activeIndex) * totalItemHeight;
	};

	const desktopContent = (
		<>
			<div className="flex w-full items-center justify-between p-4">
				<a href="/" className="text-base-900 text-lg font-semibold">
					New Page
				</a>
				<a
					href="/test-preview-block"
					className="text-base-500 text-sm underline hover:opacity-75"
				>
					Test Preview
				</a>
			</div>
			<div className="flex w-full items-center gap-4 p-4">
				<p className="text-base-300 flex w-[32px] flex-shrink-0 items-center font-mono text-sm">
					<span>(</span>
					<span>{menuItems[activeMenu]}</span>
					<span>)</span>
				</p>
				<motion.ul
					className="flex w-[280px] flex-col gap-2"
					animate={{ y: getMenuListOffset() }}
					transition={{ type: "spring", duration: 0.5, bounce: 0 }}
				>
					{menuOptions.map((menu) => (
						<li key={menu}>
							<motion.button
								className={cn(
									"w-full bg-transparent text-left text-5xl transition-colors duration-200",
									activeMenu === menu
										? "text-base-900"
										: "text-base-200 hover:text-base-400",
								)}
								animate={{
									fontWeight: activeMenu === menu ? 700 : 300,
									fontSize: activeMenu === menu ? "60px" : "48px",
								}}
								transition={{ type: "spring", duration: 0.5, bounce: 0 }}
								type="button"
								onClick={() => setActiveMenu(menu)}
							>
								{menu}
							</motion.button>
						</li>
					))}
				</motion.ul>
			</div>
		</>
	);

	const mobileContent = (
		<div className="h-full p-6">
			<ul className="flex w-[280px] flex-col gap-2">
				{menuOptions.map((menu) => (
					<li key={menu}>
						<motion.button
							className={cn(
								"flex w-full items-baseline gap-3 bg-transparent text-left text-5xl transition-colors duration-200",
								activeMenu === menu
									? "text-base-900"
									: "text-base-500 hover:text-base-700",
							)}
							animate={{
								fontWeight: activeMenu === menu ? 600 : 300,
							}}
							transition={{ type: "spring", duration: 0.5, bounce: 0 }}
							type="button"
							onClick={() => {
								setActiveMenu(menu);
								toggleMobileMenu();
							}}
						>
							<motion.span layoutId={`new-sidebar-title-${menu}`}>
								{menu}
							</motion.span>
							<motion.span
								className="text-base-500 font-mono text-sm font-normal"
								layoutId={`new-sidebar-number-${menu}`}
							>
								({menuItems[menu]})
							</motion.span>
						</motion.button>
					</li>
				))}
			</ul>
			<div className="mt-24 flex flex-col gap-3">
				<a
					href="/test-preview-block"
					className="text-base-500 hover:text-base-700 text-5xl font-light transition-colors duration-200 hover:underline"
				>
					Test Preview
				</a>
			</div>
		</div>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={activeMenu}
			desktopContent={desktopContent}
			mobileContent={mobileContent}
			number={menuItems[activeMenu]}
			mobileTitleLayoutId={`new-sidebar-title-${activeMenu}`}
			mobileNumberLayoutId={`new-sidebar-number-${activeMenu}`}
		/>
	);
}