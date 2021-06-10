import 'Views/DetailNFT/style.css';
import { Button } from 'antd';
import LoadingModal from 'Components/LoadingModal';
import { cancelSellOrder } from 'store/actions';
import store from 'store/index';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
export default function Cancel({ orderDetail, is1155, getOwners1155 }) {
  let history = useHistory();
  const [visible, setVisible] = useState(false);

  const cancel = async () => {
    setVisible(true);
    let result = await store.dispatch(cancelSellOrder(orderDetail));
    if (result) {
      if (!!is1155) {
        await getOwners1155();
      }
      history.push({
        pathname: `/token/${orderDetail.nftAddress}/${orderDetail.tokenId}/null`,
      });
    }
    setVisible(false);
  };

  return (
    <div className='actions-btn'>
      <div className='gSzfBw'>
        <LoadingModal title={'Cancel'} visible={visible} />
        <Button type='primary' shape='round' size='large' onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
