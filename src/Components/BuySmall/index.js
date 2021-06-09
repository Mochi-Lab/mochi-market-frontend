import 'Views/DetailNFT/style.css';
import { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { buyNft, approveToken } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { balanceOf, allowance } from 'utils/helper';
import { connectWeb3Modal } from 'Connections/web3Modal';
import { useHistory } from 'react-router';

export default function BuySmall({ orderDetail, is1155, id, addressToken }) {
  let history = useHistory();
  const [visibleBuy, setVisibleBuy] = useState(false);
  const [visibleApprove, setVisibleApprove] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const { balance, chainId, walletAddress, allowanceToken } = useSelector((state) => state);
  const [approvedToken, setApprovedToken] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBalance() {
      if (!orderDetail) return;
      if (orderDetail.tokenPayment === '0x0000000000000000000000000000000000000000') {
        setApprovedToken(true);
        if (parseInt(orderDetail.price) * parseInt(orderDetail.amount) > parseInt(balance * 1e18)) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      } else {
        let allowanceToken = await allowance(orderDetail.tokenPayment, walletAddress, chainId);
        let _tokenBal = await balanceOf(orderDetail.tokenPayment, walletAddress);
        if (parseInt(orderDetail.price) * parseInt(orderDetail.amount) > parseInt(_tokenBal)) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
        if (
          parseInt(orderDetail.price) * parseInt(orderDetail.amount) <=
          parseInt(allowanceToken)
        ) {
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
    let result = await dispatch(buyNft(orderDetail, is1155));
    if (!!result.status && !!result.link) {
      history.push({
        pathname: `/token/${addressToken}/${id}/null`,
      });
      openNotification(result.link);
    }

    setVisibleBuy(false);
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
    <>
      {!!walletAddress ? (
        <>
          <LoadingModal title='Buy' visible={visibleBuy} />
          <LoadingModal title='Approve' visible={visibleApprove} />
          {approvedToken ? (
            insufficient ? (
              <Button type='primary' disabled shape='round' size='small'>
                Insufficient
              </Button>
            ) : (
              <Button type='primary' shape='round' size='small' onClick={buy}>
                Buy
              </Button>
            )
          ) : (
            <Button type='primary' shape='round' size='small' onClick={approve}>
              Approve
            </Button>
          )}
        </>
      ) : (
        <>
          <Button type='primary' shape='round' size='small' onClick={connectWeb3Modal}>
            Buy
          </Button>
        </>
      )}
    </>
  );
}
