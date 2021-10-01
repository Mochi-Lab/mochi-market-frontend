import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokensPayment } from 'utils/getContractAddress';
import _ from 'lodash';
// #TODO improve calculate & display decimal value

const prettyPrintFeeLevel = (fee) => {
  const feeFloat = Number.parseFloat((100 * fee[0]) / fee[1]).toFixed(2);
  return feeFloat.replace(/0+$/, '').replace(/\.$/, '') + '%';
};

const updatePaymentToken = (setTokenPayment, chainId, currency) => {
  const tokenInfo = getTokensPayment(chainId).find((item) => item.symbol === currency);
  if (tokenInfo === undefined) return;
  setTokenPayment(tokenInfo.address);
};

const FeeDetail = ({ tokenPayment, setTokenPayment, chainId, sellPrice, sellAmount, prices }) => {
  const { market } = useSelector((state) => state);
  const currency = getTokensPayment(chainId).find((item) => item.address === tokenPayment).symbol;
  const [fee, setFee] = useState(null);
  const [profit, setProfit] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  useEffect(() => {
    if(!profit || !prices || !prices[currency.toLowerCase()]) return;
    let calcPrice = profit * prices[currency.toLowerCase()]['usd']
    calcPrice = calcPrice.toFixed(2);
    setCalculatedPrice(calcPrice)
  }, [chainId, prices, profit, currency]);

  useEffect(() => {
    setFee(() => null);
    (async () => {
      setFee(await market.methods[currency === 'MOMA' ? 'getMomaFee' : 'getRegularFee']().call());
    })();
  }, [market, tokenPayment, currency]);

  useEffect(() => {
    if ([fee, sellPrice, sellAmount].includes(null)) return;
    const profit = sellPrice * sellAmount * (1 - fee[0] / fee[1]);
    const _profit = _.trimEnd(profit.toFixed(4), '0');
    setProfit(_profit.replace(/\.$/, ''));
  }, [sellPrice, sellAmount, fee, prices]);

  return fee === null ? null : (
    <div className='textmode'>
      Fee {prettyPrintFeeLevel(fee)}
      {[sellPrice, sellAmount].includes(null) ? null : (
          <>
            <span> | You will get {profit} {currency}</span>
            <span hidden={!calculatedPrice}> | ~{calculatedPrice}$</span>
          </>
      )}
      <div hidden={currency === 'MOMA'}>
        <span
          onClick={() => {
            updatePaymentToken(setTokenPayment, chainId, 'MOMA');
          }}
          className='use-moma'
        >
          Use MOMA{' '}
        </span>
        as a payment method to get lower fee
      </div>
    </div>
  );
};

export default FeeDetail;
