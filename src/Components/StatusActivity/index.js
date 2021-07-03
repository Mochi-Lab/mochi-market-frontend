import { notification } from 'antd';
import { LoadingOutlined, CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getRootExplorer } from 'utils/getRootExplorer';
import './index.scss';

export default function StatusActivity() {
  const { activity, chainId } = useSelector((state) => state);

  const openNotification = useCallback(
    ({ key, status, title, duration, txHash }) => {
      if (status === 'close') {
        notification.close(key);
      } else {
        notification.open({
          key,
          duration: duration,
          message: <h2>{title}</h2>,
          description: !!txHash ? (
            <span>
              Details transaction{' '}
              <a href={`${getRootExplorer(chainId)}/tx/${txHash}`} target='_blank' rel='noreferrer'>
                here
              </a>
            </span>
          ) : (
            <></>
          ),
          placement: 'bottomRight',
          className: 'pending-actions',
          icon: <TypeStaus status={status} />,
        });
        if (!!duration && duration > 0) {
          setTimeout(() => {
            notification.close(key);
          }, duration);
        }
      }
    },
    [chainId]
  );

  useEffect(() => {
    if (!!activity) openNotification(activity);
  }, [activity, openNotification]);

  return <></>;
}

const TypeStaus = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <div className='center' style={{ marginRight: '15px' }}>
          <LoadingOutlined className='textmode' style={{ fontSize: '31px' }} />
        </div>
      );
    case 'success':
      return <CheckCircleTwoTone twoToneColor='#52c41a' />;
    case 'error':
      return <CloseCircleOutlined className='error-status' />;
    default:
      return <div></div>;
  }
};
