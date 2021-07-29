import Slider from 'react-slick';
import { carouselCard } from 'Constants/constantCarousel';
import CardCollection from './CardCollection.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'Views/Home/index.scss';
import './index.scss';
import 'Views/Profile/index.scss';
import 'Assets/css/common-card-nft.scss';

export default function ViewLess({ infoCollection, nftsOnSale, listNewNFT, setViewAll, viewAll }) {
  return (
    <div className={`${!!viewAll ? 'display-none-view-all' : 'display-block-view-all'}`}>
      <div className='new-nfts'>
        <div className='title-new'>
          <div className='wrap-title'>
            <h2 className='textmode title-collection'>On Sale</h2>
            <div className='link-view-all textmode' onClick={() => setViewAll(true)}>
              View all
            </div>
          </div>
        </div>
        <Slider className='carousel-new-nfts' {...carouselCard}>
          {nftsOnSale.map((nft, i) => (
            <div className='item-carousel' key={i}>
              <CardCollection token={nft} infoCollection={infoCollection} />
            </div>
          ))}
        </Slider>
      </div>

      <div className='new-nfts'>
        <div className='title-new'>
          <h2 className='textmode'>Newly Created</h2>
        </div>
        <Slider className='carousel-new-nfts' {...carouselCard}>
          {listNewNFT.map((nft, i) => (
            <div className='item-carousel' key={i}>
              <CardCollection token={nft} infoCollection={infoCollection} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
