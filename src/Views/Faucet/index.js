import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faucetMOMA, checkFaucet } from 'store/actions';
import ConnectWallet from 'Components/ConnectWallet';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import './index.css';

export default function Faucet() {
  const dispatch = useDispatch();
  const { walletAddress } = useSelector((state) => state);
  const [statusFaucet, setStatusFaucet] = useState(true);
  const [loadingFaucet, setLoadingFaucet] = useState(false);

  useEffect(() => {
    const checkStatusFaucet = async () => {
      setStatusFaucet(await dispatch(checkFaucet()));
    };
    checkStatusFaucet();
  });

  const handleFaucetMOMA = async () => {
    setLoadingFaucet(true);
    await dispatch(faucetMOMA());
    setLoadingFaucet(false);
  };

  return (
    <div className='page-faucet'>
      <h1 className='title-page'>
        Faucet <b>MOMA</b> Testnet
      </h1>
      {!!walletAddress ? (
        <>
          <i>(Don't be too greedy! Please try again in at least 5 minutes!)</i>
          <Button
            className='btn-faucet'
            onClick={async () => handleFaucetMOMA()}
            disabled={!statusFaucet}
            loading={loadingFaucet}
          >
            Send me 30 MOMA <ArrowRightOutlined />
          </Button>
        </>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
}
