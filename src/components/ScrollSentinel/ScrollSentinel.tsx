import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HouseCardSkeleton } from '../HouseCardSkeleton/HouseCardSkeleton';
import { HouseGrid } from '../HouseGrid/HouseGrid';
import styles from './ScrollSentinel.module.css';

interface Props {
  onLoadMore: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}

export function ScrollSentinel({ onLoadMore, isFetching, hasNextPage }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(isFetching);
  const onLoadMoreRef = useRef(onLoadMore);
  const observerRef = useRef<IntersectionObserver | null>(null);

  isFetchingRef.current = isFetching;
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || isFetching) return;

    // setTimeout (not rAF) so the browser has fully laid out and painted the
    // new cards before we ask "is the sentinel still visible?"
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetchingRef.current) {
            onLoadMoreRef.current();
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(el);
      observerRef.current = observer;
    }, 150);

    return () => {
      clearTimeout(timeout);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasNextPage, isFetching]);

  if (!hasNextPage && !isFetching) {
    return (
      <motion.p
        className={styles.endMessage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        You've seen all listings
      </motion.p>
    );
  }

  return (
    <>
      {isFetching && (
        <HouseGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <HouseCardSkeleton key={`skeleton-${i}`} />
          ))}
        </HouseGrid>
      )}
      {!isFetching && <div ref={sentinelRef} className={styles.sentinel} />}
    </>
  );
}
