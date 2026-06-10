import { API_URL } from '@/constants.ts';

export const AUTH_TOKEN_KEY = 'authToken:accessKey';

export interface IAuthTokenInterceptorConfig {
  header?: string;
  headerPrefix?: string;
}

class ApiRequestError extends Error {
  constructor(public readonly response: Response) {
    super(`Request failed with status ${response.status}`);
    this.name = 'ApiRequestError';
  }
}

const getAuthHeaders = ({ header = 'Authorization', headerPrefix = 'Bearer ' }: IAuthTokenInterceptorConfig = {}) => {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
  });
  const accessToken = localStorage.getItem(AUTH_TOKEN_KEY);

  if (accessToken) {
    headers.set(header, `${headerPrefix}${accessToken}`);
  }

  return headers;
};

const request = async (path: string, init: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new ApiRequestError(response);
    }

    return response;
  } catch (error) {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    throw error;
  }
};

const api = {
  patch: (path: string, init: RequestInit = {}) =>
    request(path, {
      ...init,
      method: 'PATCH',
    }),
};

export default api;
