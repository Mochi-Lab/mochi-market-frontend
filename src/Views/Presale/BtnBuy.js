import { Button } from 'antd';

export default function BtnBuy({ loading, className, buyPresaleNFT, priceNFT, symbolPayment }) {
  return (
    <>
      <Button
        type='primary'
        shape='round'
        className={`${className}`}
        size='large'
        loading={loading}
        onClick={() => buyPresaleNFT()}
      >
        <b> Buy </b> {priceNFT} <strong> {symbolPayment} </strong>
      </Button>
    </>
  );
}
