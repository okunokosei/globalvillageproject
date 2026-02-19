'use client';

import Header from "../components/Header";
import { MOCK_GALLERIES } from "../../../constants/MockData";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { GalleryType } from '../types';
import ModalBase from "../components/ModalBase";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const GalleryItem = ({gallery, onClick}: {gallery: GalleryType, onClick: () => void}) => {
    const formattedDate = gallery.event_date.replaceAll('-', '.');
    return (
        <button
            onClick={onClick}
            className="group flex flex-col text-left w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <img 
                    src={gallery.cover_image_url}
                    alt={gallery.title_jp}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-600 shadow-sm">
                    <svg xmlns="http://www.2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>
            </div>
            <div className="p-3">
                <p className="font-bold text-gray-800 text-sm mb-1 line-clamp-1 leading-tight">
                    {gallery.title_jp}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                    {formattedDate}
                </p>
            </div>
        </button>
    )
};

const ConfirmOpenModal = ({ gallery, onClose}: {gallery: GalleryType, onClose: () => void}) => {
    const handleOpenLink = () => {
        window.open(gallery.google_photos_url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-xs">
            <div className="p-6 flex flex-col items-center text-center">
                <div>
                    <svg xmlns="http://www.2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    アルバムを開きますか？
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    「<span>{gallery.title_jp}</span>」<br/>
                    の写真を見るために、外部サイト（Google Photos）へ移動します。
                </p>
                <div className="w-full flex flex-col gap-2">
                    <button
                        onClick={handleOpenLink}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                    >
                        Google Photos で開く
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-500 font-bold hoverbg-gray-100 rounded-xl transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </ModalBase>
    );
};

const GalleryPage = () => {
    const [selectedGallery, setSelectedGallery] = useState<GalleryType|null>(null);

    return (
        <div>
            <Header title="Album" subtitle="イベント写真" />

            <div className="p-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {MOCK_GALLERIES.map((gallery) => (
                        <GalleryItem 
                            key={gallery.id}
                            gallery={gallery}
                            onClick={() => setSelectedGallery(gallery)}
                        />
                    ))}
                </div>
            </div>
            {selectedGallery && (
                <ConfirmOpenModal 
                    gallery={selectedGallery}
                    onClose={() => setSelectedGallery(null)}
                />
            )}
        </div>
    )
}

export default GalleryPage;