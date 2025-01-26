"use client";

import { Menu, Home, Users, PawPrint, BarChartIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: "/", icon: <Home size={24} />, label: "Home" },
  { href: "/activities", icon: <PawPrint size={24} />, label: "Activities" },
  { href: "/facilities-and-staff", icon: <Users size={24} />, label: "Facilities" },
  { href: "/communication", icon: <BarChartIcon size={24} />, label: "Communication" },
  { href: "/settings", icon: <Settings size={24} />, label: "Settings" },
];

export function Navigation() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Navigation Sidebar - Desktop */}
      <nav className={`hidden md:flex fixed h-full bg-gray-900 flex-col items-center py-4 space-y-8 transition-all duration-300 z-50 ${isExpanded ? 'w-48' : 'w-16'}`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-white hover:text-gray-300 p-2 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col space-y-6">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-white hover:text-gray-300 p-2 transition-colors flex items-center gap-3"
            >
              {item.icon}
              {isExpanded && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Navigation Bar - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-white hover:text-gray-300 p-2 transition-colors"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}