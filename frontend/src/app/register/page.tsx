'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // 日付操作ロジック
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const d6 = new Date(today.getFullYear(), today.getMonth() + 6, 1);
    const SixMonthsFromNowStr = `${d6.getFullYear()}-${String(d6.getMonth() + 1).padStart(2, '0')}`;

    const getSurroundingMonths = () => {
        const months = [];
        for (let i = -6; i <= 6; i++){
            const d = new Date(today.getFullYear(), today.getMonth()+i, 1);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            months.push(`${yyyy}-${mm}`);
        };
        return months;
    }
    const moveInMonthOptions = getSurroundingMonths();

    const getNext12Month = () => {
        const months = [];
        for (let i = 0; i <= 12; i++){
            const d = new Date(today.getFullYear(), today.getMonth()+i, 1);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            months.push(`${yyyy}-${mm}`);
        };
        return months;
    }
    const moveOutMonthOptions = getNext12Month();


    // 必須項目
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    // 任意項目
    const [moveInMonth, setMoveInMonth] = useState(currentMonthStr);
    const [moveOutMonth, setMoveOutMonth] = useState(SixMonthsFromNowStr);
    const [iconFile, setIconFile] = useState<File | null>(null);

    // リアルタイムバリデーション
    const isPasswordValue = password.length >= 8;
    const isPasswordMatch = password === rePassword;
    const roomRegex = /^[A-Z][0-9]{3}$/;
    const isRoomValid = roomRegex.test(roomNumber);

    const isRequireFieldsFilled = email && name && roomNumber && password && rePassword;
    const canSubmit = isRequireFieldsFilled && isPasswordValue && isPasswordMatch && isRoomValid;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('re_password', rePassword);
        formData.append('name', name);
        formData.append('room_number', roomNumber);

        if (moveInMonth) {
            formData.append('move_in_date', `${moveInMonth}-01`);
        }
        if (moveOutMonth) {
            formData.append('move_out_date', `${moveOutMonth}-01`);
        }
        if (iconFile) {
            formData.append('icon', iconFile);
        }

        try {
            const res = await fetch(`${apiUrl}/api/auth/users/`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert('登録成功! ログイン画面へ移動します。');
                router.push('/login');
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert('登録失敗: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-5">新規会員登録</h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                {/* name */}
                <div>
                    <label className="block text-sm font-medium">名前 (必須)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border p-2 w-full"
                    />
                </div>
                {/* room number */}
                <div>
                    <label className="block text-sm font-medium">部屋番号 (例 : A101)</label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className={`border p-2 w-full ${ !isRoomValid && roomNumber ? 'border-red-500' : '' }`}
                    />
                    {roomNumber && !isRoomValid && (
                        <p className="text-red-500 text-xs mt-1">
                            大文字アルファベット1文字 + 数字3桁で入力してください
                        </p>
                    )}
                </div>
                {/* password */}
                <div>
                    <label className="block text-sm font-medium">パスワード (8文字以上)</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`border p-2 w-full ${ !isPasswordValue && password ? 'border-red-500' : '' }`}
                    />
                    {password && !isPasswordValue && (
                        <p className="text-red-500 text-xs mt-1">
                            パスワードが短すぎます。
                        </p>
                    )}
                </div>
                {/* repassword */}
                <div>
                    <label className="block text-sm font-medium">パスワード (確認)</label>
                    <input
                      type="password"
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                      className={`border p-2 w-full ${ !isPasswordMatch && rePassword ? 'border-red-500' : '' }`}
                    />
                    {rePassword && !isPasswordMatch && (
                        <p className="text-red-500 text-xs mt-1">
                            パスワードが一致しません。
                        </p>
                    )}
                </div>
                {/* mail */}
                <div>
                    <label className="block text-sm font-medium">メールアドレス</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border p-2 w-full"
                    />
                </div>
                {/* 入居月 */}
                <div>
                    <label className="block text-sm font-medium">入居月</label>
                    <select value={moveInMonth} onChange={(e) => setMoveInMonth(e.target.value)} className="border p-2 w-full bg-white">
                        {moveInMonthOptions.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                {/* 退去予定月 */}
                <div>
                    <label className="block text-sm font-medium">退去予定月</label>
                    <select value={moveOutMonth} onChange={(e) => setMoveOutMonth(e.target.value)} className="border p-2 w-full bg-white">
                        {moveOutMonthOptions.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                {/* アイコン画像 */}
                <div>
                    <label className="block text-sm font-medium">アイコン画像</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setIconFile(e.target.files[0]);
                        }
                      }}
                      className="border p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`p-3 text-white font-bold rounded ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    登録する
                </button>
            </form>
        </div>
    );
};



export default RegisterPage;