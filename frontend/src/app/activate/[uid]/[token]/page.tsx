'use client';

import { useParams, useRouter } from 'next/navigation';

const ActivationPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { uid, token } = useParams();

    const handleSubmit = async () => {
        const res = await fetch(`${apiUrl}/api/auth/users/activation/`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ uid, token }),
        });
        if (res.ok) {
            alert('本登録が完了しました！ログインしてください。');
            router.push('/login');
        } else {
            alert('有効化に失敗しました。');
        }
    };

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold">アカウントの有効化</h1>
            <p className="my-4">以下のボタンを押して、登録を完了させてください。</p>
            <button onClick={handleSubmit} className="bg-blue-600 text-white p-3">
                アカウントを有効にする
            </button>
        </div>
    )
}

export default ActivationPage