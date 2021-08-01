import 'Views/DetailNFT/index.scss';
import { Button, InputNumber, Modal, Form, Input, Select, Col, Row } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createSellOrder } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getTokensPayment } from 'utils/getContractAddress';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import './index.scss';

const { Option } = Select;

export default function Sell({ token, is1155, available, statusActions }) {
  const dispatch = useDispatch();
  let history = useHistory();

  const { web3, chainId } = useSelector((state) => state);

  const { addressToken, id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tokenPayment, setTokenPayment] = useState();
  const [transactionInProgress, setTransactionInProgress] = useState();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment(getTokensPayment(chainId)[0].address);
    }
  }, [chainId]);

  const showModal = () => {
    setIsModalVisible(true);
    setTransactionInProgress(false);
  };

  const handleOk = useCallback(async () => {
    const values = await form.validateFields();
    if (!!values && parseFloat(values.price) > 0) {
      const result = await dispatch(
        createSellOrder(
          addressToken,
          id,
          web3.utils.toWei(values.price.toString(), 'ether'),
          tokenPayment,
          !!values.amount ? values.amount : 1,
          is1155
        )
      );
      if (!!result.status) {
        setIsModalVisible(false);
        history.push({
          pathname: `/token/${chainId}/${addressToken}/${id}/${result.sellId}`,
        });
      }
    }
  }, [dispatch, addressToken, id, web3.utils, tokenPayment, is1155, history, form, chainId]);

  const confirmSell = useCallback(async () => {
    const values = await form.validateFields();
    if (!!values && parseFloat(values.price) > 0) {
      let currency = getTokensPayment(chainId).find((item) => item.address === tokenPayment);
      currency = currency ? currency.symbol : 'MOMA';
      Modal.confirm({
        title: 'Confirm placing sell order?',
        icon: <ExclamationCircleOutlined />,
        content: `You're going to create a sell order for ${values.price} ${currency}. Are you sure?`,
        okText: 'Sell',
        okButtonProps: { className: 'ant-btn ant-btn-primary ant-btn-round ant-btn-lg' },
        cancelButtonProps: {
          className: 'ant-btn ant-btn-round ant-btn-lg',
          disabled: transactionInProgress,
        },
        onOk() {
          setTransactionInProgress(true);
          return handleOk();
        },
        onCancel() {},
      });
    }
  }, [chainId, handleOk, form, tokenPayment, transactionInProgress]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkAmount = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Enter amount'));
    } else if (parseInt(value) > parseInt(available)) {
      return Promise.reject(new Error('Not enough amount'));
    } else {
      return Promise.resolve();
    }
  };

  return (
    <>
      <div className='gSzfBw'>
        <Button type='primary' shape='round' size='large' onClick={showModal}>
          Sell
        </Button>
      </div>

      <Modal
        title={<h3 className='textmode mgb-0'>Sell order</h3>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' shape='round' size='large' onClick={() => handleCancel()}>
            Cancel
          </Button>,
          <Button
            key='sell'
            type='primary'
            shape='round'
            size='large'
            onClick={() => confirmSell()}
          >
            Sell
          </Button>,
        ]}
      >
        <div className='sell-img'>
          <img alt='img-nft' src={token.image} />
          <p className='textmode'>{token.name}</p>
        </div>
        <div className='price-des'>
          <p className='textmode'>Price</p>

          <p className='textmode'>Will be on sale until you transfer this item or cancel it.</p>
        </div>
        <Form form={form} className='input-sell' layout='vertical'>
          <Row gutter={[5, 10]}>
            <Col xs={{ span: 24 }} md={{ span: is1155 ? 17 : 24 }}>
              <div className='ant-col ant-form-item-label'>
                <label htmlFor='price' className='ant-form-item-required' title='Price'>
                  Price
                </label>
              </div>
              <Input.Group compact label='Price'>
                <Select
                  size='large'
                  value={tokenPayment}
                  onChange={(value) => setTokenPayment(value)}
                  style={{ width: '40%' }}
                >
                  {!!getTokensPayment(chainId)
                    ? getTokensPayment(chainId).map((token, i) => {
                        return (
                          <Option value={token.address} key={i}>
                            <img
                              className='icon-tokenpayment'
                              src={token.icon}
                              alt={token.symbol}
                            />
                            <span className='textmode pl-1'>{token.symbol}</span>
                          </Option>
                        );
                      })
                    : null}
                </Select>
                <Form.Item
                  name={['price']}
                  rules={[{ required: true, message: 'Enter price' }]}
                  style={{ width: '60%' }}
                >
                  <InputNumber
                    min='0.1'
                    size='large'
                    className='search-style'
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder='Set Price'
                  />
                </Form.Item>
              </Input.Group>
            </Col>
            {is1155 ? (
              <Col xs={{ span: 24 }} md={{ span: 7 }}>
                <Input.Group>
                  <Form.Item
                    required
                    name={['amount']}
                    rules={[{ validator: checkAmount }]}
                    label={
                      <span
                        className='cursor-pointer'
                        onClick={() => form.setFieldsValue({ amount: parseInt(available) })}
                      >
                        Amount: {available}
                      </span>
                    }
                    className='input-amount-sell textmode'
                  >
                    <InputNumber
                      min='1'
                      size='large'
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder='Amount'
                      className='textmode'
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
}
