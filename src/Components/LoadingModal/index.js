import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export default function LoadingModal({ title, visible }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title={
        <p className='textmode mgb-0' style={{ fontSize: '28px', fontWeight: '900' }}>
          Pending
        </p>
      }
      visible={isModalVisible}
      footer={<div />}
      centered
      width={300}
      onCancel={handleCancel}
    >
      <div style={{ display: 'flex' }}>
        <div className='center' style={{ marginRight: '15px' }}>
          <LoadingOutlined className='textmode' style={{ fontSize: '31px' }} />
        </div>
        <div>
          <p className='textmode mgb-0' style={{ fontSize: '20px', fontWeight: '900' }}>
            {title}
          </p>
          <p
            className='textmode mgb-0'
            style={{
              color: 'rgba(4, 4, 5, 0.5)',
              fontSize: 'inherit',
            }}
          >
            Please wait for a second
          </p>
        </div>
      </div>
    </Modal>
  );
}
