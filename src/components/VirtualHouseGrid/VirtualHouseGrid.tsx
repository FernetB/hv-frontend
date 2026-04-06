import { useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { HouseCard } from '../HouseCard/HouseCard';
import { HouseCardSkeleton } from '../HouseCardSkeleton/HouseCardSkeleton';
import { useFavorites } from '../../providers/FavoritesProvider';
import type { House } from '../../hooks/api/types';
import styles from './VirtualHouseGrid.module.css';

const MIN_COL_WIDTH = 300;

function calcLayout(containerWidth: number) {
  const isMobile = containerWidth <= 450;
  const g = isMobile ? 28 : 36;
  const cols = isMobile
    ? 1
    : Math.max(1, Math.floor((containerWidth + g) / (MIN_COL_WIDTH + g)));
  return { columns: cols, gap: g };
}

function getInitialLayout() {
  const w = window.innerWidth;
  const isSmall = w <= 680;
  const padding = isSmall ? 40 : 80;
  return calcLayout(Math.min(w, 1440) - padding);
}

interface Props {
  houses: House[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export function VirtualHouseGrid({
  houses,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const gridRef = useRef<HTMLDivElement>(null);
  const initial = useRef(getInitialLayout());
  const [columns, setColumns] = useState(initial.current.columns);
  const [gap, setGap] = useState(initial.current.gap);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const update = () => {
      const { columns: cols, gap: g } = calcLayout(el.clientWidth);
      setColumns(cols);
      setGap(g);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rowCount = Math.ceil(houses.length / columns);

  const getScrollElement = useCallback(() => {
    let el = gridRef.current?.parentElement;
    while (el) {
      const overflow = getComputedStyle(el).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return el;
      el = el.parentElement;
    }
    return null;
  }, []);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement,
    estimateSize: () => 360,
    overscan: 5,
    gap,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const lastRow = virtualRows[virtualRows.length - 1];

  useEffect(() => {
    if (!lastRow) return;
    if (
      lastRow.index >= rowCount - 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [lastRow?.index, rowCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div ref={gridRef} className={styles.container}>
        <div
          style={{
            height: virtualizer.getTotalSize(),
            position: 'relative',
            width: '100%',
          }}
        >
          {virtualRows.map((virtualRow) => {
            const startIndex = virtualRow.index * columns;
            const rowHouses = houses.slice(startIndex, startIndex + columns);

            return (
              <div
                key={virtualRow.index}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gap}px`,
                }}
              >
                {rowHouses.map((house) => (
                  <HouseCard
                    key={house.id}
                    house={house}
                    isFavorited={isFavorite(house.id)}
                    onToggleFavorite={() => toggleFavorite(house)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {isFetchingNextPage && (
        <div
          className={styles.container}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <HouseCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

</>
  );
}
