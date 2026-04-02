import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../providers/FavoritesProvider';
import type { House } from '../hooks/api/types';
import arrowLeft from '../assets/icons/arrow-left.svg';
import heartOutline from '../assets/icons/heart-outline.svg';
import heartFilled from '../assets/icons/heart-filled.svg';
import styles from './HouseDetailPage.module.css';

const PLACEHOLDER =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="#c8ccd4"><rect width="800" height="450"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a3b1c6" font-family="sans-serif" font-size="24">No image</text></svg>'
  );

export function HouseDetailPage() {
  const location = useLocation();
  const house = location.state?.house as House | undefined;
  const [imgSrc, setImgSrc] = useState(house?.photoURL ?? PLACEHOLDER);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = house ? isFavorite(house.id) : false;

  if (!house) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>House not found</p>
          <Link to="/" className={styles.backButton}>
            <img src={arrowLeft} alt="Back" className={styles.btnIcon} /> Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <Link to="/" className={styles.backButton}>
          <motion.span whileTap={{ scale: 0.95 }}>
            <img src={arrowLeft} alt="Back" className={styles.btnIcon} />
          </motion.span>
        </Link>

        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <img
              src={imgSrc}
              alt={`Photo of ${house.address}`}
              className={styles.image}
              onError={() => setImgSrc(PLACEHOLDER)}
            />
          </div>

          <div className={styles.details}>
            <motion.div
              className={styles.priceRow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <p className={styles.price}>${house.price.toLocaleString()}</p>
              <motion.button
                className={`${styles.favButton} ${favorited ? styles.favActive : ''}`}
                onClick={() => toggleFavorite(house.id)}
                whileTap={{ scale: 0.9 }}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <img
                  src={favorited ? heartFilled : heartOutline}
                  alt=""
                  className={styles.btnIcon}
                />
              </motion.button>
            </motion.div>

            <motion.h1
              className={styles.address}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            >
              {house.address}
            </motion.h1>

            <motion.div
              className={styles.meta}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
            >
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Homeowner</span>
                <span className={styles.metaValue}>{house.homeowner}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Listing ID</span>
                <span className={styles.metaValue}>#{house.id}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
