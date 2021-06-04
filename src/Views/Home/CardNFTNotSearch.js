import { Card } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imgNotFound from 'Assets/notfound.png';
import { getSymbol } from 'utils/getContractAddress';

export default function CardNFTHome({ token }) {
  const { web3, chainId } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token && !!token.tokenURI) {
        try {
          let req = await axios.get(token.tokenURI);
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
  }, [token]);

  return !!detailNFT ? (
    <Link to={`/token/${token.addressToken}/${token.index}`}>
      <Card
        className='home-card'
        cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}
      >
        <div className='ant-card-meta-title'>{detailNFT.name}</div>
        <div className='ant-card-meta-description textmode'>
          {!!token.price ? (
            `${web3.utils.fromWei(token.price, 'ether')} ${getSymbol(chainId)[token.tokenPayment]}`
          ) : (
            <></>
          )}
        </div>
      </Card>
    </Link>
  ) : null;
}
