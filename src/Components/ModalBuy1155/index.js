import { InputNumber, Modal, Form, Input, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSymbol } from 'utils/getContractAddress';
import { balanceOf } from 'utils/helper';
import './index.css';

export default function ModalBuy1155({ visible, orderDetail, buy, setCheckout1155 }) {
  const { web3, chainId, balance, walletAddress } = useSelector((state) => state);
  const [form] = Form.useForm();
  const [totalPayment, setTotalPayment] = useState(
    parseFloat(web3.utils.fromWei(orderDetail.price, 'ether'))
  );
  const [amount, setAmount] = useState(1);
  const [insufficient, setInsufficient] = useState(false);

  const fetchBalance = useCallback(
    async (order) => {
      if (!order) return;
      if (order.tokenPayment === '0x0000000000000000000000000000000000000000') {
        if (order.price > parseInt(balance * 1e18)) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      } else {
        let _tokenBal = await balanceOf(order.tokenPayment, walletAddress);
        if (order.price > parseInt(_tokenBal)) {
          setInsufficient(true);
        } else {
          setInsufficient(false);
        }
      }
    },
    [balance, walletAddress]
  );

  useEffect(() => {
    if (!!walletAddress)
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
    setTotalPayment(parseInt(value) * parseFloat(web3.utils.fromWei(orderDetail.price, 'ether')));
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
      visible={visible}
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
              parseInt(orderDetail.amount) - parseInt(orderDetail.soldAmount)
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
              suffix={getSymbol(chainId)[orderDetail.tokenPayment]}
            />
          </Form.Item>
        </Input.Group>
      </Form>
    </Modal>
  );
}
