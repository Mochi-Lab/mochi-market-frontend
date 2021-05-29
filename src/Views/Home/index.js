import { useSelector } from 'react-redux';

import Slider from 'react-slick';
import IconLoading from 'Components/IconLoading';
import { carouselBanner, carouselCard } from './constantCarousel';
import Footer from 'Components/Footer';
import CardNFTNotSearch from './CardNFTNotSearch.js';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

import cover from 'Assets/banners/cover.png';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function Home() {
  const { convertErc721Tokens, isLoadingErc721 } = useSelector((state) => state);

  const tags = ['Artwork', '3D', 'Character', 'Art'];

  const mergeAllCollections = () => {
    return [].concat(
      ...convertErc721Tokens.map((collections) => collections.tokens.map((token) => token))
    );
  };

  const newListing = () => {
    let listNFT = mergeAllCollections();
    listNFT = listNFT.sort((a, b) =>
      a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
    );
    return listNFT.slice(0, 10);
  };
  return (
    <div className='content-home'>
      <div className=''>
        <Slider {...carouselBanner} className='carousel-banner-home'>
          <div className='home-banner'>
            <img src={cover} alt='cover' />
            <div className='banner-content center'>
              <div>
                <p className='fontRubik mc-mk'>MOCHI MARKET</p>
                <p className='fontRoboto new-eco'>THE NEW CREATIVE ECONOMY</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>

      {/* Search box */}
      <div style={{ position: 'relative' }}>
        <div className='center' style={{ width: '100%', position: 'absolute', top: '-2rem' }}>
          <div className='hs'>
            <div
              className='search-icon center search-input'
              style={{
                height: '3rem',
                width: '3rem',
                borderRadius: '16px 0px 0px 16px',
                background: '#ffffff',
              }}
            >
              <SearchOutlined />
            </div>
            <Link to='/browse'>
              <input className='search-input home-search' placeholder='Search' />
            </Link>
          </div>
        </div>
      </div>

      {/* Suggest */}
      <div className='center' style={{ marginTop: '2rem' }}>
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
              <h2 className='textmode'>Hot Collections</h2>
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
              <h2 className='textmode'>EXPLORE</h2>
            </div>
            <Slider className='carousel-new-nfts' {...carouselCard}>
              {newListing().map((nft, i) => (
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
