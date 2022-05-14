import { Tag } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

export default function StatusPresale({
  counterDays,
  timeStart,
  timeEnd
}) {
  return (
    <div className='description-short-right'>
      <div className='time-end-live'>
        {!timeStart && <div className='box-live-time'>
          <Tag icon={<ExclamationCircleOutlined />} color='warning' className='radius-1rem'>
            Waiting
          </Tag>
        </div>}
        {!!timeStart && timeEnd >= (Math.floor(Date.now() / 1000)) && <Tag color='success' className='radius-1rem'>
          <div className='box-live-time'>
            <div className='icon-live pulsatingDot'></div>
            <span className='time-counter--container'>
              Ends in<span>&nbsp;{counterDays(timeEnd)}</span>
            </span>
          </div>
        </Tag>}

        {!!timeStart && timeEnd < (Math.floor(Date.now() / 1000)) && <div className='box-live-time'>
          <Tag icon={<MinusCircleOutlined />} color='default' className='radius-1rem'>
            Expired
          </Tag>
        </div>}
      </div>
    </div>
  );
}
