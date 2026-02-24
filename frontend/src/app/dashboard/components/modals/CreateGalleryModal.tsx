'use client';

import Cookies from 'js-cookie';
import ModalBase from "../ModalBase";
import { useState } from "react";

const CreateGalleryModal = ({onClose}: {onClose: () => void}) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    
    const [errorMsg, setErrorMsg] = useState<string|null>(null);
    const [successMsg, setSuccessMsg] = useState<string|null>(null);
    
    const [titleEn, setTitleEn] = useState('');
    const [titleJp, setTitleJp] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState<File|null>(null);
    const [googlePhotosUrl, setGooglePhotosUrl] = useState('')

    const isRequiredFieldsFilled = titleEn && titleJp && eventDate && coverImageUrl && googlePhotosUrl;

    const handleCreateGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        const formData = new FormData();
        formData.append('title_en', titleEn);
        formData.append('title_jp', titleJp);
        formData.append('event_date', eventDate);
        if(coverImageUrl){
            formData.append('cover_image_url', coverImageUrl);
        }
        formData.append('google_photos_url', googlePhotosUrl);
        const token = Cookies.get('accessToken');

        try {
            const GalleryRes = await fetch (`${BACKEND_URL}/api/gallery/`,{
                method: 'POST',
                headers: {
                    ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                },
                body: formData,
            });
            if(GalleryRes.ok){
                setSuccessMsg("アルバムを作成しました！");
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 2000);
            }else {
                const errorData = await GalleryRes.json();
                const message = errorData.detail || errorData.message || "入力内容を確認してください。";
                setErrorMsg(`作成に失敗しました: ${message}`)
            }
        } catch(err){
            console.error(err);
            setErrorMsg("通信エラーが発生しました。時間を空けて再度お試しください。");
        }
    };

    const inputClassName = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";
    const labelClassName = "block text-sm font-bold text-gray-700 mb-1.5";

    const renderContent = () => {
        if(successMsg) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                    <p className="text-gray-600 font-medium">{successMsg}</p>
                    <p className="text-sm text-gray-400 mt-4">ホームに戻ります。</p>
                </div>
            );
        }
        return (
            <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 custom-scrollbar">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">新しいアルバム</h1>
                    <p className="text-sm text-gray-500 mt-1">アルバムの情報を入力してください</p>
                </div>
                {errorMsg && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-bold">エラーが発生しました。</p>
                            <p>{errorMsg}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleCreateGallery} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className={labelClassName}>タイトル（日本語）</label>
                            <input 
                                type="text"
                                value={titleJp}
                                onChange={(e) => setTitleJp(e.target.value)}
                                className={inputClassName}
                                placeholder="日本語でタイトルを入力"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>タイトル（英語）</label>
                            <input 
                                type="text"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                className={inputClassName}
                                placeholder="英語でタイトルを入力"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>開催日</label>
                        <input 
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">イメージ画像</label>
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                            ${coverImageUrl
                                    ? "border-blue-400 bg-blue-50 hover:bg-blue-100"
                                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400"
                                }`}
                        >
                            {coverImageUrl ? (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <div className="w-10 h-10 mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-blue-700 truncate max-w-xs px-2">
                                        {coverImageUrl.name}
                                    </p>
                                    <p className="text-xs text-blue-500 mt-1">クリックして別の画像に変更</p>
                                </div>
                            ):(
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                    </svg>
                                    <p className="text-sm text-gray-500"><span className="font-bold text-blue-600">クリックしてファイルを選択</span></p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF など</p>
                                </div>
                            )}
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if(e.target.files && e.target.files[0]){
                                        setCoverImageUrl(e.target.files[0]);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label className={labelClassName}>Google Photos URL</label>
                        <input 
                            type="text"
                            value={googlePhotosUrl}
                            onChange={(e) => setGooglePhotosUrl(e.target.value)}
                            className={inputClassName}
                            placeholder="Google Photos の共有URLを入力"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isRequiredFieldsFilled}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg
                            ${isRequiredFieldsFilled
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-200 transform active:scale-[0.98]"
                                : "bg-gray-300 cursor-not-allowed shadow-none"
                            }`}
                    >
                        作成する
                    </button>
                </form>
            </div>
        );
    };

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            <div>
                {renderContent()}
            </div>
        </ModalBase>
    )
};

export default CreateGalleryModal;