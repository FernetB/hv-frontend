import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { FavoriteHouse } from '../../providers/FavoritesProvider';

export function FlyToFirst({ houses }: { houses: FavoriteHouse[] }) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    const first = houses.find((h) => h.lat != null && h.lng != null);
    if (first && !hasFlown.current) {
      hasFlown.current = true;
      map.flyTo([first.lat!, first.lng!], 10, { duration: 1.2 });
    }
  }, [houses, map]);

  return null;
}
