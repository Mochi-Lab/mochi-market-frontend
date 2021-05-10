import { useSelector } from 'react-redux';

import Slider from 'react-slick';
import { Row } from 'antd';
import IconLoading from 'Components/IconLoading';
import { carouselBanner, carouselCard } from './constantCarousel';
import Footer from 'Components/Footer';
import CardNFTHome from './CardNFTHome.js';
import CardNFTNotSearch from './CardNFTNotSearch.js';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import iconNew from 'Assets/images/new.png';
import iconShop from 'Assets/images/shop.png';
import banner1 from 'Assets/banners/Twitter-cover-size-02-02.png';

export default function Home() {
  const { convertErc721Tokens, isLoadingErc721, strSearch } = useSelector((state) => state);

  const banners = [
    {
      src: banner1,
      alt: 'mochi-Banner',
    },
  ];

  const mergeAllCollections = () => {
    return [].concat(
      ...convertErc721Tokens.map((collections) => collections.tokens.map((token) => token))
    );
  };

  const newListing = () => {
    let listNFT = mergeAllCollections();
    listNFT = listNFT.sort((a, b) => {
      if (a.sortIndex < b.sortIndex) return -1;
      if (a.sortIndex > b.sortIndex) return 1;
      return 0;
    });
    return listNFT.slice(0, 10);
  };
  return (
    <div className='content-home '>
      <div className='container'>
        <Slider {...carouselBanner} className='carousel-banner-home'>
          {banners.map((banner, index) => (
            <div key={index} className='carousel-banner center'>
              <img src={banner.src} alt={banner.alt} />
            </div>
          ))}
        </Slider>
      </div>
      {isLoadingErc721 || isLoadingErc721 === null ? (
        // Loading if done load the first type of token user have, if user select other load other
        <div className='center' style={{ width: '100%', height: '100%' }}>
          <IconLoading />
        </div>
      ) : (
        <div className='container'>
          <div className='new-nfts'>
            <div className='title-new'>
              <h2 className='textmode'>
                New List <img src={iconNew} className='icon-new' alt='icon-new-list' />
              </h2>
            </div>
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {newListing().map((nft, i) => (
                <div className='item-carousel' key={i}>
                  <CardNFTNotSearch token={nft} />
                </div>
              ))}
            </Slider>
          </div>

          <div className='explore-nft'>
            <div className='title-explore'>
              <h2 className='textmode'>
                Explore <img src={iconShop} className='icon-new' alt='icon-explore' />
              </h2>
            </div>
            <Row justify='center'>
              {mergeAllCollections().map((nft, i) => (
                <CardNFTHome token={nft} strSearch={strSearch} key={i} />
              ))}
            </Row>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
