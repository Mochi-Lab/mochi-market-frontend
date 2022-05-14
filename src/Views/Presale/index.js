import { useEffect, useState } from 'react';
import { selectChain } from 'Connections/web3Modal';
import { useParams } from 'react-router';
import {
  fetchWhiteList,
  buyPresale,
  checkIsWhitelisted,
  approveERC20,
  getAllowanceERC20,
  getBalanceOfERC20,
  getPriceNFT,
  checkBought,
  getTimeStart,
  getSaleAmount,
  getSoldAmount
} from './actions';
import {
  setStatusActivity,
} from 'store/actions';
import store from 'store/index';
import './index.scss';
import { useSelector } from 'react-redux';
import IconLoading from 'Components/IconLoading';
import StatusPresale from './StatusPresale';
import { Table, Input, Button } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import { getContractAddress, getTokenPayment } from './getContract';
import BtnBuy from './BtnBuy';
import BtnApprove from './BtnApprove';
import PreSaleCombo from './ABI/PreSaleCombo.json';
import Whitelist from './ABI/Whitelist.json';
import ERC20 from 'Contracts/ERC20.json';
import banner from 'Assets/banners/banner-bmw.jpg';
import logoBMW from 'Assets/icons/bmw.png';
import bmwCombo from 'Assets/items/bmw-combo.png';
import bmwWarrior from 'Assets/items/bmw-box-warrior.png';
import bmwItemPVE from 'Assets/items/bmw-box-magic-item-pve.png';
import bmwItemPVP from 'Assets/items/bmw-box-magic-item-pvp.png';


