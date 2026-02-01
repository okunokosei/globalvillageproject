'use client';

import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

const ProfilePage = () => {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        alert('ログアウトしました。');
        router.push('/login');
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">プロフィール</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rouded hover:bg-red-600"
            >
                ログアウト
            </button>
        </div>
    )
};

export default ProfilePage