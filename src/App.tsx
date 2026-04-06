import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HouseListPage } from './pages/HouseListPage/HouseListPage';
import { HouseDetailModalPage } from './pages/HouseDetailPage/HouseDetailModalPage';
import { HouseDetailPage } from './pages/HouseDetailPage/HouseDetailPage';
import { FavoritesMapPage } from './pages/FavoritesMapPage/FavoritesMapPage';
import { RouteErrorFallback } from './components/ErrorBoundary/ErrorBoundary';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const router = createBrowserRouter(
  [
    {
      errorElement: <RouteErrorFallback />,
      children: [
        {
          path: '/',
          element: <HouseListPage />,
          children: [
            { path: 'house/:id', element: <HouseDetailModalPage /> },
          ],
        },
        { path: '/favorites', element: <FavoritesMapPage /> },
        { path: '/favorites/house/:id', element: <HouseDetailPage /> },
      ],
    },
  ],
  basename ? { basename } : undefined
);

export default function App() {
  return <RouterProvider router={router} />;
}
