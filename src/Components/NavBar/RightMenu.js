import { Menu, Grid } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from 'Components/ConnectWallet';
import { useSelector } from 'react-redux';
import avatarDefault from 'Assets/avatar-default.svg';
import ToggleDarkMode from 'Components/ToggleDarkMode';
import LogoutWallet from 'Components/Logout';
import { getContractAddress, getSymbol } from 'utils/getContractAddress';

const SubMenu = Menu.SubMenu;

const { useBreakpoint } = Grid;

const RightMenu = () => {
  const screen = useBreakpoint();
  const { shortAddress, walletAddress, chainId, moma, balance, infoUserLogin } = useSelector(
    (state) => state
  );

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <Menu mode={screen.md && screen.lg ? 'horizontal' : 'inline'}>
      <Menu.Item key='browse'>
        <Link to='/browse'>Browse</Link>
      </Menu.Item>
      <Menu.Item key='/submit-Nfts'>
        <Link to='/submit-Nfts'>Submit NFTs</Link>
      </Menu.Item>
      {!!walletAddress ? (
        <Menu.Item key={`/profile/${walletAddress}`}>
          <Link to={`/profile/${walletAddress}`}>Profile</Link>
        </Menu.Item>
      ) : null}
      {!!getContractAddress(chainId) && chainId === 97 ? (
        <Menu.Item key='/faucet'>
          <Link to='/faucet'>Faucet</Link>
        </Menu.Item>
      ) : null}
      {chainId === 56 && <Menu.Item key='getMOMA'>
        <div className='btn-get-moma center'>
          <a
            href='https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xB72842D6F5feDf91D22d56202802Bb9A79C6322E'
            target='_blank'
            rel='noreferrer'
            style={{ margin: '0px', color: '#ffffff' }}
          >
            <p style={{ margin: '0px', color: '#ffffff' }}> Get $MOMA</p>
          </a>
        </div>
      </Menu.Item>}

      {shortAddress ? (
        <SubMenu
          key='sub1'
          title={
            <div className='balance-create background-mode center'>
              <div style={{ paddingLeft: '2px' }}>
                <div className='center' style={{ display: 'flex' }}>
                  <img
                    className='nav-avatar'
                    src={!!infoUserLogin ? infoUserLogin.avatar : avatarDefault}
                    alt='avatar'
                  />
                  <p
                    className='textmode'
                    style={{ margin: '0px 10px 0px 10px', color: '#4F4F4F', fontWeight: 'normal' }}
                  >
                    {!!getContractAddress(chainId) && getContractAddress(chainId).MOMA.length > 0
                      ? moma.toString().slice(0, 5)
                      : balance.toString().slice(0, 5)}
                  </p>
                  <p className='pink-font' style={{ margin: '0px 5px' }}>
                    {!!getContractAddress(chainId) && getContractAddress(chainId).MOMA.length > 0
                      ? 'MOMA'
                      : getSymbol(chainId)['0x0000000000000000000000000000000000000000']}
                  </p>
                </div>
              </div>
            </div>
          }
        >
          <Menu.Item
            key='setting:4'
            style={{ width: '240px', height: '80px', cursor: 'pointer' }}
            disabled
          >
            <strong>
              <h3 className='nav-textmode'>
                {!!infoUserLogin ? `@${infoUserLogin.username}` : 'Unnamed'}
              </h3>
            </strong>
            <div>
              <div className='address nav-textmode textmode' onClick={() => copyToClipboard()}>
                {shortAddress}
                <span className='icon-coppy' style={{ paddingLeft: '10px' }}>
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
              </div>
            </div>
          </Menu.Item>
          <Menu.Item key='setting:3'>
            <Link to={`/profile/${walletAddress}`}>
              <strong className='nav-textmode'>Profile</strong>
            </Link>
          </Menu.Item>
          <Menu.Item key='setting:2'>
            <LogoutWallet />
          </Menu.Item>
        </SubMenu>
      ) : (
        <Menu.Item key='connect-wallet'>
          <ConnectWallet />
        </Menu.Item>
      )}
      <Menu.Item key='setting:1' disabled>
        <div style={{ cursor: 'pointer' }} className='justifyContent'>
          <div>
            <ToggleDarkMode />
          </div>
        </div>
      </Menu.Item>
    </Menu>
  );
};

export default RightMenu;
