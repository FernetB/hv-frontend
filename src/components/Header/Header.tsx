import { motion } from 'framer-motion';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './Header.module.css';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.top}>
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
        <h1 className={styles.title}>HomeVision</h1>
      </div>
      <p className={styles.subtitle}>Discover your perfect home</p>
    </motion.header>
  );
}
