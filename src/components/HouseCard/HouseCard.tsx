import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { House } from '../../hooks/api/types';
import styles from './HouseCard.module.css';

interface Props {
  house: House;
  index: number;
}

const PLACEHOLDER =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" fill="#c8ccd4"><rect width="400" height="225"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a3b1c6" font-family="sans-serif" font-size="18">No image</text></svg>'
  );

// Survives unmount/remount — cards only animate once per session
const animatedIds = new Set<number>();

export function HouseCard({ house, index }: Props) {
  const [imgSrc, setImgSrc] = useState(house.photoURL);
  const seen = animatedIds.has(house.id);

  return (
    <motion.article
      className={styles.card}
      initial={seen ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: seen ? 0 : (index % 12) * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onAnimationComplete={() => animatedIds.add(house.id)}
      whileHover={{
        y: -5,
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      layout
    >
      <Link
        to={`/house/${house.id}`}
        state={{ house }}
        viewTransition
        className={styles.link}
      >
        <div className={styles.imageWrapper}>
          <img
            src={imgSrc}
            alt={`Photo of ${house.address}`}
            loading="lazy"
            className={styles.image}
            style={{ viewTransitionName: `house-image-${house.id}` }}
            onError={() => setImgSrc(PLACEHOLDER)}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.price}>${house.price.toLocaleString()}</p>
          <h3 className={styles.address}>{house.address}</h3>
          <p className={styles.homeowner}>{house.homeowner}</p>
        </div>
      </Link>
    </motion.article>
  );
}
