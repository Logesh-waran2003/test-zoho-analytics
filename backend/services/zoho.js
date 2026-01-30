import axios from 'axios';

let cachedToken = null;
let tokenExpiry = null;

export const getAccessToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  const response = await axios.post(
    `${process.env.ZOHO_ACCOUNT_SERVER_URL}/oauth/v2/token`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
  
  return cachedToken;
};

export const getEmbedUrl = async (userId, orgId) => {
  const accessToken = await getAccessToken();

  const payload = {
    workspace_id: process.env.ZOHO_WORKSPACE_ID,
    view_id: process.env.ZOHO_VIEW_ID,
    user_info: {
      user_id: userId,
      org_id: orgId,
    },
    embed_type: 'iframe',
    expiry_time: 300000,
  };

  const response = await axios.post(
    `${process.env.ZOHO_ANALYTICS_SERVER_URL}/restapi/v2/workspaces/${process.env.ZOHO_WORKSPACE_ID}/views/${process.env.ZOHO_VIEW_ID}/embed`,
    payload,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data.embed_url;
};
