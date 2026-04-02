import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFavorites } from '../providers/FavoritesProvider';
import arrowLeft from '../assets/icons/arrow-left.svg';
import { useGetHouses } from '../hooks/api/useGetHouses';
import type { House } from '../hooks/api/types';
import styles from './FavoritesMapPage.module.css';

import mapPinUrl from '../assets/icons/map-pin.svg';

const pinIcon = new L.Icon({
  iconUrl: mapPinUrl,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

interface GeocodedHouse extends House {
  lat: number;
  lng: number;
}

const GEOCODE_CACHE_KEY = 'hv-geocode-cache';

function loadGeoCache(): Record<string, { lat: number; lng: number }> {
  try {
    const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveGeoCache(cache: Record<string, { lat: number; lng: number }>) {
  localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
}

// The API addresses have fake street numbers but real city/state/zip.
// Try the full address first, then fall back to just city + state + zip.
function extractCityStateZip(address: string): string | null {
  // Pattern: "... City, ST XXXXX"
  const match = address.match(/([A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5})$/);
  return match ? match[1].trim() : null;
}

async function tryGeocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        countrycodes: 'us',
      })}`,
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch { /* skip */ }
  return null;
}

async function geocodeAddress(
  address: string,
  cache: Record<string, { lat: number; lng: number }>
): Promise<{ lat: number; lng: number } | null> {
  if (cache[address]) return cache[address];

  // The API uses fake street names but real city/state/zip.
  // Extract just the city+state+zip for geocoding.
  const cityState = extractCityStateZip(address);
  const query = cityState ?? address;
  const result = await tryGeocode(query);

  if (result) {
    cache[address] = result;
    saveGeoCache(cache);
  }
  return result;
}

function FlyToFirst({ geocoded }: { geocoded: GeocodedHouse[] }) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (geocoded.length > 0 && !hasFlown.current) {
      hasFlown.current = true;
      map.flyTo([geocoded[0].lat, geocoded[0].lng], 10, { duration: 1.2 });
    }
  }, [geocoded, map]);

  return null;
}

export function FavoritesMapPage() {
  const { favorites } = useFavorites();
  const { data } = useGetHouses();
  const [geocoded, setGeocoded] = useState<GeocodedHouse[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const navigate = useNavigate();
  const abortRef = useRef(false);

  const allHouses = data?.pages.flatMap((p) => p.houses) ?? [];
  const favoriteHouses = allHouses.filter((h) => favorites.has(h.id));

  useEffect(() => {
    if (favoriteHouses.length === 0) return;

    abortRef.current = false;
    setGeocoding(true);
    const cache = loadGeoCache();

    (async () => {
      const results: GeocodedHouse[] = [];

      for (let i = 0; i < favoriteHouses.length; i++) {
        if (abortRef.current) return;
        const house = favoriteHouses[i];
        const coords = await geocodeAddress(house.address, cache);
        if (coords) {
          results.push({ ...house, ...coords });
          setGeocoded([...results]);
        }
        // Respect Nominatim rate limit: 1 req/sec (skip delay for cached)
        if (!cache[house.address] && i < favoriteHouses.length - 1) {
          await new Promise((r) => setTimeout(r, 1100));
        }
      }

      setGeocoding(false);
    })();

    return () => { abortRef.current = true; };
  }, [favorites.size]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backButton}>
          <motion.span whileTap={{ scale: 0.95 }}>
            <img src={arrowLeft} alt="Back" className={styles.backIcon} />
          </motion.span>
        </Link>
        <h2 className={styles.title}>Favorite Houses</h2>
        {geocoding && <span className={styles.badge}>Locating...</span>}
      </div>

      {favoriteHouses.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🏠</p>
          <p className={styles.emptyText}>No favorites yet</p>
          <p className={styles.emptyHint}>
            Go back and tap the heart on a house to add it here
          </p>
        </div>
      ) : (
        <div className={styles.mapWrapper}>
          <MapContainer
            center={[39.8, -98.5]}
            zoom={4}
            className={styles.map}
            scrollWheelZoom
          >
            <FlyToFirst geocoded={geocoded} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geocoded.map((house) => (
              <Marker key={house.id} position={[house.lat, house.lng]} icon={pinIcon}>
                <Popup>
                  <div
                    className={styles.popup}
                    onClick={() => navigate(`/house/${house.id}`, { state: { house } })}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={house.photoURL}
                      alt={house.address}
                      className={styles.popupImage}
                    />
                    <strong className={styles.popupPrice}>
                      ${house.price.toLocaleString()}
                    </strong>
                    <span className={styles.popupAddress}>{house.address}</span>
                    <span className={styles.popupOwner}>{house.homeowner}</span>
                    <span className={styles.popupCta}>View details →</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