const columns = [
  {
    align: "center",
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

export default function Presale() {
  const { walletAddress, loadingCampaign, web3, chainId } = useSelector(
    (state) => state
  );

  const timeEnd = 1638062039;

  const { chainID } = useParams();
  useEffect(() => {
    if (parseInt(chainId) !== parseInt(chainID)) selectChain(chainID, walletAddress);
  }, [walletAddress, chainId, chainID]);


  const [loadingBuyNFT, setLoadingBuyNFT] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDataWhitelist, setLoadingDataWhitelist] = useState(false);
  const [whitelist, setWhitelist] = useState([]);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [bought, setBought] = useState(false);
  const [whitelistInstance, setWhitelistInstance] = useState();
  const [presaleInstance, setPresaleInstance] = useState();
  const [tokenBuyInstance, setTokenBuyInstance] = useState();
  const [allowance, setAllowance] = useState(0);
  const [balanceTokenBuy, setBalanceTokenBuy] = useState(0);
  const [priceNFT, setPriceNFT] = useState(0);
  const [timeStart, setTimeStart] = useState();
  const [symbolPayment, setSymbolPayment] = useState();
  const [saleAmount, setSaleAmount] = useState(0);
  const [soldAmount, setSoldAmount] = useState(0);

  useEffect(() => {
    async function initData() {
      let instanceWhiteList = whitelistInstance;
      let instancePresale = presaleInstance;
      let instanceTokenBuy = tokenBuyInstance;
      let symbol = getTokenPayment(chainId);
      if (!!web3 && !!chainId && !whitelistInstance) {
        var contractAddress = getContractAddress(chainId);
        symbol = getTokenPayment(chainId);
        instanceWhiteList = new web3.eth.Contract(Whitelist, contractAddress.Whitelist);
        instancePresale = new web3.eth.Contract(PreSaleCombo, contractAddress.PreSaleCombo);
        instanceTokenBuy = new web3.eth.Contract(ERC20.abi, contractAddress.TokenBuy);
        setWhitelistInstance(instanceWhiteList);
        setPresaleInstance(instancePresale);
        setTokenBuyInstance(instanceTokenBuy);
      }
      setSymbolPayment(!!symbol && symbol.Symbol)
      setLoadingDataWhitelist(true);
      setWhitelist(await fetchWhiteList(whitelistInstance));
      setLoadingDataWhitelist(false);
      setTimeStart(await getTimeStart(web3, instancePresale))
      setSaleAmount(await getSaleAmount(instancePresale))
      setSoldAmount(await getSoldAmount(instancePresale))
      if (!!walletAddress) {
        setAllowance(await getAllowanceERC20(instanceTokenBuy, walletAddress, instancePresale))
        setBalanceTokenBuy(await getBalanceOfERC20(instanceTokenBuy, walletAddress))
        setPriceNFT(await getPriceNFT(instancePresale, instanceTokenBuy))
        setIsWhitelisted(await checkIsWhitelisted(instanceWhiteList, walletAddress));
        setBought(await checkBought(instancePresale, walletAddress));
      }
    }
    initData();
  }, [web3, walletAddress, chainId]);

  const buyPresaleNFT = async () => {
    setLoadingBuyNFT(true);
    let result = await buyPresale(web3, chainId, PreSaleCombo, getContractAddress, walletAddress, tokenBuyInstance, store, setStatusActivity);
    if (result) {
      setBalanceTokenBuy(await getBalanceOfERC20(tokenBuyInstance, walletAddress))
      setBought(await checkBought(presaleInstance, walletAddress));
    }
    setLoadingBuyNFT(false);
  };

  const approveTokenBuy = async () => {
    setLoadingApprove(true);
    let result = await approveERC20(web3, chainId, ERC20, getContractAddress, walletAddress, presaleInstance, store, setStatusActivity);
    if (result) {
      setAllowance(await getAllowanceERC20(tokenBuyInstance, walletAddress, presaleInstance))
    }
    setLoadingApprove(false);
  };

  const counterDays = (timeEnd) => {
    if (Math.floor(Date.now() / 1000) >= timeEnd) {
      return 0;
    }
    const oneDay = 24 * 60 * 60; // hours*minutes*seconds
    const oneHour = 60 * 60; // minutes*seconds
    const oneMinutes = 60; // 60 seconds
    const timeStart = Math.floor(Date.now() / 1000);

    if (timeEnd - timeStart < oneHour) {
      const diffMinutes = Math.round(Math.abs((timeEnd - timeStart) / oneMinutes));
      return `${diffMinutes < 10 ? '0' + diffMinutes : diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'
        }`;
    }

    if (timeEnd - timeStart < oneDay) {
      const diffHours = Math.round(Math.abs((timeEnd - timeStart) / oneHour));
      return `${diffHours < 10 ? '0' + diffHours : diffHours} ${diffHours === 1 ? 'hour' : 'hours'
        }`;
    }
    const diffDays = Math.round(Math.abs((timeEnd - timeStart) / oneDay));
    return `${diffDays < 10 ? '0' + diffDays : diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  };

  const filterWhiteList = async (input) => {
    setLoadingDataWhitelist(true);
    if (!!input.target.value) {
      let listFilter = whitelist.filter((e, i) => e.address.toLowerCase().includes(input.target.value.toLowerCase()))
      setWhitelist(listFilter);
    } else {
      setWhitelist(await fetchWhiteList(whitelistInstance));
    }
    setLoadingDataWhitelist(false);
  };

  return (
    <div className='page-airdrops'>
      {loadingCampaign ? (
        <div className='center loading'>
          <IconLoading />
        </div>
      ) : (
        <></>
      )}
      <h1 className='title-airdrop textmode fontRubik title-pad'>Presale NFT</h1>
      <div className="banner-airdrop">
      </div>
      <div className='list-airdrop background-airdrop-mode'>
        <div className='show-campaigns'>
          <div
            className='banner-airdrop-nearest'
            style={{ animation: `1s ease 0s 1 normal none running fadein` }}
          >
            <img
              src={banner}
              className='banner-campaign'
              alt='banner-campaign'
            />
            <div className='description-short'>
              <div
                className='description-short-left'
              >
                <div className='icon-token'>
                  <img
                    src={logoBMW}
                    className='img-loaded'
                    alt='airdrop-img'
                  />

                  <span className='airdrop-badge red css-vurnku'>
                    <span>LIVE</span>
                  </span>
                </div>
                <div className='description-text'>
                  <div className='title-text-airdop'>Battle of Multi Worlds</div>
                  <div className='description-text-airdop'>
                    BMW presale nft with price discount</div>
                </div>
              </div>
              <StatusPresale
                counterDays={counterDays}
                timeStart={timeStart}
                timeEnd={timeEnd}
              />
            </div>
          </div>
          <div className='airdrop-card'>
            <div className='content-presale'>
              <div className='description-text-presale'>
                <div className='description-text-presale'>
                  Battle of Multi Worlds (BMW) is a NFT game which is built on Binance Smart Chain platform in which it supports players in controlling their digital property to join the game.
                  Players can use their characters to defeat Monsters in their world, compete in PvP mode, take part in conquering the other worlds and join different tournaments.
                  Players receive rewards as BMW tokens in these play modes. In addition, players can own a range of items in the game by shopping in the game shop or collecting while defeating Monsters.
                  All the NFTs in the game use Standard ERC-721 which allows freely exchanging in the normal NFT market.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="area-image-items">

          <div className="total-sale">
            <h2 className="textmode">Total Sale: {saleAmount}</h2>
          </div>
          <div className="area-combo-box box-nft">
            <img
              src={bmwCombo}
              className='image-combo-box'
              alt='image-combo-box'
            />
            <label className="title-box">Combo Box</label>
          </div>

          <div className="area-btn-presale">
            {
              // check button approve
              !!isWhitelisted && allowance <= 0 && !!timeStart && <BtnApprove
                allowance={allowance}
                approveTokenBuy={approveTokenBuy}
                loadingApprove={loadingApprove}
                className='btn-buy-presale'
              />
            }
            {
              // check button buy
              !!isWhitelisted && allowance > 0 && balanceTokenBuy >= priceNFT && !bought && !!timeStart && <BtnBuy
                buyPresaleNFT={buyPresaleNFT}
                loading={loadingBuyNFT}
                className='btn-buy-presale'
                priceNFT={web3.utils.fromWei(priceNFT.toString(), 'ether')}
                symbolPayment={symbolPayment}
              />
            }
            {
              // check button balanceOf
              !!isWhitelisted && allowance > 0 && balanceTokenBuy < priceNFT && !!timeStart && <Button
                type='primary' disabled shape='round' size='large'
                className="btn-buy-presale"
                size='large'
              >
                Insufficient {web3.utils.fromWei(priceNFT.toString(), 'ether')} {symbolPayment}
              </Button>
            }
            {
              // check button bought
              !!isWhitelisted && allowance > 0 && balanceTokenBuy >= priceNFT && !!bought && !!timeStart && <Button
                type='primary' disabled shape='round' size='large'
                className="btn-buy-presale"
                size='large'
              >
                Bought
              </Button>
            }
          </div>
          <div className="icon-down">
            <ArrowDownOutlined />
          </div>
          <div className="info-sold">
            <h2 className="textmode">
              Sold: {soldAmount}   &ensp;-&ensp;  Remain: {saleAmount - soldAmount}
            </h2>
          </div>
          <div className="area-items">
            <div className="box-nft">
              <img
                src={bmwWarrior}
                className='image-box'
                alt='image-box-warrior'
              />
              <label className="title-box">Character Box</label>
            </div>
            <div className="box-nft">
              <img
                src={bmwItemPVE}
                className='image-box'
                alt='image-box-item-pve'
              />
              <label className="title-box">Elixir Box</label>
            </div>
            <div className="box-nft">
              <img
                src={bmwItemPVP}
                className='image-box'
                alt='image-item-pvp'
              />
              <label className="title-box">Magical Weapon Box</label>
            </div>
          </div>
        </div>

        <div className="area-whitelist">
          <h1 className="title-whitelist">Whitelist</h1>
          <Input.Search allowClear className="search-whitelist" placeholder="Address" size="large" onChange={(e) => filterWhiteList(e)} />
          <Table dataSource={whitelist} columns={columns} scroll={{ x: 600, y: 1000 }} size="small" className="table-whitelist" loading={loadingDataWhitelist} />
        </div>
      </div>
    </div>
  );
}
