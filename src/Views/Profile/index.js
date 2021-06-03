import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Tabs } from 'antd';
import { WalletOutlined, HistoryOutlined, ShopOutlined } from '@ant-design/icons';
import NFTsProfile from 'Components/NFTsProfile';
// import Edit from './Edit';
import backgroundDefault from 'Assets/backgrounds/background-profile.png';
import avatarDefault from 'Assets/avatar-profile.png';
import iconFacebook from 'Assets/icons/facebook.svg';
import iconLinkedIn from 'Assets/icons/invision.svg';
import iconTwitter from 'Assets/icons/twitter-profile.svg';
import { getNFTsOfOwner } from 'store/actions';
import './index.css';
import TransactionTable from 'Components/TransactionTable';
import { useParams } from 'react-router';

const { TabPane } = Tabs;

export default function Profile() {
  const dispatch = useDispatch();
  const {
    erc721TokensOwner,
    erc721TokensOnsale,
    /* erc1155Tokens, */
    isLoadingErc721,
    erc721Instances,
  } = useSelector((state) => state);
  const { address } = useParams();

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!!erc721Instances && !!address) {
      dispatch(getNFTsOfOwner(erc721Instances, address));
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
        <Row gutter={[32, 32]}>
          <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 6 }}>
            <div style={{ position: 'relative' }}>
              <div className='left-profile'>
                <div className='info-user'>
                  <div className='background-avatar'>
                    <div className='background-profile'>
                      <img src={backgroundDefault} alt='background-profile' />
                    </div>
                    <img src={avatarDefault} alt='avatar-profile' className='avatar-profile' />
                  </div>
                  <div className='name-user'>
                    <h2 className='textmode'>KENDY BAIDU</h2>
                  </div>
                  <div className='address-wallet' onClick={() => copyToClipboard()}>
                    <p className='textmode'>
                      {' '}
                      {`${address.slice(0, 8)}...${address.slice(
                        address.length - 8,
                        address.length
                      )}`}{' '}
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
                    </p>
                  </div>

                  <div className='social-profile'>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                      <img src={iconFacebook} alt='Facebook' />
                    </a>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                      <img src={iconLinkedIn} alt='LinkedIn' />
                    </a>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                      <img src={iconTwitter} alt='Twitter' />
                    </a>
                  </div>
                  <div className='following'></div>
                  <div className='follower'></div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 16 }} xl={{ span: 18 }}>
            <div className='right-profile'>
              <Tabs
                defaultActiveKey={erc721TokensOwner.length >= erc721TokensOnsale.length ? '2' : '1'}
                type='card'
                size={'large'}
                className='tabs-actions-profile'
              >
                <TabPane
                  tab={
                    <div className='action-profile'>
                      <ShopOutlined />
                      <strong>On Sale</strong>
                    </div>
                  }
                  key='1'
                >
                  <NFTsProfile
                    listNFTs={erc721TokensOnsale}
                    isLoadingErc721={isLoadingErc721}
                    type={'onSale'}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <div className='action-profile'>
                      <WalletOutlined />
                      <strong>Collected</strong>
                    </div>
                  }
                  key='2'
                >
                  <NFTsProfile listNFTs={erc721TokensOwner} isLoadingErc721={isLoadingErc721} />
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
          </Col>
        </Row>
      </div>
    </>
  );
}
