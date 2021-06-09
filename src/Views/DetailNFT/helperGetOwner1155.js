import { getAllOwnersOf1155 } from 'utils/helper';

export default async function helperGetOwner1155(
  convertErc1155Tokens,
  addressToken,
  id,
  chainId,
  market,
  setTotalSupply,
  setOwners,
  setOwnersOnSale
) {
  let onSaleOfAddressToken = [];
  for (let i = 0; i < convertErc1155Tokens.length; i++) {
    const collection = convertErc1155Tokens[i];
    if (
      collection.addressToken.toLowerCase() === addressToken.toLowerCase() &&
      parseInt(collection.tokenId) === parseInt(id)
    ) {
      onSaleOfAddressToken = collection.tokens;
      break;
    }
  }
  const ownerNoMarket = await getAllOwnersOf1155(addressToken, id, chainId, market._address);
  const totalSupplyNFT = ownerNoMarket.totalSupply;
  setTotalSupply(totalSupplyNFT);

  setOwners(ownerNoMarket.ownersOf1155);
  setOwnersOnSale(onSaleOfAddressToken);
}
