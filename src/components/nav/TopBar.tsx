import React from "react";

interface TopBarProps {
	title?: string;
	rightSlot?: React.ReactNode;
}

export default function TopBar({ title = "Chayut", rightSlot }: TopBarProps) {
	return (
		<div className="bg-base-50/80 border-base-100 supports-[backdrop-filter]:bg-base-50/60 fixed top-0 right-0 left-0 z-40 border-b backdrop-blur">
			<div className="mx-auto flex w-full max-w-[528px] items-center justify-between px-6 py-4 md:max-w-none">
				<h1 className="text-base-900 text-2xl font-semibold">{title}</h1>
				<div className="flex items-center gap-3">{rightSlot}</div>
			</div>
		</div>
	);
}
