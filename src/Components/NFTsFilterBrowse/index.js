import { Col, Layout, Row, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsCardBrowse from 'Components/NFTsCardBrowse';
import IconLoading from 'Components/IconLoading';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { getTokensPayment } from 'utils/getContractAddress';
import 'react-alice-carousel/lib/alice-carousel.css';
import './index.scss';

const { Content } = Layout;
const { Option } = Select;

export default function NFTsFilterBrowse({ collectionsNFT, isLoadingErc721, addressToken }) {
  const { chainId } = useSelector((state) => state);

  const [selectedTokens, setSelectedTokens] = useState({});
  const [tokenActive, setTokenActive] = useState('');
  const [strSearch, setStrSearch] = useState();
  const [tokenPayment, setTokenPayment] = useState('0');
  const [typeSort, setTypeSort] = useState('recentlyListed');
  const [allOrders, setAllOrders] = useState([]);
  const [filterCount, setFilterCount] = useState(0);

  useEffect(() => {
    if (!!addressToken && tokenActive === '') {
      for (let i = 0; i < collectionsNFT.length; i++) {
        const collection = collectionsNFT[i];
        if (collection.addressToken.toLowerCase() === addressToken.toLowerCase()) {
          setSelectedTokens(collection);
          setTokenActive(i);
        }
      }
    }
  }, [addressToken, collectionsNFT, tokenActive]);

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment('0');
    }
  }, [chainId]);

  useEffect(() => {
    if (!!collectionsNFT) {
      setAllOrders(
        collectionsNFT
          ? [].concat(
              ...collectionsNFT.map((collections) => collections.tokens.map((token) => token))
            )
          : []
      );
    }
  }, [collectionsNFT]);

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

  const _setFilterCount = (count) => {
    setFilterCount(count);
  };

  return (
    <>
      <Layout style={{ minHeight: '100%' }}>
        <Layout style={{ padding: '1rem' }} className='nfts-filter-browse-container background-mode'>
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
                          className='style-search-input input-mode-bc textmode'
                        />
                      </div>
                      <div className='list-collections'>
                        {collectionsNFT
                          ? collectionsNFT.map((collection, index) => {
                              if (
                                ((!!strSearch &&
                                  collection.name
                                    .toLocaleLowerCase()
                                    .includes(strSearch.toLowerCase())) ||
                                  !strSearch) &&
                                collection.tokens.length > 0
                              )
                                return (
                                  <div
                                    className='collect-item'
                                    key={index}
                                    onClick={() => selectToken(collection, index)}
                                  >
                                    <div className='icon-collection'>
                                      {tokenActive === index ? (
                                        <div className='avatar-token'>
                                          <CheckCircleOutlined />
                                        </div>
                                      ) : (
                                        <img src={collection.avatarToken} alt='logo-collection' />
                                      )}
                                    </div>
                                    <div className='name-collection textmode'>
                                      {collection.name}
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
                  <Row className='sort-results'>
                    <Col span='4' className='left-sort-results'>
                      <span className='textmode'>
                        {`${filterCount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Results
                      </span>
                    </Col>
                    <Col span='20' className='right-sort-results'>
                      <Select
                        size='large'
                        value={tokenPayment}
                        onChange={(value) => setTokenPayment(value)}
                        className='tokenpayment textmode'
                      >
                        <Option value='0' key='-1' className='text-center'>
                          All
                        </Option>
                        {!!getTokensPayment(chainId)
                          ? getTokensPayment(chainId).map((token, i) => {
                              return (
                                <Option
                                  value={token.address}
                                  key={i}
                                  className='option-tokenpayment'
                                >
                                  <img
                                    className='icon-tokenpayment'
                                    src={token.icon}
                                    alt={token.symbol}
                                  />
                                  <span className='symbol-tokenpayment'>{token.symbol}</span>
                                </Option>
                              );
                            })
                          : null}
                      </Select>
                      <Select
                        value={typeSort}
                        className='textmode select-sort'
                        size='large'
                        onChange={(value) => setTypeSort(value)}
                      >
                        <Option value='recentlyListed'>Recently listed</Option>
                        <Option value='latestCreated'>Latest created</Option>
                        <Option value='priceAsc'>Price asc</Option>
                        <Option value='priceDesc'>Price desc</Option>
                      </Select>
                    </Col>
                  </Row>
                  {!!selectedTokens && !!selectedTokens.tokens ? (
                    <NFTsCardBrowse
                      tokens={selectedTokens.tokens}
                      tokenPayment={tokenPayment}
                      typeSort={typeSort}
                      filterCountCallback={_setFilterCount}
                    />
                  ) : (
                    <NFTsCardBrowse
                      tokens={allOrders}
                      tokenPayment={tokenPayment}
                      typeSort={typeSort}
                      filterCountCallback={_setFilterCount}
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
