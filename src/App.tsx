import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { LayoutGroup, AnimatePresence, motion } from 'framer-motion';
import { HouseListPage } from './pages/HouseListPage';
import { HouseDetailPage } from './pages/HouseDetailPage';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function ListLayout() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith('/house/');

  return (
    <LayoutGroup>
      <HouseListPage />
      <AnimatePresence>
        {isDetail && (
          <div key={location.pathname} style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'auto' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: -1 }}
            />
            <Outlet />
          </div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

const router = createBrowserRouter(
  [
    {
      element: <ListLayout />,
      children: [
        { index: true, path: '/' },
        { path: '/house/:id', element: <HouseDetailPage /> },
      ],
    },
  ],
  { basename }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
