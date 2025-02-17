"use client";

import {
	Menu,
	Home,
	Users,
	PawPrint,
	BarChartIcon,
	SquareKanban,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/", icon: <Home size={24} />, label: "Home" },
	{ href: "/activities", icon: <PawPrint size={24} />, label: "Activities" },
	{
		href: "/facilities-and-staff",
		icon: <Users size={24} />,
		label: "Facilities",
	},
	{
		href: "/communication",
		icon: <BarChartIcon size={24} />,
		label: "Communication",
	},
	{
		href: "/external-reviews",
		icon: <SquareKanban size={24} />,
		label: "External Reviews",
	},
	{ href: "/settings", icon: <Settings size={24} />, label: "Settings" },
];

export function Navigation() {
	const [isExpanded, setIsExpanded] = useState(false);
	const pathname = usePathname();

	return (
		<>
			{/* Navigation Sidebar - Desktop */}
			<nav
				className={`hidden md:flex fixed h-full bg-[#EBEBEB] flex-col items-center space-y-8 transition-all duration-300 z-50 ${
					isExpanded ? "w-48" : "w-16"
				}`}
			>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className='w-full bg-[#444444] p-4 transition-colors'
				>
					<Menu
						size={24}
						className='text-white mx-auto'
					/>
				</button>
				<div className='flex flex-col space-y-6'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`p-3 transition-colors flex items-center gap-3 rounded-lg
									${isActive ? "bg-white" : "hover:bg-white/50"}`}
							>
								<div className={`text-[#444444]`}>
									{item.icon}
								</div>
								{isExpanded && (
									<span className='text-sm text-[#444444]'>
										{item.label}
									</span>
								)}
							</Link>
						);
					})}
				</div>
			</nav>

			{/* Navigation Bar - Mobile */}
			<nav className='md:hidden fixed bottom-0 left-0 right-0 bg-[#EBEBEB] z-50'>
				<div className='flex justify-around items-center py-2'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`p-3 transition-colors rounded-lg
									${isActive ? "bg-white" : "hover:bg-white/50"}`}
							>
								<div className='text-[#444444]'>
									{item.icon}
								</div>
							</Link>
						);
					})}
				</div>
			</nav>
		</>
	);
}
