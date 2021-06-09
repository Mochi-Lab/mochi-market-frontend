import { useState } from 'react';
import { Button, Modal } from 'antd';
import { connectWeb3Modal } from 'Connections/web3Modal';
import { useSelector } from 'react-redux';
import MetaMaskLogo from 'Assets/metamask.svg';
import './index.css';

export default function ConnectWallet() {
  const { walletAddress } = useSelector((state) => state);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const connect = async () => {
    await connectWeb3Modal();
    setIsModalVisible(false);
  };
  return (
    <>
      {!walletAddress ? (
        <Button className='pink-font bt-cnlo' shape='round' onClick={showModal}>
          <div className='center'>
            Connect Wallet
            <div className='error-dot' />
          </div>
        </Button>
      ) : null}
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className='center wallet' onClick={() => connect()}>
          <img className='wallet-logo' src={MetaMaskLogo} alt='Metamask' />
          <p className='wallet-name textmode'>MetaMask</p>
          <p className='wallet-description textmode'>Connect to your MetaMask Wallet</p>
        </div>
      </Modal>
    </>
  );
}
