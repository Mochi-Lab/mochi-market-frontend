import { Card, Row, Col, Skeleton } from 'antd';
import './index.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import imgNotFound from 'Assets/notfound.png';

function NFTsCard({ token, strSearch }) {
  const { web3 } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token && !!token.tokenURI) {
        try {
          let req = await axios.get(token.tokenURI);
          setDetailNFT(req.data);
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
        }
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [token]);

  return !!detailNFT &&
    !!detailNFT.name &&
    (detailNFT.name.toLocaleLowerCase().includes(strSearch.toLowerCase()) ||
      token.collections.toLocaleLowerCase().includes(strSearch.toLowerCase())) ? (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 8 }}
      lg={{ span: 6 }}
      xl={{ span: 4 }}
      xxl={{ span: 4 }}
    >
      {!!detailNFT ? (
        <Link to={`/token/${token.addressToken}/${token.index}`}>
          <Card hoverable cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}>
            <div className='ant-card-meta-title'>{detailNFT.name}</div>
            <div className='ant-card-meta-description textmode'>
              {!!token.price ? `${web3.utils.fromWei(token.price, 'ether')} BNB` : <></>}
            </div>
          </Card>
        </Link>
      ) : (
        <Skeleton active round title='123' />
      )}
    </Col>
  ) : null;
}

export default function NFTsCardBrowse({ tokens }) {
  const [afterFilter, setafterFilter] = useState(!!tokens ? tokens : []);
  const { strSearch } = useSelector((state) => state);

  useEffect(() => {
    if (tokens) setafterFilter(() => tokens);
  }, [tokens]);

  return (
    <div className='explore-nft content-list-nft'>
      <Row justify='start' gutter={[0, 10]}>
        {!!afterFilter ? (
          afterFilter.map((token, index) => (
            <NFTsCard key={index} token={token} strSearch={strSearch} />
          ))
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}
