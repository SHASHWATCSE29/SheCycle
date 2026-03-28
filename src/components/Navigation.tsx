'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScanLine, MapPin, Shield, LayoutDashboard } from 'lucide-react';

const navItems = [
  { label: 'Scan', icon: ScanLine, href: '/scan' },
  { label: 'Centers', icon: MapPin, href: '/centers' },
  { label: 'Safe Zone', icon: Shield, href: '/safe-zone' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
];

export default function Navigation() {
  const pathname = usePathname();

  // Don't show navigation on the login page
  if (pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-rose-100 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${
              isActive ? 'text-rose-600' : 'text-[#000000]'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-colors ${isActive ? 'bg-rose-50' : 'bg-transparent'}`}>
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
