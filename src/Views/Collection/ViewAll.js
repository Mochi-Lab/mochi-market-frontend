import { Layout, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsCardBrowse from 'Components/NFTsCardBrowse';
import { getTokensPayment } from 'utils/getContractAddress';
import './index.scss';
import 'Components/NFTsFilterBrowse/index.scss';

const { Option } = Select;

export default function ViewAll({ collectionOnSale, setViewAll }) {
  const { chainId } = useSelector((state) => state);

  const [tokenPayment, setTokenPayment] = useState('0');
  const [typeSort, setTypeSort] = useState('recentlyListed');
  const [filterCount, setFilterCount] = useState(0);

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment('0');
    }
  }, [chainId]);

  const _setFilterCount = (count) => {
    setFilterCount(count);
  };

  return (
    <>
      <Layout style={{ minHeight: '100%' }} className='view-all-collection background-mode'>
        <div className='sort-results-collection'>
          <div className='left-sort-results'>
            <span className='textmode'>
              {`${filterCount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Results
            </span>
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
        <NFTsCardBrowse
          tokens={collectionOnSale()}
          tokenPayment={tokenPayment}
          typeSort={typeSort}
          filterCountCallback={_setFilterCount}
        />
      </Layout>
    </>
  );
}
