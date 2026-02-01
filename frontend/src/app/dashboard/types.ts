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
export type GuideCategory = {
    id: number;
    name_en: string;
    name_jp: string;
    icon_name: string;
    guides: Guide[];
};
export type Guide = {
    id: number;
    title_en: string;
    title_jp: string;
    body_en: string;
    body_jp: string;
    image: string | null;
};