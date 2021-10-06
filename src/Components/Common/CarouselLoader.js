import React from 'react';
import Slider from 'react-slick';
import { Card, Col, Row } from 'antd';
import { carouselCard } from 'Constants/constantCarousel';
import { NFTCardLoader } from 'Components/Common/NFTCard';
import _ from 'lodash';
import './common.scss';

const options = {
  ...carouselCard,
  arrows: false,
};

const __CarouselLoader = () => {
  return (
    <>
      <Slider className='carousel-new-nfts' {...options}>
        {_.range(5).map((index) => (
          <div className='item-carousel' key={index}>
            <NFTCardLoader />
          </div>
        ))}
      </Slider>
    </>
  );
};

const CarouselCollectionItem = () => {
  return (
    <div className='item-carousel'>
      <Card
        className='home-card card-nft card-collection'
        cover={<div className='wrap-cover'></div>}
      >
        <div className='div-loader'></div>
        <Row justify='center'>
          <Col className='footer-card-left'>
            <div className='textmode collection-name'>&nbsp;</div>
            <div className='collection-type textmode text-blur'>&nbsp;</div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const __CarouselCollectionLoader = () => {
  return (
    <Slider className='carousel-new-nfts' {...options}>
      {_.range(5).map((index) => (
        <CarouselCollectionItem key={index} />
      ))}
    </Slider>
  );
};

const CarouselLoader = React.memo(__CarouselLoader);
const CarouselCollectionLoader = React.memo(__CarouselCollectionLoader);

export { CarouselCollectionItem, CarouselLoader, CarouselCollectionLoader };
