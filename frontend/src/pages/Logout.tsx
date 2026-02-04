import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 100);
  }, [navigate]);

  return null;
}

export default Logout;
