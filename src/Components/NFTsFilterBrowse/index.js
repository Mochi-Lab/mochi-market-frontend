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

export default function NFTsFilterBrowse({
  collectionsNFT,
  isLoadingErc721,
  isEndOfOrderList,
  loadingScroll,
  fetchExplore,
  listCollections,
  setSelectedToken,
  setSkip,
  setNftsOnSale,
  tokenPayment,
  setTokenPayment,
  typeSort,
  setTypeSort,
}) {
  const { chainId } = useSelector((state) => state);
  const [tokenActive, setTokenActive] = useState('');
  const [strSearch, setStrSearch] = useState();

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment('0');
    }
  }, [chainId, setTokenPayment]);

  const selectToken = async (token, index) => {
    if (index === tokenActive) {
      setSelectedToken(null);
      setTokenActive(null);
      setSkip(0);
      setNftsOnSale(null);
    } else {
      await setSelectedToken(token.addressToken);
      setTokenActive(index);
      setSkip(0);
      setNftsOnSale(null);
    }
  };

  const searchCollections = (e) => {
    const { value } = e.target;
    setStrSearch(value);
  };

  const selectTokenPayment = (_tokenPayment) => {
    // 'price sort' will not be enabled if "token payment" is 'all' ( for now )
    // #TODO : enable cross-token price sorting by convert all to USD
    if(_tokenPayment === '0') selectSortType('');
    setTokenPayment(_tokenPayment);
    setSkip(0);
    setNftsOnSale(null);
  };

  const selectSortType = (_type) => {
    setTypeSort(_type);
    setSkip(0);
    setNftsOnSale(null);
  };

  return (
    <>
      <Layout style={{ minHeight: '100%' }}>
        <Layout
          style={{ padding: '1rem' }}
          className='nfts-filter-browse-container background-mode'
        >
          <Content
            className='site-layout-background'
            style={{
              padding: 6,
              margin: 0,
              minHeight: 280,
            }}
          >
            {/* because isLoadingERC721 will false before start loading so isLoadingErc72 = null may be best option */}
            {isLoadingErc721 || isLoadingErc721 === null || !listCollections ? (
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
                        {!!listCollections
                          ? listCollections.map((collection, index) => {
                              if (
                                (!!strSearch &&
                                  collection.name
                                    .toLocaleLowerCase()
                                    .includes(strSearch.toLowerCase())) ||
                                !strSearch
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
                                        <img src={collection.logo} alt='logo-collection' />
                                      )}
                                    </div>

                                    <div className='name-collection textmode'>
                                      <a
                                        href={`/collection/${chainId}/${collection.addressToken}?ViewAll=true`}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='link-collection-name'
                                      >
                                        {collection.name}
                                      </a>
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
                        {`${!!collectionsNFT ? collectionsNFT.length : 0}`.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ','
                        )}{' '}
                        Results
                      </span>
                    </Col>
                    <Col span='20' className='right-sort-results'>
                      <Select
                        size='large'
                        value={tokenPayment}
                        onChange={(value) => selectTokenPayment(value)}
                        className='tokenpayment textmode'
                      >
                        <Option value='0' key='-1' className='text-center' title=''>
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
                        onChange={(_typeSort) => selectSortType(_typeSort)}
                      >
                        <Option value='' title=''>Recently listed</Option>
                        <Option value='1' disabled={tokenPayment === '0'} title=''>Price asc</Option>
                        <Option value='-1' disabled={tokenPayment === '0'} title=''>Price desc</Option>
                      </Select>
                    </Col>
                  </Row>
                  <NFTsCardBrowse
                    tokens={collectionsNFT}
                    isEndOfOrderList={isEndOfOrderList}
                    loadingScroll={loadingScroll}
                    fetchExplore={fetchExplore}
                  />
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
