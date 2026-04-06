import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFavorites } from '../../providers/FavoritesProvider';
import { FlyToFirst } from './FlyToFirst';
import arrowLeft from '../../assets/icons/arrow-left.svg';
import mapPinUrl from '../../assets/icons/map-pin.svg';
import styles from './FavoritesMapPage.module.css';

const pinIcon = new L.Icon({
  iconUrl: mapPinUrl,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

function extractCityStateZip(address: string): string | null {
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
  } catch {}
  return null;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const cityState = extractCityStateZip(address);
  return tryGeocode(cityState ?? address);
}

export function FavoritesMapPage() {
  const { favorites, updateCoords } = useFavorites();
  const [geocoding, setGeocoding] = useState(false);
  const navigate = useNavigate();

  const favoriteHouses = [...favorites.values()];
  const geocodedHouses = favoriteHouses.filter((h) => h.lat != null && h.lng != null);

  useEffect(() => {
    const needsGeocoding = favoriteHouses.filter((h) => h.lat == null);
    if (needsGeocoding.length === 0) {
      setGeocoding(false);
      return;
    }

    let aborted = false;
    setGeocoding(true);
    const houses = [...needsGeocoding];

    (async () => {
      for (let i = 0; i < houses.length; i++) {
        if (aborted) return;
        const house = houses[i];
        if (!house.address) continue;
        const coords = await geocodeAddress(house.address);
        if (aborted) return;
        if (coords) {
          updateCoords(house.id, coords.lat, coords.lng);
        }
        if (i < houses.length - 1) {
          await new Promise((r) => setTimeout(r, 1100));
        }
      }
      if (!aborted) setGeocoding(false);
    })();

    return () => { aborted = true; };
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
            <FlyToFirst houses={favoriteHouses} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geocodedHouses.map((house) => (
              <Marker key={house.id} position={[house.lat!, house.lng!]} icon={pinIcon}>
                <Popup>
                  <div
                    className={styles.popup}
                    onClick={() => navigate(`/favorites/house/${house.id}`, { state: { house } })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/favorites/house/${house.id}`, { state: { house } });
                      }
                    }}
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
