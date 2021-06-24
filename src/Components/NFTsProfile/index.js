import { Layout } from 'antd';
import NFTsCardProfile from 'Components/NFTsCardProfile';
import IconLoading from 'Components/IconLoading';
import 'react-alice-carousel/lib/alice-carousel.css';
import './index.css';

const { Content } = Layout;

export default function NFTsProfile({ listNFTs, isLoadingErc721, onSale }) {
  return (
    <>
      <Layout style={{ minHeight: '100%' }}>
        <Layout style={{ padding: '1rem' }} className='background-mode'>
          <Content
            className='site-layout-background'
            style={{
              padding: 6,
              margin: 0,
              minHeight: 280,
            }}
          >
            {isLoadingErc721 || isLoadingErc721 === null ? (
              <div className='center' style={{ width: '100%', height: '100%' }}>
                <IconLoading />
              </div>
            ) : (
              <NFTsCardProfile tokens={listNFTs} onSale={onSale} />
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
