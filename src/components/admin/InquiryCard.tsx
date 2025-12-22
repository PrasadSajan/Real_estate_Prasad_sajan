import { format } from 'date-fns';

interface Inquiry {
    id: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    message?: string;
    created_at: string;
    property?: {
        title: string;
    } | null;
}

interface InquiryCardProps {
    inquiry: Inquiry;
    onDelete?: (id: string) => void;
}

export default function InquiryCard({ inquiry, onDelete }: InquiryCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {inquiry.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{inquiry.customer_name}</h3>
                        <p className="text-xs text-gray-400">
                            {format(new Date(inquiry.created_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                    </div>
                </div>
                {inquiry.property && (
                    <span className="bg-accent/10 text-accent text-xs px-2 py-1 rounded font-medium max-w-[150px] truncate" title={inquiry.property.title}>
                        For: {inquiry.property.title}
                    </span>
                )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                {inquiry.customer_phone && (
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                        </svg>
                        {inquiry.customer_phone}
                    </div>
                )}
                {inquiry.customer_email && (
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                            <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                            <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                        </svg>
                        {inquiry.customer_email}
                    </div>
                )}
            </div>

            {inquiry.message && (
                <p className="text-gray-700 whitespace-pre-wrap mb-4 bg-gray-50 p-3 rounded-md italic border-l-4 border-gray-200">&quot;{inquiry.message}&quot;</p>
            )}

            {onDelete && (
                <button
                    onClick={() => onDelete(inquiry.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all bg-white"
                    title="Delete Inquiry"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            )}
        </div>
    );
}
