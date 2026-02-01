import { X } from "lucide-react";

const ModalBase = ({ children, onClose }: {children: React.ReactNode, onClose: () => void}) => {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-sm p-1.5 rouded-full text-gray-600 hover:bg-white transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalBase;