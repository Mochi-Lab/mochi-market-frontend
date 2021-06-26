import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Tabs } from 'antd';
import {
  WalletOutlined,
  ShopOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons';
import NFTsProfile from 'Components/NFTsProfile';
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
import { getNFTsOfOwner, setAvailableSellOrder, setInfoUserLogin } from 'store/actions';
import { getProfileByAddress } from 'APIs/Users/Gets';
import './index.scss';
import { useParams } from 'react-router';

const { TabPane } = Tabs;

export default function Profile() {
  const dispatch = useDispatch();
  const {
    listNFTsOwner,
    listNFTsOnsale,
    isLoadingErc721,
    erc721Instances,
    walletAddress,
  } = useSelector((state) => state);

  const [visibleEitdProfile, setvisibleEitdProfile] = useState(false);
  const [infoUser, setInfrUser] = useState({});
  const [showMoreBio, setShowMoreBio] = useState(false);

  const { address } = useParams();

  const getInfoUser = useCallback(async () => {
    let res = await getProfileByAddress(address);
    if (!!res && !!res.user) {
      setInfrUser(res.user);
      if (!!walletAddress && walletAddress.toLowerCase() === address.toLowerCase()) {
        dispatch(setInfoUserLogin(res.user));
      }
    } else {
      setInfrUser({});
    }
  }, [address, dispatch, walletAddress]);

  useEffect(() => {
    getInfoUser();
  }, [getInfoUser, walletAddress]);

  useEffect(() => {
    if (!!erc721Instances && !!address) {
      dispatch(getNFTsOfOwner(erc721Instances, address));
      dispatch(setAvailableSellOrder(address));
    }
  }, [erc721Instances, address, dispatch]);

  return (
    <>
      <Edit
        visible={visibleEitdProfile}
        setvisibleEitdProfile={setvisibleEitdProfile}
        infoUser={infoUser}
        setInfrUser={setInfrUser}
        getInfoUser={getInfoUser}
      />
      <div className='page-profile'>
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
                      {!!infoUser && !!infoUser.username ? `@${infoUser.username}` : 'Unamed'}
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
                    {!!infoUser.titok ? (
                      <a target='_blank' rel='noreferrer' href={infoUser.titok}>
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
