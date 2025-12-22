'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Re-apply icon fix in case this component loads first/independently
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    latitude: number;
    longitude: number;
    title: string;
}

export default function PropertyMapModal({ isOpen, onClose, latitude, longitude, title }: PropertyMapModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden relative animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center bg-primary text-white">
                    <h3 className="text-lg font-serif font-bold tracking-wide">{title}</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none font-light">&times;</button>
                </div>

                <div className="h-[500px] w-full bg-gray-100 relative">
                    {mounted ? (
                        <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[latitude, longitude]}>
                                <Popup>
                                    <span className="font-bold">{title}</span>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">Loading Map...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
