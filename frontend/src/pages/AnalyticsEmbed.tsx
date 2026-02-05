import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function AnalyticsEmbed() {
  const [searchParams] = useSearchParams();
  const tenant = searchParams.get('tenant') || 'default';
  
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        // Map tenant to tenant_id (you can customize this mapping)
        const tenantIdMap: Record<string, string> = {
          'tenant1': 'test_tenant_1',
          'tenant2': 'test_tenant_2',
          'default': 'test_tenant_1'
        };
        
        const tenantId = tenantIdMap[tenant] || tenantIdMap['default'];
        
        const response = await fetch(`/api/dashboard/embed-url?tenant_id=${tenantId}`);
        const data = await response.json();
        
        if (data.embedUrl) {
          setEmbedUrl(data.embedUrl);
        } else {
          setError('Failed to get embed URL');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, [tenant]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', 
            color: '#666',
            marginBottom: '10px'
          }}>
            Loading Analytics...
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Tenant: {tenant}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ color: '#f44336', marginBottom: '10px', fontSize: '18px' }}>
            Error Loading Analytics
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* This iframe embeds Zoho Analytics */}
      <iframe
        src={embedUrl}
        style={{ 
          flex: 1, 
          border: 'none',
          width: '100%',
          height: '100%'
        }}
        title="Zoho Analytics Dashboard"
        allow="fullscreen"
      />
    </div>
  );
}

export default AnalyticsEmbed;
