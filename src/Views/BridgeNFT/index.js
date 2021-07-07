import { Input, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.scss';
import imgDefault from 'Assets/banners/Twitter-cover-size-02-02.png';
import imgBinance from 'Assets/binance-coin.svg';
import swapList from 'Assets/images/swap-list.jpg';
import arrow from 'Assets/images/arrow.png';

const { TabPane } = Tabs;

export default function BridgeNFT() {
  const switchTab = (key) => {};

  const onChangeAddress = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className='bridge-nft'>
      <div className='container-standard'>
        <div className='title-page'>
          <h1>
            MOCHI MARKET
            <span className='circle'>
              <img src={arrow} className='up' alt='arrow up' />
              <img src={arrow} className='down' alt='arrow down' />
            </span>
          </h1>
        </div>
        <div className='desciption-page'>
          <h3>NFT NETWORK SWAP</h3>
        </div>
        <div className='content-bridge'>
          <div className='content-bridge-left'>
            <div className='header-tabs'>
              <Tabs defaultActiveKey='1' onChange={switchTab}>
                <TabPane tab='ERC 721' key='1'>
                  <div className='list-nft-owner'>
                    <div className='item-nft'>
                      <img src={imgDefault} alt='img-nft' />
                      <div className='name-id'>
                        <p className='textmode'>Symbol: Moma </p>
                        <p className='textmode'>Name: MOchi MArket</p>
                      </div>
                    </div>
                  </div>
                </TabPane>

                <TabPane tab='ERC 1155' key='2'>
                  <div className='list-nft-owner'>
                    <div className='item-nft'>
                      <img src={imgDefault} alt='img-nft' />
                      <div className='name-id'>
                        <p className='textmode'>Symbol: Moma </p>
                        <p className='textmode'>Name: MOchi MArket</p>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>

            <div className='search-nft'>
              <Input
                placeholder='Name or contract address'
                suffix={<SearchOutlined />}
                className='input-search-nfts search-input'
              ></Input>
            </div>
          </div>
          <div className='content-bridge-right'>
            <div className='area-swap'>
              <div className='title-are-swap'>
                <div className='title-from'>
                  <p className='textmode'>From</p>
                </div>
                <div className='title-to'>
                  <p className='textmode'>To</p>
                </div>
              </div>
              <div className='area-swap-content'>
                <div className='from-wallet-connect'>
                  <div className='connection-wallet'>
                    <img src={imgBinance} alt='logo-wallet' />
                    <div className='name-address'>
                      <div className='textmode'>Binance Smart Chain</div>
                      <div className='textmode text-blur'>0x69d4...4353884</div>
                    </div>
                  </div>
                </div>
                <div className='icon-arrow-right'>
                  <svg
                    width='51'
                    height='34'
                    viewBox='0 0 51 34'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M0 12H29.6842V2.43786C29.6842 2.2665 29.8856 2.17449 30.0152 2.28669L47 17L30.0152 31.7133C29.8856 31.8255 29.6842 31.7335 29.6842 31.5621V22H0'
                      stroke='white'
                      strokeWidth='4'
                    />
                  </svg>
                </div>
                <div className='to-wallet-connect'>
                  <div className='connection-wallet'>
                    <img src={imgBinance} alt='logo-wallet' />
                    <div className='name-address'>
                      <div className='textmode'>Binance Smart Chain</div>
                      <div className='textmode text-blur'>0x69d4...4353884</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='eth-address'>
                <p>ethereum address</p>
                <Input allowClear onChange={onChangeAddress} />
              </div>
            </div>
          </div>
        </div>
        <div className='swap-list'>
          <img src={swapList} alt='swap list' />
          <p>swap list</p>
        </div>
      </div>
    </div>
  );
}
