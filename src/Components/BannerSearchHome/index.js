import cover from 'Assets/banners/cover.png';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { setStrSearch } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.scss';

export default function BannerSearchHome({ carouselBanner, inputSearch }) {
  const [searchBoxFocused, setSearchBoxFocused] = useState(false);
  const dispatch = useDispatch();
  const { strSearch } = useSelector((state) => state);

  const browse = useRef(null);
  const searchNFT = (event) => {
    const text = event.target.value;
    dispatch(setStrSearch(text));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      browse.current.click();
    }
  };

  const handleOnFocus = (event) => {
    setSearchBoxFocused(true);
  };

  const handleOnBlur = (event) => {
    setSearchBoxFocused(false);
  };

  return (
    <div className='banner-search-home'>
      <Slider {...carouselBanner} className='carousel-banner-home'>
        <div className='home-banner' height='241px'>
          <img src={cover} alt='cover' height='241px' />
          <div className='banner-content center'>
            <div>
              <p className='fontRubik mc-mk'>MOCHI MARKET</p>
              <p className='fontRoboto new-eco'>Creativity is contagious. Pass it on.</p>
            </div>
          </div>
        </div>
      </Slider>
      {/* Search box */}
      <div className='box-search'>
        <div className='center' style={{ width: '100%', position: 'absolute', top: '-2rem' }}>
          <div className={'hs' + (searchBoxFocused ? ' active' : '')}>
            <div className='search-icon center search-input'>
              <SearchOutlined />
            </div>
            <Link to='/browse' ref={browse} />
            <input
              className='search-input home-search'
              placeholder='Search'
              ref={inputSearch}
              onChange={searchNFT}
              onKeyDown={handleKeyDown}
              value={strSearch}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
