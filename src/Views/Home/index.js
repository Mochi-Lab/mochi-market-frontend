import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useWindowSize from 'utils/useWindowSize';

import Slider from 'react-slick';
import IconLoading from 'Components/IconLoading';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner, carouselCard } from 'Constants/constantCarousel';
import Footer from 'Components/Footer';
import CardNFTNotSearch from './CardNFTNotSearch.js';
import CardCollection from './CardCollection.js';
import { unpinFooterOnLoad } from 'utils/helper.js';
import { getSellOrderByPage, getavailableSellOrderERC1155 } from 'APIs/SellOrder/Gets';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.scss';
import 'Assets/css/common-card-nft.scss';

export default function Home() {
  const [explore, setExplore] = useState([]);
  const [erc1155, setErc1155] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isEndOfOrderList, setIsEndOfOrderList] = useState(false);
  const size = useWindowSize();

  const { convertErc721Tokens, convertErc1155Tokens, isLoadingErc721, chainId } = useSelector(
    (state) => state
  );

  const page =
    size.width > 1500
      ? 10
      : size.width > 1400
      ? 8
      : size.width > 1200
      ? 9
      : size.width > 576
      ? 4
      : 4;

  const tags = ['Artwork', '3D', 'Character', 'Art'];

  const fetchExplore = async () => {
    try {
      // load  sellorder per page
      let exp = await getSellOrderByPage(skip, skip + page);
      setSkip(skip + page);
      setExplore((explore) => [...explore, ...exp]);
      if (exp.length < page) setIsEndOfOrderList(true);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    const fetchErc1155 = async () => {
      let erc1155 = await getavailableSellOrderERC1155(0, 10);
      setErc1155(erc1155);
    };
    if (size.width !== undefined) {
      fetchExplore();
      fetchErc1155();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width !== undefined]);

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
    let listNFT;
    if (chainId === 56 && explore.length > 0) {
      listNFT = explore.slice(0, 10);
    } else {
      listNFT = mergeAllCollections();
      listNFT = listNFT.sort((a, b) =>
        a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
      );
    }

    return listNFT.slice(0, 10);
  };

  const new1155 = () => {
    let listNFT;
    if (chainId === 56 && erc1155.length > 0) {
      listNFT = erc1155.slice(0, 10);
    } else {
      listNFT = mergeAllCollections1155();
      listNFT = listNFT.sort((a, b) =>
        a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
      );
    }
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
      {!isLoadingErc721 || isLoadingErc721 !== null ? (
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

          {/* only run on bsc mainnet */}
          {chainId === 56 && explore.length > 0 ? (
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
                <div className='loadmore textmode' onClick={() => fetchExplore()}>
                  Load more
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        // Loading if done load the first type of token user have, if user select other load other
        <div className='center' style={{ width: '100%', height: '100%' }}>
          <IconLoading className='search-icon' />
        </div>
      )}
      <Footer />
    </div>
  );
}
