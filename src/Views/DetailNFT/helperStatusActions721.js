import { getSellerByNft, getSellOrderBySellId } from 'APIs/SellOrder/Gets';
import ERC721 from 'Contracts/ERC721.json';

export default async function helperStatusActions721(
  addressToken,
  id,
  chainId,
  walletAddress,
  web3,
  setStatus,
  setOwners,
  setOwnersOnSale,
  setOrderDetail,
  history,
  sellID
) {
  if (!!web3 && !!chainId && !!history) {
    try {
      const erc721Instances = await new web3.eth.Contract(ERC721.abi, addressToken);
      let tokenOwner;
      if (sellID === 'null') {
        tokenOwner = await erc721Instances.methods.ownerOf(id).call();
        setOwners([{ owner: tokenOwner, totalSupply: 1, value: 1 }]);
        let seller = await getSellerByNft(chainId, addressToken, id);
        setOwnersOnSale(seller.sellOrders);
        if (!!walletAddress && walletAddress.toLowerCase() === tokenOwner.toLowerCase()) {
          setStatus(2);
        } else {
          setStatus(0);
        }
      } else {
        // check if user is owner of token
        const order = await getSellOrderBySellId(chainId, sellID);
        if (order.isActive) {
          tokenOwner = order.seller;
          setOwners([{ owner: tokenOwner, totalSupply: 1, value: 1 }]);
          setOwnersOnSale([
            {
              seller: tokenOwner,
              totalSupply: 1,
              value: 1,
              price: order.price,
              token: order.token,
              sellId: order.sellId,
              amount: order.amount,
            },
          ]);
          setOrderDetail({ ...order, tokenPayment: order.token });
          if (!!walletAddress && walletAddress.toLowerCase() === tokenOwner.toLowerCase()) {
            setStatus(3);
          } else {
            setStatus(1);
          }
        } else {
          return history.push('/404');
        }
      }

      // let isSelling;

      // if (!!walletAddress) {
      //   isSelling = await sellOrderList.methods
      //     .checkDuplicateERC721(addressToken, id, walletAddress)
      //     .call();
      // }

      // if (walletAddress && isSelling) {
      //   setStatus(3);
      // } else if (walletAddress && tokenOwner.toLowerCase() === walletAddress.toLowerCase()) {
      //   // Check if the token is in the order list?
      //   let isOnList = await sellOrderList.methods
      //     .checkDuplicateERC721(addressToken, id, tokenOwner)
      //     .call();
      //   isOnList ? setStatus(3) : setStatus(2);
      // } else {
      //   let isOnList = await sellOrderList.methods
      //     .checkDuplicateERC721(addressToken, id, tokenOwner)
      //     .call();

      //   isOnList || tokenOwner === market._address ? setStatus(1) : setStatus(0);
      // }
    } catch (error) {
      console.log(error);
      history.push('/404');
    }
  }
}
