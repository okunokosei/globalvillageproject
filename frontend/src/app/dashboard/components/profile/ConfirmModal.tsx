type Props ={
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    transparentOverlay?: boolean;
};

const ConfirmModal =({
    isOpen, onClose, onConfirm, title, message,
    confirmText = "OK", cancelText = "キャンセル", isDanger = false,
    transparentOverlay = false
}: Props) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
            <div className={`absolute inset-0 ${transparentOverlay ? 'bg-black/30' : 'bg-black/40 backdrop-blur-sm'} `} onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
                <h3 className={`text-lg font-bold mb-2 ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-transform active:scale-95
                            ${isDanger
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;