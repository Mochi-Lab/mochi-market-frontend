import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row, Tabs } from 'antd';
import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  ShopOutlined,
  WalletOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import IconCoppy from 'Components/IconCoppy';
import Edit from './Edit';
import backgroundDefault from 'Assets/backgrounds/background-profile.png';
import avatarDefault from 'Assets/avatar-profile.png';
import discord from 'Assets/icons/discord-01.svg';
import youtube from 'Assets/icons/youtube.svg';
import facebook from 'Assets/icons/facebook-01.svg';
import instagram from 'Assets/icons/instagram.svg';
import medium from 'Assets/icons/medium-01.svg';
import titok from 'Assets/icons/tiktok.svg';
import github from 'Assets/icons/github-01.svg';
import twitter from 'Assets/icons/twitter-01.svg';
import telegram from 'Assets/icons/telegram-01.svg';
// import TransactionTable from 'Components/TransactionTable';
import { setInfoUserLogin } from 'store/actions';
import store from 'store/index';
import { getProfileByAddress } from 'APIs/Users/Gets';
import './index.scss';
import { useParams } from 'react-router';
import { selectChain } from 'Connections/web3Modal';
import TabOwner from './TabOwner';
import TabOnSale from './TabOnSale';
import TabAdmins from './TabAdmins';
import { TransactionHistoryByUser } from 'Components/NFTTransactionHistory/TransactionHistoryByUser';
import { Helmet } from 'react-helmet';

const { TabPane } = Tabs;

export default function Profile() {
  const { walletAddress, chainId, infoAdmins } = useSelector((state) => state);

  const [visibleEitdProfile, setvisibleEitdProfile] = useState(false);
  const [infoUser, setInfrUser] = useState({});
  const [showMoreBio, setShowMoreBio] = useState(false);

  const { chainID, address } = useParams();

  // Check chainId in route
  useEffect(() => {
    if (parseInt(chainId) !== parseInt(chainID)) selectChain(chainID, walletAddress);
  }, [walletAddress, chainId, chainID]);

  const getInfoUser = useCallback(async () => {
    let res = await getProfileByAddress(address);
    if (!!res && !!res.user) {
      setInfrUser(res.user);
      if (!!walletAddress && walletAddress.toLowerCase() === address.toLowerCase()) {
        store.dispatch(setInfoUserLogin(res.user));
      }
    } else {
      setInfrUser({});
    }
  }, [address, walletAddress]);

  useEffect(() => {
    getInfoUser();
  }, [getInfoUser, walletAddress]);

  return (
    <>
      <Edit
        open={visibleEitdProfile}
        setvisibleEitdProfile={setvisibleEitdProfile}
        infoUser={infoUser}
        setInfrUser={setInfrUser}
        getInfoUser={getInfoUser}
      />
      <div className='page-profile'>
        {!!address && (
          <Helmet>
            <title>{`User ${
              !!infoUser && !!infoUser.username ? infoUser.username : address
            } - Mochi Market`}</title>
            <meta
              name='description'
              content={`User ${
                !!infoUser && !!infoUser.username ? infoUser.username : address
              } in NFT on Mochi Market - Multi-Chain NFT Market`}
            />
          </Helmet>
        )}
        <Row gutter={[32, 32]}>
          <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 6 }}>
            <div style={{ position: 'relative' }}>
              <div className='left-profile'>
                <div className='info-user'>
                  <div className='background-avatar'>
                    <div className='background-profile'>
                      <img
                        src={!!infoUser && !!infoUser.cover ? infoUser.cover : backgroundDefault}
                        alt='background-profile'
                      />
                    </div>
                    <img
                      src={!!infoUser && !!infoUser.avatar ? infoUser.avatar : avatarDefault}
                      alt='avatar-profile'
                      className='avatar-profile'
                    />
                  </div>
                  <div className='name-user'>
                    <h2 className='textmode'>
                      {!!infoUser && !!infoUser.username ? `@${infoUser.username}` : 'Unnamed'}
                    </h2>
                    <h2> </h2>
                  </div>
                  {!!walletAddress && walletAddress.toLowerCase() === address.toLowerCase() ? (
                    <div className='textmode'>
                      <button
                        className='btn-edit-profile'
                        onClick={() => setvisibleEitdProfile(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
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
                  <div className='bio-info-user textmode'>
                    {!!infoUser.bio ? (
                      infoUser.bio.length > 75 ? (
                        !showMoreBio ? (
                          <>
                            {infoUser.bio.substring(0, 50) + '...'}
                            <span className='show-more-bio' onClick={() => setShowMoreBio(true)}>
                              show more <DoubleRightOutlined />
                            </span>
                          </>
                        ) : (
                          <>
                            {infoUser.bio}
                            <span className='show-more-bio' onClick={() => setShowMoreBio(false)}>
                              <DoubleLeftOutlined /> less
                            </span>
                          </>
                        )
                      ) : (
                        infoUser.bio
                      )
                    ) : (
                      ''
                    )}{' '}
                  </div>

                  <div className='social-profile'>
                    {!!infoUser.twitter ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.twitter}>
                        <img src={twitter} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.telegram ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.telegram}>
                        <img src={telegram} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.discord ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.discord}>
                        <img src={discord} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.youtube ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.youtube}>
                        <img src={youtube} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.facebook ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.facebook}>
                        <img src={facebook} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.instagram ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.instagram}>
                        <img src={instagram} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.github ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.github}>
                        <img src={github} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.medium ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.medium}>
                        <img src={medium} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
                    {!!infoUser.tiktok ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.tiktok}>
                        <img src={titok} alt='icon-link' className='icon-contact' />
                      </a>
                    ) : (
                      ''
                    )}
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
                defaultActiveKey={'2'}
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
                  <TabOnSale address={address} />
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
                    <TabOwner address={address} key='2' />
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <div className='action-profile'>
                      <HistoryOutlined />
                      <strong>History</strong>
                    </div>
                  }
                  key='3'
                >
                  <div className='transaction-history'>
                    <TransactionHistoryByUser chainId={chainID} userAddress={address} />
                  </div>
                </TabPane>
                {!!walletAddress &&
                  walletAddress.toLowerCase() === address.toLowerCase() &&
                  infoAdmins.hasOwnProperty(walletAddress.toString().toLowerCase()) && (
                    <TabPane
                      tab={
                        <div className='action-profile'>
                          <WalletOutlined />
                          <strong>Admins</strong>
                        </div>
                      }
                      key='4'
                    >
                      <div className='list-nft-owner'>
                        <TabAdmins />
                      </div>
                    </TabPane>
                  )}

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
