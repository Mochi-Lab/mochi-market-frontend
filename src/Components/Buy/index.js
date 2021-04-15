import 'Views/DetailNFT/style.css';
import { useState } from 'react';
import { Button, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { buyNft } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';

export default function Buy({ orderDetail }) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const buy = async () => {
    setVisible(true);
    let link = await dispatch(buyNft(orderDetail));
    setVisible(false);
    if (!!link) openNotification(link);
  };

  const openNotification = (link) => {
    notification.open({
      message: 'Successfully purchased',
      description: (
        <div>
          Great !! This NFT is your now. Check transaction :
          <a target='_blank' style={{ marginLeft: '5px' }} rel='noopener noreferrer' href={link}>
            View
          </a>
        </div>
      ),
      duration: 6,
    });
  };

  return (
    <div className='actions-btn'>
      <div className='gSzfBw'>
        <LoadingModal title='Buy' visible={visible} />
        <Button type='primary' shape='round' size='large' onClick={buy}>
          Buy now
        </Button>
      </div>
    </div>
  );
}
