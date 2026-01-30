import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async () => {
  const response = await api.post('/auth/login');
  return response.data;
};

export const submitForm = async (formData: any) => {
  const response = await api.post('/form/submit', formData);
  return response.data;
};

export const getEmbedUrl = async (tenantId: string) => {
  const response = await api.get('/dashboard/embed-url', { params: { tenant_id: tenantId } });
  return response.data.embedUrl;
};

export const getZohoRedirectUrl = async (tenantId: string) => {
  const response = await api.get('/dashboard/zoho-redirect-url', { params: { tenant_id: tenantId } });
  return response.data.redirectUrl;
};
