import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from 'Components/NavBar';
import IconLoading from 'Components/IconLoading';
import { setAvailableSellOrder, setBalance, setMomaBalance } from 'store/actions';
import store from 'store/index';

import { lazy, Suspense, useEffect } from 'react';
import './App.scss';
import Notification from 'Components/Notification';
import StatusActivity from 'Components/StatusActivity';
import useInterval from 'utils/useInterval';
import { useSelector } from 'react-redux';

const Home = lazy(() => import('Views/Home'));
const Profile = lazy(() => import('Views/Profile'));
const DetailNFT = lazy(() => import('Views/DetailNFT'));
const SubmitNFT = lazy(() => import('Views/SubmitNft'));
// const Airdrops = lazy(() => import('Views/Airdrops'));
const Browse = lazy(() => import('Views/Browse'));
const Faucet = lazy(() => import('Views/Faucet'));
const Collection = lazy(() => import('Views/Collection'));
const NotFound = lazy(() => import('Views/NotFound'));

function App() {
  const { walletAddress } = useSelector((state) => state);

  useEffect(() => {
    async function fetchDataInit() {
      document
        .getElementsByTagName('HTML')[0]
        .setAttribute('data-theme', localStorage.getItem('theme'));
      await store.dispatch(setAvailableSellOrder());
      store.dispatch(setBalance());
      store.dispatch(setMomaBalance());
    }
    fetchDataInit();
  }, []);

  useInterval(() => {
    if (!!walletAddress) {
      store.dispatch(setBalance());
      store.dispatch(setMomaBalance());
    }
  }, 3000);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BrowserRouter>
        <div className='page content'>
          <Notification />
          <StatusActivity />
          <NavBar />
          <Suspense
            fallback={
              <div className='center background-mode' style={{ height: '90vh' }}>
                <IconLoading />
              </div>
            }
          >
            <div style={{ height: '100%' }}>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/profile/:address' component={Profile} />
                <Route exact path='/submit-Nfts' component={SubmitNFT} />
                <Route exact path='/browse' component={Browse} />
                <Route
                  exact
                  path='/token/:chainID/:addressToken/:id/:sellID'
                  component={DetailNFT}
                />
                <Route exact path='/collection/:chainID/:addressToken' component={Collection} />
                {/* <Route exact path='/airdrops' component={Airdrops} /> */}
                <Route exact path='/faucet' component={Faucet} />
                <Route path='*' component={NotFound} />
              </Switch>
            </div>
          </Suspense>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
