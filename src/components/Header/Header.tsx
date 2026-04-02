import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../theme/ThemeProvider';
import { useFavorites } from '../../providers/FavoritesProvider';
import mapIcon from '../../assets/icons/map.svg';
import styles from './Header.module.css';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.top}>
        <Link to="/favorites" className={styles.mapButton}>
          <img src={mapIcon} alt="Favorites map" className={styles.mapIcon} />
          {favorites.size > 0 && (
            <span className={styles.mapBadge}>{favorites.size}</span>
          )}
        </Link>
        <motion.button
          className={styles.themeToggle}
          onClick={toggleTheme}
          whileTap={{ scale: 0.92 }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <motion.span
            key={theme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={styles.themeIcon}
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </motion.span>
        </motion.button>
      </div>
      <div className={styles.logoContainer}>
        <img
          src="https://cdn.prod.website-files.com/683f6efa9ca6a7e1d412fdbc/683f70dc65eb1baa61d8c626_Logo.svg"
          alt="HomeVision"
          className={styles.logo}
        />
      </div>
      <p className={styles.subtitle}>Discover your perfect home</p>
    </motion.header>
  );
}
