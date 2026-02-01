import { ChevronUp, ChevronDown } from "lucide-react";
import { GuideCategory } from "../types";

const GuideCategoryItem = ({
    category,
    isOpen,
    onToggle,
    onGuideClick
}: {
    category: GuideCategory,
    isOpen: boolean,
    onToggle: () => void,
    onGuideClick: (guide: any) => void
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-3">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon_name}</span>
                    <div className="text-left">
                        <span className="block font-bold text-slate-800 text-sm">{category.name_jp}</span>
                    </div>
                    {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </button>
            {isOpen && (
                <div className="border-t border-gray-100 bg-slate-50/50">
                    {category.guides.map((guide: any) => (
                        <button
                            key={guide.id}
                            onClick={() => onGuideClick(guide)}
                            className="w-full text-left p-4 border-b border-gray-100 last:border-0 hover:bg-white active:bg-slate-100 transition-colors flex justify-between items-center group"
                        >
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{guide.title_jp}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GuideCategoryItem;