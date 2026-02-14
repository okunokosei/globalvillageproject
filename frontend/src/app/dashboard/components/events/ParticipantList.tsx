import { useState } from "react";
import { Participant } from "../../types";

const ParticipantList = ({ participants }: { participants: Participant[] }) => {
    // コピーした瞬間に「Copied!」と出すためのstate
    const [isCopied, setIsCopied] = useState(false);

    const sortedParticipants = [...participants].sort((a, b) => {
        return Number(a.room_number) - Number(b.room_number);
    });

    const handleCopy = () => {
        // 1. コピーするテキストを作成 (例: "101 Alex Johnson\n202 Yuki Tanaka...")
        const text = sortedParticipants
            .map(p => `${p.room_number} ${p.name}`)
            .join('\n');
        
        // 2. クリップボードに書き込み
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            // 2秒後に元の表示に戻す
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            {/* ヘッダー：タイトルと人数 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Participant Management
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shrink-0">
                    {sortedParticipants.length} people
                </span>
            </div>

            {/* リスト本体 */}
            <ul className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {sortedParticipants.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 text-sm text-gray-600 border-b border-dashed border-gray-100 pb-2 last:border-0 last:pb-0">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        <span className="font-mono text-gray-400 w-8">{p.room_number}</span>
                        <span className="font-medium">{p.name}</span>
                    </li>
                ))}
            </ul>

            {/* コピーボタン */}
            <button 
                onClick={handleCopy}
                className="w-full py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors active:scale-95"
            >
                {isCopied ? (
                    <>
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        Copy List
                    </>
                )}
            </button>
        </div>
    );
};

export default ParticipantList;