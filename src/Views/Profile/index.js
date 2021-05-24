import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { WalletOutlined, HistoryOutlined, ShopOutlined } from '@ant-design/icons';
import NFTsFilter from 'Components/NFTsFilter';
import Edit from './Edit';
import avatarDefault from 'Assets/avatar-default.svg';
import { getOwnedERC721 } from 'store/actions';
import './index.css';
import TransactionTable from 'Components/TransactionTable';
import { useParams } from 'react-router';

const { TabPane } = Tabs;

export default function Profile() {
  const dispatch = useDispatch();
  const { erc721Tokens, isLoadingErc721, erc721Instances } = useSelector((state) => state);
  const { address } = useParams();

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!!erc721Instances && !!address) {
      dispatch(getOwnedERC721(erc721Instances, address));
    }
  }, [erc721Instances, address, dispatch]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      <div className='page-profile'>
        <div className='profile-header'>
          <div className='banner relative'>
            <img
              src={
                'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ'
              }
              alt='banner'
            />
            <Edit />
          </div>

          <div className='avatar center'>
            <img src={avatarDefault} alt='avatar' />
          </div>
          <div className='name'>
            <p className='textmode'>Unnamed</p>
          </div>
          <div className='address' onClick={() => copyToClipboard()}>
            <p>
              {address}
              <span className='icon-coppy'>
                {isCopied ? (
                  <svg
                    viewBox='0 0 14 11'
                    fill='none'
                    width='16'
                    height='16'
                    xlmns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 5L5 9L13 1'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                    ></path>
                  </svg>
                ) : (
                  <svg
                    viewBox='0 0 13 13'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    xlmns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3.25 8.25H2C1.86193 8.25 1.75 8.13807 1.75 8V2C1.75 1.86193 1.86193 1.75 2 1.75H8C8.13807 1.75 8.25 1.86193 8.25 2V3.25H5C4.0335 3.25 3.25 4.0335 3.25 5V8.25ZM3.25 9.75H2C1.0335 9.75 0.25 8.9665 0.25 8V2C0.25 1.0335 1.0335 0.25 2 0.25H8C8.9665 0.25 9.75 1.0335 9.75 2V3.25H11C11.9665 3.25 12.75 4.0335 12.75 5V11C12.75 11.9665 11.9665 12.75 11 12.75H5C4.0335 12.75 3.25 11.9665 3.25 11V9.75ZM11.25 11C11.25 11.1381 11.1381 11.25 11 11.25H5C4.86193 11.25 4.75 11.1381 4.75 11V5C4.75 4.86193 4.86193 4.75 5 4.75H11C11.1381 4.75 11.25 4.86193 11.25 5V11Z'
                      fill='currentColor'
                    ></path>
                  </svg>
                )}
              </span>
            </p>
          </div>
        </div>
        <Tabs defaultActiveKey='2' type='card' size={'large'} className='tabs-actions-profile'>
          <TabPane
            tab={
              <div className='action-profile'>
                <ShopOutlined />
                <strong>On Sale</strong>
              </div>
            }
            key='1'
          >
            <NFTsFilter
              erc721Tokens={erc721Tokens}
              isLoadingErc721={isLoadingErc721}
              type={'onSale'}
            />
          </TabPane>
          <TabPane
            tab={
              <div className='action-profile'>
                <WalletOutlined />
                <strong>My Wallet</strong>
              </div>
            }
            key='2'
          >
            <NFTsFilter erc721Tokens={erc721Tokens} isLoadingErc721={isLoadingErc721} />
          </TabPane>
          <TabPane
            tab={
              <div className='action-profile'>
                <HistoryOutlined />
                <strong>Activity</strong>
              </div>
            }
            key='3'
          >
            <TransactionTable />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
