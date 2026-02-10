import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const getJwtToken = (userEmail) => {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    email: userEmail,
    iat: now,
    exp: now + 3600, // 1 hour expiry
    nbf: now,
    jti: uuidv4(),
    csrf: uuidv4() // Add CSRF token
  };

  return jwt.sign(payload, process.env.ZOHO_JWT_SECRET, { algorithm: "HS256" });
};

export const getEmbedUrl = async (userEmail) => {
  const token = getJwtToken(userEmail);
  const viewUrl = encodeURIComponent(`https://analytics.stigmatatech.com/open-view/460548000000023287`);
  
  return `https://analytics.stigmatatech.com/accounts/p/${process.env.ZOHO_PORTAL_ID}/signin/jwt/auth?jwt=${token}&return_to=${viewUrl}`;
};

export const getZohoRedirectUrl = async (userEmail) => {
  const token = getJwtToken(userEmail);
  const workspaceUrl = encodeURIComponent(`https://analytics.stigmatatech.com`);
  
  return `https://analytics.stigmatatech.com/accounts/p/${process.env.ZOHO_PORTAL_ID}/signin/jwt/auth?jwt=${token}&return_to=${workspaceUrl}`;
};
