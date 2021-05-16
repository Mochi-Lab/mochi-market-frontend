import './index.css';
import { Avatar } from 'antd';
import { FormOutlined } from '@ant-design/icons';

export default function FormFeedback() {
  return (
    <a href='https://forms.gle/Z8BJciPFQL2xsbZg8' target='_blank' rel='noreferrer'>
      <div className='form-feedback'>
        <Avatar
          size={{ xs: 50, sm: 50, md: 50, lg: 50, xl: 50, xxl: 50 }}
          icon={
            <>
              <FormOutlined />
            </>
          }
          className='icon-feedback'
        />
        <p>Feedback</p>
      </div>
    </a>
  );
}
