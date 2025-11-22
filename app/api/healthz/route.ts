import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    // Test database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();
    
    return NextResponse.json({ 
      ok: true, 
      version: "1.0",
      database: 'connected'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      version: "1.0",
      error: error.message,
      database: 'connection failed'
    }, { status: 500 });
  }
}