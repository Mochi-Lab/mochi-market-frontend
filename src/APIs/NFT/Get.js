import axios from 'axios';

export const getDetailNFT = async (chainId, addressToken, tokenId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/nft/${chainId}/${addressToken}/${tokenId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getMochiGraphListNFTs = async (chainId, addressToken, skip = 0, page = 20, type = 'erc721', subendpoint = 'owner') => {
  const subendpoints = {
      owner: 'byOwner',
      new: 'newlyCreated'
  }

  let result = await axios
    .get(
      `${process.env.REACT_APP_NFT_DATA}/${chainId}/${type}/${subendpoints[subendpoint]}/${addressToken}?skip=${skip}&limit=${page}`
    )
    .then(async function (response) {
      type = type.toLowerCase();
      if (!['erc721', 'erc1155'].includes(type)) return [];
      let listRaw = response.data || [];
      let listNfts = [];
      await Promise.all(
        listRaw.map(async (e) => {
          e.contract_address = e.Address;
          e.token_id = e.TokenID;
          let nft = await getDetailNFT(chainId, e.contract_address, e.token_id);
          if (!nft.name || nft.name === 'Unnamed') nft.name = 'ID: ' + e.token_id;
          nft['is1155'] = type === 'erc1155';
          if (type === 'erc1155') {
            nft['value'] = e.Balance;
            nft['totalSupply'] = e.Supply;
          }
          listNfts.push(nft);
        })
      );
      return listNfts;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
