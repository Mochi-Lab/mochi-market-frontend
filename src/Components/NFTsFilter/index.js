import { Layout } from 'antd';
import { useState } from 'react';
import NFTsCard from 'Components/NFTsCard';
import IconLoading from 'Components/IconLoading';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './index.css';

const { Content } = Layout;

export default function NFTsFilter({ erc721Tokens, isLoadingErc721, type }) {
  const [selectedTokens, setSelectedTokens] = useState({});
  const [tokenActive, setTokenActive] = useState(null);

  const selectToken = (token, index) => {
    if (index === tokenActive) {
      setSelectedTokens(null);
      setTokenActive(null);
    } else {
      setSelectedTokens(token);
      setTokenActive(index);
    }
  };

  return (
    <>
      <div className='carousel-collections'>
        <AliceCarousel
          responsive={{ 0: { items: 3 } }}
          animationType='fadeout'
          animationDuration={800}
          disableButtonsControls
          disableDotsControls
          infinite
          items={
            erc721Tokens
              ? erc721Tokens.map((erc721Token, index) => (
                  <div
                    className={`collection-nft sidenav-item ${
                      tokenActive === index ? 'is-active' : ''
                    }`}
                    onClick={() => selectToken(erc721Token, index)}
                  >
                    <div
                      className='avatar-token'
                      dangerouslySetInnerHTML={{ __html: erc721Token.avatarToken }}
                    />
                    <div className='name-token'>
                      <h2>{erc721Token.name}</h2>
                    </div>
                  </div>
                ))
              : []
          }
          mouseTracking
          innerWidth='50'
        />
      </div>
      <Layout style={{ minHeight: '100%' }}>
        <Layout style={{ padding: '1rem' }} className='background-mode'>
          <Content
            className='site-layout-background'
            style={{
              padding: 6,
              margin: 0,
              minHeight: 280,
            }}
          >
            {/* because isLoadingERC721 will false before start loading so isLoadingErc72 = null may be best option */}
            {isLoadingErc721 || isLoadingErc721 === null ? (
              // Loading if done load the first type of token user have, if user select other load other
              <div className='center' style={{ width: '100%', height: '100%' }}>
                <IconLoading />
              </div>
            ) : !!selectedTokens && (!!selectedTokens.tokens || !!selectedTokens.onSale) ? (
              type === 'onSale' ? (
                <NFTsCard tokens={selectedTokens.onSale} />
              ) : (
                <NFTsCard tokens={selectedTokens.tokens} />
              )
            ) : type === 'onSale' ? (
              <NFTsCard
                tokens={
                  erc721Tokens
                    ? [].concat(
                        ...erc721Tokens.map((collections) =>
                          collections.onSale.map((token) => token)
                        )
                      )
                    : []
                }
              />
            ) : (
              <NFTsCard
                tokens={
                  erc721Tokens
                    ? [].concat(
                        ...erc721Tokens.map((collections) =>
                          collections.tokens.map((token) => token)
                        )
                      )
                    : []
                }
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
