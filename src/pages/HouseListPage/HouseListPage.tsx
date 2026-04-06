import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGetHouses } from '../../hooks/api/useGetHouses/useGetHouses';
import { useFavorites } from '../../providers/FavoritesProvider';
import { Header } from '../../components/Header/Header';
import { HouseCardSkeleton } from '../../components/HouseCardSkeleton/HouseCardSkeleton';
import { VirtualHouseGrid } from '../../components/VirtualHouseGrid/VirtualHouseGrid';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import gridStyles from '../../components/VirtualHouseGrid/VirtualHouseGrid.module.css';
import styles from './HouseListPage.module.css';

type Filter = 'all' | 'favorites';

export function HouseListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.pathname.startsWith('/house/');
  const [filter, setFilter] = useState<Filter>('all');
  const { isFavorite } = useFavorites();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetHouses();

  const allHouses = data?.pages.flatMap((page) => page.houses) ?? [];
  const houses = filter === 'favorites'
    ? allHouses.filter((h) => isFavorite(h.id))
    : allHouses;

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <Header />

      {!isLoading && !isError && (
        <div className={styles.filterBar}>
          <div
            className={styles.toggle}
            onClick={() => setFilter(filter === 'all' ? 'favorites' : 'all')}
            role="radiogroup"
          >
            <motion.div
              className={styles.toggleThumb}
              animate={{ x: filter === 'favorites' ? '100%' : '0%' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
            <span className={`${styles.toggleLabel} ${filter === 'all' ? styles.toggleLabelActive : ''}`}>
              All
            </span>
            <span className={`${styles.toggleLabel} ${filter === 'favorites' ? styles.toggleLabelActive : ''}`}>
              Favorites
            </span>
          </div>
        </div>
      )}

      <main>
        {isLoading ? (
          <div className={gridStyles.skeletonGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <HouseCardSkeleton key={i} />
            ))}
          </div>
        ) : isError && allHouses.length === 0 ? (
          <ErrorMessage
            message={error.message}
            onRetry={() => refetch()}
          />
        ) : houses.length === 0 && filter === 'favorites' ? (
          <p className={styles.emptyMessage}>No favorite houses yet</p>
        ) : (
          <VirtualHouseGrid
            houses={houses}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={filter === 'all' ? hasNextPage : false}
          />
        )}
      </main>

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
