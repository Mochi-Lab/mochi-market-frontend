import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from 'Components/NavBar';
import IconLoading from 'Components/IconLoading';
import { setAvailableSellOrder, setBalance, setMomaBalance } from 'store/actions';
import store from 'store/index';

import { lazy, Suspense, useEffect } from 'react';
import './App.css';
import Notification from 'Components/Notification';
import useInterval from 'utils/useInterval';

const Home = lazy(() => import('Views/Home'));
const Profile = lazy(() => import('Views/Profile'));
const DetailNFT = lazy(() => import('Views/DetailNFT'));
const SubmitNFT = lazy(() => import('Views/SubmitNft'));
const Create = lazy(() => import('Views/Create'));
// const Airdrops = lazy(() => import('Views/Airdrops'));
const CreateERC721 = lazy(() => import('Views/Create/ERC721'));
const CreateERC1155 = lazy(() => import('Views/Create/ERC1155'));
const Browse = lazy(() => import('Views/Browse'));
const Faucet = lazy(() => import('Views/Faucet'));

function App() {
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
    store.dispatch(setBalance());
    store.dispatch(setMomaBalance());
  }, 3000);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <BrowserRouter>
        <div className='page content'>
          <Notification />
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
                <Route exact path='/create' component={Create} />
                <Route exact path='/browse' component={Browse} />
                <Route exact path='/create/erc721' component={CreateERC721} />
                <Route exact path='/create/erc1155' component={CreateERC1155} />
                <Route exact path='/token/:addressToken/:id/:sellID' component={DetailNFT} />
                {/* <Route exact path='/airdrops' component={Airdrops} /> */}
                <Route exact path='/faucet' component={Faucet} />
              </Switch>
            </div>
          </Suspense>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
