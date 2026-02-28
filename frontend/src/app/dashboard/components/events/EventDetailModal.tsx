import { Noticia_Text } from "next/font/google";
import { Calendar, Clock, MapPin, ExternalLink} from "lucide-react";
import { Event} from "../../types";
import ModalBase from "../ModalBase";

const EventDetailModal = ({event, onClose}: {event: Event, onClose: () => void}) => {

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md" >
            {event.images && event.images.length > 0 && (
                <div className="relative w-full h-64 bg-transparent">
                    <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                        {event.images.map((img) => (
                            <div
                                key={img.id}
                                className="relative w-full h-full shrink-0 snap-center flex items-center justify-center overflow-hidden"
                            >
                                <div 
                                    className="absolute inset-0 bg-cover blur-lg opacity-40 scale-110"
                                    style={{ backgroundImage: `url(${img.image})`}}
                                />
                                <img 
                                    src={img.image} 
                                    alt="" 
                                    className="z-10 w-full h-full object-contain drop-shadow-lg p-2"
                                />
                            </div>
                        ))}
                    </div>
                    {event.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                            {event.images.map((_, index) => (
                                <div key={index} className="w-1.5 h-1.5 rounded-full bg-white/80" ></div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="p-6">
                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                        {event.title_jp}
                    </h2>
                </div>
                <div className="flex flex-col gap-3.5 mb-8 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-blue-500 shrink-0 border border-gray-100">
                            <Calendar size={18} />
                        </div>
                        <span className="font-medium text-gray-700">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-gray-100">
                            <Clock size={18} />
                        </div>
                        <span className="font-medium text-gray-700">{event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-gray-100">
                            <MapPin size={18} />
                        </div>
                        <span className="font-medium text-gray-700">{event.location}</span>
                    </div>
                </div>
                <div className="text-[15px] text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                    {event.description_jp}
                </div>
            </div>
            { event.google_form_url && (
                <div className="sticky bottom-0 bg-white border-t border-gray-50 p-4 pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-xs text-gray-500 text-center mb-1">
                            参加登録は外部サイト（Google Forms）で行います
                        </p>
                        <a
                            href={event.google_form_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 flex items-center justify-center gap-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200
                                        bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl transform active:scale-[0.98]"
                        >
                            <span>Google Form で参加登録</span>
                            <ExternalLink size={18} className="shrink-0" />
                        </a>
                    </div>
                </div>
            )}
        </ModalBase>
    );
};

export default EventDetailModal;