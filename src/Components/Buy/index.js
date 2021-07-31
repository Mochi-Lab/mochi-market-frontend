import 'Views/DetailNFT/index.scss';
import { useState, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { buyNft, approveToken } from 'store/actions';
import ModalBuy1155 from 'Components/ModalBuy1155';
import { balanceOf, allowance } from 'utils/helper';
import { connectWeb3Modal } from 'Connections/web3Modal';
import { useHistory } from 'react-router';

export default function Buy({
  orderDetail,
  is1155,
  id,
  addressToken,
  statusActions,
  getOwners1155,
}) {
  let history = useHistory();
  const [insufficient, setInsufficient] = useState(false);
  const { balance, chainId, walletAddress, allowanceToken, web3 } = useSelector((state) => state);
  const [approvedToken, setApprovedToken] = useState(false);
  const [Checkout1155, setCheckout1155] = useState(false);
  const dispatch = useDispatch();
  const fetchBalance = useCallback(
    async (order) => {
      if (!order) return;
      if (order.token === '0x0000000000000000000000000000000000000000') {
        setApprovedToken(true);
        if (order.price > balance) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      } else {
        let allowanceToken = await allowance(order.token, walletAddress, chainId, web3);
        let _tokenBal = await balanceOf(order.token, walletAddress, web3);
        if (order.price > web3.utils.fromWei(_tokenBal, 'ether')) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
        if (order.price <= web3.utils.fromWei(allowanceToken)) {
          setApprovedToken(true);
        } else {
          setApprovedToken(false);
        }
      }
    },
    [balance, walletAddress, chainId, web3]
  );

  useEffect(() => {
    if (!!walletAddress && !!orderDetail && !!orderDetail.token) fetchBalance(orderDetail);
  }, [fetchBalance, walletAddress, allowanceToken, orderDetail, chainId, web3]);

  const buy = async (order) => {
    if (!order) return;
    let result = await dispatch(buyNft(order, is1155));
    if (!!result.status && !!result.link) {
      if (!!is1155) {
        await getOwners1155();
      }
      history.push({
        pathname: `/token/${chainId}/${addressToken}/${id}/null`,
      });
    }
  };

  const approve = async () => {
    if (!orderDetail) return;
    await dispatch(approveToken(orderDetail));
  };

  const checkout1155 = async () => {
    setCheckout1155(true);
  };

  return (
    <div className='actions-btn'>
      {!!walletAddress ? (
        <div className='gSzfBw'>
          <ModalBuy1155
            visible={Checkout1155}
            orderDetail={orderDetail}
            buy={buy}
            insufficient={insufficient}
            setCheckout1155={setCheckout1155}
          />
          {approvedToken ? (
            insufficient ? (
              <Button type='primary' disabled shape='round' size='large' className='btn-buy-sell'>
                Insufficient Balance
              </Button>
            ) : (
              <Button
                type='primary'
                shape='round'
                size='large'
                onClick={() => (is1155 ? checkout1155() : buy(orderDetail))}
                className='btn-buy-sell'
              >
                Buy now
              </Button>
            )
          ) : (
            <Button
              type='primary'
              shape='round'
              size='large'
              onClick={approve}
              className='btn-buy-sell'
            >
              Approve
            </Button>
          )}
        </div>
      ) : (
        <div className='gSzfBw'>
          <Button
            type='primary'
            shape='round'
            size='large'
            onClick={connectWeb3Modal}
            className='btn-buy-sell'
          >
            Buy now
          </Button>
        </div>
      )}
    </div>
  );
}
