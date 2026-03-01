import { Pin, MoreVertical, Edit, Trash2 } from "lucide-react";
import ModalBase from "./ModalBase";
import { Notice } from "../types";
import {useUser } from "../../../contexts/UserContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useState } from "react";
import ConfirmModal from "../components/profile/ConfirmModal";
import EditNoticeModal from "./EditNoticeModal";

const NewsDetailModal = ({notice, onClose, onUpdate}: {notice: Notice, onClose: () => void, onUpdate: () => void }) => {
    
    const hasImages = notice.images && notice.images.length > 0;

    const { user } = useUser();
    const isAdmin = user?.role === 'Admin';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const token = Cookies.get('accessToken');
            const res = await fetch(`${BACKEND_URL}/api/notices/${notice.id}/`, {
                method: 'DELETE',
                headers: {
                    ...(token ? {'Authorization': `Bearer ${token}`} : {})
                }
            });

            if(res.ok) {
                toast.success("お知らせを削除しました");
                onClose();
                onUpdate();
            } else {
                toast.error("削除に失敗しました");
            }
        } catch (error) {
            console.error(error);
            toast.error("通信エラーが発生しました")
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        setIsMenuOpen(false);
        setIsEditOpen(true);
    };

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            {hasImages && (
                <div className="relative w-full h-64 bg-transparent">
                    <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                        {notice.images.map((img) => (
                            <div
                                key={img.id}
                                className="relative w-full h-full shrink-0 snap-center flex items-center justify-center overflow-hidden"
                            >
                                <div 
                                    className="absolute inset-0 bg-cover bg-center blur-lg opacity-40 scale-110"
                                    style={{ backgroundImage: `url(${img.image})`}}
                                />
                                <img
                                    src={img.image}
                                    alt=""
                                    className="z-10 w-full h-full object-contain drop-shadow-lg p-2"
                                />
                            </div>
                        ))}
                    </div>
                    {notice.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                            {notice.images.map((_, index) => (
                                <div key={index} className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="p-6 relative bg-white">
                {isAdmin && (
                    <div className={`absolute top-4 z-10 transition-all duration-200 ${hasImages ? 'right-4' : 'right-14'}`} >
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button
                                    onClick={handleEdit}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                >
                                    <Edit size={16} className="text-blue-500" />
                                    編集する
                                </button>
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    disabled={isDeleting}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    {isDeleting ? "削除中..." : "削除する"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2 mb-3 pr-10">
                    {notice.is_pinned && <Pin size={16} className="text-blue-500 fill-blue-300 shrink-0" />}
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500 text-white border border-blue-500 shrink-0">{notice.tag.name}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{notice.title_jp}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-400 mb-6">
                    <span>{notice.created_at}</span>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {notice.body_jp}
                </div>
            </div>
            <ConfirmModal 
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Notice"
                message="Are you sure? This action cannot be undone and the notice will be permanently removed."
                confirmText="Delete Notice"
                isDanger={true}
                transparentOverlay={true}
            />
            {isEditOpen && (
                <EditNoticeModal 
                    notice={notice}
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={() => {
                        onUpdate();
                        onClose();
                    }}
                />
            )}
        </ModalBase>
    );
};

export default NewsDetailModal;