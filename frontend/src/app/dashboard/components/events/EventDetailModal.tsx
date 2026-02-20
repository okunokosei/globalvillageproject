import { Event} from "../../types";
import ModalBase from "../ModalBase";

const EventDetailModal = ({event, onClose}: {event: Event, onClose: () => void}) => {

    return (
        <ModalBase onClose={onClose} maxWidth="max-w-md" >
            {event.cover_image ? (
                <div className="w-full h-56 bg-gray-100 relative group ">
                    <img src={event.cover_image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
            ):(
                <div className="w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                    <div className="absolute top-4 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                </div>
            )}

            <div className="p-6 relative -mt-8 bg-white rounded-t-3xl">
                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                        {event.title_jp}
                    </h2>
                </div>
                <div className="flex flex-col gap-3 mb-8 text-gray-500 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">📅</div>
                        <span className="font-medium text-gray-700">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">⏰</div>
                        <span className="font-medium text-gray-700">{event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">📍</div>
                        <span className="font-medium text-gray-700">{event.location}</span>
                    </div>
                </div>
                <div className="text-gray-600 leading-relaxed text-sm mb-8">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </ModalBase>
    );
};

export default EventDetailModal;