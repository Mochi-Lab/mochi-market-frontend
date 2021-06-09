import { useParams } from 'react-router-dom';
import DetailsNftOrder from './DetailsNftOrder';
import DetailsNftProfile from './DetailsNftProfile';

import './style.css';

export default function DetailNFT() {
  const { sellID } = useParams();
  return parseInt(sellID) && sellID !== 'null' ? <DetailsNftOrder /> : <DetailsNftProfile />;
}
