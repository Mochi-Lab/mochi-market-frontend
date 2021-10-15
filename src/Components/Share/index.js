import { MoreOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useState } from 'react';
import './index.scss';

export default function Share({ token, additionalButtons }) {
  const [text] = useState(`Yoo! look what I found! ${token.name}`);

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}&hashtags=MochiMarket%2Cbnb%2Cnonfungible%2Cdigitalasset%2Cnft`,
      '_blank',
      'toolbar=yes,resizable=yes,top=300,width=500,height=400'
    );
  };

  return (
    <Popconfirm
      placement='bottomRight'
      title={
        <div>
          <h3 className={'textmode'}>Share this collectible</h3>
          <Button
            shape='circle'
            icon={<TwitterOutlined />}
            size='large'
            onClick={() => shareTwitter()}
          />
          <hr/>
          {!!additionalButtons && <div>
              <h3 className={'textmode'}>Other</h3>
              {additionalButtons}
            </div>
          }
        </div>
      }
      style={{ height: '40px', borderRadius: '30px' }}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
      icon={<></>}
    >
      <div>
        <Button shape='circle' icon={<MoreOutlined />} size='large' />
      </div>
    </Popconfirm>
  );
}
