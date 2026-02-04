import ModalBase from "./ModalBase";
import { Guide } from "../types";

const GuideDetailModal = ({guide, onClose}: {guide: Guide, onClose: () => void}) => {
    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            {guide.image && (
                <div className="w-full h-48 bg-gray-100">
                    <img src={guide.image} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-6 pt-10">
                <div className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold mb-4">Guide Article</div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-gray-100">{guide.title_jp}</h2>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {guide.body_jp}
                </div>
            </div>
        </ModalBase>
    );
};

export default GuideDetailModal;