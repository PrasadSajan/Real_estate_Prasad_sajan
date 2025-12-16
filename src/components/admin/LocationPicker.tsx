'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in Next.js
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

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onSelect }: { position: { lat: number, lng: number } | null, onSelect: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ latitude, longitude, onLocationSelect }: LocationPickerProps) {
    const defaultPosition: [number, number] = [18.0125, 76.0735]; // Tuljapur
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>;

    const currentPosition = latitude && longitude ? { lat: latitude, lng: longitude } : null;

    return (
        <div className="rounded overflow-hidden shadow-sm border border-gray-300 h-[300px] w-full z-0 relative">
            <MapContainer center={currentPosition || { lat: defaultPosition[0], lng: defaultPosition[1] }} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={currentPosition} onSelect={onLocationSelect} />
            </MapContainer>
            <div className="text-xs text-center text-gray-500 p-1 bg-gray-50 border-t">
                Click map to set location.
                {latitude && longitude ? ` Selected: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : ' No location selected'}
            </div>
        </div>
    );
}
