import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { House } from '../../hooks/api/types';
import heartOutline from '../../assets/icons/heart-outline.svg';
import heartFilled from '../../assets/icons/heart-filled.svg';
import styles from './HouseCard.module.css';

interface Props {
  house: House;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

const PLACEHOLDER =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" fill="#c8ccd4"><rect width="400" height="225"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a3b1c6" font-family="sans-serif" font-size="18">No image</text></svg>'
  );

const animatedIds = new Set<number>();

export const HouseCard = memo(function HouseCard({
  house,
  isFavorited,
  onToggleFavorite,
}: Props) {
  const [imgSrc, setImgSrc] = useState(house.photoURL);
  const seen = animatedIds.has(house.id);

  return (
    <motion.article
      className={styles.card}
      initial={seen ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: seen ? 0 : 0.3 }}
      onAnimationComplete={() => animatedIds.add(house.id)}
    >
      <Link
        to={`/house/${house.id}`}
        state={{ house }}
        className={styles.link}
      >
        <div className={styles.imageWrapper}>
          <img
            src={imgSrc}
            alt={`Photo of ${house.address}`}
            loading="lazy"
            className={styles.image}
            onError={() => setImgSrc(PLACEHOLDER)}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.priceRow}>
            <p className={styles.price}>${house.price.toLocaleString()}</p>
            <motion.button
              className={`${styles.heartBtn} ${isFavorited ? styles.heartActive : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
              }}
              whileTap={{ scale: 0.75 }}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <motion.img
                key={isFavorited ? 'filled' : 'outline'}
                src={isFavorited ? heartFilled : heartOutline}
                alt=""
                className={styles.heartIcon}
                initial={isFavorited ? { scale: 1 } : false}
                animate={isFavorited ? { scale: [1, 1.45, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </motion.button>
          </div>
          <h3 className={styles.address}>{house.address}</h3>
          <p className={styles.homeowner}>{house.homeowner}</p>
        </div>
      </Link>
    </motion.article>
  );
});
