import { createContext, useContext, useMemo, type ReactNode } from 'react';
import axios, { type AxiosInstance } from 'axios';

const ApiContext = createContext<AxiosInstance | null>(null);

const API_BASE_URL = 'https://staging.homevision.co/api_project';

export function ApiProvider({ children }: { children: ReactNode }) {
  const apiClient = useMemo(
    () => axios.create({ baseURL: API_BASE_URL }),
    []
  );

  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
}

export function useApiClient(): AxiosInstance {
  const client = useContext(ApiContext);
  if (!client) {
    throw new Error('useApiClient must be used within an ApiProvider');
  }
  return client;
}
