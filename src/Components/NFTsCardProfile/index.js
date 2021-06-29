import { Card, Row, Col, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getSymbol } from 'utils/getContractAddress';
import imgNotFound from 'Assets/notfound.png';
import sampleAbiERC1155 from 'Contracts/SampleERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';
import tick from 'Assets/icons/tick-green.svg';
import '../NFTsCardBrowse/index.css';
import 'Assets/css/common-card-nft.css';

function NFTsCardProfile({ token, strSearch, onSale }) {
  const { web3, chainId, verifiedContracts } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let tokenURI;
          if (token.is1155) {
            const nft = new web3.eth.Contract(sampleAbiERC1155.abi, token.addressToken);
            tokenURI = await nft.methods.uri(token.index).call();
            try {
              token.collections = await nft.methods.name().call();
            } catch (error) {
              token.collections = null;
            }
          } else {
            const nft = new web3.eth.Contract(abiERC721.abi, token.addressToken);
            tokenURI = await nft.methods.tokenURI(token.index).call();
          }
          let req = await axios.get(tokenURI);
          const data = req.data;
          setDetailNFT({
            name: !!data.name ? data.name : 'Unnamed',
            description: !!data.description ? data.description : '',
            image: !!data.image ? data.image : imgNotFound,
          });
          if (!token.collections) token.collections = !!data.name ? data.name : 'Unnamed';
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
          if (!token.collections) token.collections = 'Unnamed';
        }
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [token, web3]);

  return !!detailNFT &&
    !!detailNFT.name &&
    (detailNFT.name.toLocaleLowerCase().includes(strSearch.toLowerCase()) ||
      token.collections.toLocaleLowerCase().includes(strSearch.toLowerCase())) ? (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 8 }}
    >
      {!!detailNFT ? (
        <Link
          to={`/token/${token.addressToken}/${token.index}/${!!token.sellId ? token.sellId : null}`}
        >
          <Card
            hoverable
            cover={
              <div className='wrap-cover'>
                <div className='blurred-background'  style={{ backgroundImage: `url(${detailNFT.image})` }}/>
                <div className='NFTResource-Wrapper'>
                  <img
                    alt={`img-nft-${token.index}`}
                    src={detailNFT.image}
                    className='display-resource-nft'
                  />
                </div>
              </div>
            }
            className='card-nft'
          >
            {!!token.price ? (
                <div className='price-nft textmode'>
                  <span>{web3.utils.fromWei(token.price, 'ether')}</span>{' '}
                  <b>{getSymbol(chainId)[token.tokenPayment]}</b>
                </div>
            ) : (
                <></>
            )}
            <Row justify='space-between'>
              <Col className={`footer-card-left ${!token.is1155 ? 'fill-width' : ''}`}>
                <div className='name-collection'>
                  {verifiedContracts.includes(token.addressToken.toLocaleLowerCase()) ? (
                    <img src={tick} alt='icon-tick' className='icon-tick' />
                  ) : null}{' '}
                  {token.collections}
                </div>
                <div className='name-nft textmode'>{detailNFT.name}</div>
              </Col>
              {!!token.is1155 && !onSale ? (
                <Col className='footer-card-right text-right price-nft'>
                  <div className='title-price'>Available</div>
                  <div className='textmode'>
                    {!!token.soldAmount
                      ? parseInt(token.value) - parseInt(token.soldAmount)
                      : token.value}{' '}
                    <span className='text-blur'>of</span> {token.totalSupply}{' '}
                  </div>
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </Card>
        </Link>
      ) : (
        <Skeleton active round title='123' />
      )}
    </Col>
  ) : null;
}

export default function ERC721({ tokens, onSale }) {
  const [afterFilter, setafterFilter] = useState(!!tokens ? tokens : []);
  const { strSearch } = useSelector((state) => state);

  useEffect(() => {
    if (tokens) setafterFilter(() => tokens);
  }, [tokens]);

  return (
    <div className='explore-nft content-list-nft'>
      <Row justify='start' gutter={[20, 20]}>
        {!!afterFilter ? (
          afterFilter.map((token, index) => (
            <NFTsCardProfile key={index} token={token} strSearch={strSearch} onSale={onSale} />
          ))
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}
