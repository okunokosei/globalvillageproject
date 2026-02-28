import React from "react"
import Link from 'next/link';
import AdminFab from "./components/AdminFab";
import { UserProvider } from "../../contexts/UserContext";

type NavLinkProps = {
    href: string;
    label: string;
};

const NavLink = ({ href, label }: NavLinkProps) => {
    return (
        <Link href={href} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600">
            <span className="text-xs">{label}</span>
        </Link>
    )
};

const DashboardLayout = ({children} : { children: React.ReactNode }) => {
    return (
        <UserProvider>
            <div className="h-[100dvh] w-full bg-gray-50 flex flex-col overflow-hidden relative">
                <main className="flex-1 overflow-y-auto hide-scrollbar">
                    { children }
                </main>
                <nav className="shrink-0 w-full bg-white border-t border-gray-200 z-50 h-16 safe-area-pb">
                    <div className="grid grid-cols-4 h-full">
                        <NavLink href="/dashboard" label="Home" />
                        <NavLink href="/dashboard/event" label="Event" />
                        <NavLink href="/dashboard/gallery" label="Gallery" />
                        <NavLink href="/dashboard/profile" label="Profile" />
                    </div>
                </nav>
                <AdminFab />
            </div>
        </UserProvider>
    )
}

export default DashboardLayout;