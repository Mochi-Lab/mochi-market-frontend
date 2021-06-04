import { notification, Button } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Notification() {
  const { noti } = useSelector((state) => state);

  const openError = (message) => {
    notification.error({
      message: 'Transaction Error',
      description: message,
    });
  };

  const openSuccess = (message) => {
    notification.success({
      message: 'Message',
      description: message,
    });
  };

  const openSuccessRedirect = (message, fn) => {
    notification.success({
      message: 'Message',
      description: (
        <div>
          <p>{message}</p>
          <Button onClick={fn}>Go to Inventory</Button>
        </div>
      ),
    });
  };

  useEffect(() => {
    const showNotification = (noti) => {
      switch (noti.type) {
        case 'error':
          openError(noti.message);
          break;
        case 'success':
          openSuccess(noti.message);
          break;
        case 'redirect-profile':
          openSuccessRedirect(noti.message, noti.fn);
          break;
        default:
          console.log(noti.type);
      }
    };
    if (!!noti) showNotification(noti);
  }, [noti]);

  return <></>;
}
