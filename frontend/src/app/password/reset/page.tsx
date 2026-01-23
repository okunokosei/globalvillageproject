'use client'
import React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const PasswordResetPage = () => {
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${apiurl}/api/auth/users/reset_password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });
            if (res.ok) {
                alert('パスワード再設定用のURLをメールで送信しました。 \n届かない場合は迷惑メールフォルダもご確認ください。');
                router.push('/login');
            } else {
                alert('送信に失敗しました。メールアドレスをご確認ください。')
            }
        } catch (err) {
            console.error(err);
            alert('ログイン処理に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-5">パスワードの再設定</h1>
            <p className="mb-4 text-sm text-gray-600">
                登録したメールアドレスを入力してください。<br />
                再設定用のリンクをお送りします。
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium">メールアドレス</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? '送信中...' : 'メールを送信する'}
                </button>
            </form>
            <div className="text-right">
                <Link href="/login" className="text-sm hover:underline">
                    ログインページへ戻る
                </Link>
            </div>
        </div>
    )
};

export default PasswordResetPage