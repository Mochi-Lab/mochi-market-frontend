export default async function helperStatusActions1155(
  availableSellOrder721,
  availableSellOrder1155,
  nftList,
  sellOrderList,
  walletAddress,
  web3,
  sellID,
  setStatus,
  setOrderDetail
) {
  if (web3 && sellOrderList && availableSellOrder721 && nftList) {
    try {
      if (!!walletAddress) {
        const sellOrder = await sellOrderList.methods.getSellOrderById(sellID).call();
        if (sellOrder.seller.toLowerCase() === walletAddress.toLowerCase()) {
          setStatus(3);
        } else {
          setStatus(1);
        }
      } else {
        setStatus(1);
      }
      let fil = availableSellOrder1155.filter((token) => token.sellId === sellID);
      if (!!fil[0]) {
        setOrderDetail({ ...fil[0], tokenPayment: fil[0].token });
      }
    } catch (error) {
      console.log(error);
      // message.error("NFT doesn't exist!");
    }
  }
}
