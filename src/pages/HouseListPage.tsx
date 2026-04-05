import { useGetHouses } from '../hooks/api/useGetHouses';
import { Header } from '../components/Header/Header';
import { HouseCardSkeleton } from '../components/HouseCardSkeleton/HouseCardSkeleton';
import { VirtualHouseGrid } from '../components/VirtualHouseGrid/VirtualHouseGrid';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';
import gridStyles from '../components/VirtualHouseGrid/VirtualHouseGrid.module.css';

export function HouseListPage() {
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

  const houses = data?.pages.flatMap((page) => page.houses) ?? [];

  return (
    <>
      <Header />
      <main>
        {isLoading ? (
          <div className={gridStyles.skeletonGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <HouseCardSkeleton key={i} />
            ))}
          </div>
        ) : isError && houses.length === 0 ? (
          <ErrorMessage
            message={error.message}
            onRetry={() => refetch()}
          />
        ) : (
          <VirtualHouseGrid
            houses={houses}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </main>
    </>
  );
}
