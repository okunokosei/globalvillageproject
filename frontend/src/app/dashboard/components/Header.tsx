

const Header = ({title, subtitle}: {title: string, subtitle: string}) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="px-4 py-3">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
                <p className="text-xs font-medium text-slate-500">{subtitle}</p>
            </div>
        </header>
    )
};

export default Header;