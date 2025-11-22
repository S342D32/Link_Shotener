import { NextRequest, NextResponse } from 'next/server';
import { initDb, getLinkByCode, deleteLink } from '@/lib/db';

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
    
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await initDb();
    const deleted = await deleteLink(params.code);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}