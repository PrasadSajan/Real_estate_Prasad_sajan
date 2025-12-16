import { NextResponse } from 'next/server';
import properties from '@/data/properties.json';

export async function GET() {
  return NextResponse.json(properties);
}
