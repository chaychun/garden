import {
	BlurDialog,
	BlurDialogContent,
	BlurDialogTrigger,
} from "@/components/ui/blur-dialog";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ProjectHeaderProps {
	projectTitle: string;
	projectDescription: string;
	children?: React.ReactNode;
}

export default function ProjectHeader({
	projectTitle,
	projectDescription,
	children,
}: ProjectHeaderProps) {
	return (
		<header className="relative z-[10000] p-4">
			<div className="relative z-[10000]">
				<div className="grid grid-cols-5 items-start gap-2.5">
					<a
						href="/"
						className="text-base-900 col-span-1 text-xl font-medium md:col-span-2"
					>
						<h1>Chayut.</h1>
					</a>

					<div className="col-span-3 col-start-3 flex flex-col gap-1 md:col-span-2">
						<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
							{projectTitle}
						</div>
						<p className="text-base-700 text-xs leading-[1.35]">
							{projectDescription}
						</p>

						<BlurDialog disableScrollBarAdjustment>
							<BlurDialogTrigger disableEventBubbling>
								{(open) => (
									<button
										type="button"
										className="text-base-300 hover:text-base-600 inline-flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors"
									>
										<span>{open ? "Less info" : "More info"}</span>
										{open ? (
											<ArrowUp className="h-3 w-3" strokeWidth={2.5} />
										) : (
											<ArrowDown className="h-3 w-3" strokeWidth={2.5} />
										)}
									</button>
								)}
							</BlurDialogTrigger>
							<BlurDialogContent
								overlayZIndex={9990}
								ariaLabelledby="project-info-title"
								keepMounted
							>
								<div
									className="text-base-900 invisible hidden text-xs font-semibold uppercase"
									id="project-info-title"
								>
									Project info
								</div>
								<div
									className="text-base-700 [&_a]:text-base-500 mt-0 flex flex-col gap-3 text-xs leading-[1.35] [&_a]:underline"
									data-blur-dialog-stagger
								>
									{children}
								</div>
							</BlurDialogContent>
						</BlurDialog>
					</div>

					<div className="hidden md:block" />
					<div className="hidden md:block" />
				</div>
			</div>
		</header>
	);
}
