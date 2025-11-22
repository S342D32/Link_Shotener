'use client';

import { useState, useEffect } from 'react';

interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  created_at: string;
  last_clicked?: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      if (Array.isArray(data)) {
        setLinks(data);
      } else {
        setLinks([]);
        setError(data.error || 'Failed to fetch links');
      }
    } catch (error) {
      setLinks([]);
      setError('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!url) {
      setError('URL is required');
      return;
    }

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Short URL created: ${window.location.origin}/${data.code}`);
        setUrl('');
        setCustomCode('');
        fetchLinks();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create link');
    }
  };

  const deleteLink = async (code: string) => {
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLinks();
      } else {
        setError('Failed to delete link');
      }
    } catch (error) {
      setError('Failed to delete link');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setSuccess('URL copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredLinks = Array.isArray(links) ? links.filter(link =>
    link.code.toLowerCase().includes(search.toLowerCase()) ||
    link.url.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="container">
      <div className="header">
        <h1>URL Shortener</h1>
        <p>Create and manage your short URLs</p>
      </div>

      <form onSubmit={createLink} className="form">
        <div className="form-group">
          <label className="label">URL to shorten</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Custom code (optional)</label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-custom-code"
            className="input"
          />
        </div>
        <button type="submit" className="btn">
          Create Short URL
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>

      <div className="form-group">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search links..."
          className="input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : filteredLinks.length === 0 ? (
        <div className="empty">
          {search ? 'No links match your search.' : 'No links created yet.'}
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Target URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link) => (
              <tr key={link.id}>
                <td>
                  <a href={`/${link.code}`} target="_blank" rel="noopener noreferrer">
                    {link.code}
                  </a>
                </td>
                <td>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                  </a>
                </td>
                <td>{link.clicks}</td>
                <td>{new Date(link.created_at).toLocaleDateString()}</td>
                <td>
                  {link.last_clicked
                    ? new Date(link.last_clicked).toLocaleDateString()
                    : 'Never'}
                </td>
                <td>
                  <div className="flex">
                    <button
                      onClick={() => copyToClipboard(link.code)}
                      className="btn"
                      style={{ marginRight: '0.5rem' }}
                    >
                      Copy
                    </button>
                    <a
                      href={`/stats/${link.code}`}
                      className="btn"
                      style={{ marginRight: '0.5rem', textDecoration: 'none' }}
                    >
                      Stats
                    </a>
                    <button
                      onClick={() => deleteLink(link.code)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}