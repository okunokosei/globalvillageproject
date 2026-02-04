'use client';

import ModalBase from "../ModalBase";
import React, { useState } from "react";

const CreateNoticeModal = ({onClose}: {onClose: () => void}) => {

    const [tag, setTag] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [titleJp, setTitleJp] = useState('');
    const [bodyEn, setbodyEn] = useState('');
    const [bodyJp, setBodyJp] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isPinned, setIsPinned] = useState(false);
    const [createdBy, setCreatedBy] =useState('');
    const [updatedBy, setUpdatedBy] = useState('');

    const handleCreateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
    };

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md">
            <h1>新しいお知らせを作成する</h1>
            <form onSubmit={handleCreateNotice}>
                <div>
                    <label>タイトル(日本語)</label>
                    <input
                        type="text"
                        value={titleJp}
                        onChange={(e) => setTitleJp(e.target.value)}
                    />
                </div>
                <div>
                    <label>タイトル(英語)</label>
                    <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                    />
                </div>
            </form>
        </ModalBase>
    )
};

export default CreateNoticeModal;