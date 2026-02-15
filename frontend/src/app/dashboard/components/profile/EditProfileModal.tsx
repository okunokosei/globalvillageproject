import { HardDrive } from "lucide-react";
import { UserProfileType } from "../../types";
import React, { useState } from "react";
import Cookies from 'js-cookie';
import ModalBase from "../ModalBase";

type Props ={
    user: UserProfileType;
    onClose: () => void;
    onUpdate: () => void;
};

const EditProfileModal = ({ user, onClose, onUpdate }: Props) => {
    const [name, setName] = useState(user.name);
    const [iconFile, setIconFile] = useState<File|null>(null);
    const [previewUrl, setPreviewUrl] = useState<string|null>(user.icon);
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string|null>(null);
    const [successMsg, setSuccessMsg] = useState<string|null>(null);

    const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        if (iconFile) {
            formData.append('icon', iconFile);
        }
        try {
            const token = Cookies.get('accessToken');
            const res = await fetch(`${BACKEND_API_URL}/api/accounts/me/`, {
                method: 'PATCH',
                headers: {...(token ? {'Authorization': `Bearer ${token}`} : {})},
                body: formData,
            });
            if(!res.ok){
                throw new Error (`更新エラー ${res.status}`);
            }
            setSuccessMsg("ユーザー情報を更新しました。");
            
            setTimeout(() => {
                onUpdate();
                onClose()
            }, 2000);
        }catch(err){
            console.error(err);
            setErrorMsg("ユーザー情報の更新に失敗しました。")
        }finally{
            setIsLoading(false);
        }
    };

    if(successMsg){
        return(
            <ModalBase onClose={onClose} maxWidth="max-w-md">
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                            ✓
                        </div>
                        <h2 className="text-2xl font-blod text-gray-800 mb-2">Success!</h2>
                        <p className="text-gray-600 font-medium">{successMsg}</p>
                        <p className="text-sm text-gray-400 mt-4">プロフィール画面に戻ります...</p>
                    </div>
                </div>
            </ModalBase>
        );
    }

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                {errorMsg && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm items-start gap-2 animate-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-bold">エラーが発生しました。</p>
                            <p>{errorMsg}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div>
                        <label className="relative cursor-pointer group">
                            <img 
                                src={previewUrl || ""}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-70 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 font-bold text-xs">
                                Change
                            </div>
                            <input 
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if(e.target.files?.[0]) {
                                        setIconFile(e.target.files[0]);
                                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all active:scale-95"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </ModalBase>
    );
};

export default EditProfileModal;