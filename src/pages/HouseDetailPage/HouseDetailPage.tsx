import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HouseDetail } from '../../components/HouseDetail/HouseDetail';
import type { House } from '../../hooks/api/useGetHouses/types';
import arrowLeft from '../../assets/icons/arrow-left.svg';
import styles from './HouseDetailPage.module.css';

export function HouseDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const house = location.state?.house as House | undefined;

  if (!house) {
    return (
      <div className={styles.notFound}>
        <p>House not found</p>
        <Link to="/" className={styles.backLink}>
          <img src={arrowLeft} alt="Back" className={styles.backIcon} /> Go back
        </Link>
      </div>
    );
  }

  return <HouseDetail house={house} onBack={() => navigate(-1)} />;
}
