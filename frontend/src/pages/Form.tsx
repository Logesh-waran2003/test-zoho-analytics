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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            Data Entry Form
          </h1>
          <p style={{
            opacity: 0.9,
            fontSize: '14px'
          }}>
            Tenant ID: {user.tenant_id}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '16px',
            background: '#10b981',
            color: 'white',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            ✓ Form submitted successfully! Redirecting...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div key={num}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Field {num}
                </label>
                <input
                  type="text"
                  name={`field_${num}`}
                  value={formData[`field_${num}` as keyof typeof formData]}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder={`Enter value for field ${num}`}
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? 'Submitting...' : 'Submit Form'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#667eea',
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
