import './index.css';
import { Avatar } from 'antd';
import { FormOutlined } from '@ant-design/icons';

export default function FormFeedback() {
  return (
    <a href='https://forms.gle/Z8BJciPFQL2xsbZg8' target='_blank' rel='noreferrer'>
      <div className='form-feedback'>
        <Avatar
          size={{ xs: 40, sm: 40, md: 40, lg: 50, xl: 50, xxl: 50 }}
          icon={
            <>
              <FormOutlined />
            </>
          }
          className='icon-feedback'
        />
        <p>feedback</p>
      </div>
    </a>
  );
}
