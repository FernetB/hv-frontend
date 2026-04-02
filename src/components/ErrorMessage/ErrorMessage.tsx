import { motion } from 'framer-motion';
import styles from './ErrorMessage.module.css';

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <p className={styles.icon}>⚠</p>
      <p className={styles.title}>Something went wrong</p>
      <p className={styles.message}>{message}</p>
      <motion.button
        className={styles.retryButton}
        onClick={onRetry}
        whileTap={{ scale: 0.97 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
}
