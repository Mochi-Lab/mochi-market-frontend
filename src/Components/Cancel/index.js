import 'Views/DetailNFT/index.scss';
import { Button } from 'antd';
import { cancelSellOrder } from 'store/actions';
import store from 'store/index';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Cancel({ orderDetail, statusActions }) {
  let history = useHistory();

  const { chainId } = useSelector((state) => state);

  const { addressToken, id } = useParams();

  const cancel = async () => {
    if (orderDetail && orderDetail.sellId) {
      let result = await store.dispatch(cancelSellOrder(orderDetail));
      if (result) {
        history.push({
          pathname: `/token/${chainId}/${addressToken}/${id}/null`,
        });
      }
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
