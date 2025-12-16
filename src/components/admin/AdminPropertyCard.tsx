import Image from 'next/image';
import { formatPrice } from '@/utils/format';

interface AdminPropertyCardProps {
    title: string;
    price: string;
    imageSrc: string;
    latitude?: number;
    longitude?: number;
    onDelete: () => void;
}

export default function AdminPropertyCard({ title, price, imageSrc, latitude, longitude, onDelete }: AdminPropertyCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Actions Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={onDelete}
                        className="bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50 transition-colors"
                        title="Delete Property"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>

                <div className="absolute bottom-2 left-2">
                    {latitude && longitude ? (
                        <span className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full shadow backdrop-blur-sm flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.45-.96 2.337-1.774 3.63-3.326 6.29-6.726 6.29-9.71 0-4.418-4.03-8-9-8s-9 3.582-9 8c0 2.984 2.66 6.384 6.29 9.71.887.814 1.716 1.39 2.336 1.774.312.193.571.337.757.433a5.772 5.772 0 00.299.148zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Mapped
                        </span>
                    ) : (
                        <span className="bg-gray-500/90 text-white text-xs px-2 py-1 rounded-full shadow backdrop-blur-sm">
                            No Location
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 truncate mb-1" title={title}>{title}</h3>
                <p className="text-accent font-semibold">{formatPrice(price)}</p>
            </div>
        </div>
    );
}
