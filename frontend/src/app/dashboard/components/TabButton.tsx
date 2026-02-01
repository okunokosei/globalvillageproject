type TabButtonProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
                isActive
                ? "text-slate-800"
                : "text-gray-400 hover:text-gray-600"
            }`}
        >
            {label}
            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-800"/>
            )}
        </button>
    )
};

export default TabButton;