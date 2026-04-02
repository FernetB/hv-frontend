import type { ReactNode } from 'react';
import styles from './HouseGrid.module.css';

export function HouseGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
