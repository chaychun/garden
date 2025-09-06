import {
	BlurDialog,
	BlurDialogContent,
	BlurDialogTrigger,
	BlurDialogVariants,
} from "@/components/ui/blur-dialog";
import { ArrowDown, ArrowUp } from "lucide-react";
import { motion } from "motion/react";

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
		<header className="relative z-50 p-4">
			<div className="relative z-50">
				<div className="hidden grid-cols-5 items-start gap-2.5 md:grid">
					<a href="/" className="text-base-900 text-xl font-medium">
						Chayut.
					</a>

					<div className="col-span-2 col-start-3 flex flex-col gap-1">
						<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
							{projectTitle}
						</div>
						<p className="text-base-700 text-xs leading-[1.35]">
							{projectDescription}
						</p>

						<BlurDialog>
							<BlurDialogTrigger>
								{(open) => (
									<button className="text-base-300 hover:text-base-600 inline-flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors">
										<span>{open ? "Less info" : "More info"}</span>
										{open ? (
											<ArrowUp className="h-3 w-3" strokeWidth={2.5} />
										) : (
											<ArrowDown className="h-3 w-3" strokeWidth={2.5} />
										)}
									</button>
								)}
							</BlurDialogTrigger>
							<BlurDialogContent overlayZIndex={10}>
								<motion.div
									variants={BlurDialogVariants.block}
									className="text-base-700 [&_a]:text-base-500 mt-0 flex flex-col gap-3 text-xs leading-[1.35] [&_a]:underline"
								>
									{children}
								</motion.div>
							</BlurDialogContent>
						</BlurDialog>
					</div>

					<div />
					<div />
				</div>

				<div className="flex flex-col gap-4 md:hidden">
					<div className="grid grid-cols-5 items-start gap-2.5">
						<a
							href="/"
							className="text-base-900 col-span-2 text-xl font-medium"
						>
							Chayut.
						</a>

						<div className="col-span-3 flex flex-col gap-1">
							<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
								{projectTitle}
							</div>
							<p className="text-base-700 text-xs leading-[1.35]">
								{projectDescription}
							</p>

							<BlurDialog>
								<BlurDialogTrigger>
									{(open) => (
										<button className="text-base-300 hover:text-base-600 inline-flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors">
											<span>{open ? "Less info" : "More info"}</span>
											{open ? (
												<ArrowUp className="h-3 w-3" strokeWidth={2.5} />
											) : (
												<ArrowDown className="h-3 w-3" strokeWidth={2.5} />
											)}
										</button>
									)}
								</BlurDialogTrigger>
								<BlurDialogContent overlayZIndex={10}>
									<motion.div
										variants={BlurDialogVariants.block}
										className="text-base-700 [&_a]:text-base-500 mt-0 flex flex-col gap-3 text-xs leading-[1.35] [&_a]:underline"
									>
										{children}
									</motion.div>
								</BlurDialogContent>
							</BlurDialog>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
