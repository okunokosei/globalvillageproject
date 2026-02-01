'use client';

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Pin, X } from "lucide-react";

// 型定義-----------------------------------------
type NoticeTag = {
    id: number;
    name: string;
    slug: string;
    color_code: string;
};
type Notice = {
    id: number;
    tag: NoticeTag;
    title_en: string;
    title_jp: string;
    body_en: string;
    body_jp: string;
    image: string | null;
    is_pinned: boolean;
    created_at: string;
};
type GuideCategory = {
    id: number;
    name_en: string;
    name_jp: string;
    icon_name: string;
    guides: Guide[];
};
type Guide = {
    id: number;
    title_en: string;
    title_jp: string;
    body_en: string;
    body_jp: string;
    image: string | null;
};
// ------------------------------------------------

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
// ------------------------------------------------

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="px-4 py-3">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Home</h1>
                <p className="text-xs font-medium text-slate-500">お知らせと生活ガイド</p>
            </div>
        </header>
    )
};

type TabButtonProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
                isActive
                ? "text-slate-800"
                : "text-gray-400 hover:text-gray-600"
            }`}
        >
            {label}
            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-800"/>
            )}
        </button>
    )
};

const ModalBase = ({ children, onClose }: {children: React.ReactNode, onClose: () => void}) => {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-white/50 backdrop-blur-sm p-1.5 rouded-full text-gray-600 hover:bg-white transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const NewsDetailModal = ({notice, onClose}: {notice: any, onClose: () => void }) => {
    return (
        <ModalBase onClose={onClose}>
            {notice.image && (
                <div className="w-full h-56 bg-gray-100">
                    <img src={notice.image} alt="" className="w-full h-full object-cover"/>
                </div>
            )}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    {notice.is_pinned && <Pin size={16} className="text-slate-800 fill-slate-800" />}
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: notice.tag.color_code }}>{notice.tag.name}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{notice.title_jp}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-400 mb-6">
                    <span>{notice.created_at}</span>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {notice.body_jp}
                </div>
            </div>
        </ModalBase>
    );
};

const GuideDetailModal = ({guide, onClose}: {guide: any, onClose: () => void}) => {
    return (
        <ModalBase onClose={onClose}>
            {guide.image && (
                <div className="w-full h-48 bg-gray-100">
                    <img src={guide.image} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-6 pt-10">
                <div className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold mb-4">Guide Article</div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-gray-100">{guide.title_jp}</h2>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {guide.body_jp}
                </div>
            </div>
        </ModalBase>
    );
};

const NewCard = ({notice, onClick}: {notice: any, onClick: () => void}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left bg-white rounded-xl border p-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex gap-4 ${
                notice.is_pinned ? "border-slate-300 ring-1 ring-slate-100" : "border-gray-100"}`}
        >
            {/* 左 */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    {notice.is_pinned && <Pin size={14} className="text-slate-800 fill-slate-800"/>}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: notice.tag.color_code }}>{notice.tag.name}</span>
                    <span className="text-xs text-gray-400">{notice.created_at}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{notice.title_jp}</h3>
            </div>
            {/* 右 */}
            {notice.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                    <img src={notice.image} alt="" />
                </div>
            )}
        </button>
    );
};

const GuideCategoryItem = ({
    category,
    isOpen,
    onToggle,
    onGuideClick
}: {
    category: any,
    isOpen: boolean,
    onToggle: () => void,
    onGuideClick: (guide: any) => void
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-3">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon_name}</span>
                    <div className="text-left">
                        <span className="block font-bold text-slate-800 text-sm">{category.name_jp}</span>
                    </div>
                    {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </button>
            {isOpen && (
                <div className="border-t border-gray-100 bg-slate-50/50">
                    {category.guides.map((guide: any) => (
                        <button
                            key={guide.id}
                            onClick={() => onGuideClick(guide)}
                            className="w-full text-left p-4 border-b border-gray-100 last:border-0 hover:bg-white active:bg-slate-100 transition-colors flex justify-between items-center group"
                        >
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{guide.title_jp}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}


const HomePage = () => {
    const [currentView, setCurrentView] = useState<"news" | "guide">("news");
    const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
    const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

    const closeModal= () => {
        setSelectedNotice(null);
        setSelectedGuide(null);
    };

    const newsContent = (
        <div className="space-y-3 pt-4 pb-24">
            {
                MOCK_NOTICES.map((notice) => (
                    <NewCard key={notice.id} notice={notice} onClick={() => setSelectedNotice(notice)} />
                ))
            }
        </div>
    );

    const guideContent = (
        <div className="pt-4 pb-24">
            {
                MOCK_GUIDE_DATA.map((category) => (
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