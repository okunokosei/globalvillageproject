
'use client';

import React, { useState } from "react";
import { Event }  from "../../types";

import Cookies from 'js-cookie';
import ModalBase from "../ModalBase";

import { X, Image as ImageIcon } from "lucide-react";

const CreateEventModal = ({onClose}: {onClose: () => void}) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    const MAX_IMAGES = 3;

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [titleEn, setTitleEn] = useState('');
    const [titleJp, setTitleJp] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionJp, setDescriptionJp] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [googleFormUrl, setGoogleFormUrl] = useState('');

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const isRequiredFieldsFilled = titleEn && titleJp && descriptionEn && descriptionJp && location && date && startTime && endTime;

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        const formData = new FormData();
        formData.append('title_en', titleEn);
        formData.append('title_jp', titleJp);
        formData.append('description_en', descriptionEn);
        formData.append('description_jp', descriptionJp);
        formData.append('location', location);
        console.log("送信する日付: ", date);
        formData.append('date', date);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        formData.append('google_form_url', googleFormUrl);

        const token = Cookies.get('accessToken')
        try {
            const EventRes = await fetch (`${BACKEND_URL}/api/events/`, {
                method: 'POST',
                headers: {
                    ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                },
                body: formData,
            });
            if(EventRes.ok) {
                setSuccessMsg("イベントを作成しました！");
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 2000);
            }else {
                const errorData = await EventRes.json();
                const message = errorData.detail || errorData.message || "入力内容を確認してください。";
                setErrorMsg(`作成に失敗しました : ${message}`)
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("通信エラーが発生しました。時間を空けて再度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClassName = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";
    const labelClassName = "block text-sm font-bold text-gray-700 mb-1.5";

    const handleImageCange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const newFiles = Array.from(e.target.files);
            const combinedFiles = [...imageFiles, ...newFiles].slice(0, MAX_IMAGES);
            setImageFiles(combinedFiles);
            const newPreviewUrls = combinedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(newPreviewUrls)
        }
        e.target.value='';
    };

    const removeImage = (indexToRemove: number) => {
        const filteredFiles = imageFiles.filter((_,index) => index !== indexToRemove);
        setImageFiles(filteredFiles);

        URL.revokeObjectURL(previewUrls[indexToRemove]);

        const filteredPreviewUrls = previewUrls.filter((_, index) => index !== indexToRemove);
        setPreviewUrls(filteredPreviewUrls);
    };

    const renderContent = () => {
        if(successMsg) {
            return(
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm">
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
                    <h1 className="text-2xl font-bold text-gray-800">新しいイベント</h1>
                    <p className="text-sm text-gray-500 mt-1">イベントの情報を入力してください</p>
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
                <form onSubmit={handleCreateEvent} className="flex flex-col gap-5">
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
                        <label className={labelClassName}>詳細（日本語）</label>
                        <textarea
                            onChange={(e) => setDescriptionJp(e.target.value)}
                            value={descriptionJp}
                            rows={4}
                            placeholder="日本語で詳細を入力"
                            className={inputClassName}
                        />
                    </div>
                    <div>
                        <label className={labelClassName}>詳細（英語）</label>
                        <textarea
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            value={descriptionEn}
                            rows={4}
                            placeholder="英語で詳細を入力"
                            className={inputClassName}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClassName}>場所</label>
                            <input 
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={inputClassName}
                                placeholder="場所"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>開催日</label>
                            <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClassName}>開始時間</label>
                            <input 
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>終了時間</label>
                            <input 
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-2"></div>

                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <label className="block text-sm font-bold text-gray-700">添付画像</label>
                            <span className="text-xs text-gray-500 font-medium">
                                {imageFiles.length} / {MAX_IMAGES}枚
                            </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            {previewUrls.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-balck/50 text-white rounded-full p-1 opacity-80 hover:opacity-100 hover:bg-red-500 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {imageFiles.length < MAX_IMAGES && (
                                <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white hover:border-blue-400 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                                        <ImageIcon size={24} className="mb-2" />
                                        <p className="text-sm font-medium"><span className="text-blue-600">クリック</span>して写真を追加</p>
                                    </div>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageCange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>Google Forms URL</label>
                        <input 
                            type="text"
                            value={googleFormUrl}
                            onChange={(e) => setGoogleFormUrl(e.target.value)}
                            className={inputClassName}
                            placeholder="Google Form のURLを入力"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isRequiredFieldsFilled || isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg
                            ${isRequiredFieldsFilled
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-200 transform active:scale-[0.98]"
                                : "bg-gray-300 cursor-not-allowed shadow-none"
                            }`}
                    >
                        {isLoading ? "作成中..." : "作成する"}
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
}

export default CreateEventModal;
