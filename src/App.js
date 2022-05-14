import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from 'Components/NavBar';
import IconLoading from 'Components/IconLoading';

import { lazy, Suspense, useEffect } from 'react';
import './App.scss';
import Notification from 'Components/Notification';
import StatusActivity from 'Components/StatusActivity';
import { Helmet } from "react-helmet";

const Home = lazy(() => import('Views/Home'));
const Profile = lazy(() => import('Views/Profile'));
const DetailNFT = lazy(() => import('Views/DetailNFT'));
const SubmitNFT = lazy(() => import('Views/SubmitNft'));
const Browse = lazy(() => import('Views/Browse'));
const Faucet = lazy(() => import('Views/Faucet'));
const Collection = lazy(() => import('Views/Collection'));
const NotFound = lazy(() => import('Views/NotFound'));
const Dev = lazy(() => import('Views/Dev'));
const Presale = lazy(() => import('Views/Presale'));

function App() {
  useEffect(() => {
    async function fetchDataInit() {
      const selectedMode = localStorage.getItem('theme');
      if (selectedMode !== null)
        document.querySelector('html').setAttribute('data-theme', selectedMode);
    }
    fetchDataInit();
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Mochi Market</title>
        <link rel="canonical" href="https://app.mochi.market/" />
        <meta name="description" content="Mochi Market - Multi-Chain NFT Market" />
      </Helmet>
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
                <Route exact path='/profile/:chainID/:address' component={Profile} />
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
                {process.env.REACT_APP_ENVIRONMENT === 'development' && <Route exact path='/dev' component={Dev} />}
                <Route path='/presale/:chainID' component={Presale} />
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
