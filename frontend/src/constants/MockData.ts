// src/constants/mockData.ts

// （※型のインポートパスは、ご自身の環境に合わせて修正してください）
import { Event } from "../app/dashboard/types"; 

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title_en: "Welcome Party",
    title_jp: "寮生ウェルカムパーティー",
    description_en: "Let's welcome the new residents! There will be pizza and drinks. It's a great chance to make new friends.",
    description_jp: "新入居者の歓迎会を行います！ピザや飲み物を用意しています。新しい友達を作る絶好のチャンスです。",
    location: "Common Lounge",
    date: "2026-02-13", // スクリショのカレンダーで選択されていた日に合わせました
    start_time: "18:00",
    end_time: "21:00",
    cover_image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop", // 仮のフリー画像URL
    is_joined: true,
  },
  {
    id: 2,
    title_en: "Japanese Cooking Class",
    title_jp: "日本料理教室（肉じゃが）",
    description_en: "Learn how to make authentic Nikujaga (Meat and Potato Stew). Ingredients are provided.",
    description_jp: "本格的な肉じゃがの作り方を学びましょう。材料はこちらで用意します。",
    location: "Shared Kitchen",
    date: "2026-02-15",
    start_time: "10:00",
    end_time: "13:00",
    cover_image: null,
    is_joined: false,
  },
  {
    id: 3,
    title_en: "Regular Cleaning & Meeting",
    title_jp: "定期清掃・全体ミーティング",
    description_en: "Monthly cleaning of common areas followed by a short resident meeting.",
    description_jp: "月一回の共用部清掃と、その後の居住者ミーティングです。全員参加お願いします。",
    location: "Entrance Hall",
    date: "2026-02-25",
    start_time: "09:00",
    end_time: "11:00",
    cover_image: null, 
    is_joined: true,
  },
];