import { Pin } from "lucide-react";
import { Notice } from "../types";

const NewsCard = ({notice, onClick}: {notice: Notice, onClick: () => void}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full h-32 text-left bg-white rounded-xl border p-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex gap-4 ${
                notice.is_pinned ? "border-slate-300 ring-1 ring-slate-100" : "border-gray-100"}`}
        >
            {/* 左 */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    {notice.is_pinned && <Pin size={14} className="text-slate-800 fill-slate-800"/>}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: notice.tag.color_code }}>{notice.tag.name}</span>
                    <span className="text-xs text-gray-400">{notice.created_at}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{notice.title_jp}</h3>
            </div>
            {/* 右 */}
            {notice.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                    <img src={notice.image} alt="" />
                </div>
            )}
        </button>
    );
};

export default NewsCard;