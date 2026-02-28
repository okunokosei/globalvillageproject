'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Cookies from 'js-cookie';

import Link from 'next/link';

import toast from 'react-hot-toast';

const LoginPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${apiUrl}/api/auth/jwt/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            if (res.ok) {
                const data = await res.json();
                Cookies.set('accessToken', data.access, { expires: 1 });
                Cookies.set('refreshToken', data.refresh, { expires: 7 });
                // alert('ログイン成功！');
                toast.success('ログインしました！');
                router.push('/dashboard');
            } else {
                // alert('メールアドレスまたはパスワードが間違っています。')
                toast.error('メールアドレスまたはパスワードが間違っています。');
            }
        } catch (err) {
            console.error(err);
            // alert('ログイン処理に失敗しました。');
            toast.error('通信エラーが発生しました。');
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            
            {/* アイコン用、将来的にはReactライブラリに置き換える */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                <Link 
                    href="/" 
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    {/* SVGアイコン（左矢印） */}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-4 h-4 mr-1"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    ホームに戻る
                </Link>
            </div>
            {/* ここまで */}

            <h1 className="text-2xl font-bold mb-5">ログイン</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium">メールアドレス</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">パスワード</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
                >
                    ログインする
                </button>
            </form>
            <div className="text-right">
                <Link href="/password/reset" className="text-sm text-blue-600 hover:underline">
                    パスワードをお忘れですか？
                </Link>
            </div>
        </div>
    )
};

export default LoginPage