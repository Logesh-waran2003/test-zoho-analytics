import { useNavigate } from 'react-router-dom';

function Analytics() {
  const navigate = useNavigate();

  // URL to full app.stigmatatech.com with authentication
  const appUrl = `https://app.stigmatatech.com`;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '15px 40px', 
        background: '#1976d2', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>Client1 Portal</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            Powered by app.stigmatatech.com
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Embedded iframe - Full app with authentication */}
      <iframe
        src={appUrl}
        style={{ 
          flex: 1, 
          border: 'none',
          width: '100%'
        }}
        title="App Portal"
        allow="fullscreen"
      />

      {/* Info Footer */}
      <div style={{
        padding: '10px 40px',
        background: '#f5f5f5',
        borderTop: '1px solid #ddd',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        <strong>Iframe Chain:</strong> client1.stigmatatech.com → app.stigmatatech.com (full app with auth) → analytics.stigmatatech.com (Zoho)
      </div>
    </div>
  );
}

export default Analytics;
