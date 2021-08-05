import 'Assets/css/common-card-nft.scss';
import { useNFTDetail, NFTCardLoader, NFTCard } from 'Components/Common/Card';
import { useSelector } from 'react-redux';

export default function CardNFTHome({ token }) {
  const { chainId, verifiedContracts } = useSelector((state) => state);
  const detailNFT = useNFTDetail(token, chainId);

  return !!detailNFT && !!token ? (
    <NFTCard className="home-card" { ... {
      chainId,
      token,
      detailNFT,
      verifiedContracts
    } }/>
  ) : (
    <NFTCardLoader />
  );
}
