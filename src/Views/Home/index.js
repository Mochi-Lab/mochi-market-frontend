import { useSelector } from 'react-redux';

import Slider from 'react-slick';
import IconLoading from 'Components/IconLoading';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner, carouselCard } from 'Constants/constantCarousel';
import Footer from 'Components/Footer';
import CardNFTNotSearch from './CardNFTNotSearch.js';
import CardCollection from './CardCollection.js';
import { useEffect } from 'react';
import { unpinFooterOnLoad } from 'utils/helper.js';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.scss';
import 'Assets/css/common-card-nft.scss';

export default function Home() {
  const { convertErc721Tokens, convertErc1155Tokens, isLoadingErc721, chainId } = useSelector(
    (state) => state
  );

  const tags = ['Artwork', '3D', 'Character', 'Art'];

  const mergeAllCollections = () => {
    return [].concat(
      ...convertErc721Tokens.map((collections) => collections.tokens.map((token) => token))
    );
  };
  const mergeAllCollections1155 = () => {
    return [].concat(
      ...convertErc1155Tokens.map((collections) => collections.tokens.map((token) => token))
    );
  };

  const newListing = () => {
    let listNFT = mergeAllCollections();
    listNFT = listNFT.sort((a, b) =>
      a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
    );
    return listNFT.slice(0, 10);
  };

  const new1155 = () => {
    let listNFT = mergeAllCollections1155();
    listNFT = listNFT.sort((a, b) =>
      a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
    );
    return listNFT.slice(0, 10);
  };

  useEffect(() => {
    return unpinFooterOnLoad(isLoadingErc721 || isLoadingErc721 === null);
  }, [isLoadingErc721]);

  const listHotCollections = [
    {
      addressToken: '0xC33d69a337B796A9f0F7588169cd874C3987BDE9',
      chainId: 56,
    },
    {
      addressToken: '0x301817312598f8f48cb7d898d659ca4a4d457ad8',
      chainId: 56,
    },
    {
      addressToken: '0x0AC1bd198DB93d7EC428b698DCEf2E43DBcea7D1',
      chainId: 56,
    },
    {
      addressToken: '0x3e629332c51046a17ec236553cb931cf0548b5e1',
      chainId: 56,
    },
    {
      addressToken: '0xc0cee8f3799be895e8f53ee97ab66d7581017b5f',
      chainId: 137,
    },
    {
      addressToken: '0x85bc2e8aaad5dbc347db49ea45d95486279ed918',
      chainId: 137,
    },
  ];

  return (
    <div className='content-home'>
      <BannerSearchHome carouselBanner={carouselBanner} />

      {/* Suggest */}
      <div className='center'>
        <p style={{ color: '#A3A3A3' }}>Suggested:</p>
        {tags.map((tag, index) => (
          <div key={index} style={{ margin: '0px 10px', cursor: 'pointer' }}>
            <p className='pink-font'>{tag}</p>
          </div>
        ))}
      </div>

      {isLoadingErc721 || isLoadingErc721 === null ? (
        // Loading if done load the first type of token user have, if user select other load other
        <div className='center' style={{ width: '100%', height: '100%' }}>
          <IconLoading className='search-icon' />
        </div>
      ) : (
        <div className='container'>
          <div className='new-nfts'>
            <div className='title-new'>
              <h2 className='textmode'>Hot Collections</h2>
            </div>
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {listHotCollections.map((collection, index) =>
                parseInt(collection.chainId) === parseInt(chainId) ? (
                  <CardCollection
                    key={index}
                    addressToken={collection.addressToken}
                    chainId={collection.chainId}
                  />
                ) : (
                  ''
                )
              )}
            </Slider>
          </div>

          <div className='new-nfts'>
            <div className='title-new'>
              <h2 className='textmode'>New List</h2>
            </div>
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {newListing().map((nft, i) => (
                <div className='item-carousel' key={i}>
                  <CardNFTNotSearch token={nft} />
                </div>
              ))}
            </Slider>
          </div>

          <div className='new-nfts'>
            <div className='title-new'>
              <h2 className='textmode'>COLLECTIONS 1155</h2>
            </div>
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {new1155().map((nft, i) => (
                <div className='item-carousel' key={i}>
                  <CardNFTNotSearch token={nft} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
