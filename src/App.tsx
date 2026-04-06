import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HouseListPage } from './pages/HouseListPage/HouseListPage';
import { HouseDetailPage } from './pages/HouseDetailPage/HouseDetailPage';
import { FavoritesMapPage } from './pages/FavoritesMapPage/FavoritesMapPage';
import { RouteErrorFallback } from './components/ErrorBoundary/ErrorBoundary';

function HouseListLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.pathname.startsWith('/house/');

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <HouseListPage />

      <AnimatePresence>
        {isModal && (
          <motion.div
            key={location.pathname}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              overflow: 'auto',
              background: 'var(--bg)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) navigate('/');
            }}
          >
            <Outlet />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RootLayout() {
  const location = useLocation();

  return (
    <>
      <Outlet />

      <AnimatePresence>
        {location.pathname === '/favorites' && (
          <motion.div
            key="favorites"
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
            <FavoritesMapPage />
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
      element: <RootLayout />,
      errorElement: <RouteErrorFallback />,
      children: [
        {
          path: '/',
          element: <HouseListLayout />,
          children: [
            { index: true, element: null },
            { path: 'house/:id', element: <HouseDetailPage /> },
          ],
        },
        { path: '/favorites', element: null },
      ],
    },
  ],
  basename ? { basename } : undefined
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
