import 'Views/DetailNFT/style.css';
import { Button } from 'antd';
import { cancelSellOrder } from 'store/actions';
import store from 'store/index';
import { useHistory } from 'react-router-dom';
export default function Cancel({ orderDetail, is1155, getOwners1155 }) {
  let history = useHistory();
  const cancel = async () => {
    let result = await store.dispatch(cancelSellOrder(orderDetail));
    if (result) {
      if (!!is1155) {
        await getOwners1155();
      }
      history.push({
        pathname: `/token/${orderDetail.nftAddress}/${orderDetail.tokenId}/null`,
      });
    }
  };

  return (
    <div className='actions-btn'>
      <div className='gSzfBw'>
        <Button type='primary' shape='round' size='large' onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
