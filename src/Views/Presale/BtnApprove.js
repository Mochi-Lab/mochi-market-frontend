import { Button } from 'antd';

export default function BtnApprove({ loadingApprove, className, approveTokenBuy }) {
  return (
    <>
      <Button
        type='primary'
        shape='round'
        className={`${className}`}
        size='large'
        loading={loadingApprove}
        onClick={() => approveTokenBuy()}
      >
        Approve
      </Button>
    </>
  );
}
