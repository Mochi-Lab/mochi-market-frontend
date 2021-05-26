import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTokensPayment } from 'utils/getContractAddress';
import { balanceOf, NATIVE_TOKEN } from 'utils/helper';
export const usePaymentBalance = () => {
  const { walletAddress, chainId, balance } = useSelector((state) => state);
  const [balances, setBalances] = useState(null);
  useEffect(() => {
    const tokensPayment = getTokensPayment(chainId);
    const fetchAllowances = async () => {
      let res = new Map();
      Promise.all(
        tokensPayment.map(async (e) => {
          if (e.address === NATIVE_TOKEN) {
            res.set(e.address, balance * 1e18);
          } else {
            let _balance = await balanceOf(e.address, walletAddress, chainId);
            res.set(e.address, parseInt(_balance));
          }
        })
      );
      setBalances(res);
    };
    if (walletAddress) {
      fetchAllowances();
    }
  }, [walletAddress, chainId, balance]);
  return balances;
};
