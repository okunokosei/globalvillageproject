'use client';
// タブのGET、送信したら更新したい、作成者ユーザーどうやって見分ける？、作成日と更新日を自動で付けたい

import ModalBase from "../ModalBase";
import React, { useEffect, useState } from "react";

import { SimpleGuideCategory } from "../../types";

import Cookies from 'js-cookie';


const CreateGuideModal = ({onClose}: {onClose: () => void}) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [isTagLoading, setIsTagLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [selectedGuideCategory, setSelectedGuideCategory] = useState<number | null>(null);
    const [titleEn, setTitleEn] = useState('');
    const [titleJp, setTitleJp] = useState('');
    const [bodyEn, setBodyEn] = useState('');
    const [bodyJp, setBodyJp] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [guideCategory, setGuideCategory] = useState<SimpleGuideCategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsTagLoading(true);
                const token = Cookies.get('accessToken');
                const guideCategories = await fetch(`${apiUrl}/api/guide-categories/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                    }
                });
                if(!guideCategories.ok){
                    throw new Error (`ガイドカテゴリー取得エラー${guideCategories.status}`);
                }
                const guideCategoriesDate = await guideCategories.json();

                setGuideCategory(guideCategoriesDate.results);
                // console.log("getTags :", guideCategoriesDate);
            }catch (err) {
                console.error(err);
                setErrorMsg("カテゴリデータの読み込みに失敗しました。時間を空けて再度お試しください。")
            }finally {
                setIsTagLoading(false);
            }
        };
        fetchData();
    },[])

    const isRequiredFieldsFilled = selectedGuideCategory && titleEn && titleJp && bodyEn;

    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        const formData = new FormData();
        formData.append('category', String(selectedGuideCategory));
        formData.append('title_en',titleEn);
        formData.append('title_jp',titleJp);
        formData.append('body_en',bodyEn);
        formData.append('body_jp',bodyJp);
        if (imageFile) {
            formData.append('image',imageFile)
        };

        const token = Cookies.get('accessToken')
        try {
            const guideRes = await fetch(`${apiUrl}/api/guides/`, {
                method: 'POST',
                headers: {
                    ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                },
                body: formData,
            });
            if(guideRes.ok) {
                setSuccessMsg("ガイドを作成しました！");
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 2000);
            }else {
                const errorData = await guideRes.json();
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

    if(isTagLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full "></div>
            </div>
        );
    }

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
                <h1 className="text-2xl font-bold mb-5">新しいガイドを作成する</h1>
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
                        <label className="block text-sm font-medium mb-2">カテゴリーを選択</label>
                        {guideCategory.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedGuideCategory(category.id)}
                                className={`text-sm p-1 m-1 border rounded-full font-bold ${
                                    selectedGuideCategory === category.id
                                        ?"text-white shadow-md transform scale-105 bg-blue-500"
                                        :"bg-withe text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                {category.name_jp}
                            </button>
                        ))}
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

export default CreateGuideModal;