import { getContractAddress } from 'utils/getContractAddress';
import axios from 'axios';
const Web3 = require('web3');
const ERC20 = require('Contracts/ERC20.json');

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

export async function listTokensERC721OfOwner(addressToken, walletAddress) {
  const result = await axios.post(
    'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-bsc',
    {
      query: `{
        owner(
          id:"${walletAddress}"
        ){
            tokens(where:{contract :"${addressToken}"}){
              tokenID
              tokenURI
            }
          }
        }`,
    }
  );

  return result.data && result.data.data.owner ? result.data.data.owner.tokens : [];
}

export async function listTokensERC115OfOwner(addressToken, walletAddress) {
  const result = await axios.post(
    'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-bsc',
    {
      query: `{
        owner(
          id:"${walletAddress}"
        ){
            tokens(where:{contract :"${addressToken}"}){
              tokenID
              tokenURI
            }
          }
        }`,
    }
  );

  return result.data && result.data.data.owner ? result.data.data.owner.tokens : [];
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
