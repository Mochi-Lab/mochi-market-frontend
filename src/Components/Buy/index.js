import 'Views/DetailNFT/style.css';
import { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { buyNft, approveToken } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { balanceOf, allowance } from 'utils/helper';
import { connectWeb3Modal } from 'Connections/web3Modal';

export default function Buy({ orderDetail }) {
  const [visibleBuy, setVisibleBuy] = useState(false);
  const [visibleApprove, setVisibleApprove] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const { balance, chainId, walletAddress, allowanceToken } = useSelector((state) => state);
  const [approvedToken, setApprovedToken] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBalance() {
      if (!orderDetail) return;
      if (orderDetail.token === '0x0000000000000000000000000000000000000000') {
        setApprovedToken(true);
        if (parseInt(orderDetail.price) > parseInt(balance * 1e18)) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      } else {
        let allowanceToken = await allowance(orderDetail.token, walletAddress, chainId);
        let _tokenBal = await balanceOf(orderDetail.token, walletAddress);
        if (parseInt(orderDetail.price) > parseInt(_tokenBal)) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
        if (parseInt(orderDetail.price) <= parseInt(allowanceToken)) {
          setApprovedToken(true);
        } else {
          setApprovedToken(false);
        }
      }
    }
    if (!!walletAddress) fetchBalance();
  }, [orderDetail, balance, allowanceToken, walletAddress, chainId]);

  const buy = async () => {
    if (!orderDetail) return;
    setVisibleBuy(true);
    let link = await dispatch(buyNft(orderDetail));
    setVisibleBuy(false);
    if (!!link) openNotification(link);
  };

  const approve = async () => {
    if (!orderDetail) return;
    setVisibleApprove(true);
    await dispatch(approveToken(orderDetail))
      .then(() => {
        setVisibleApprove(false);
      })
      .catch((e) => {
        setVisibleApprove(false);
      });
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
      {!!walletAddress ? (
        <div className='gSzfBw'>
          <LoadingModal title='Buy' visible={visibleBuy} />
          <LoadingModal title='Approve' visible={visibleApprove} />
          {approvedToken ? (
            insufficient ? (
              <Button type='primary' disabled shape='round' size='large'>
                Insufficient Balance
              </Button>
            ) : (
              <Button type='primary' shape='round' size='large' onClick={buy}>
                Buy now
              </Button>
            )
          ) : (
            <Button type='primary' shape='round' size='large' onClick={approve}>
              Approve
            </Button>
          )}
        </div>
      ) : (
        <div className='gSzfBw'>
          <Button type='primary' shape='round' size='large' onClick={connectWeb3Modal}>
            Buy now
          </Button>
        </div>
      )}
    </div>
  );
}
