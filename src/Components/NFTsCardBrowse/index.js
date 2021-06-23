import { Card, Row, Col, Skeleton } from 'antd';
import './index.css';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getSymbol } from 'utils/getContractAddress';
import imgNotFound from 'Assets/notfound.png';
import abiERC1155 from 'Contracts/ERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';

function NFTsCard({ token, strSearch }) {
  const { web3, chainId } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let tokenURI;
          if (token.is1155) {
            const nft = new web3.eth.Contract(abiERC1155.abi, token.addressToken);
            tokenURI = await nft.methods.uri(token.index).call();
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
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
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
      md={{ span: 8 }}
      lg={{ span: 6 }}
      xl={{ span: 4 }}
      xxl={{ span: 4 }}
    >
      {!!detailNFT ? (
        <Link to={`/token/${token.addressToken}/${token.index}/${token.sellId}`}>
          <Card hoverable cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}>
            <div className='ant-card-meta-title'>{detailNFT.name}</div>
            <div className='ant-card-meta-description textmode'>
              {!!token.price ? (
                `${web3.utils.fromWei(token.price, 'ether')} ${
                  getSymbol(chainId)[token.tokenPayment]
                }`
              ) : (
                <></>
              )}
            </div>
          </Card>
        </Link>
      ) : (
        <Skeleton active round title='123' />
      )}
    </Col>
  ) : null;
}

export default function NFTsCardBrowse({ tokens, tokenPayment, typeSort }) {
  const [afterFilter, setAfterFilter] = useState(!!tokens ? tokens : []);
  const { strSearch, web3 } = useSelector((state) => state);

  const sortOrders = useCallback(async () => {
    var BN = web3.utils.BN;
    let filterByTokenPayment =
      tokenPayment === '0' ? tokens : tokens.filter((order) => order.tokenPayment === tokenPayment);
    switch (typeSort) {
      case 'recentlyListed':
        setAfterFilter(filterByTokenPayment);
        break;
      case 'latestCreated':
        setAfterFilter(
          filterByTokenPayment.sort((a, b) =>
            a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
          )
        );
        break;
      case 'priceAsc':
        setAfterFilter(
          filterByTokenPayment.sort((a, b) =>
            !new BN(a.price).gt(new BN(b.price)) ? 1 : new BN(a.price).gt(new BN(b.price)) ? -1 : 0
          )
        );
        break;
      case 'priceDesc':
        setAfterFilter(
          filterByTokenPayment.sort((a, b) =>
            new BN(a.price).gt(new BN(b.price)) ? 1 : !new BN(a.price).gt(new BN(b.price)) ? -1 : 0
          )
        );
        break;
      default:
        break;
    }
  }, [tokens, tokenPayment, typeSort, web3]);

  useEffect(() => {
    if (tokens) sortOrders();
  }, [tokens, sortOrders]);

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
