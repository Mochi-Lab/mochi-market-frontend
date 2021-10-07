import { Card, Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import tick from 'Assets/icons/tick-green.svg';
import 'Assets/css/common-card-nft.scss';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { useEffect, useState } from 'react';
import { CarouselCollectionItem } from 'Components/Common/CarouselLoader'

export default function CardCollection({ addressToken, chainId }) {
  const { verifiedContracts, nftList } = useSelector((state) => state);
  const [collection, setCollection] = useState(null);
  const [is1155, setIs1155] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function fetchCollection() {
      let res = await store.dispatch(getCollection(addressToken));
      if (isMounted) setCollection(res.collection);
      let is1155 = await nftList.methods.isERC1155(addressToken).call();
      if (isMounted) setIs1155(is1155);
    }
    if (!!chainId && !!nftList) fetchCollection();
    return () => { isMounted = false };
  }, [addressToken, chainId, nftList]);

  if(collection === null) return <CarouselCollectionItem />

  return !!collection.addressToken ? (
    <div className='item-carousel'>
      <Link to={`/collection/${chainId}/${collection.addressToken}`}>
        <Card
          className='home-card card-nft card-collection'
          cover={<div className='wrap-cover'></div>}
        >
          <div className='div-box-top'>
            <div
                className='blurred-background'
                style={{ backgroundImage: `url(${collection.logo})` }}
            />
            <img
              alt={`img-collection`}
              src={collection.logo}
              className='display-resource-collection'
            />
          </div>

          <Row justify='center'>
            <Col className='footer-card-left'>
              <div className='textmode collection-name'>
                {collection.name}
                {verifiedContracts.includes(collection.addressToken.toLocaleLowerCase()) ? (
                  <img src={tick} alt='icon-tick' className='icon-tick' />
                ) : null}{' '}
              </div>
              <div className='collection-type textmode text-blur'>
                {!!is1155 ? 'ERC-1155' : 'ERC-721'}
              </div>
            </Col>
          </Row>
        </Card>
      </Link>
    </div>
  ) : null;
}
