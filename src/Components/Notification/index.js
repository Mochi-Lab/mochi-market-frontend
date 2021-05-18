import { notification } from 'antd';
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

  useEffect(() => {
    const showNotification = (noti) => {
      if (noti.type === 'error') openError(noti.message);
      else openSuccess(noti.message);
    };
    if (!!noti) showNotification(noti);
  }, [noti]);

  return <></>;
}
