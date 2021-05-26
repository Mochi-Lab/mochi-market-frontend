import 'Views/DetailNFT/style.css';
import { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { buyNft, approveToken } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { usePaymentAllowance } from 'hooks/usePaymentAllowance';
import { usePaymentBalance } from 'hooks/usePaymentBalance';
import { NATIVE_TOKEN } from 'utils/helper';
import { getTokensPayment } from 'utils/getContractAddress';

export default function Buy({ orderDetail }) {
  const [visibleBuy, setVisibleBuy] = useState(false);
  const [visibleApprove, setVisibleApprove] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const [approvedToken, setApprovedToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const { chainId } = useSelector((state) => state);
  const allowances = usePaymentAllowance();
  const balances = usePaymentBalance();
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBalance() {
      if (balances && balances.size === getTokensPayment(chainId).length) {
        setLoading(false);
      }
      if (!orderDetail || !allowances || !balances) return;
      if (parseInt(orderDetail.price) > balances.get(orderDetail.token)) {
        setInsufficient(true);
      } else {
        setInsufficient(false);
      }
      if (orderDetail.token === NATIVE_TOKEN) {
        setApprovedToken(true);
      } else {
        if (parseInt(orderDetail.price) <= allowances.get(orderDetail.token)) {
          setApprovedToken(true);
        } else {
          setApprovedToken(false);
        }
      }
    }
    fetchBalance();
  }, [allowances, balances, orderDetail, chainId]);

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
      <div className='gSzfBw'>
        <LoadingModal title='Buy' visible={visibleBuy} />
        <LoadingModal title='Approve' visible={visibleApprove} />
        {approvedToken ? (
          insufficient ? (
            <Button type='primary' disabled shape='round' size='large' loading={loading}>
              Insufficient Balance
            </Button>
          ) : (
            <Button type='primary' shape='round' size='large' onClick={buy} loading={loading}>
              Buy now
            </Button>
          )
        ) : (
          <Button type='primary' shape='round' size='large' onClick={approve} loading={loading}>
            Approve
          </Button>
        )}
      </div>
    </div>
  );
}
