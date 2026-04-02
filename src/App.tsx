import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HouseListPage } from './pages/HouseListPage';
import { HouseDetailPage } from './pages/HouseDetailPage';
import { FavoritesMapPage } from './pages/FavoritesMapPage';
import { RouteErrorFallback } from './components/ErrorBoundary/ErrorBoundary';

function ListLayout() {
  const location = useLocation();
  const isOverlay =
    location.pathname.startsWith('/house/') ||
    location.pathname === '/favorites';

  return (
    <>
      <div style={{ height: '100vh', overflow: 'auto' }}>
        <HouseListPage />
      </div>

      <AnimatePresence>
        {isOverlay && (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              overflow: 'auto',
              background: 'var(--bg)',
            }}
          >
            <Outlet />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const router = createBrowserRouter(
  [
    {
      element: <ListLayout />,
      errorElement: <RouteErrorFallback />,
      children: [
        { index: true, path: '/', element: null },
        { path: '/house/:id', element: <HouseDetailPage /> },
        { path: '/favorites', element: <FavoritesMapPage /> },
      ],
    },
  ],
  basename ? { basename } : undefined
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
