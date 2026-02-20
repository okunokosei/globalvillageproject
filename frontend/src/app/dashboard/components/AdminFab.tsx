'use client'
import { useState } from "react";

import CreateNoticeModal from "./modals/CreateNoticeModal";
import CreateEventModal from "./modals/CreateEventModal";
import CreateGalleryModal from "./modals/CreateGalleryModal";

const NewPostButton = ({object, onClick}: {object: string, onClick: () => void}) => {
    return (
        <div className="p-2 text-xs shadow rounded rounded-full border border-gray-400">
            <button
                onClick={onClick}
                className="hover:underline"
            >
                {object}
            </button>
        </div>
    )
}

const AdminFab = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [ActiveModal, setActiveModal] = useState<"notice"|"guide"|"event"|"album"|null>(null);

    return (
        <div>
            <div className="fixed bottom-20 right-5 flex flex-col items-end gap-3 z-40">
                {
                    isMenuOpen && (
                        <div className="flex flex-col gap-3 mb-2">
                            <NewPostButton object="New Notice" onClick={() => setActiveModal("notice")}/>
                            <NewPostButton object="New Event" onClick={() => setActiveModal("event")}/>
                            <NewPostButton object="New Album" onClick={() => setActiveModal("album")}/>
                        </div>
                    )
                }
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-3xl"
                >
                    {isMenuOpen ? "*": "+"}
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