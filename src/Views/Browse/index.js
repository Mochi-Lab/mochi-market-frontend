import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import NFTsFilterBrowse from 'Components/NFTsFilterBrowse';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner } from 'Constants/constantCarousel';
import { useEffect, useRef } from 'react';
import { setAvailableSellOrder } from 'store/actions';
import store from 'store/index';
import Footer from 'Components/Footer';

export default function Browse() {
  const { convertErc721Tokens, convertErc1155Tokens, isLoadingErc721 } = useSelector(
    (state) => state
  );

  const addressToken = new URLSearchParams(useLocation().search).get('addressToken');

  const inputSearch = useRef(null);
  useEffect(() => {
    const fetchSetAvailableOrdersNew = async () => {
      await store.dispatch(setAvailableSellOrder());
    };
    fetchSetAvailableOrdersNew();
    setTimeout(() => {
      fetchSetAvailableOrdersNew();
      fetchSetAvailableOrdersNew();
    }, 500);
    if (!!inputSearch) {
      inputSearch.current.focus();
    }
  }, []);
  return (
    <>
      <BannerSearchHome carouselBanner={carouselBanner} inputSearch={inputSearch} />
      <div className='container' style={{ width: '100%', height: '100%' }}>
        <NFTsFilterBrowse
          collectionsNFT={convertErc721Tokens.concat(convertErc1155Tokens)}
          isLoadingErc721={isLoadingErc721}
          addressToken={addressToken}
        />
      </div>
      <Footer />
    </>
  );
}
