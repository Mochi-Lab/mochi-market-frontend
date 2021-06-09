import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { setChainId, setWeb3, setAddress, setAcceptedNfts } from 'store/actions';
import store from 'store/index';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
      qrcodeModalOptions: {
        mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
      },
      bridge: 'https://bridge.walletconnect.org',
    },
  },
};

const autoAddNetworkBSC = async () => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      // {
      //   chainId: '0x38',
      //   chainName: 'Binance Smart Chain',
      //   nativeCurrency: {
      //     name: 'BNB',
      //     symbol: 'BNB',
      //     decimals: 18,
      //   },
      //   rpcUrls: ['https://bsc-dataseed.binance.org/'],
      //   blockExplorerUrls: ['https://bscscan.com/'],
      // },
      {
        chainId: '0x61',
        chainName: 'BSC-Testnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
      },
    ],
  });
};

export const connectWeb3Modal = async () => {
  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    network: 'binance',
    providerOptions, // required
  });
  autoAddNetworkBSC();
  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);

  let chainId = await web3.eth.net.getId();

  if (chainId === 56 || chainId === 97) {
    let accounts = await web3.eth.getAccounts();

    store.dispatch(setChainId(chainId));
    store.dispatch(setWeb3(web3));

    if (accounts.length > 0) {
      try {
        await axios.post(`${serverUrl}/user/checkin`, {
          address: accounts[0],
        });
      } catch (err) {
      } finally {
        store.dispatch(setAddress(accounts[0]));

        // Init ERC721
        store.dispatch(setAcceptedNfts());
      }
    }
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', async (accounts) => {
    try {
      await axios.post(`${serverUrl}/user/checkin`, {
        address: accounts[0],
      });
    } catch (err) {
    } finally {
      store.dispatch(setAddress(accounts[0]));

      store.dispatch(setAcceptedNfts());
    }
  });

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    chainId = parseInt(web3.utils.hexToNumber(chainId));
    if (chainId === 56 || chainId === 97) {
      store.dispatch(setChainId(chainId));
      store.dispatch(setAcceptedNfts());
      store.dispatch(setWeb3(web3));
    } else {
      alert('Please change to Binance Smart Chain Mainnet or Testnet');
    }
  });

  // Subscribe to provider connection
  provider.on('connect', (info) => {
    console.log(info);
  });

  // Subscribe to provider disconnection
  provider.on('disconnect', (error) => {
    console.log(error);
    store.dispatch(setAddress(null));
  });
};
