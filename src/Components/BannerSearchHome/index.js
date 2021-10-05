import cover from 'Assets/banners/cover.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.scss';
import BannerSearchBox from './BannerSearchBox';

export default function BannerSearchHome({ carouselBanner, inputSearch, setSkip, setNftsOnSale }) {
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
      <div className='box-search'>
        <div className='center' style={{ width: '100%', position: 'absolute', top: '-2rem' }}>
          <BannerSearchBox inputSearch={inputSearch} setSkip={setSkip} setNftsOnSale={setNftsOnSale}/>
        </div>
      </div>
    </div>
  );
}
