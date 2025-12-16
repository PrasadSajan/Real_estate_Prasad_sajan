'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';



export default function ImageUpload({ onUpload, currentImages = [] }: { onUpload: (urls: string[]) => void, currentImages?: string[] }) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>(currentImages);

    // Sync state with prop (for form resets)
    useEffect(() => {
        setPreviews(currentImages);
    }, [currentImages]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const files = Array.from(event.target.files);
            const newUrls: string[] = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('property-images')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(filePath);

                if (data) {
                    newUrls.push(data.publicUrl);
                }
            }

            const updatedImages = [...previews, ...newUrls];
            setPreviews(updatedImages);
            onUpload(updatedImages);

        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = previews.filter((_, i) => i !== index);
        setPreviews(updatedImages);
        onUpload(updatedImages);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
                {previews.map((src, index) => (
                    <div key={index} className="relative w-32 h-24 border rounded overflow-hidden group">
                        <Image
                            src={src}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button" // Prevent form submission
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center relative hover:bg-gray-50 transition-colors">
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <span className="text-2xl">+</span>
                        <span className="text-xs">Add Images</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
            {uploading && <div className="text-sm text-blue-500">Uploading...</div>}
        </div>
    );
}
