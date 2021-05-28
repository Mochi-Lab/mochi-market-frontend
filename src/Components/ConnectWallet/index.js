import { Button } from 'antd';
import { connectWeb3Modal } from 'Connections/web3Modal';
import { useSelector } from 'react-redux';

export default function ConnectWallet() {
  const { walletAddress } = useSelector((state) => state);

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
