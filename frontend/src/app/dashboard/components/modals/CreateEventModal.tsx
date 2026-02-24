
'use client';

import React, { useState } from "react";
import { Event }  from "../../types";

import Cookies from 'js-cookie';
import ModalBase from "../ModalBase";

const CreateEventModal = ({onClose}: {onClose: () => void}) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [titleEn, setTitleEn] = useState('');
    const [titleJp, setTitleJp] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionJp, setDescriptionJp] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [googleFormUrl, setGoogleFormUrl] = useState('');

    const isRequiredFieldsFilled = titleEn && titleJp && descriptionEn && descriptionJp && location && date && startTime && endTime;

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
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
        if (coverImage){
            formData.append('cover_image', coverImage);
        }
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
        }
    };

    const inputClassName = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";
    const labelClassName = "block text-sm font-bold text-gray-700 mb-1.5";

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
                        <label className={labelClassName}>カバー画像</label>
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                            ${coverImage
                                ? "border-blue-400 bg-blue-50 hover:bg-blue-100"
                                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400"
                            }`}
                        >
                            {coverImage ? (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <div className="w-10 h-10 mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-blue-700 truncate max-w-xs px-2">
                                        {coverImage.name}
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
                                        setCoverImage(e.target.files[0]);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
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
}

export default CreateEventModal;
