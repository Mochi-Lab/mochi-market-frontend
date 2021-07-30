import { getAllOwnersOf1155 } from 'utils/helper';

export default async function helperGetOwner1155(
  addressToken,
  id,
  chainId,
  market,
  setTotalSupply,
  setOwners
) {
  const ownerNoMarket = await getAllOwnersOf1155(addressToken, id, chainId, market._address);
  const totalSupplyNFT = ownerNoMarket.totalSupply;
  setTotalSupply(totalSupplyNFT);
  setOwners(ownerNoMarket.ownersOf1155);
}
