"use client";

import { Navigation } from "@/components/layout/navigation";
import { DateRangeProvider } from "@/lib/context/date-range-context";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth-context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, logout } = useAuth();
	const lodgeName = process.env.NEXT_PUBLIC_LODGE_NAME || "Lodge";

	return (
		<DateRangeProvider>
			<div className='flex min-h-screen flex-col md:flex-row'>
				<Navigation />

				{/* Main Content */}
				<div className='flex-1 pb-16 md:pb-0 md:ml-16'>
					<header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
						<div className='flex h-14 items-center justify-between'>
							<div className='px-4 md:px-8'>
								<img
									src='/amava.svg'
									alt='Amava'
									className='h-6 md:h-8 w-auto'
								/>
							</div>
							{isAuthenticated && (
								<div className='px-4'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='sm'
												className='flex items-center gap-2 hover:bg-accent'
											>
												<span className='font-medium hidden md:inline'>
													{lodgeName}
												</span>
												<Avatar className='h-8 w-8'>
													<AvatarFallback className='bg-primary/10 text-primary'>
														{lodgeName.charAt(0)}
													</AvatarFallback>
												</Avatar>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align='end'
											className='w-48'
										>
											<DropdownMenuItem
												onClick={logout}
												className='text-red-600 focus:text-red-600 cursor-pointer'
											>
												<LogOut className='mr-2 h-4 w-4' />
												<span>Logout</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
						</div>
					</header>
					<main className='min-h-[calc(100vh-3.5rem-4rem)] md:min-h-[calc(100vh-3.5rem)]'>
						{children}
					</main>
				</div>
			</div>
		</DateRangeProvider>
	);
}
