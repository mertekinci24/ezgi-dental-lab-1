'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    FolderOpen,
    Plus,
    LogOut,
    Receipt,
    CreditCard,
    Truck,
    Banknote,
    Building2,
    Users,
    UserCircle
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar({ userRole }: { userRole?: string }) {
    const t = useTranslations('Portal');
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Menu Groups
    const operationsItems = [
        { title: t('dashboard'), href: '/portal', icon: LayoutDashboard }, // "Panel" -> "Dashboard" (mapped in translation)
        { title: t('my_cases'), href: '/portal/cases', icon: FolderOpen },
        { title: t('menu.shipping'), href: '/portal/shipping', icon: Truck }
    ];

    const financeItems = [
        { title: t('menu.invoices'), href: '/portal/invoices', icon: Receipt },
        { title: t('menu.account'), href: '/portal/account', icon: CreditCard },
        { title: t('menu.pricing'), href: '/portal/pricing', icon: Banknote }
    ];

    const managementItems = [
        { title: t('menu.clinicSettings'), href: '/portal/clinic-settings', icon: Building2 },
        { title: t('menu.doctors'), href: '/portal/doctors', icon: Users }
    ];

    // Role Check for Finance Group
    // Visible to: DENTIST, CLINIC_ADMIN, SYSTEM_ADMIN
    const showFinance = ['DENTIST', 'CLINIC_ADMIN', 'SYSTEM_ADMIN'].includes(userRole || '');

    const NavItem = ({ item }: { item: { title: string; href: string; icon: any } }) => {
        const active = isActive(item.href);
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${active
                    ? 'bg-zinc-900 text-blue-400 border border-zinc-800 shadow-sm'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
            >
                <item.icon className={`w-4 h-4 transition-colors ${active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`} />
                {item.title}
            </Link>
        );
    };

    return (
        <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
            {/* Header / Logo */}
            <div className="p-6 border-b border-zinc-800">
                <Link href="/portal" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-tr-lg rounded-bl-lg shadow-lg shadow-blue-900/20 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="font-serif text-xl font-bold text-zinc-100 tracking-tight">
                        Ezgi Portal
                    </span>
                </Link>
            </div>

            {/* Main Action */}
            <div className="p-4">
                <Link
                    href="/portal/new-case"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    {t('newCase')}
                </Link>
            </div>

            {/* Scrollable Navigation Area */}
            <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">

                {/* Group 1: Operations */}
                <div>
                    <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                        {t('menu.operations')}
                    </p>
                    <div className="space-y-1">
                        {operationsItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </div>
                </div>

                {/* Group 2: Finance */}
                <div>
                    <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                        {t('menu.finance')}
                    </p>
                    <div className="space-y-1">
                        {financeItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </div>
                </div>

                {/* Group 3: Management */}
                <div>
                    <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                        {t('menu.management')}
                    </p>
                    <div className="space-y-1">
                        {managementItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </div>
                </div>

            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                <Link
                    href="/portal/profile"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${isActive('/portal/profile')
                        ? 'bg-zinc-900 text-blue-400 border border-zinc-800'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                >
                    <UserCircle className="w-4 h-4 text-zinc-500" />
                    {t('menu.profile')}
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors border border-transparent hover:border-red-900/30"
                >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                </button>
            </div>
        </div>
    );
}
