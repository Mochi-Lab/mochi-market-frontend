import { useSelector } from 'react-redux';
import 'Assets/css/common-card-nft.scss';
import { useNFTDetail, NFTCardLoader, NFTCard } from 'Components/Common/Card';

export default function CardCollection({ token, infoCollection }) {
  const { chainId, verifiedContracts } = useSelector((state) => state);
  const detailNFT = useNFTDetail(token, chainId);

  return !!detailNFT && !!token ? (
    <NFTCard className="collection-card" {... {
      chainId,
      token,
      detailNFT,
      verifiedContracts,
      collectionName: infoCollection.name,
      enableCollectionLink: false,
    }} />
  ) : (
    <NFTCardLoader className="collection-card"/>
  );
}
