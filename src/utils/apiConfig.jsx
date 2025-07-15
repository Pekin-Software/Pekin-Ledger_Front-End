import Cookies from 'js-cookie';

export const tenantDomain = Cookies.get("tenant");
export const accessToken = Cookies.get("access_token");

export const apiBase = tenantDomain
  ? `https://${tenantDomain}.pekingledger.store/api`
  : null;

// Common endpoints
export const storesUrl = apiBase ? `${apiBase}/store/` : null;
export const overviewUrl = storesUrl ? `${storesUrl}overview/` : null;

// Auth headers generator
export const getAuthHeaders = (isJson = true) => {
  if (!accessToken) return {};
  return {
    ...(isJson && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${accessToken}`,
  };
};

// Helper for full auth check
export const isAuthValid = () => Boolean(tenantDomain && accessToken);