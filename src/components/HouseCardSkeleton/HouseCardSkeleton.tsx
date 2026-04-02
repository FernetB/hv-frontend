import styles from './HouseCardSkeleton.module.css';

export function HouseCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imagePlaceholder} />
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.price}`} />
        <div className={`${styles.line} ${styles.address}`} />
        <div className={`${styles.line} ${styles.homeowner}`} />
      </div>
    </div>
  );
}
