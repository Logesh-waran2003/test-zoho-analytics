import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitForm } from '../api';

function Form() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    field_1: '',
    field_2: '',
    field_3: '',
    field_4: '',
    field_5: '',
    field_6: '',
    field_7: '',
    field_8: '',
    field_9: '',
    field_10: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitForm({ tenant_id: user.tenant_id, ...formData });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Form submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Data Entry Form</h1>
      <p>Tenant: {user.tenant_id}</p>
      
      {success && <div style={{ padding: '10px', background: '#4caf50', color: 'white', marginBottom: '20px' }}>Form submitted successfully!</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <div key={num}>
            <label>Field {num}:</label>
            <input
              type="text"
              name={`field_${num}`}
              value={formData[`field_${num}` as keyof typeof formData]}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        ))}
        
        <button type="submit" disabled={loading} style={{ padding: '10px', fontSize: '16px', marginTop: '10px' }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        
        <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '10px', fontSize: '16px' }}>
          Go to Dashboard
        </button>
      </form>
    </div>
  );
}

export default Form;
