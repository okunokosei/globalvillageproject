import { Pin, Clock } from "lucide-react";
import { Notice } from "../types";

const NewsCard = ({notice, onClick}: {notice: Notice, onClick: () => void}) => {
    const firstImageUrl = notice.images?.[0]?.image;
    return (
        <button
            onClick={onClick}
            className={`w-full h-38 text-left bg-white rounded-xl border p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4 ${
                notice.is_pinned 
                    ? "border-blue-200 bg-blue-50/10 ring-1 ring-blue-50" 
                    : "border-gray-100"
            }`}
        >
            {/* 左 */}
            <div className="flex-1 flex flex-col items-start gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                    {notice.is_pinned &&
                        <Pin size={14} className="text-blue-500 fill-blue-300 shrink-0"/>
                    }
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                        {notice.tag.name}
                    </span>
                </div>
                <h3 className="font-bold text-gray-800 text-[16px] leading-tight line-clamp-2 mt-1">
                    {notice.title_jp}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Clock size={12} className="shrink-0" />
                    <span className="truncate">
                        {notice.created_at}
                    </span>
                </div>
            </div>
            {/* 右 */}
            <div className="w-24 h-24 rounded-lg shrink-0 overflow-hidden border border-gray-100 bg-gray-50">
                {firstImageUrl && (
                    <img src={firstImageUrl} alt="" className="w-full h-full object-cover"/>
                )}
            </div>
        </button>
    );
};

export default NewsCard;