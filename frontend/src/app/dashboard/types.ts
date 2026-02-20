export type NoticeTag = {
    id: number;
    name: string;
    slug: string;
    color_code: string;
};

export type Notice = {
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


export type Event = {
    id: number;
    title_en: string;
    title_jp: string;
    description_en: string;
    description_jp: string;
    location: string;
    date: string;
    start_time: string;
    end_time: string;
    cover_image: string | null;
    google_form_url: string | null;

}


export type UserProfileType = {
    id: string; 
    email: string;
    name: string;
    room_number: string;
    language_preference: 'JP' | 'EN'; 
    move_in_date: string; 
    move_out_date: string; 
    icon: string | null; 
};

export type GalleryType = {
    id: number;
    title_en: string;
    title_jp: string;
    event_date: string;
    cover_image_url: string;
    google_photos_url: string;
    created_at: string;
    created_by: string | null;
};