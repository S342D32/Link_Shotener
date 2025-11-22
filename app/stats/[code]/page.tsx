'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  created_at: string;
  last_clicked?: string;
}

export default function StatsPage() {
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      const response = await fetch(`/api/links/${code}`);
      
      if (response.ok) {
        const data = await response.json();
        setLink(data);
      } else {
        setError('Link not found');
      }
    } catch (error) {
      setError('Failed to fetch link stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="container">
        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <a href="/" className="btn">← Back to Dashboard</a>
        </div>
        <div className="error" style={{ marginTop: '4rem' }}>{error || 'Link not found'}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
        <a href="/" className="btn">← Back to Dashboard</a>
      </div>
      <div className="header">
        <h1>Link Statistics</h1>
      </div>

      <div className="stats-card">
        <h2>Short Code: {link.code}</h2>
        <p><strong>Target URL:</strong> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
        <p><strong>Short URL:</strong> <a href={`/${link.code}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/{link.code}</a></p>
      </div>

      <div className="stats-card">
        <h3>Click Statistics</h3>
        <p><strong>Total Clicks:</strong> {link.clicks}</p>
        <p><strong>Created:</strong> {new Date(link.created_at).toLocaleString()}</p>
        <p><strong>Last Clicked:</strong> {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}</p>
      </div>
    </div>
  );
}