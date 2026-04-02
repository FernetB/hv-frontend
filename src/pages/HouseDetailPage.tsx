import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { House } from '../hooks/api/types';
import styles from './HouseDetailPage.module.css';

const PLACEHOLDER =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="#c8ccd4"><rect width="800" height="450"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a3b1c6" font-family="sans-serif" font-size="24">No image</text></svg>'
  );

export function HouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const house = location.state?.house as House | undefined;
  const [imgSrc, setImgSrc] = useState(house?.photoURL ?? PLACEHOLDER);

  if (!house) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>House not found</p>
          <Link to="/" className={styles.backButton}>
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.backButton}>
          <motion.span whileTap={{ scale: 0.95 }}>←</motion.span>
        </Link>

        <div className={styles.card}>
          <motion.div
            className={styles.imageWrapper}
            layoutId={`house-image-${id}`}
          >
            <img
              src={imgSrc}
              alt={`Photo of ${house.address}`}
              className={styles.image}
              onError={() => setImgSrc(PLACEHOLDER)}
            />
          </motion.div>

          <div className={styles.details}>
            <motion.p
              className={styles.price}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              ${house.price.toLocaleString()}
            </motion.p>

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
