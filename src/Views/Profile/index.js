import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Tabs } from 'antd';
import { WalletOutlined, ShopOutlined } from '@ant-design/icons';
import NFTsProfile from 'Components/NFTsProfile';
import IconCoppy from 'Components/IconCoppy';
// import Edit from './Edit';
import backgroundDefault from 'Assets/backgrounds/background-profile.png';
import avatarDefault from 'Assets/avatar-profile.png';
// import iconFacebook from 'Assets/icons/facebook.svg';
// import iconLinkedIn from 'Assets/icons/invision.svg';
// import iconTwitter from 'Assets/icons/twitter-profile.svg';
// import TransactionTable from 'Components/TransactionTable';
import { getNFTsOfOwner, setAvailableSellOrder } from 'store/actions';
import './index.scss';
import { useParams } from 'react-router';

const { TabPane } = Tabs;

export default function Profile() {
  const dispatch = useDispatch();
  const { listNFTsOwner, listNFTsOnsale, isLoadingErc721, erc721Instances } = useSelector(
    (state) => state
  );

  const { address } = useParams();

  useEffect(() => {
    if (!!erc721Instances && !!address) {
      dispatch(getNFTsOfOwner(erc721Instances, address));
      dispatch(setAvailableSellOrder(address));
    }
  }, [erc721Instances, address, dispatch]);

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
                    {/* <h2 className='textmode'>MOCHIS</h2> */}
                    <h2> </h2>
                  </div>
                  <div className='address-wallet textmode'>
                    {`${address.slice(0, 8)}...${address.slice(
                      address.length - 8,
                      address.length
                    )}`}{' '}
                    <button className='btn-coppy'>
                      <span className='icon-coppy'>
                        <IconCoppy address={address} />
                      </span>
                    </button>
                  </div>

                  {/* <div className='social-profile'>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                      <img src={iconFacebook} alt='Facebook' />
                    </a>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                      <img src={iconLinkedIn} alt='LinkedIn' />
                    </a>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                      <img src={iconTwitter} alt='Twitter' />
                    </a>
                  </div> */}
                  <div className='following'></div>
                  <div className='follower'></div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 16 }} xl={{ span: 18 }}>
            <div className='right-profile'>
              <Tabs
                defaultActiveKey={listNFTsOwner.length >= listNFTsOnsale.length ? '2' : '1'}
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
                    listNFTs={listNFTsOnsale}
                    isLoadingErc721={isLoadingErc721}
                    onSale={true}
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
                  <div className='list-nft-owner'>
                    <NFTsProfile
                      listNFTs={listNFTsOwner}
                      isLoadingErc721={isLoadingErc721}
                      onSale={false}
                    />
                  </div>
                </TabPane>
                {/* <TabPane
                  tab={
                    <div className='action-profile'>
                      <HistoryOutlined />
                      <strong>Activity</strong>
                    </div>
                  }
                  key='3'
                >
                  <TransactionTable />
                </TabPane> */}
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
