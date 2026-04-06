import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { House } from '../hooks/api/types';

export interface FavoriteHouse extends House {
  lat?: number;
  lng?: number;
}

interface FavoritesContextValue {
  favorites: Map<number, FavoriteHouse>;
  toggleFavorite: (house: House) => void;
  isFavorite: (id: number) => boolean;
  updateCoords: (id: number, lat: number, lng: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = 'hv-favorites';

function load(): Map<number, FavoriteHouse> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as FavoriteHouse[];
      return new Map(arr.map((h) => [h.id, h]));
    }
  } catch {}
  return new Map();
}

function save(map: Map<number, FavoriteHouse>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.values()]));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState(load);

  const toggleFavorite = useCallback((house: House) => {
    setFavorites((prev) => {
      const next = new Map(prev);
      if (next.has(house.id)) next.delete(house.id);
      else next.set(house.id, { ...house });
      save(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  );

  const updateCoords = useCallback((id: number, lat: number, lng: number) => {
    setFavorites((prev) => {
      const entry = prev.get(id);
      if (!entry) return prev;
      const next = new Map(prev);
      next.set(id, { ...entry, lat, lng });
      save(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, updateCoords }),
    [favorites, toggleFavorite, isFavorite, updateCoords]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
