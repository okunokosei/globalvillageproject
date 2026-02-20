// src/constants/mockData.ts

import { Event, UserProfileType, GalleryType } from "../app/dashboard/types"; 
// import { Participant } from '../app/dashboard/types';

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
    google_form_url: "https://forms.gle/dummy",
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
    google_form_url: "https://forms.gle/dummy",
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
    google_form_url: "https://forms.gle/dummy",
  },
];



export const MOCK_USER: UserProfileType ={
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // 適当なUUID
    email: "alex.johnson@example.com",
    name: "Alex Johnson",
    room_number: "A301",
    language_preference: "EN",
    move_in_date: "2024-04-01",
    move_out_date: "2025-03-31",
    icon: "https://i.pravatar.cc/300?img=11",
};

export const MOCK_MY_JOINED_EVENTS: Event[] = [
    // --- 【未来のイベント (Upcoming)】 3件 ---
    
    // 1. 直近の未来 (Board Game Night)
    {
        id: 201,
        title_en: "Board Game Night",
        title_jp: "ボードゲームナイト",
        description_en: "Let's play various board games together! Snacks and drinks will be provided.",
        description_jp: "みんなでボードゲームをして遊びましょう！お菓子と飲み物も用意します。",
        location: "Common Lounge",
        date: "2026-02-20", // 5日後
        start_time: "19:00",
        end_time: "22:00",
        cover_image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2070&auto=format&fit=crop",
        google_form_url: "https://forms.gle/dummy",
    },
    // 2. 3月のイベント (Hinamatsuri)
    {
        id: 202,
        title_en: "Hinamatsuri Celebration",
        title_jp: "ひな祭りパーティー",
        description_en: "Experience traditional Japanese culture for Girls' Day. We will display Hina dolls and eat Chirashi-sushi.",
        description_jp: "日本の伝統行事「ひな祭り」を体験しましょう。雛人形を飾り、ちらし寿司を食べます。",
        location: "Tatami Room",
        date: "2026-03-03",
        start_time: "18:00",
        end_time: "20:00",
        cover_image: "https://plus.unsplash.com/premium_photo-1661632731518-202d6447c645?q=80&w=2070&auto=format&fit=crop",
        google_form_url: "https://forms.gle/dummy",
    },
    // 3. 4月のイベント (Hanami)
    {
        id: 203,
        title_en: "Cherry Blossom Picnic (Hanami)",
        title_jp: "お花見ピクニック",
        description_en: "Spring is here! Let's go to the nearby park to see the cherry blossoms.",
        description_jp: "春が来ました！近くの公園に桜を見に行きましょう。",
        location: "Expo Park",
        date: "2026-04-05",
        start_time: "11:00",
        end_time: "15:00",
        cover_image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop",
        google_form_url: "https://forms.gle/dummy",
    },

    // --- 【過去のイベント (History)】 3件 ---

    // 4. 直近の過去 (Valentine)
    {
        id: 101,
        title_en: "Valentine's Chocolate Making",
        title_jp: "バレンタインチョコ作り",
        description_en: "Make handmade chocolates for your friends or special someone.",
        description_jp: "友達や大切な人のために手作りチョコを作りましょう。",
        location: "Shared Kitchen",
        date: "2026-02-14", // 昨日
        start_time: "14:00",
        end_time: "17:00",
        cover_image: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=2070&auto=format&fit=crop",
        google_form_url: "https://forms.gle/dummy",
    },
    // 5. 1月のイベント (Calligraphy)
    {
        id: 102,
        title_en: "Japanese Calligraphy Workshop",
        title_jp: "書初め大会",
        description_en: "Write your new year's resolution with Japanese calligraphy.",
        description_jp: "日本の書道で新年の抱負を書きましょう。",
        location: "Multi-purpose Room",
        date: "2026-01-10",
        start_time: "10:00",
        end_time: "12:00",
        cover_image: "https://images.unsplash.com/photo-1583144362846-52c676718449?q=80&w=2070&auto=format&fit=crop",
        google_form_url: "https://forms.gle/dummy",
    },
    // 6. 去年のイベント (Christmas)
    {
        id: 103,
        title_en: "Christmas Party 2025",
        title_jp: "クリスマスパーティー2025",
        description_en: "The biggest event of the year! Gift exchange and dinner.",
        description_jp: "今年最大のイベント！プレゼント交換とディナーを楽しみましょう。",
        location: "Main Hall",
        date: "2025-12-25",
        start_time: "18:00",
        end_time: "22:00",
        cover_image: "https://images.unsplash.com/photo-1512474932049-782abb8be239?q=80&w=2070&auto=format&fit=crop",
        google_form_url: "https://forms.gle/dummy",

    }
];


export const MOCK_GALLERIES: GalleryType[] = [
    {
        id: 1,
        title_en: "Spring Welcome Party 2025",
        title_jp: "2025年春 新入寮生歓迎会",
        event_date: "2025-04-10",
        cover_image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
        google_photos_url: "https://photos.app.goo.gl/dummy-link-1",
        created_at: "2025-04-12T10:00:00Z",
        created_by: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // 前に作ったAlexさんのUUIDを想定
    },
    {
        id: 2,
        title_en: "Takoyaki Party in Winter",
        title_jp: "冬のタコパ！",
        event_date: "2026-01-15",
        cover_image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop",
        google_photos_url: "https://photos.app.goo.gl/dummy-link-2",
        created_at: "2026-01-16T11:30:00Z",
        created_by: "b1ffcd22-0d1c-5fg9-cc7e-7cc0ce491b22",
    },
    {
        id: 3,
        title_en: "Christmas Party 2025",
        title_jp: "クリスマスパーティー2025",
        event_date: "2025-12-25",
        cover_image_url: "https://images.unsplash.com/photo-1512474932049-782abb8be239?q=80&w=800&auto=format&fit=crop",
        google_photos_url: "https://photos.app.goo.gl/dummy-link-3",
        created_at: "2025-12-26T14:15:00Z",
        created_by: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    },
    {
        id: 4,
        title_en: "Kyoto Autumn Leaves Trip",
        title_jp: "京都紅葉バスツアー",
        event_date: "2025-11-20",
        cover_image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
        google_photos_url: "https://photos.app.goo.gl/dummy-link-4",
        created_at: "2025-11-22T09:00:00Z",
        created_by: "b1ffcd22-0d1c-5fg9-cc7e-7cc0ce491b22",
    },
    {
        id: 5,
        title_en: "Summer BBQ Festival",
        title_jp: "サマーBBQフェスティバル",
        event_date: "2025-08-05",
        cover_image_url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop",
        google_photos_url: "https://photos.app.goo.gl/dummy-link-5",
        created_at: "2025-08-06T18:45:00Z",
        created_by: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    }
];