interface HomeSidebarContentProps {
	title: string;
}

export default function HomeSidebarContent({ title }: HomeSidebarContentProps) {
	return (
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
}
