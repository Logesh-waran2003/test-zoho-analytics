import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 40px', 
        background: '#1976d2', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Client 1 Business App</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
          client1.stigmatatech.com
        </p>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Welcome to Client 1</h2>
          <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.6' }}>
            This is a business application that embeds analytics from app.stigmatatech.com.
            The analytics are powered by Zoho Analytics through a nested iframe structure.
          </p>
          
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}>
            <strong>Iframe Structure:</strong><br/>
            client1.stigmatatech.com<br/>
            └── iframe → app.stigmatatech.com<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;└── iframe → analytics.stigmatatech.com (Zoho)
          </div>

          <button 
            onClick={() => navigate('/analytics')}
            style={{
              width: '100%',
              padding: '15px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1565c0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1976d2'}
          >
            View Analytics Dashboard
          </button>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '18px' }}>
            How This Works
          </h3>
          <ul style={{ 
            color: '#666', 
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>Client1 embeds app.stigmatatech.com in an iframe</li>
            <li>app.stigmatatech.com embeds Zoho Analytics</li>
            <li>Zoho only sees and trusts app.stigmatatech.com</li>
            <li>This allows multiple client domains to use one Zoho setup</li>
            <li>Security is maintained through browser same-origin policy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
