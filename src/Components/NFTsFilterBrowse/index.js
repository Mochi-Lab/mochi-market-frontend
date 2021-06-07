import { Col, Layout, Row, Input } from 'antd';
import { useState } from 'react';
import NFTsCardBrowse from 'Components/NFTsCardBrowse';
import IconLoading from 'Components/IconLoading';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import 'react-alice-carousel/lib/alice-carousel.css';
import './index.css';

const { Content } = Layout;

export default function NFTsFilterBrowse({ erc721Tokens, isLoadingErc721 }) {
  const [selectedTokens, setSelectedTokens] = useState({});
  const [tokenActive, setTokenActive] = useState(null);
  const [strSearch, setStrSearch] = useState();

  const selectToken = (token, index) => {
    if (index === tokenActive) {
      setSelectedTokens(null);
      setTokenActive(null);
    } else {
      setSelectedTokens(token);
      setTokenActive(index);
    }
  };

  const searchCollections = (e) => {
    const { value } = e.target;
    setStrSearch(value);
  };

  return (
    <>
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
              <div className='center' style={{ width: '100%', height: '100%' }}>
                <IconLoading />
              </div>
            ) : (
              <Row gutter={[25, 15]}>
                <Col xs={{ span: 24 }} lg={{ span: 5 }}>
                  <div className='sidebar-collections'>
                    <div className='search-collections'>
                      <div className='title-collections'>
                        <h1 className='textmode'>Collections</h1>
                      </div>
                      <div className='input-search-collections'>
                        <Input
                          placeholder='Search collections '
                          onChange={searchCollections}
                          size='large'
                          value={strSearch}
                          suffix={<SearchOutlined />}
                          className='style-search-input input-mode-bc'
                        />
                      </div>
                      <div className='list-collections'>
                        {erc721Tokens
                          ? erc721Tokens.map((erc721Token, index) => {
                              if (
                                (!!strSearch &&
                                  erc721Token.name
                                    .toLocaleLowerCase()
                                    .includes(strSearch.toLowerCase())) ||
                                !strSearch
                              )
                                return (
                                  <div
                                    className='collect-item'
                                    key={index}
                                    onClick={() => selectToken(erc721Token, index)}
                                  >
                                    <div className='icon-collection'>
                                      {tokenActive === index ? (
                                        <div className='avatar-token'>
                                          <CheckCircleOutlined />
                                        </div>
                                      ) : (
                                        <div
                                          className='avatar-token'
                                          dangerouslySetInnerHTML={{
                                            __html: erc721Token.avatarToken,
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div className='name-collection textmode'>
                                      {erc721Token.name}
                                    </div>
                                  </div>
                                );
                              return '';
                            })
                          : null}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 19 }}>
                  {!!selectedTokens && !!selectedTokens.tokens ? (
                    <NFTsCardBrowse tokens={selectedTokens.tokens} />
                  ) : (
                    <NFTsCardBrowse
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
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
