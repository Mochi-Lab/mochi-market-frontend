import { Modal, Button, } from 'antd';
import { useEffect, useState } from 'react';
import { PUT_SELL_ORDER_TIME, PUT_SELL_ORDER_WARNING_TIME, MINIMUM_SELL_PRICE_IN_MOMA } from 'Constants';
import { getTokensPayment } from 'utils/getContractAddress';

const SellConfirmModal = ({
    itemName,
    onCancel,
    onConfirm,
    chainId,
    form,
    tokenPayment,
    transactionInProgress,
    is1155
}) => {

    const { price, amount } = form.getFieldValue();
    const currency = getTokensPayment(chainId).find((item) => item.address === tokenPayment).symbol
    const hasWarning = currency === 'MOMA' && price <= MINIMUM_SELL_PRICE_IN_MOMA;
    const [state, setState] = useState({
        timeLeft: hasWarning ? PUT_SELL_ORDER_WARNING_TIME : PUT_SELL_ORDER_TIME,
        intervalId: 0
    });

    useEffect(() => {
        const _intervalId = setInterval(() => {
            setState(state => ({
                ...state,
                timeLeft: state.timeLeft - 1
            }))
        }, 1000);
        setState(state => ({
            ...state,
            intervalId: _intervalId
        }))
        return () => {
            clearInterval(_intervalId);
        }
    }, [])

    useEffect(() => {
        if(state.timeLeft > 0) return;
        clearInterval(state.intervalId);
    }, [state]);
    
    return (
        <Modal
            maskClosable={false}
            closable={false}
            visible={true}
            centered
            title={<h3 className='textmode mgb-0'>Selling <b>{itemName}</b></h3>}
            footer={[
                <Button key='cancel' shape='round' size='large' onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    loading={transactionInProgress}
                    disabled={state.timeLeft > 0}
                    key='sell'
                    type='primary'
                    shape='round'
                    size='large'
                    onClick={onConfirm}
                >
                    { `Confirm ${state.timeLeft > 0 ? `(${state.timeLeft})` : ''}` }
                </Button>,
            ]}
        >
            <span className='textmode text-base'>
                Price: <span className="text-eb2f96">{price} {currency}</span><br/>
                {
                    is1155 && (
                        <>
                            Amount: <span className="text-eb2f96">{amount}</span><br/>
                        </>
                    )
                }
                {
                    hasWarning && (
                        <span><br/>Please make sure this is <b>NOT</b> a mistake !</span>
                    )
                }
            </span>
        </Modal>
    )
}

export default SellConfirmModal;
