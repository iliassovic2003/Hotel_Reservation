export interface ApiResponse<T = any> {
    data: T;
    status: number;
    ok: boolean;
  }
  
  export interface AuthTokens {
    token: string;
    refreshToken: string;
    tokenType: string;
  }
  
  export interface ApiError {
    message: string;
    code?: string;
    status?: number;
  }
  
  export interface RefreshTokenResponse {
    token: string;
    refreshToken?: string;
    tokenType: string;
  }
  
  // Custom error class
  export class ApiFetchError extends Error {
    public status?: number;
    public code?: string;
  
    constructor(message: string, status?: number, code?: string) {
      super(message);
      this.name = 'ApiFetchError';
      this.status = status;
      this.code = code;
    }
  }
  
  // API configuration
  const API_BASE_URL = 'http://localhost:8080/api';
  
  // Request options type
  interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
  }
  
  // Token refresh state
  let isRefreshing = false;
  let refreshPromise: Promise<string | null> | null = null;
  
  // Helper function to handle session expiration
  const handleSessionExpired = (reason: string): void => {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login with reason
    window.location.href = `/login?reason=${encodeURIComponent(reason)}`;
  };
  
  // Helper function to refresh access token
  const refreshAccessToken = async (refreshToken: string | null): Promise<string | null> => {
    if (!refreshToken) return null;
    
    // If already refreshing, return existing promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }
    
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        const data = await response.json() as RefreshTokenResponse;
        
        if (response.ok) {
          // Store new tokens
          localStorage.setItem('accessToken', data.token);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          return data.token;
        }
        
        // Check if refresh token expired
        if ((data as any).message === 'REFRESH_TOKEN_EXPIRED') {
          handleSessionExpired((data as any).message);
        }
        
        return null;
        
      } catch (error) {
        console.error('Refresh failed:', error);
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
    
    return refreshPromise;
  };
  
  // Main API fetch function
  export async function apiFetch<T = any>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<Response> {
    // Get tokens from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add access token if available
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    // Build request options
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include' as RequestCredentials
    };
    
    try {
      // Make the request
      let response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      
      // If response is 401 (Unauthorized), try to refresh the token
      if (response.status === 401) {
        // Clone response to read body multiple times if needed
        const clonedResponse = response.clone();
        const errorData = await clonedResponse.json().catch(() => ({} as any));
        
        // Check if refresh token itself is expired
        if (errorData.message === 'REFRESH_TOKEN_EXPIRED' || 
            errorData.message === 'REFRESH_TOKEN_INVALID') {
          handleSessionExpired(errorData.message);
          throw new ApiFetchError('SESSION_EXPIRED', 401, errorData.message);
        }
        
        // Try to refresh the access token
        const newAccessToken = await refreshAccessToken(refreshToken);
        
        if (newAccessToken) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryOptions: RequestInit = {
            ...options,
            headers
          };
          response = await fetch(`${API_BASE_URL}${endpoint}`, retryOptions);
        } else {
          // Refresh failed
          handleSessionExpired('REFRESH_FAILED');
          throw new ApiFetchError('SESSION_EXPIRED', 401, 'REFRESH_FAILED');
        }
      }
      
      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({} as any));
        throw new ApiFetchError(
          errorData.message || 'Request failed',
          response.status,
          errorData.code
        );
      }
      
      // Return successful response
      return response;
      
    } catch (error) {
      if (error instanceof ApiFetchError) {
        throw error;
      }
      console.error(`API Error (${endpoint}):`, error);
      throw new ApiFetchError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
  
  // Convenience methods for common HTTP verbs
  export const api = {
    get: <T = any>(endpoint: string): Promise<Response> => 
      apiFetch<T>(endpoint),
    
    post: <T = any>(endpoint: string, data?: any): Promise<Response> => 
      apiFetch<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      }),
    
    put: <T = any>(endpoint: string, data?: any): Promise<Response> => 
      apiFetch<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      }),
    
    delete: <T = any>(endpoint: string): Promise<Response> => 
      apiFetch<T>(endpoint, {
        method: 'DELETE'
      }),
    
    patch: <T = any>(endpoint: string, data?: any): Promise<Response> => 
      apiFetch<T>(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined
      })
  };
  
  export default api;