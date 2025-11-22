// Simple in-memory database for local development
export interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  created_at: Date;
  last_clicked?: Date;
}

let links: Link[] = [];
let nextId = 1;

export async function initDb() {
  // No initialization needed for in-memory storage
}

export async function createLink(code: string, url: string): Promise<Link> {
  // Check if code already exists
  if (links.find(link => link.code === code)) {
    const error = new Error('Code already exists') as any;
    error.code = '23505';
    throw error;
  }

  const link: Link = {
    id: nextId++,
    code,
    url,
    clicks: 0,
    created_at: new Date(),
  };

  links.push(link);
  return link;
}

export async function getLinks(): Promise<Link[]> {
  return [...links].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  return links.find(link => link.code === code) || null;
}

export async function incrementClicks(code: string): Promise<void> {
  const link = links.find(link => link.code === code);
  if (link) {
    link.clicks++;
    link.last_clicked = new Date();
  }
}

export async function deleteLink(code: string): Promise<boolean> {
  const index = links.findIndex(link => link.code === code);
  if (index !== -1) {
    links.splice(index, 1);
    return true;
  }
  return false;
}