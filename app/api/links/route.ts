import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { initDb, createLink, getLinks } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const { url, customCode } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const code = customCode || nanoid(8);

    try {
      const link = await createLink(code, url);
      return NextResponse.json(link);
    } catch (error: any) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initDb();
    const links = await getLinks();
    return NextResponse.json(links);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}