import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmbedUrl } from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const url = await getEmbedUrl(user.tenant_id);
        setEmbedUrl(url);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user.tenant_id) {
      fetchEmbedUrl();
    } else {
      navigate('/login');
    }
  }, [user.tenant_id, navigate]);

  const handleCustomizeReports = () => {
    navigate('/analytics');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
        <div style={{ color: 'red' }}>Error: {error}</div>
        <button onClick={() => navigate('/form')} style={{ padding: '10px 20px' }}>Go to Form</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '20px', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Analytics Dashboard</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Tenant: {user.tenant_id}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/form')} style={{ padding: '10px 20px' }}>
            Go to Form
          </button>
          <button onClick={handleCustomizeReports} style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
            Customize Reports
          </button>
          <button onClick={() => navigate('/logout')} style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
      
      <iframe
        src={embedUrl}
        style={{ flex: 1, border: 'none' }}
        title="Zoho Analytics Dashboard"
      />
    </div>
  );
}

export default Dashboard;
