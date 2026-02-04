'use client';

import { useState, useEffect } from "react";

import { NoticeTag, Notice, GuideCategory, Guide } from "./types";

import Header from "./components/Header";
import TabButton from "./components/TabButton";
import NewsCard from "./components/NewsCard";
import NewsDetailModal from "./components/NewsModal";
import GuideDetailModal from "./components/GuideModal";
import GuideCategoryItem from "./components/GuideItem";

import Cookies from 'js-cookie';

// モックデータ-------------------------------------
const MOCK_NOTICES: Notice[] = [
    {
        id: 1,
        tag: { id: 1, name: "重要", slug: "important", color_code: "#EF4444" },
        title_en: "Important: Rent Payment Due",
        title_jp: "【重要】今月の家賃の支払いについて",
        body_en: "Please pay by the 25th",
        body_jp: "25日までに支払いを完了させてください。遅れる場合はオフィスまで連絡をお願いします。",
        image: "https://placehold.co/600x400/fee2e2/991b1b?text=Payment",
        is_pinned: true,
        created_at: "2026-01-30",
    },
    {
    id: 2,
    tag: { id: 2, name: "イベント", slug: "event", color_code: "#3B82F6" }, // 青
    title_en: "Welcome Party for New Residents",
    title_jp: "新入寮生歓迎パーティーのお知らせ🎉",
    body_en: "Let's enjoy pizza and drinks!",
    body_jp: "ピザとドリンクを用意しています！みんなで楽しみましょう。",
    image: "https://placehold.co/600x400/dbeafe/1e40af?text=Party",
    is_pinned: false,
    created_at: "2026-02-01",
  },
  {
    id: 3,
    tag: { id: 3, name: "施設", slug: "facility", color_code: "#64748B" }, // グレー
    title_en: "Kitchen Cleaning Schedule",
    title_jp: "共用キッチンの定期清掃について",
    body_en: "Cleaning will start at 10 AM.",
    body_jp: "午前10時から清掃業者が入ります。その間はキッチンを使用できません。",
    image: null, // 画像なしパターン
    is_pinned: false,
    created_at: "2026-02-05",
  },
];

const MOCK_GUIDE_DATA: GuideCategory[] = [
  {
    id: 1,
    name_en: "Garbage Disposal",
    name_jp: "ゴミ出しルール",
    icon_name: "🗑️",
    guides: [
      {
        id: 101,
        title_en: "Burnable Trash",
        title_jp: "可燃ごみの出し方",
        body_en: "Tue & Fri",
        body_jp: "収集日は火曜日と金曜日です。指定の袋に入れてください。",
        image: null
      },
      {
        id: 102,
        title_en: "Recyclables",
        title_jp: "資源ごみ（カン・ビン）",
        body_en: "Wed only",
        body_jp: "水曜日のみ回収します。中を洗って出してください。",
        image: null
      }
    ]
  },
  {
    id: 2,
    name_en: "Common Areas",
    name_jp: "共用部の利用",
    icon_name: "🍳",
    guides: [
      {
        id: 201,
        title_en: "Kitchen Rules",
        title_jp: "キッチンの利用ルール",
        body_en: "Wash dishes.",
        body_jp: "使用後はすぐに食器を洗い、生ごみは各自で処理してください。",
        image: null
      }
    ]
  },
];
// ----------------------------------------------------

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;


const HomePage = () => {
    const [currentView, setCurrentView] = useState<"news" | "guide">("news");
    const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
    const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

    const [notices, setNotices] = useState<Notice[]>([]);
    const [guideCategories, setGuideCategories] = useState<GuideCategory[]>([])

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const token = Cookies.get('accessToken');
                // console.log("現在のトークン:", token);

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

                const guideCategoriesRes = await fetch(`${BACKEND_URL}/api/guides/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? {'Authorization': `Bearer ${token}`,} : {})
                    }
                });
                if(!guideCategoriesRes.ok){
                    throw new Error (`ガイド取得エラー${guideCategoriesRes.status}`);
                }
                const guideCategoriesResData = await guideCategoriesRes.json();

                // console.log("取得ニュースデータ:",noticesData);
                setNotices(noticesData.results);
                setGuideCategories(guideCategoriesResData.results);

            }catch (err) {
                console.error(err);
                setError("データの読み込みに失敗しました。時間を空けて再度お試しください。")
            }finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [])

    const closeModal= () => {
        setSelectedNotice(null);
        setSelectedGuide(null);
    };

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

    const newsContent = (
        <div className="space-y-3 pt-4 pb-24">
            {
                notices.map((notice) => (
                    <NewsCard key={notice.id} notice={notice} onClick={() => setSelectedNotice(notice)} />
                ))
            }
        </div>
    );

    const guideContent = (
        <div className="pt-4 pb-24">
            {
                guideCategories.map((category) => (
                    <GuideCategoryItem 
                        key={category.id}
                        category={category}
                        isOpen={openCategoryId === category.id}
                        onToggle={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}
                        onGuideClick={(guide) => setSelectedGuide(guide)}
                    />
                ))
            }
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="sticky top-[57px] z-40 bg-gray-50 pt-2 px-2 pb-2">
                <div className="flex bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <TabButton 
                        label="News"
                        isActive={currentView === "news"}
                        onClick={() => setCurrentView("news")}
                    />
                    <TabButton 
                        label="Guide"
                        isActive={currentView === "guide"}
                        onClick={() => setCurrentView("guide")}
                    />
                </div>
            </div>
            <div className="px-4">
                {currentView === "news" ? newsContent : guideContent}
            </div>

            {/* 詳細 */}
            {selectedNotice && (
                <NewsDetailModal notice={selectedNotice} onClose={closeModal} />
            )}
            {selectedGuide && (
                <GuideDetailModal guide={selectedGuide} onClose={closeModal} />
            )}
        </div>
    )
};

export default HomePage;