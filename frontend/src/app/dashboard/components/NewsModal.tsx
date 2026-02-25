import { Pin } from "lucide-react";
import ModalBase from "./ModalBase";
import { Notice } from "../types";

const NewsDetailModal = ({notice, onClose}: {notice: Notice, onClose: () => void }) => {
    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            {notice.images && notice.images.length > 0 && (
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

            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
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
        </ModalBase>
    );
};

export default NewsDetailModal;