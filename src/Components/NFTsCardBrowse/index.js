import { Row, Col } from 'antd';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import './index.scss';
import 'Assets/css/common-card-nft.scss';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import LoadingScroll from 'Components/LoadingScroll';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { useNFTDetail, NFTCardLoader, NFTCard } from 'Components/Common/Card';

function NFTsCard({ token, collectionName }) {
  const { chainId, verifiedContracts } = useSelector((state) => state);
  const detailNFT = useNFTDetail(token, chainId);

  return (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 8 }}
      lg={{ span: 8 }}
      xl={{ span: 6 }}
      xxl={{ span: 6 }}
    >
      {
        detailNFT === null
        ? <NFTCardLoader />
        : <NFTCard {... {
          chainId,
          token,
          detailNFT,
          collectionName,
          verifiedContracts
        }}
      />
      }
    </Col>
  )
}

export default function NFTsCardBrowse({
  tokens,
  strSearchInCollection,
  fetchExplore,
  isEndOfOrderList,
  loadingScroll,
  collectionName,
}) {
  const [loadingNFTs, setLoadingNFTs] = useStateWithCallbackLazy(false);

  const paginationCards = useCallback(
    async (e) => {
      if (!!tokens && tokens.length > 0 && !!fetchExplore && !isEndOfOrderList && !loadingNFTs) {
        setLoadingNFTs(true, async () => {
          setLoadingNFTs(true);
          if (!loadingNFTs) fetchExplore();
          setLoadingNFTs(false);
        });
      }
    },
    [fetchExplore, isEndOfOrderList, loadingNFTs, tokens, setLoadingNFTs]
  );

  return (
    <div className='explore-nft content-list-nft'>
      <Row justify='start' gutter={[15, 20]} id='row-cards'>
        <BottomScrollListener onBottom={() => paginationCards()}>
          {!!tokens &&
            tokens.map((token) => (
              <NFTsCard
                key={token.sellId}
                token={token}
                strSearch={strSearchInCollection}
                collectionName={collectionName}
              />
            ))}
        </BottomScrollListener>
      </Row>
      {!!loadingScroll && <LoadingScroll />}
    </div>
  );
}
