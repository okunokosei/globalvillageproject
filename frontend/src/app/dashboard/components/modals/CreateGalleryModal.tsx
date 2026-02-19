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
            <div>
                <h1 className="text-2xl font-bold mb-5">新しいアルバムを作成する</h1>
                {errorMsg && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm items-start gap-2 animate-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-bold">エラーが発生しました。</p>
                            <p>{errorMsg}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleCreateGallery} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium">タイトル（日本語）</label>
                        <input 
                            type="text"
                            value={titleJp}
                            onChange={(e) => setTitleJp(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="日本語でタイトルを入力"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">タイトル（英語）</label>
                        <input 
                            type="text"
                            value={titleEn}
                            onChange={(e) => setTitleEn(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="英語でタイトルを入力"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">開催日</label>
                        <input 
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">イメージ画像</label>
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if(e.target.files && e.target.files[0]){
                                    setCoverImageUrl(e.target.files[0]);
                                }
                            }}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Google Photos URL</label>
                        <input 
                            type="text"
                            value={googlePhotosUrl}
                            onChange={(e) => setGooglePhotosUrl(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="Google Photos の共有URLを入力"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isRequiredFieldsFilled}
                        className={
                            `p-3 text-white font-bold rounded
                            ${isRequiredFieldsFilled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`
                        }
                    >
                        作成する
                    </button>
                </form>
            </div>
        );
    };

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            <div className="p-10">
                {renderContent()}
            </div>
        </ModalBase>
    )
};

export default CreateGalleryModal;