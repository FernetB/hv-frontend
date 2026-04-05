import { useInfiniteQuery } from '@tanstack/react-query';
import { useApiClient } from '../../providers/ApiProvider';
import type { HousesResponse } from './types';

const PER_PAGE = 12;

export function useGetHouses() {
  const apiClient = useApiClient();

  return useInfiniteQuery({
    queryKey: ['houses'],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<HousesResponse>('/houses', {
        params: { page: pageParam, per_page: PER_PAGE },
      });

      if (!data.ok) {
        throw new Error('API returned ok: false');
      }

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.houses.length < PER_PAGE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    retry: 10,
    staleTime: 5 * 60 * 1000,
  });
}
