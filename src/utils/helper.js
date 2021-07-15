import { getContractAddress } from 'utils/getContractAddress';
import { getUrlSubgraph } from 'utils/getUrlsSubgraph';
const Web3 = require('web3');
const ERC20 = require('Contracts/ERC20.json');
const axios = require('axios');

export function parseBalance(_balanceWei, _decimals) {
  if (!_balanceWei) {
    return 0;
  }
  if (!_decimals) {
    _decimals = 18;
  }
  _decimals = parseInt(_decimals);
  let afterDecimal;
  const weiString = _balanceWei.toString();
  const trailingZeros = /0+$/u;

  const beforeDecimal =
    weiString.length > _decimals ? weiString.slice(0, weiString.length - _decimals) : '0';
  afterDecimal = ('0'.repeat(_decimals) + _balanceWei).slice(-_decimals).replace(trailingZeros, '');
  if (afterDecimal === '') {
    afterDecimal = '0';
  } else if (afterDecimal.length > 3) {
    afterDecimal = afterDecimal.slice(0, 3);
  }
  return parseFloat(`${beforeDecimal}.${afterDecimal}`);
}

export function convertTimestampToDate(timestamp) {
  var months_arr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  // Convert timestamp to milliseconds
  var date = new Date(timestamp * 1000);
  // Year
  var year = date.getFullYear();
  // Month
  var month = months_arr[date.getMonth()];
  // Day
  var day = date.getDate();
  // Hours
  var hours = date.getHours();
  // Minutes
  var minutes = date.getMinutes() + 1;

  // Display date time in MM-dd-yyyy h:m:s format
  var convdataTime = `${year !== new Date().getFullYear() ? year : ''} ${month} ${
    day < 10 ? '0' + day : day
  }, ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes} `;

  return convdataTime;
}

export const balanceOf = async (tokenAddress, walletAddress) => {
  const web3 = new Web3(window.ethereum);
  let balance;
  const erc20 = new web3.eth.Contract(ERC20.abi, tokenAddress);
  balance = await erc20.methods.balanceOf(walletAddress).call();
  return balance;
};

export const allowance = async (tokenAddress, walletAddress, chainId) => {
  const web3 = new Web3(window.ethereum);
  const instaneErc20 = new web3.eth.Contract(ERC20.abi, tokenAddress);
  const contractAddress = getContractAddress(chainId);
  let allowance = await instaneErc20.methods
    .allowance(walletAddress, contractAddress.Market)
    .call();
  return allowance;
};

export async function listERC721OfOwner(token, walletAddress, addressMarket) {
  try {
    const logs = await token
      .getPastEvents('Transfer', { fromBlock: 1000000 })
      .then((events) => events);

    const owned = new Set();
    const onSale = new Set();
    for (const log of logs) {
      const { from, to, tokenId } = log.returnValues;
      if (to.toLowerCase() === walletAddress.toLowerCase()) {
        owned.add(tokenId.toString());
      } else if (from.toLowerCase() === walletAddress.toLowerCase()) {
        owned.delete(tokenId.toString());
        if (
          from.toLowerCase() === walletAddress.toLowerCase() &&
          to.toLowerCase() === addressMarket.toLowerCase()
        ) {
          onSale.add(tokenId.toString());
        }
      }

      if (
        (owned.has(tokenId.toString()) && onSale.has(tokenId.toString())) ||
        (from.toLowerCase() === addressMarket.toLowerCase() &&
          to.toLowerCase() !== walletAddress.toLowerCase())
      ) {
        onSale.delete(tokenId.toString());
      }
    }
    return { owned: [...owned], onSale: [...onSale] };
  } catch (error) {
    return { owned: [], onSale: [] };
  }
}

export async function listTokensERC721OfOwner(listAddressAccept, walletAddress, chainId) {
  let strListAddressAccept = listAddressAccept.map((address) => `"${address}"`).join(',');
  const url = getUrlSubgraph(chainId);
  const result = await axios.post(url.url721, {
    query: `{
        owner(
          id:"${walletAddress.toLowerCase()}"
        ){
            tokens (where:{contract_in : [${strListAddressAccept}]}){
              tokenID
              tokenURI
              contract {
                id
                name
                symbol
              }
            }
          }
        }`,
  });

  let list721Raw = result.data && result.data.data.owner ? result.data.data.owner.tokens : [];
  let list721 = list721Raw.map(function (nft) {
    return {
      addressToken: nft.contract.id,
      symbol: nft.contract.symbol,
      collections: nft.contract.name,
      index: nft.tokenID,
      tokenURI: nft.tokenURI,
      is1155: false,
    };
  });
  return list721;
}

