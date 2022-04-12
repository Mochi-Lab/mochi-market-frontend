import { useSelector } from 'react-redux';

import Slider from 'react-slick';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner, carouselCard } from 'Constants/constantCarousel';
import Footer from 'Components/Footer';
import CardNFTNotSearch from './CardNFTNotSearch.js';
import CardCollection from './CardCollection.js';
import { useCallback, useEffect, useState } from 'react';
import { CarouselLoader, CarouselCollectionLoader } from 'Components/Common/CarouselLoader';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.scss';
import 'Assets/css/common-card-nft.scss';
import { getAll, getSellOrderERC1155 } from 'APIs/SellOrder/Gets.js';

export default function Home() {
  const { chainId } = useSelector((state) => state);

  const [allOrders, setAllOrders] = useState(null);
  const [ordersERC1155, setOrdersERC1155] = useState(null);

  const mergeAllCollections = useCallback(async () => {
    let all = await getAll(chainId, 0, 10);
    setAllOrders(all);
  }, [chainId]);

  const mergeAllCollections1155 = useCallback(async () => {
    let orders1155 = await getSellOrderERC1155(chainId, 0, 10);
    setOrdersERC1155(orders1155);
  }, [chainId]);

  useEffect(() => {
    async function loadNFTs() {
      await mergeAllCollections();
      await mergeAllCollections1155();
    }
    if (!!chainId) {
      loadNFTs();
    }
  }, [mergeAllCollections, mergeAllCollections1155, chainId]);

  const listHotCollections = [
    {
      addressToken: '0x57a2422FD8997424ebCFd8777d2B71e4BB5D8E9C',
      chainId: 56,
    },
    {
      addressToken: '0xC33d69a337B796A9f0F7588169cd874C3987BDE9',
      chainId: 56,
    },
    {
      addressToken: '0x04B0f7d5CB2CE4688497f2525748FB7A9aFFa394',
      chainId: 56,
    },
    {
      addressToken: '0x891D36718bF26c7389487366BeeCCa04bb42b680',
      chainId: 56,
    },
    {
      addressToken: '0xc2027db8c0d68bfd60ff394e47dc210fc9e1407a',
      chainId: 56,
    },
    {
      addressToken: '0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40',
      chainId: 56,
    },
    {
      addressToken: '0x301817312598f8f48cb7d898d659ca4a4d457ad8',
      chainId: 56,
    },
    {
      addressToken: '0x56536c54abb2d2d2512965af01c98550edb15ef9',
      chainId: 56,
    },
    {
      addressToken: '0x0AC1bd198DB93d7EC428b698DCEf2E43DBcea7D1',
      chainId: 56,
    },
    {
      addressToken: '0xa7a9a8156c24c4b0ca910c3ba842d1f1ac7200ef',
      chainId: 56,
    },
    {
      addressToken: '0x3e629332c51046a17ec236553cb931cf0548b5e1',
      chainId: 56,
    },
    {
      addressToken: '0x7f8d8f602c37999385f370b11c6075d53ae94f52',
      chainId: 137,
    },
    {
      addressToken: '0xc0cee8f3799be895e8f53ee97ab66d7581017b5f',
      chainId: 137,
    },
    {
      addressToken: '0x85bc2e8aaad5dbc347db49ea45d95486279ed918',
      chainId: 137,
    },
    {
      addressToken: '0xbca30d6d18f0c5ac15e0be5c9b389d2df207d19e',
      chainId: 137,
    },
    {
      addressToken: '0xa88fab4c14b94e656d8b0162bb269189912c5e42',
      chainId: 336,
    },
  ].filter((c) => +chainId === +c.chainId);

  return (
    <div className='content-home'>
      <BannerSearchHome carouselBanner={carouselBanner} />
      <div className='container'>
        <div className='new-nfts'>
          <div className='title-new'>
            <h2 className='textmode'>Hot Collections</h2>
          </div>
          {chainId === null ? (
            <CarouselCollectionLoader />
          ) : (
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {listHotCollections.map((collection, index) => (
                <CardCollection
                  key={index}
                  addressToken={collection.addressToken}
                  chainId={collection.chainId}
                />
              ))}
            </Slider>
          )}
        </div>

        <div className='new-nfts'>
          <div className='title-new'>
            <h2 className='textmode'>New Listing</h2>
          </div>
          {allOrders === null ? (
            <CarouselLoader />
          ) : (
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {allOrders.map((nft, i) => (
                <div className='item-carousel' key={i}>
                  <CardNFTNotSearch token={nft} />
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className='new-nfts'>
          <div className='title-new'>
            <h2 className='textmode'>COLLECTIONS 1155</h2>
          </div>
          {ordersERC1155 === null ? (
            <CarouselLoader />
          ) : (
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {ordersERC1155.map((nft, i) => (
                <div className='item-carousel' key={i}>
                  <CardNFTNotSearch token={nft} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
