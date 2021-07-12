export default async function helperStatusActions1155Order(
  availableSellOrder721,
  availableSellOrder1155,
  nftList,
  sellOrderList,
  walletAddress,
  web3,
  sellID,
  setStatus,
  setOrderDetail,
  history
) {
  if (web3 && sellOrderList && availableSellOrder721 && nftList) {
    try {
      const sellOrder = await sellOrderList.methods.getSellOrderById(sellID).call();
      if (sellOrder.isActive) {
        if (!!walletAddress) {
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
      } else {
        history.push('/404');
      }
    } catch (error) {
      console.log(error);
      // message.error("NFT doesn't exist!");
      history.push('/404');
    }
  }
}
