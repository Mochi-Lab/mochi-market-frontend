import { Col, Collapse, Row, Checkbox, Slider, DatePicker, InputNumber } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import './styleFilter.scss';
import { useEffect, useState } from 'react';

const { Panel } = Collapse;

const attributes = [
  {
    trait_type: 'Element Type',
    display_type: 'enum',
    values: ['Air', 'Fire', 'Water', 'Ice', 'Ground', 'Electro', 'Grass', 'Ghost'],
  },
  { trait_type: 'Speciality', display_type: 'enum', values: ['Defense', 'Attack', 'Balance'] },
  { trait_type: 'Super', display_type: 'enum', values: ['Normal'] },
  { trait_type: 'Affection', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Braveness', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Constitution', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Craziness', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Hunger', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Instinct', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Smart', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Element Starting Talent', display_type: 'number', min: 0, max: 1000 },
  { trait_type: 'Laziness', display_type: 'number', min: 0, max: 100 },
  { trait_type: 'Unfreezable', display_type: 'enum', values: ['Yes', 'No'] },
  { trait_type: 'Generation', display_type: 'number', min: 0, max: 10 },
  { trait_type: 'Birthday', display_type: 'date' },
];

export default function FilterCollection() {
  return (
    <div className='collection-filter'>
      <h1 className='textmode'>Filter Properties</h1>
      <div className='list-properties'>
        <Collapse className='background-mode'>
          {attributes.map((attribute, index) => (
            <Panel
              header={<span className='text-trait-type'>{attribute.trait_type}</span>}
              key={index}
            >
              <RenderSwitch attribute={attribute} />
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}

function RenderSwitch({ attribute }) {
  switch (attribute.display_type) {
    case 'enum':
      return <TypeEnum attribute={attribute} />;
    case 'number':
      return <TypeNumber attribute={attribute} />;
    case 'date':
      return <TypeDate attribute={attribute} />;
    default:
      return null;
  }
}

function TypeEnum({ attribute }) {
  return (
    <div className='type-enum'>
      <div className='list-enum'>
        <Row>
          {attribute.values.map((element, index) => (
            <Col xs={{ span: 8 }} lg={{ span: 12 }} key={index}>
              <div className='item-enum'>
                <Checkbox value={element} className='backgound-mode'>
                  <span className='color-text-enum textmode'>{element}</span>
                </Checkbox>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

function TypeNumber({ attribute }) {
  const [min, setMin] = useState();
  const [max, setMax] = useState();

  useEffect(() => {
    if (!!attribute && typeof attribute.max !== 'undefined') {
      setMax(attribute.max);
    }
    if (!!attribute && typeof attribute.min !== 'undefined') {
      setMin(attribute.min);
    }
  }, [attribute]);

  return (
    <div className='type-number'>
      <Slider
        range={{ draggableTrack: true }}
        defaultValue={[min, max]}
        marks={{
          0: {
            label: <span className='textmode'>{min}</span>,
          },
          100: {
            label: <span className='textmode'>{max}</span>,
          },
        }}
      />

      <Row justify='center'>
        <Col span={12}>
          <span className='textmode'>Min </span>
          <InputNumber value={min} size='large' className='textmode' />
        </Col>
        <Col span={12}>
          <span className='textmode'>Max</span>
          <InputNumber value={max} size='large' className='textmode' />
        </Col>
      </Row>
    </div>
  );
}

function TypeDate({ attribute }) {
  return (
    <div className='type-date'>
      <div className='time-start'>
        <DatePicker
          placeholder='Date start'
          format={'DD-MM-YYYY'}
          size='large'
          style={{ width: '100%' }}
        />
      </div>
      <ArrowDownOutlined />
      <div className='time-end'>
        <DatePicker
          placeholder='Date end'
          format={'DD-MM-YYYY'}
          size='large'
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
