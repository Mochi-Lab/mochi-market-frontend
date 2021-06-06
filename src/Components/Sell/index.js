import 'Views/DetailNFT/style.css';
import { Button, InputNumber, Modal, Form, Input, Select } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createSellOrder } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from 'Components/LoadingModal';
import { getTokensPayment } from 'utils/getContractAddress';

import './index.css';

const { Option } = Select;

export default function Sell({ token, is1155 }) {
  const dispatch = useDispatch();

  const { web3, chainId } = useSelector((state) => state);

  const { addressToken, id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tokenPayment, setTokenPayment] = useState();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment(getTokensPayment(chainId)[0].address);
    }
  }, [chainId]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onSubmit = useCallback(
    async (values) => {
      if (parseFloat(values.price) > 0) {
        setVisible(true);
        const result = await dispatch(
          createSellOrder(
            addressToken,
            id,
            web3.utils.toWei(values.price.toString(), 'ether'),
            tokenPayment,
            is1155
          )
        );
        if (!!result) {
          setIsModalVisible(false);
        }
        setVisible(false);
      }
    },
    [dispatch, addressToken, id, web3.utils, tokenPayment, is1155]
  );

  const handleOk = async () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className='gSzfBw'>
        <LoadingModal title={'Sell'} visible={visible} />
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
          <Button key='sell' type='primary' shape='round' size='large' onClick={() => handleOk()}>
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
        <Form onFinish={onSubmit} form={form} className='input-sell'>
          <Input.Group compact>
            <Select size='large' value={tokenPayment} onChange={(value) => setTokenPayment(value)}>
              {!!getTokensPayment(chainId)
                ? getTokensPayment(chainId).map((token, i) => {
                    return (
                      <Option value={token.address} key={i}>
                        <img className='bnb-coin' src={token.icon} alt={token.symbol} />
                      </Option>
                    );
                  })
                : null}
            </Select>

            <Form.Item name={['price']} rules={[{ required: true, message: 'Enter price' }]}>
              <InputNumber
                min='0'
                size='large'
                className='search-style'
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: 250 }}
                placeholder='Set Price'
              />
            </Form.Item>
          </Input.Group>
        </Form>
      </Modal>
    </>
  );
}
