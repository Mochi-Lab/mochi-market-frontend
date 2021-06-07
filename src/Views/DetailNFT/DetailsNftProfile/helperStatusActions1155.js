import { getAllOwnersOf1155 } from 'utils/helper';

export default async function helperStatusActions1155(
  walletAddress,
  setStatus,
  addressToken,
  id,
  chainId
) {
  if (!!chainId && !!id && !!addressToken) {
    try {
      if (!!walletAddress) {
        let addressOwnersOf1155 = (await getAllOwnersOf1155(addressToken, id, chainId, ''))
          .addressOwnersOf1155;
        if (!!addressOwnersOf1155[walletAddress.toLowerCase()]) {
          setStatus(2);
        } else {
          setStatus(0);
        }
      } else {
        setStatus(0);
      }
    } catch (error) {
      console.log(error);
      // message.error("NFT doesn't exist!");
    }
  }
}
