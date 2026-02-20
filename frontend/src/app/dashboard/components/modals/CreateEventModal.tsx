
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

    const renderContent = () => {
        if(successMsg) {
            return(
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
                <h1 className="text-2xl font-bold mb-5">新しいイベントを作成する</h1>
                {errorMsg && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm items-start gap-2 animate-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-bold">エラーが発生しました。</p>
                            <p>{errorMsg}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
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
                        <label className="block text-sm font-medium">詳細（日本語）</label>
                        <textarea
                            onChange={(e) => setDescriptionJp(e.target.value)}
                            value={descriptionJp}
                            rows={4}
                            placeholder="日本語で詳細を入力"
                            className="border p-2 w-full rounded resize-y"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">詳細（英語）</label>
                        <textarea
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            value={descriptionEn}
                            rows={4}
                            placeholder="英語で詳細を入力"
                            className="border p-2 w-full rounded resize-y"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">場所</label>
                        <input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="場所"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">開催日</label>
                        <input 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">開始時間</label>
                        <input 
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">終了時間</label>
                        <input 
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">画像</label>
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if(e.target.files && e.target.files[0]){
                                    setCoverImage(e.target.files[0]);
                                }
                            }}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Google Photos URL</label>
                        <input 
                            type="text"
                            value={googleFormUrl}
                            onChange={(e) => setGoogleFormUrl(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="Google Form のURLを入力"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isRequiredFieldsFilled}
                        className={
                            `p-3 text-white font-bold rounded 
                            ${isRequiredFieldsFilled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"} `
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
}

export default CreateEventModal;
