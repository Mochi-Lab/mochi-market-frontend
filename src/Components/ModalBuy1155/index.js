import { InputNumber, Modal, Form, Input, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSymbol } from 'utils/getContractAddress';
import { balanceOf } from 'utils/helper';
import './index.scss';

export default function ModalBuy1155({ visible, orderDetail, buy, setCheckout1155 }) {
  const { chainId, balance, walletAddress, web3 } = useSelector((state) => state);
  const [form] = Form.useForm();
  const [totalPayment, setTotalPayment] = useState(
    !!orderDetail ? parseFloat(orderDetail.price) : 0
  );
  const [amount, setAmount] = useState(1);
  const [insufficient, setInsufficient] = useState(false);

  const fetchBalance = useCallback(
    async (order) => {
      if (!order) return;
      if (order.token === '0x0000000000000000000000000000000000000000') {
        if (order.price > balance) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      } else {
        let _tokenBal = await balanceOf(order.token, walletAddress, web3);
        if (order.price > web3.utils.fromWei(_tokenBal, 'ether')) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      }
    },
    [balance, walletAddress, web3]
  );

  useEffect(() => {
    if (!!walletAddress && !!orderDetail && !!orderDetail.token)
      fetchBalance({
        ...orderDetail,
        amount,
        price: parseInt(amount) * parseFloat(orderDetail.price),
      });
  }, [fetchBalance, balance, orderDetail, walletAddress, amount]);

  const handleCancel = () => {
    setCheckout1155(false);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!!values && values.amount >= 1) {
      buy({ ...orderDetail, amount: values.amount });
    }
  };

  const handleChangeAmout = (value) => {
    value = !value ? 1 : value;
    setAmount(value);
    fetchBalance({
      ...orderDetail,
      amount: value,
      price: parseInt(value) * parseFloat(orderDetail.price),
    });
    setTotalPayment(parseInt(value) * parseFloat(orderDetail.price));
  };

  const checkAmount = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Enter amount'));
    } else if (parseInt(value) > parseInt(orderDetail.amount) - parseInt(orderDetail.soldAmount)) {
      return Promise.reject(new Error('Amount greater available'));
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Modal
      title={
        <p className='textmode mgb-0' style={{ fontSize: '28px', fontWeight: '900' }}>
          Checkout
        </p>
      }
      open={visible}
      footer={[
        <Button key='cancel' shape='round' size='large' onClick={() => handleCancel()}>
          Cancel
        </Button>,
        !insufficient ? (
          <Button
            key='payment'
            type='primary'
            shape='round'
            size='large'
            onClick={() => handleOk()}
          >
            Payment
          </Button>
        ) : (
          <Button key='insufficient' type='primary' shape='round' size='large' disabled>
            Insufficient
          </Button>
        ),
      ]}
      centered
      width={450}
      onCancel={handleCancel}
    >
      <p className='textmode mgb-0' style={{ fontSize: '14px', fontWeight: '900' }}>
        Choose the amount of order you want to buy
      </p>
      <Form form={form} className='input-checkout-1155' layout='vertical'>
        <Input.Group>
          <Form.Item
            required
            name={['amount']}
            rules={[{ validator: checkAmount }]}
            label={`Enter amount. ${
              !!orderDetail ? parseInt(orderDetail.amount) - parseInt(orderDetail.soldAmount) : 0
            } available`}
            className='input-amount-checkout1155'
          >
            <InputNumber
              min='1'
              size='large'
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={handleChangeAmout}
              placeholder='Amount'
            />
          </Form.Item>
        </Input.Group>
        <Input.Group>
          <Form.Item label='Total payment'>
            <Input
              disabled
              size='large'
              value={`${totalPayment}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              suffix={!!orderDetail ? getSymbol(chainId)[orderDetail.tokenPayment] : 'MOMA'}
            />
          </Form.Item>
        </Input.Group>
      </Form>
    </Modal>
  );
}
