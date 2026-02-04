import React from "react"
import Link from 'next/link';
import AdminFab from "./components/AdminFab";

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
        <div className="min-h-screen bg-gray-50 pb-20">
            <main>{ children }</main>
            <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 h-16 safe-area-pb">
                <div className="grid grid-cols-4 h-full">
                    <NavLink href="/dashboard" label="Home" />
                    <NavLink href="/dashboard/event" label="Event" />
                    <NavLink href="/dashboard/gallery" label="Gallery" />
                    <NavLink href="/dashboard/profile" label="Profile" />
                </div>
            </nav>
            <AdminFab />
        </div>
    )
}

export default DashboardLayout;