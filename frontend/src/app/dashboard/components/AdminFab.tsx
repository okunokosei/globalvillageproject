'use client'
import { useState } from "react";

import { Plus, Bell, CalendarDays, Image as ImageIcon } from "lucide-react";

import CreateNoticeModal from "./modals/CreateNoticeModal";
import CreateEventModal from "./modals/CreateEventModal";
import CreateGalleryModal from "./modals/CreateGalleryModal";

const NewPostButton = ({label, icon, onClick}: {label: string, icon:React.ReactNode, onClick: () => void}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-start w-38 gap-3 px-5 py-2.5 bg-white text-gray-700 shadow-md rounded-full font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
            <span className="text-blue-500">{icon}</span>
            {label}
        </button>
    )
}

const AdminFab = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [ActiveModal, setActiveModal] = useState<"notice"|"event"|"album"|null>(null);

    const handleMenuClick = (modalType: "notice"|"event"|"album") => {
        setActiveModal(modalType);
        setIsMenuOpen(false);
    };

    return (
        <div>
            <div className="fixed bottom-20 right-5 flex flex-col items-end gap-4 z-40">
                <div className={`flex flex-col items-end gap-3 duration-300 origin-bottom mb-2 ${
                    isMenuOpen
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90 pointer-events-none'
                }`}>
                    <NewPostButton label="New Notice" icon={<Bell size={18} />} onClick={() => handleMenuClick("notice")}/>
                    <NewPostButton label="New Event" icon={<CalendarDays size={18} />} onClick={() => handleMenuClick("event")}/>
                    <NewPostButton label="New Album" icon={<ImageIcon size={18} />} onClick={() => handleMenuClick("album")}/>
                </div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 ${
                        isMenuOpen
                            ? 'bg-slate-700 rotate-45'
                            : 'bg-blue-600 rotate-0'
                    }`}
                >
                    <Plus size={28} />
                </button>
            </div>
            {(ActiveModal === "notice") && (
                <CreateNoticeModal onClose={() => setActiveModal(null)}/>
            )}
            {(ActiveModal === "event") && (
                <CreateEventModal onClose={() => setActiveModal(null)}/>
            )}
            {(ActiveModal === "album") && (
                <CreateGalleryModal onClose={() => setActiveModal(null)}/>
            )}
        </div>
    )
};

export default AdminFab;