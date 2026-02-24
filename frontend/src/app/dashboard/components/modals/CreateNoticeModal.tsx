'use client';
// タブのGET、送信したら更新したい、作成者ユーザーどうやって見分ける？、作成日と更新日を自動で付けたい

import ModalBase from "../ModalBase";
import React, { useEffect, useState } from "react";

import { NoticeTag } from "../../types";

import Cookies from 'js-cookie';

const MOCK_TAGS = [
    {id: 1, name: "重要", slug: "important", color_code: "EF4444"},
    {id: 2, name: "イベント", slug: "event", color_code: "3B82F6"},
    {id: 3, name: "施設", slug: "facility", color_code: "64748B"},
    {id: 4, name: "その他", slug: "other", color_code: "10B981"},
]

const CreateNoticeModal = ({onClose}: {onClose: () => void}) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // console.log("url:",apiUrl);

    const [isLoading, setIsLoading] = useState(false);
    const [isTagLoading, setIsTagLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [titleEn, setTitleEn] = useState('');
    const [titleJp, setTitleJp] = useState('');
    const [bodyEn, setBodyEn] = useState('');
    const [bodyJp, setBodyJp] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isPinned, setIsPinned] = useState(false);
    // const [createdBy, setCreatedBy] =useState('');
    // const [updatedBy, setUpdatedBy] = useState('');

    const [noticesTags, setNoticeTags] = useState<NoticeTag[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsTagLoading(true);
                const token = Cookies.get('accessToken');
                const noticeTagsRes = await fetch(`${apiUrl}/api/noticetags/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                    }
                });
                if(!noticeTagsRes.ok){
                    throw new Error (`ニュース取得エラー${noticeTagsRes.status}`);
                }
                const noticeTagsData = await noticeTagsRes.json();

                setNoticeTags(noticeTagsData.results);
                console.log("getTags :", noticeTagsData);
            }catch (err) {
                console.error(err);
                setErrorMsg("Tagデータの読み込みに失敗しました。時間を空けて再度お試しください。")
            }finally {
                setIsTagLoading(false);
            }
        };
        fetchData();
    },[])

    const isRequiredFieldsFilled = selectedTagId && titleEn && titleJp && bodyEn;

    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        const formData = new FormData();
        formData.append('tag', String(selectedTagId));
        formData.append('title_en',titleEn);
        formData.append('title_jp',titleJp);
        formData.append('body_en',bodyEn);
        formData.append('body_jp',bodyJp);
        formData.append('is_pinned',String(isPinned));
        if (imageFile) {
            formData.append('image',imageFile)
        };

        const token = Cookies.get('accessToken')
        try {
            const noticeRes = await fetch(`${apiUrl}/api/notices/`, {
                method: 'POST',
                headers: {
                    ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                },
                body: formData,
            });
            if(noticeRes.ok) {
                setSuccessMsg("お知らせを作成しました！");
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 2000);
            }else {
                const errorData = await noticeRes.json();
                const message = errorData.detail || errorData.message || "入力内容を確認してください。";
                setErrorMsg(`作成に失敗しました : ${message}`)
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("通信エラーが発生しました。時間を空けて再度お試しください。");
            setIsLoading(false);
        }
    };

    // if(isTagLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //             <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full "></div>
    //         </div>
    //     );
    // }
    const inputClassName = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";
    const labelClassName = "block text-sm font-bold text-gray-700 mb-1.5";


    const renderContent = () => {
        if(successMsg){
            return(
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-blod text-gray-800 mb-2">Success!</h2>
                    <p className="text-gray-600 font-medium">{successMsg}</p>
                    <p className="text-sm text-gray-400 mt-4">ホームに戻ります...</p>
                </div>
            );
        }

        return (
            <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 custom-scrollbar">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">新しいお知らせ</h1>
                    <p className="text-sm text-gray-500 mt-1">お知らせの情報を入力してください</p>
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
                <form onSubmit={handleCreateNotice} className="flex flex-col gap-4">
                    <div>
                        <label className={labelClassName}>タグを選択</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {noticesTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => setSelectedTagId(tag.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                        selectedTagId === tag.id
                                            ?"bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                                            :"bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">上部にピン留めする（Pin to top）</span>
                            <span className="text-xs text-gray-500 mt-0.5">重要なお知らせを一番上に固定します</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPinned(!isPinned)}
                            className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 
                                ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isPinned ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                        >
                            <span 
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out ${
                                    isPinned ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className={labelClassName}>タイトル(日本語)</label>
                            <input
                                type="text"
                                value={titleJp}
                                onChange={(e) => setTitleJp(e.target.value)}
                                className={inputClassName}
                                placeholder="日本語でタイトルを入力"
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>タイトル(英語)</label>
                            <input
                                type="text"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                className={inputClassName}
                                placeholder="Enter title in English"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>内容(日本語)</label>
                        <textarea
                            onChange={(e) => setBodyJp(e.target.value)}
                            className={inputClassName}
                            rows={4}
                            placeholder="日本語で説明を入力"
                            value={bodyJp}
                        />
                    </div>
                    <div>
                        <label className={labelClassName}>内容(英語)</label>
                        <textarea
                            onChange={(e) => setBodyEn(e.target.value)}
                            className={inputClassName}
                            rows={4}
                            placeholder="Enter description in English"
                            value={bodyEn}
                        />
                    </div>

                    <div>
                        <label className={labelClassName}>カバー画像</label>
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                            ${imageFile
                                ? "border-blue-400 bg-blue-50 hover:bg-blue-100"
                                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400"
                            }`}
                        >
                            {imageFile ? (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <div className="w-10 h-10 mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-blue-700 truncate max-w-xs px-2">
                                        {imageFile.name}
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
                                        setImageFile(e.target.files[0]);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
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
    );
};

export default CreateNoticeModal;
