import { CameraOutlined } from '@ant-design/icons';

import './index.scss';

export default function Edit() {
  return (
    <>
      <div className='change-image' style={{ display: 'flex', padding: '5px 10px' }}>
        <CameraOutlined style={{ fontSize: '20px' }} />
        <p style={{ paddingLeft: '5px', margin: 0 }}>
          <strong>Edit your profile</strong>
        </p>
      </div>
    </>
  );
}
