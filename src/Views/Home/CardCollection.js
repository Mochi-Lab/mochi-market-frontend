import { Card, Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import tick from 'Assets/icons/tick-green.svg';
import 'Assets/css/common-card-nft.scss';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { useEffect, useState } from 'react';

export default function CardCollection({ addressToken, chainID }) {
  const { verifiedContracts, nftList, chainId } = useSelector((state) => state);
  const [collection, setCollection] = useState({});
  const [is1155, setIs1155] = useState({});

  useEffect(() => {
    async function fetchCollection() {
      let res = await store.dispatch(getCollection(addressToken));
      setCollection(res.collection);
      let is1155 = await nftList.methods.isERC1155(addressToken).call();
      setIs1155(is1155);
    }
    if (!!nftList) fetchCollection();
  }, [addressToken, nftList]);

  return !!collection.addressToken && chainId === chainID ? (
    <div className='item-carousel'>
      <Link to={`/collection/${collection.addressToken}`}>
        <Card
          className='home-card card-nft card-collection'
          cover={<div className='wrap-cover'></div>}
        >
          <div className='div-box-top'>
            <img
              alt={`img-collection`}
              src={collection.logo}
              className='display-resource-collection'
            />
          </div>

          <Row justify='center'>
            <Col className='footer-card-left'>
              <div className='textmode collection-name'>
                {verifiedContracts.includes(collection.addressToken.toLocaleLowerCase()) ? (
                  <img src={tick} alt='icon-tick' className='icon-tick' />
                ) : null}{' '}
                {collection.name}
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
