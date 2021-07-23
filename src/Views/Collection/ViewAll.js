import { Col, Input, Layout, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsCardBrowse from 'Components/NFTsCardBrowse';
import { getTokensPayment } from 'utils/getContractAddress';
import './index.scss';
import 'Components/NFTsFilterBrowse/index.scss';
import { SearchOutlined } from '@ant-design/icons';
import IconLoading from 'Components/IconLoading';
import FilterCollection from 'Components/FilterCollection';

const { Option } = Select;

export default function ViewAll({
  collectionOnSale,
  setViewAll,
  viewAll,
  loadingNFTs,
  setObjectFilter,
  objectFilter,
}) {
  const { chainId } = useSelector((state) => state);

  const [tokenPayment, setTokenPayment] = useState('0');
  const [typeSort, setTypeSort] = useState('recentlyListed');
  const [strSearch, setStrSearch] = useState();
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment('0');
    }
  }, [chainId]);

  const _setFilterCount = (count) => {};

  const searchNFTsCollection = (e) => {
    const { value } = e.target;
    if (!!value) {
      setStrSearch(value);
    } else {
      setStrSearch('');
    }
  };

  return (
    <div className={`${!!viewAll ? 'display-block-view-all' : 'display-none-view-all'}`}>
      <Layout style={{ minHeight: '100%' }} className='view-all-collection background-mode'>
        <div className='sort-results-collection'>
          <div className='left-sort-results'>
            <div className='input-search-collections search-nft-in-collection-1 mr-0d5rem'>
              <Input
                placeholder='Search collections '
                onChange={searchNFTsCollection}
                size='large'
                value={strSearch}
                suffix={<SearchOutlined />}
                className='style-search-input input-mode-bc textmode '
              />
            </div>
          </div>
          <div className='right-sort-results'>
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
                      <Option value={token.address} key={i} className='option-tokenpayment'>
                        <img className='icon-tokenpayment' src={token.icon} alt={token.symbol} />
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
            <span className='textmode link-view-less' onClick={() => setViewAll(false)}>
              View Less
            </span>
          </div>
        </div>
        <div className='search-nft-in-collection-2'>
          <div className='input-search-collections'>
            <Input
              placeholder='Search collections '
              onChange={searchNFTsCollection}
              size='large'
              value={strSearch}
              suffix={<SearchOutlined />}
              className='style-search-input input-mode-bc textmode'
            />
          </div>
        </div>
        {loadingNFTs || loadingNFTs === null ? (
          <div className='center' style={{ width: '100%', height: '100%' }}>
            <IconLoading />
          </div>
        ) : (
          <>
            {!!showFilter ? (
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 5 }}>
                  <FilterCollection
                    setShowFilter={setShowFilter}
                    setObjectFilter={setObjectFilter}
                    objectFilter={objectFilter}
                  />
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 18 }} xxl={{ span: 19 }}>
                  <NFTsCardBrowse
                    tokens={collectionOnSale()}
                    tokenPayment={tokenPayment}
                    typeSort={typeSort}
                    filterCountCallback={_setFilterCount}
                    strSearchInCollection={strSearch}
                  />
                </Col>
              </Row>
            ) : (
              <NFTsCardBrowse
                tokens={collectionOnSale()}
                tokenPayment={tokenPayment}
                typeSort={typeSort}
                filterCountCallback={_setFilterCount}
                strSearchInCollection={strSearch}
              />
            )}
          </>
        )}
      </Layout>
    </div>
  );
}
