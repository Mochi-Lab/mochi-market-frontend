import { Row, Col, Empty } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import tick from 'Assets/icons/tick-green.svg';
import '../NFTsCardBrowse/index.scss';
import 'Assets/css/common-card-nft.scss';
import empty from 'Assets/icons/empty.svg';
import LoadingScroll from 'Components/LoadingScroll';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { useNFTDetail, NFTCardLoader, NFTCard } from 'Components/Common/Card';
import classNames from 'classnames';

function NFTsCardProfile({ token, onSale }) {
  const { chainId, verifiedContracts } = useSelector((state) => state);
  const detailNFT = useNFTDetail(token, chainId);
  const footerNode = detailNFT && (
    <>
      <Col className={classNames('footer-card-left', {'fill-width': !token.is1155})}>
        <div className='name-collection'>
          <Link
            to={`/collection/${chainId}/${token.collectionAddress}`}
            className='link-collection-name'
            tag='span'
          >
            {detailNFT.nameCollection || token.nameCollection}
          </Link>
          {verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) ? (
            <img src={tick} alt='icon-tick' className='icon-tick' />
          ) : null}{' '}
        </div>
        <div className='name-nft textmode'>
          {!!token.name ? token.name : detailNFT.name}
        </div>
      </Col>
      {!!token.is1155 && !onSale && (
        <Col className='footer-card-right text-right price-nft'>
          <div className='title-price'>Available</div>
          <div className=''>
            {!!token.soldAmount
              ? parseInt(token.value) - parseInt(token.soldAmount)
              : token.value}{' '}
            <span className=''>of</span> {token.totalSupply}{' '}
          </div>
        </Col>
      )}
    </>
  )
  return (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 8 }}
    >
      { detailNFT === null ? <NFTCardLoader /> : (
        <NFTCard {... {
          chainId,
          token,
          detailNFT,
          verifiedContracts,
          footerNode
        }} />)
      }
    </Col>
  );
}

export default function ERC721({ tokens, onSale, loadingScroll, fetchExplore, isEndOfOrderList }) {
  const [afterFilter, setafterFilter] = useState(!!tokens ? tokens : []);

  const [loadingNFTs, setLoadingNFTs] = useStateWithCallbackLazy(false);

  useEffect(() => {
    if (tokens) setafterFilter(() => tokens);
  }, [tokens]);

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
      <Row justify={afterFilter.length > 0 ? 'start' : 'center'} gutter={[20, 20]}>
        <BottomScrollListener onBottom={() => paginationCards()}>
          {afterFilter.length > 0 ? (
            afterFilter.map((token, index) => (
              <NFTsCardProfile key={index} token={token} onSale={onSale} />
            ))
          ) : (
            <Empty
              image={empty}
              imageStyle={{
                height: 86,
                width: 86,
              }}
              description={<span className='textmode'>No Data</span>}
            ></Empty>
          )}
        </BottomScrollListener>
      </Row>
      {!!loadingScroll && <LoadingScroll />}
    </div>
  );
}
