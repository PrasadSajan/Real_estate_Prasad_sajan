
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    // Query 1 row to see columns
    const { data, error } = await supabase.from('properties').select('*').limit(1);

    if (data && data.length > 0) {
        return NextResponse.json({
            columns: Object.keys(data[0]),
            firstRow: data[0]
        });
    }

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    const { error: errorImageUrl } = await supabase.from('properties').select('imageUrl').limit(1);
    const { error: errorImageSrc } = await supabase.from('properties').select('imageSrc').limit(1);
    const { error: errorImagesrc } = await supabase.from('properties').select('imagesrc').limit(1);

    return NextResponse.json({
        message: 'Table empty',
        checkImageUrl: errorImageUrl,
        checkImageSrc: errorImageSrc,
        checkImagesrc: errorImagesrc,
    });
}
