import { Pin } from "lucide-react";
import ModalBase from "./ModalBase";
import { Notice } from "../types";

const NewsDetailModal = ({notice, onClose}: {notice: Notice, onClose: () => void }) => {
    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            {notice.image && (
                <div className="w-full h-56 bg-gray-100">
                    <img src={notice.image} alt="" className="w-full h-full object-cover"/>
                </div>
            )}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    {notice.is_pinned && <Pin size={16} className="text-slate-800 fill-slate-800" />}
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: notice.tag.color_code }}>{notice.tag.name}</span>
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