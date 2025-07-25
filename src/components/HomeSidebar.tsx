import Sidebar from "./Sidebar";

interface HomeSidebarProps {
	scrollAreaId: string;
	title: string;
}

export default function HomeSidebar({ scrollAreaId, title }: HomeSidebarProps) {
	const desktopContent = (
		<>
			<div className="flex w-full items-center justify-between p-4">
				<a href="/" className="text-base-900 text-lg font-semibold">
					Chayut
				</a>
				<a
					href="/"
					className="text-base-500 text-sm underline hover:opacity-75"
				>
					About
				</a>
			</div>
			<h1 className="text-base-900 font-cabinet p-6 text-4xl font-medium">
				{title}
			</h1>
		</>
	);

	const mobileContent = (
		<div className="h-full p-6 text-white">
			<div className="mb-4 text-lg font-bold">Sidebar</div>
			<div className="mb-4 text-sm">Mobile menu content goes here</div>
			<div className="mb-4 text-sm">This is the expanded mobile sidebar</div>
		</div>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={title}
			desktopContent={desktopContent}
			mobileContent={mobileContent}
		/>
	);
}
