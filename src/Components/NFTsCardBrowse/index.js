import React, { useCallback } from 'react';
import _ from 'lodash';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import './index.scss';
import 'Assets/css/common-card-nft.scss';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import LoadingScroll from 'Components/LoadingScroll';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { NFTCardLoader, NFTCardDetail, useDetailNFT } from 'Components/Common/NFTCard';

const NFTsCard = React.memo(
  ({ chainId, token, collectionName, verifiedContracts }) => {
    const detailNFT = useDetailNFT(chainId, token);
    const cardOptions = {
      blurredBackground: false
    }
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
        {detailNFT === null ? (
          <NFTCardLoader />
        ) : (
          <NFTCardDetail {...{ detailNFT, chainId, token, collectionName, verifiedContracts, cardOptions }} />
        )}
      </Col>
    );
  },
  (_props, props) => _.isEqual(_props, props)
);

export default function NFTsCardBrowse({
  tokens,
  fetchExplore,
  isEndOfOrderList,
  loadingScroll,
  collectionName,
}) {
  const [loadingNFTs, setLoadingNFTs] = useStateWithCallbackLazy(false);
  // warning: useSelector may cause massive re-render
  const { chainId, verifiedContracts } = useSelector((state) => state);
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
                {...{
                  chainId,
                  token,
                  collectionName,
                  verifiedContracts,
                }}
              />
            ))}
        </BottomScrollListener>
      </Row>
      {!!loadingScroll && <LoadingScroll />}
    </div>
  );
}
