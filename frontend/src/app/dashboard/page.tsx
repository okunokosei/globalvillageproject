'use client';

import { useState, useEffect } from "react";

import { Notice} from "./types";

import Header from "./components/Header";
import NewsCard from "./components/NewsCard";
import NewsDetailModal from "./components/NewsModal";

import Cookies from 'js-cookie';


const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;


const HomePage = () => {
    const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

    const [notices, setNotices] = useState<Notice[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const token = Cookies.get('accessToken');

            const noticesRes = await fetch(`${BACKEND_URL}/api/notices/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                    // ()は優先順位のカッコ。[]は配列（順番が大事）。{}はオブジェクト（キーが大事）。
                }
            });
            if(!noticesRes.ok){
                throw new Error (`ニュース取得エラー${noticesRes.status}`);
            }
            const noticesData = await noticesRes.json();

            setNotices(noticesData.results);

        }catch (err) {
            console.error(err);
            setError("データの読み込みに失敗しました。時間を空けて再度お試しください。")
        }finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [])


    if(isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full "></div>
            </div>
        );
    }

    if(error){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 px-4 text-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 h-[100dvh] overflow-y-auto overflow-x-hidden overscroll-none hide-scrollbar">
            <Header title="Home" subtitle="お知らせと生活ガイド" />
            <div className="space-y-3 pt-4 pb-24 px-4">
                {
                    notices.map((notice) => (
                        <NewsCard key={notice.id} notice={notice} onClick={() => setSelectedNotice(notice)} />
                    ))
                }
            </div>

            {/* 詳細 */}
            {selectedNotice && (
                <NewsDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} onUpdate={() => fetchData()} />
            )}
        </div>
    )
};

export default HomePage;