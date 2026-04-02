import { useGetHouses } from '../hooks/api/useGetHouses';
import { Header } from '../components/Header/Header';
import { HouseGrid } from '../components/HouseGrid/HouseGrid';
import { HouseCardSkeleton } from '../components/HouseCardSkeleton/HouseCardSkeleton';
import { VirtualHouseGrid } from '../components/VirtualHouseGrid/VirtualHouseGrid';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';

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
          <HouseGrid>
            {Array.from({ length: 12 }).map((_, i) => (
              <HouseCardSkeleton key={i} />
            ))}
          </HouseGrid>
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
