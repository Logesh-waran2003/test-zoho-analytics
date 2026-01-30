import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await login();
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/form');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Login</h1>
      <button onClick={handleLogin} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
        {loading ? 'Logging in...' : 'Mock Login'}
      </button>
    </div>
  );
}

export default Login;
