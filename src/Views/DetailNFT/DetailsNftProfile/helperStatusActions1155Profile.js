import { getSellerByNft } from 'APIs/SellOrder/Gets';
import { getAvailableToken1155OfOwner } from 'utils/helper';

export default async function helperStatusActions1155Profile(
  walletAddress,
  setStatus,
  addressToken,
  id,
  chainId,
  setOwnersOnSale,
  setAvailable,
  setOrderDetail
) {
  if (!!chainId && !!id && !!addressToken) {
    setOrderDetail(null);
    try {
      if (!!walletAddress) {
        let availableToken = await getAvailableToken1155OfOwner(
          walletAddress,
          addressToken,
          id,
          chainId
        );
        setAvailable(availableToken.balance);
        let seller = await getSellerByNft(chainId, addressToken, id);
        setOwnersOnSale(seller.sellOrders);
        if (availableToken.balance > 0) {
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
