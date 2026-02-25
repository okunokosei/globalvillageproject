import { UserProfileType } from "../../types";

const UserProfile = ({ userProfile, userLanguage, changeLanguage }: { userProfile: UserProfileType, userLanguage: "En"|"Jp", changeLanguage: (lang: "En"|"Jp") => void}) => {
    const formatYearMonth = (datesString: string) => {
        const parts = datesString.split('-');
        return `${parts[0]}.${parts[1]}`;
    };
    
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 m-2 flex-col gap-6">
            <div className="flex items-center gap-5">
                <img
                    src={userProfile.icon ?? ""}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-gray-50 shadow-sm shrink-0"
                />
                <div className="flex flex-col gap-1.5">
                    <p className="text-2xl font-bold text-gray-800 tracking-tight">{userProfile.name}</p>
                    <p className="text-sm font-medium text-gray-500">{`Room: ${userProfile.room_number}`}</p>
                    <p className="text-sm font-medium text-gray-500">{`${formatYearMonth(userProfile.move_in_date)} - ${formatYearMonth(userProfile.move_out_date)}`}</p>
                </div>
            </div>
            <div className="border-t border-gray-100 my-4"></div>

            <div>
                <div className="flex items-center mb-3 text-sm font-bold text-gray-700">表示言語（Language）</div>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => changeLanguage("En")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                            (userLanguage === "En") 
                                ? "bg-white text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage("Jp")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                            (userLanguage === "Jp") 
                                ? "bg-white text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        日本語
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;