export async function listTokensERC115OfOwner(listAddressAccept, walletAddress, chainId) {
  const url = getUrlSubgraph(chainId);
  if (url.url1155.length > 0) {
    const result = await axios.post(url.url1155, {
      query: `{
        account(
          id:"${walletAddress.toLowerCase()}"
        ){
          balances(where: {value_gt: 0}){
            token{
              id
              registry {
                id
              }
              identifier
              totalSupply
            }
            value
            }
          }
        }`,
    });

    let list1155Raw = (result.data && result.data.data.account
      ? result.data.data.account.balances
      : []
    ).filter(function (e) {
      return this.indexOf(e.token.registry.id) > 0;
    }, listAddressAccept);

    let list1155 = Promise.all(
      list1155Raw.map(async (nft) => {
        return {
          addressToken: nft.token.registry.id,
          index: nft.token.identifier,
          value: nft.value,
          totalSupply: nft.token.totalSupply,
          is1155: true,
        };
      })
    );

    return list1155;
  } else return [];
}

export async function getAllOwnersOf1155(tokenAddress, tokenId, chainId, addressMarket) {
  if (!!chainId) {
    const url = getUrlSubgraph(chainId);
    if (url.url1155.length > 0) {
      const result = await axios.post(url.url1155, {
        query: `{
          tokens(where: {registry : "${tokenAddress.toLowerCase()}", identifier: "${tokenId}"}) {
            balances(where: {value_gt: 0, account_not: "${addressMarket.toLowerCase()}"}){
              account {
                id
              }
              value
              }
              totalSupply
            }
          }`,
      });

      let ownersOf1155Raw =
        !!result.data && !!result.data.data.tokens && !!result.data.data.tokens[0]
          ? result.data.data.tokens[0].balances
          : [];
      const totalSupply =
        !!result.data && !!result.data.data.tokens && !!result.data.data.tokens[0]
          ? result.data.data.tokens[0].totalSupply
          : 0;

      let ownersOf1155 = await Promise.all(
        ownersOf1155Raw.map(async (nft) => {
          return {
            owner: nft.account.id,
            value: nft.value,
            totalSupply,
          };
        })
      );

      let addressOwnersOf1155 = {};
      ownersOf1155Raw.forEach(async (nft) => (addressOwnersOf1155[nft.account.id] = nft.value));

      return { ownersOf1155, addressOwnersOf1155, totalSupply };
    }
  }
  return { ownersOf1155: [], addressOwnersOf1155: {}, totalSupply: 0 };
}

export async function newMintOf721(tokenAddress, chainId) {
  if (!!chainId) {
    const url = getUrlSubgraph(chainId);
    if (url.url721.length > 0) {
      const result = await axios.post(url.url721, {
        query: `{
          tokens(where: { contract: "${tokenAddress.toLowerCase()}"}, orderBy:mintTime, orderDirection: desc, first:10){
              contract {
                id
              }
              tokenID
              mintTime
            }
          }`,
      });

      let nftsOf721Raw = !!result.data && !!result.data.data.tokens ? result.data.data.tokens : [];

      let nftsOf721 = await Promise.all(
        nftsOf721Raw.map(async (nft) => {
          return {
            addressToken: nft.contract.id,
            symbol: nft.contract.symbol,
            collections: nft.contract.name,
            index: nft.tokenID,
            tokenURI: nft.tokenURI,
            is1155: false,
          };
        })
      );
      return nftsOf721;
    }
  }
  return [];
}

export async function newMintOf1155(tokenAddress, chainId) {
  const url = getUrlSubgraph(chainId);
  if (url.url1155.length > 0) {
    const result = await axios.post(url.url1155, {
      query: `{
        tokens(where :{
          registry: "${tokenAddress.toLowerCase()}"}
          orderBy: identifier,
          orderDirection:desc,
          first:10){
            id
            registry {
              id
            }
            identifier
            totalSupply
          }
        }`,
    });
    let list1155Raw =
      result.data && result.data.data && result.data.data.tokens ? result.data.data.tokens : [];
    let list1155 = Promise.all(
      list1155Raw.map(async (nft) => {
        return {
          addressToken: nft.registry.id,
          index: nft.identifier,
          totalSupply: nft.totalSupply,
          is1155: true,
        };
      })
    );
    return list1155;
  } else return [];
}

export const checkUrl = (url) => {
  // eslint-disable-next-line
  let regexCheckUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regexCheckUrl.test(url);
};

export const handleChildClick = (e) => {
  e.preventDefault();
};
