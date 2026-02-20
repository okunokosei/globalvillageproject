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
            <div>
                <h1 className="text-2xl font-bold mb-5">新しいお知らせを作成する</h1>
                {errorMsg && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm items-start gap-2 animate-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-bold">エラーが発生しました。</p>
                            <p>{errorMsg}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleCreateNotice} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">タグを選択</label>
                        {noticesTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => setSelectedTagId(tag.id)}
                                className={`text-sm p-1 m-1 border rounded-full font-bold ${
                                    selectedTagId === tag.id
                                        ?"text-white shadow-md transform scale-105 bg-blue-500"
                                        :"bg-withe text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                    <div>
                        <label className="flex">
                            <input 
                                type="checkbox"
                                onChange={() => setIsPinned(!isPinned)}
                                className="w-4 h-4 mr-2 rounded"
                            />
                            <span className="text-sm font-medium">Pin to top</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">タイトル(日本語)</label>
                        <input
                            type="text"
                            value={titleJp}
                            onChange={(e) => setTitleJp(e.target.value)}
                            className="border p-2 w-fullrounded"
                            placeholder="日本語でタイトルを入力"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">タイトル(英語)</label>
                        <input
                            type="text"
                            value={titleEn}
                            onChange={(e) => setTitleEn(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="Enter title in English"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">内容(日本語)</label>
                        <textarea
                            onChange={(e) => setBodyJp(e.target.value)}
                            className="border p-2 w-full rounded resize-y"
                            rows={4}
                            placeholder="日本語で説明を入力"
                            value={bodyJp}
                        />
                    </div>
                    <div>
                        <label className="block text-sx font-medium">内容(英語)</label>
                        <textarea
                            onChange={(e) => setBodyEn(e.target.value)}
                            className="border p-2 w-full rounded resize-y"
                            rows={4}
                            placeholder="Enter description in English"
                            value={bodyEn}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">画像</label>
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if(e.target.files && e.target.files[0]){
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isRequiredFieldsFilled || isLoading}
                        className={`p-3 text-white font-bold rounded ${(isRequiredFieldsFilled || isLoading) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
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
    );
};

export default CreateNoticeModal;
