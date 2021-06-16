import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { setChainId, setWeb3, setAddress, setAcceptedNfts } from 'store/actions';
import store from 'store/index';
import { getWeb3List } from 'utils/getWeb3List';

const rpcSupport = {
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  56: 'https://bsc-dataseed.binance.org/',
  137: 'https://rpc-mainnet.maticvigil.com/',
  1666600000: 'https://api.harmony.one',
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: rpcSupport,
      qrcodeModalOptions: {
        mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
      },
      bridge: 'https://bridge.walletconnect.org',
    },
  },
};

const paramsSwitchNetwork = {
  137: [
    {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
      blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com/'],
    },
  ],
  56: [
    {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/'],
    },
  ],
  97: [
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
  1666600000: [
    {
      chainId: '0x63564C40',
      chainName: 'Harmony Mainnet',
      nativeCurrency: {
        name: 'ONE',
        symbol: 'ONE',
        decimals: 18,
      },
      rpcUrls: ['https://api.harmony.one'],
      blockExplorerUrls: ['https://explorer.pops.one/#/'],
    },
  ],
};

export const selectChain = async (chainId, walletAddress) => {
  if (!!walletAddress) {
    injectNetworkNoEthereum(chainId);
  }
  await store.dispatch(setChainId(chainId));
  await store.dispatch(setAcceptedNfts());
  await store.dispatch(setWeb3(getWeb3List(chainId).web3Default));
};

export const injectNetworkNoEthereum = async (chainId) => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: paramsSwitchNetwork[chainId],
  });
};

export const connectWeb3Modal = async () => {
  const { chainId } = store.getState();

  injectNetworkNoEthereum(chainId);

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  });

  const provider = await web3Modal.connect();

  const web3 = new Web3(provider);

  let chainID = await web3.eth.net.getId();

  if (!!rpcSupport[chainID]) {
    let accounts = await web3.eth.getAccounts();

    store.dispatch(setChainId(chainID));
    store.dispatch(setWeb3(web3));

    if (accounts.length > 0) {
      store.dispatch(setAddress(accounts[0]));
      // Init ERC721
      store.dispatch(setAcceptedNfts());
    }
  } else {
    alert('Market does not support this network');
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', async (accounts) => {
    store.dispatch(setAddress(accounts[0]));
    store.dispatch(setAcceptedNfts());
  });

  // Subscribe to chainID change
  provider.on('chainChanged', (chainID) => {
    chainID = parseInt(web3.utils.hexToNumber(chainID));
    if (!!rpcSupport[chainID]) {
      store.dispatch(setChainId(chainID));
      store.dispatch(setAcceptedNfts());
      store.dispatch(setWeb3(web3));
    } else {
      alert('Market does not support this network');
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
