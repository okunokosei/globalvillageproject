'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const PasswordResetConfirmPage = () => {
    const params = useParams();
    const router = useRouter();
    const apiurl = process.env.NEXT_PUBLIC_API_URL;

    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(password !== rePassword) {
            alert('パスワードが一致しません。もう一度入力してください。');
            return;
        }
        setIsLoading(true);

        try {
            const res = await fetch(`${apiurl}/api/auth/users/reset_password_confirm`, {
                method: 'POST',
                headers: {
                    'ContentType': 'application/json',
                },
                body: JSON.stringify({
                    uid: params.uid,
                    token: params.token,
                    new_password: password,
                    re_new_password: rePassword,
                }),
            });
            if(res.ok) {
                alert('パスワードの変更が完了しました。\n新しいパスワードでログインしてください。');
                router.push('/login');
            } else {
                alert('パスワードリセットに失敗しました。\nリンクの有効期限が切れている可能性があります。');
            }
        } catch (err) {
            console.error(err);
            alert('サーバーとの通信に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-5">新しいパスワードの設定</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">新しいパスワード</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                        minLength={8}
                        placeholder="8文字以上"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">新しいパスワード(確認)</label>
                    <input 
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                        minLength={8}
                        placeholder="確認のためもう一度入力"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`text-white p-3 rounded font-bold transition colors ${ 
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? '変更処理中...' : 'パスワードを変更する'}
                </button>
            </form>
        </div>
    );
};

export default PasswordResetConfirmPage;
