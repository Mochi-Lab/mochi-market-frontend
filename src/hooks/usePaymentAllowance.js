import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTokensPayment } from 'utils/getContractAddress';
import { allowance, NATIVE_TOKEN } from 'utils/helper';
export const usePaymentAllowance = () => {
  const { walletAddress, chainId } = useSelector((state) => state);
  const [allowances, setAllowances] = useState(null);
  useEffect(() => {
    const tokensPayment = getTokensPayment(chainId);
    const fetchAllowances = async () => {
      let res = new Map();
      Promise.all(
        tokensPayment.map(async (e) => {
          if (e.address === NATIVE_TOKEN) return;
          let _allowance = await allowance(e.address, walletAddress, chainId);
          res.set(e.address, _allowance);
        })
      );
      setAllowances(res);
    };
    if (walletAddress) {
      fetchAllowances();
    }
  }, [walletAddress, chainId]);
  return allowances;
};
