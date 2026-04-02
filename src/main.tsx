import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeProvider';
import { ApiProvider } from './providers/ApiProvider';
import { FavoritesProvider } from './providers/FavoritesProvider';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </ApiProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
