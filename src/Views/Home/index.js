import { useSelector } from 'react-redux';
import { useState } from 'react';
import Slider from 'react-slick';
import IconLoading from 'Components/IconLoading';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner, carouselCard } from 'Constants/constantCarousel';
import Footer from 'Components/Footer';
import CardNFTNotSearch from './CardNFTNotSearch.js';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import axiosClient from 'api/index.js';
import { getAllSellOrderList } from 'api/apiProvider.js';
import { useEffect } from 'react';

export default function Home() {
  const { convertErc721Tokens, isLoadingErc721 } = useSelector((state) => state);
  const [explore, setExplore] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isEndOfOrderList, setIsEndOfOrderList] = useState(false);
  const page = 10;

  const tags = ['Artwork', '3D', 'Character', 'Art'];

  const fetchExplore = async () => {
    try {
      // load  sellorder per page
      let exp = await axiosClient.get(getAllSellOrderList() + `?skip=${skip}&limit=${page}`);
      setSkip(skip + page);
      setExplore((explore) => [...explore, ...exp]);
      if (exp.length < page) setIsEndOfOrderList(true);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchExplore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div className='explore'>
              {explore.map((nft, i) => (
                <div className='card' key={i}>
                  <CardNFTNotSearch token={nft} />
                </div>
              ))}
            </div>
            {isEndOfOrderList ? (
              <></>
            ) : (
              <div className='loadmore' onClick={() => fetchExplore()}>
                Load more
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
