import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  created_at: Date;
  last_clicked?: Date;
}

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        last_clicked TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

export async function createLink(code: string, url: string): Promise<Link> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
      [code, url]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getLinks(): Promise<Link[]> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM links ORDER BY created_at DESC');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM links WHERE code = $1', [code]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function incrementClicks(code: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1',
      [code]
    );
  } finally {
    client.release();
  }
}

export async function deleteLink(code: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM links WHERE code = $1', [code]);
    return (result.rowCount ?? 0) > 0;
  } finally {
    client.release();
  }
}