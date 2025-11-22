import { NextRequest, NextResponse } from 'next/server';
import { initDb, getLinkByCode, incrementClicks } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await initDb();
    const link = await getLinkByCode(params.code);
    
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    
    await incrementClicks(params.code);
    return NextResponse.redirect(link.url);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}