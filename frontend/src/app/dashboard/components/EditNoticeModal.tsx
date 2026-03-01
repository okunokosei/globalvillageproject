'use cliebnt';

import { Notice, NoticeTag } from "../types";
import React, { useEffect, useState } from "react";

import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import ModalBase from "./ModalBase";
import { X, Image as ImageIcon } from "lucide-react";

type Props = {
    notice: Notice;
    onClose: () => void;
    onUpdate: () => void;
}

const EditNoticeModal = ({notice, onClose, onUpdate}: Props) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const MAX_IMAGES = 3;

    const [isLoading, setIsLoading] = useState(false);
    const [noticeTags, setNoticeTags] = useState<NoticeTag[]>([])

    const [selectedTagId, setSelectedTagId] = useState<number|null>(notice.tag.id)
    const [isPinned, setIsPinned] = useState(notice.is_pinned);
    const [titleJp, setTitleJp] = useState(notice.title_jp);
    const [titleEn, setTitleEn] = useState(notice.title_en);
    const [bodyJp, setBodyJp] = useState(notice.body_jp);
    const [bodyEn, setBodyEn] = useState(notice.body_en);


    const [existingImages, setExistingImages] = useState<{id: number, image: string}[]>(notice.images || []);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

    const totalImageCount = existingImages.length + newImageFiles.length;

    const handleRemoveExistingImage = (imageIdToRemove: number) => {
        setExistingImages(prev => prev.filter(img => img.id !== imageIdToRemove));
        setDeletedImageIds(prev => [...prev, imageIdToRemove]);
    };

    const handleAddNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const newFiles = Array.from(e.target.files);
            const availableSlots = MAX_IMAGES - totalImageCount;
            const allowedFiles = newFiles.slice(0, availableSlots);

            const combinedFiles = [...newImageFiles, ...allowedFiles];
            setNewImageFiles(combinedFiles);

            const generatedUrls = combinedFiles.map(file => URL.createObjectURL(file));
            setNewPreviewUrls(generatedUrls);
        }
        e.target.value = '';
    };

    const handleRemoveNewImage = (indexToRemove: number) => {
        const filteredFiles = newImageFiles.filter((_, index) => index !== indexToRemove);
        setNewImageFiles(filteredFiles);
        URL.revokeObjectURL(newPreviewUrls[indexToRemove]);
        setNewPreviewUrls(newPreviewUrls.filter((_,index) => index !== indexToRemove));
    };

    useEffect(() => {
        const fetchTags = async () => {
            try{
                const token = Cookies.get('accessToken');
                const res = await fetch(`${apiUrl}/api/noticetags/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? {'Authorization': `Bearer ${token}`} : {})
                    }
                });
                if(res.ok) {
                    const data = await res.json();
                    setNoticeTags(data.results || data);
                }
            }catch(err) {
                console.error(err);
                toast.error("タグの読み込みに失敗しました。")
            }
        };
        fetchTags();
    }, [apiUrl])

    const isRequiredFieldsFilled = selectedTagId && titleEn && titleJp && bodyEn && bodyJp;

    const handleUpdateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('tag', String(selectedTagId));
        formData.append('title_jp', titleJp);
        formData.append('title_en', titleEn);
        formData.append('body_jp', bodyJp);
        formData.append('body_en', bodyEn);
        formData.append('is_pinned', String(isPinned));

        deletedImageIds.forEach(id => {
            formData.append('deleted_image_ids', String(id));
        });

        newImageFiles.forEach(file => {
            formData.append('new_images', file);
        });

        const token = Cookies.get('accessToken');

        try {
            const res = await fetch(`${apiUrl}/api/notices/${notice.id}/`, {
                method: 'PATCH',
                headers: {
                    ...(token ? {'Authorization': `Bearer ${token}`} : {})
                },
                body: formData,
            });
            if(res.ok) {
                toast.success("お知らせを更新しました。")
                onUpdate();
                onClose();
            } else {
                const errorData = await res.json();
                toast.error(`更新に失敗しました: ${errorData.detail || "入力内容を確認してください"}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("通信エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClassName = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";
    const labelClassName="block text-sm font-bold text-gray-700 mb-1.5";

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md" isDouble={true} >
            <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-white rounded-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">お知らせの編集</h1>
                </div>
                <form onSubmit={handleUpdateNotice} className="flex flex-col gap-4">
                    <div>
                        <label className={labelClassName}>タグを選択</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {noticeTags.map((tag) => (
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
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>タイトル(英語)</label>
                            <input
                                type="text"
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>内容(日本語)</label>
                        <textarea
                            onChange={(e) => setBodyJp(e.target.value)}
                            className={inputClassName}
                            rows={4}
                            value={bodyJp}
                        />
                    </div>
                    <div>
                        <label className={labelClassName}>内容(英語)</label>
                        <textarea
                            onChange={(e) => setBodyEn(e.target.value)}
                            className={inputClassName}
                            rows={4}
                            value={bodyEn}
                        />
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between items-end mb-1.5">
                            <label className="block text-sm font-bold text-gray-700">添付画像</label>
                            <span className="text-xs text-gray-500 font-medium">
                                {totalImageCount} / {MAX_IMAGES}枚
                            </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            {(existingImages.length > 0 || newPreviewUrls.length > 0) && (
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {existingImages.map((img) => (
                                        <div key={`exist-${img.id}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                            <img src={img.image} alt="Existing" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(img.id)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-80 hover:opacity-100 hover:bg-red-500 transitiion-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {newPreviewUrls.map((url, index) => (
                                        <div key={`new-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200 shadow-sm group" >
                                            <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-80 hover:opacity-100 hover:bg-red-500 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {totalImageCount < MAX_IMAGES && (
                                <label className="flex flex-col items-center justify-center w-full h-24 border border-gray-300 rounded-lg cursor-pointer hover:bg-white hover:border-blue-400 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                                        <ImageIcon size={24} className="mb-2" />
                                        <p className="text-sm font-medium"><span className="text-blue-600">クリック</span>して写真を追加</p>
                                    </div>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleAddNewImages}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
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
                        {isLoading ? "更新中..." : "変更を保存する"}
                    </button>
                </form>
            </div>
        </ModalBase>
    );
};

export default EditNoticeModal;