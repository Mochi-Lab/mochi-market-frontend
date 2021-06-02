import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Col, Tag } from 'antd';
import { setWeb3, setChainId } from 'store/actions';
import { web3Default, networkDefault, getWeb3List } from 'utils/getWeb3List';

import './index.css';

const { useBreakpoint } = Grid;

export default function LeftNar() {
  const dispatch = useDispatch();
  const [network, setNetwork] = useState(networkDefault);
  const { chainId, web3 } = useSelector((state) => state);

  useEffect(() => {
    if (!!chainId) setNetwork(chainId);
  }, [chainId]);

  useEffect(() => {
    const setWeb3Default = async () => {
      dispatch(setWeb3(getWeb3List(networkDefault).web3Default));
      dispatch(setChainId(networkDefault));
    };
    if (!web3 || !chainId) {
      setWeb3Default();
    }
  }, [web3, chainId, dispatch]);

  const { md } = useBreakpoint();
  return (
    <Col span={md ? 40 : 25} className='alignItems' style={{ paddingLeft: md ? '0px' : '10px' }}>
      <Tag color='success' className='radius-1rem'>
        <div className='box-live-time'>
          <div className='icon-live successDot'></div>
          <span className='time-counter--container'>
            <span>&nbsp;{web3Default[`${network}`].name}</span>
          </span>
        </div>
      </Tag>

      <></>
    </Col>
  );
}
