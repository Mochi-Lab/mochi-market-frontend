import { useSelector } from 'react-redux';
import NFTsFilter from 'Components/NFTsFilter';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner } from 'Constants/constantCarousel';
import { useEffect, useRef } from 'react';

export default function Browse() {
  const { convertErc721Tokens, isLoadingErc721 } = useSelector((state) => state);
  const inputSearch = useRef(null);
  useEffect(() => {
    if (!!inputSearch) {
      inputSearch.current.focus();
    }
  }, []);
  return (
    <>
      <BannerSearchHome carouselBanner={carouselBanner} inputSearch={inputSearch} />
      <div className='container' style={{ width: '100%', height: '100%' }}>
        <NFTsFilter erc721Tokens={convertErc721Tokens} isLoadingErc721={isLoadingErc721} />
      </div>
    </>
  );
}
