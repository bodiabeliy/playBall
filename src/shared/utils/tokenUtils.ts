/**
 * Utility functions for token validation and management
 */

export interface TokenPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

/**
 * Decode JWT token payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

/**
 * Get time until token expires (in seconds)
 */
export const getTokenTimeToExpiry = (token: string): number => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return 0;
  }
  
  const currentTime = Date.now() / 1000;
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Check if tokens are valid and present
 */
export const areTokensValid = (): { isValid: boolean; hasRefreshToken: boolean } => {
  const accessToken = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh');
  
  if (!accessToken || !refreshToken) {
    return { isValid: false, hasRefreshToken: !!refreshToken };
  }
  
  // Even if access token is expired, if we have refresh token, consider as valid
  // because the interceptor will handle refreshing
  return { isValid: true, hasRefreshToken: true };
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
};
