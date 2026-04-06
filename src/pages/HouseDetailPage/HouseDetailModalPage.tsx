import { useLocation, useNavigate } from 'react-router-dom';
import { HouseDetail } from '../../components/HouseDetail/HouseDetail';
import type { House } from '../../hooks/api/types';

export function HouseDetailModalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const house = location.state?.house as House | undefined;

  if (!house) return null;

  return <HouseDetail house={house} onBack={() => navigate('/')} />;
}
