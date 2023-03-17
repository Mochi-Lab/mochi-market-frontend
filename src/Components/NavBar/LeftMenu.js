import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Grid, Col, Menu, Dropdown } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { setWeb3, setChainId, getCoingeckoPrices } from 'store/actions';
import store from 'store/index';
import { networkDefault, getWeb3List } from 'utils/getWeb3List';
import { getInfoChain, listChainsSupport } from 'utils/getContractAddress';
import { selectChain } from 'Connections/web3Modal';
import imgNotFound from 'Assets/notfound.png';

import './index.scss';

const { useBreakpoint } = Grid;

export default function LeftNar() {
  let history = useHistory();
  let matchRouteToken = useRouteMatch('/token/:chainID/:addressToken/:id/:sellID');
  let matchRouteCollection = useRouteMatch('/collection/:chainID/:addressToken');
  let matchRouteProfile = useRouteMatch('/profile/:chainID/:address');

  const { chainId, web3, walletAddress } = useSelector((state) => state);
  const [infoChain, setInfoChain] = useState(getInfoChain(chainId));

  useEffect(() => {
    if (!!chainId) {
      setInfoChain(getInfoChain(chainId));
    }
  }, [chainId]);

  useEffect(() => {
    if (!!chainId) store.dispatch(getCoingeckoPrices());
  }, [chainId]);

  useEffect(() => {
    const setWeb3Default = async () => {
      await store.dispatch(setWeb3(getWeb3List(networkDefault).web3Default));
      await store.dispatch(setChainId(networkDefault));
    };
    if (!web3 || !chainId) {
      setWeb3Default();
    }
  }, [web3, chainId]);

  const switchNetworks = async (chainId) => {
    if (!!matchRouteToken || !!matchRouteCollection || matchRouteProfile) {
      history.push('/');
    }
    await selectChain(chainId, walletAddress);
    window.location.reload();
  };

  const { md } = useBreakpoint();
  const items = listChainsSupport.map((info, i) => ({
    label: info.name,
    key: i,
    className: 'textMode',
    onClick: () => switchNetworks(info.chainId),
  }));

  return (
    <Col span={md ? 40 : 25}>
      <Dropdown placement='bottom' menu={{ items }} trigger={['click']}>
        <div className='dropdown_network_header' onClick={(e) => e.preventDefault()}>
          <div className='flex flex-max'>
            <img
              className='sidebar-menu-network-icon'
              alt='icon-chain'
              src={!!infoChain ? infoChain.icon : imgNotFound}
            />
            <div className='sidebar-menu-network-label textmode'>
              {!!infoChain ? infoChain.name : 'Unnamed'}
            </div>
            <CaretDownOutlined className='textmode ml-5' />
          </div>
        </div>
      </Dropdown>
    </Col>
  );
}
