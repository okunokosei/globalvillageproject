'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Cookies from 'js-cookie';

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
                alert('ログイン成功！');
                router.push('/dashboard');
            } else {
                alert('メールアドレスまたはパスワードが間違っています。')
            }
        } catch (err) {
            console.error(err);
            alert('ログイン処理に失敗しました。');
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
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
                    <label htmlFor="">パスワード</label>
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
        </div>
    )
};

export default LoginPage