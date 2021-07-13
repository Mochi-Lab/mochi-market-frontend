import 'Views/DetailNFT/index.scss';
import { Button } from 'antd';
import { cancelSellOrder } from 'store/actions';
import store from 'store/index';
import { useHistory } from 'react-router-dom';
export default function Cancel({ orderDetail, is1155, getOwners1155, chainId }) {
  let history = useHistory();
  const cancel = async () => {
    let result = await store.dispatch(cancelSellOrder(orderDetail));
    if (result) {
      if (!!is1155) {
        await getOwners1155();
      }
      history.push({
        pathname: `/token/${chainId}/${orderDetail.nftAddress}/${orderDetail.tokenId}/null`,
      });
    }
  };

  return (
    <div className='gSzfBw'>
      <Button shape='round' size='large' onClick={cancel} className='btn-cancel-sell'>
        Cancel
      </Button>
    </div>
  );
}
