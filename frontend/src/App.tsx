import { useEffect, useState } from 'react';
import { getEmbedUrl } from './api';

function App() {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const url = await getEmbedUrl('mock_user', 'mock_org');
        setEmbedUrl(url);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        src={embedUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Zoho Analytics Dashboard"
      />
    </div>
  );
}

export default App;
