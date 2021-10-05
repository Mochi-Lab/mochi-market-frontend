import { Button } from 'antd';
import { connectWeb3Modal, CONNECTID } from 'Connections/web3Modal';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ConnectWallet() {
  const { walletAddress, chainId } = useSelector((state) => state);

  useEffect(() => {
    if (localStorage.getItem(CONNECTID)) {
      connectWeb3Modal();
    }
  }, [chainId]);

  const connect = () => {
    connectWeb3Modal();
  };

  return (
    <>
      {!walletAddress ? (
        <Button className='pink-font bt-cnlo' shape='round' onClick={() => connect()}>
          <div className='center'>
            Connect Wallet
            <div className='error-dot' />
          </div>
        </Button>
      ) : null}
    </>
  );
}
