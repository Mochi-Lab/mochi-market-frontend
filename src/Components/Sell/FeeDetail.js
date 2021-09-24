import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokensPayment } from 'utils/getContractAddress';

// #TODO improve calculate & display decimal value

const prettyPrintFeeLevel = (fee) => {
  const feeFloat = Number.parseFloat((100 * fee[0]) / fee[1]).toFixed(2);
  return feeFloat.replace(/0+$/, '').replace(/\.$/, '') + '%';
};

const FeeDetail = ({ tokenPayment, chainId, sellPrice, sellAmount }) => {
  const { market } = useSelector((state) => state);
  const currency = getTokensPayment(chainId).find((item) => item.address === tokenPayment).symbol;
  const [fee, setFee] = useState(null);
  const [profit, setProfit] = useState(null);

  useEffect(() => {
    setFee(() => null);
    (async () => {
      setFee(await market.methods[currency === 'MOMA' ? 'getMomaFee' : 'getRegularFee']().call());
    })();
  }, [market, tokenPayment, currency]);

  useEffect(() => {
    if ([fee, sellPrice, sellAmount].includes(null)) return;
    setProfit(sellPrice * sellAmount * (1 - fee[0] / fee[1]));
  }, [sellPrice, sellAmount, fee]);

  return fee === null ? null : (
    <div>
      <div>
        <span>Fee {prettyPrintFeeLevel(fee)} </span>
        {[sellPrice, sellAmount].includes(null) ? null : (
          <span>
            / You will get {profit} {currency}
          </span>
        )}
        <div hidden={currency === "MOMA"}>To get lower fee, use MOMA as a payment method</div>
      </div>
    </div>
  );
};

export default FeeDetail;
