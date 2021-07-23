import { Col, Collapse, Row, Checkbox, Slider, InputNumber, DatePicker /* , Radio */ } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import './styleFilter.scss';
import { useEffect, useState } from 'react';

const { Panel } = Collapse;

const attributes = [
  {
    index: 0,
    trait_type: 'Element Type',
    display_type: 'enum',
    values: ['Air', 'Fire', 'Water', 'Ice', 'Ground', 'Electro', 'Grass', 'Ghost'],
  },
  {
    index: 1,
    trait_type: 'Speciality',
    display_type: 'enum',
    values: ['Defense', 'Attack', 'Balance'],
  },
  { index: 2, trait_type: 'Super', display_type: 'enum', values: ['Normal'] },
  { index: 3, trait_type: 'Affection', display_type: 'number' },
  { index: 4, trait_type: 'Braveness', display_type: 'number', min: 0, max: 100 },
  { index: 5, trait_type: 'Constitution', display_type: 'number', min: 0, max: 100 },
  { index: 6, trait_type: 'Craziness', display_type: 'number', min: 0, max: 100 },
  { index: 7, trait_type: 'Hunger', display_type: 'number', min: 0, max: 100 },
  { index: 8, trait_type: 'Instinct', display_type: 'number', min: 0, max: 100 },
  { index: 9, trait_type: 'Smart', display_type: 'number', min: 0, max: 100 },
  {
    index: 10,
    trait_type: 'Element Starting Talent',
    display_type: 'number',
    min: 0,
    max: 1000,
  },
  { index: 11, trait_type: 'Laziness', display_type: 'number', min: 0, max: 100 },
  {
    index: 12,
    trait_type: 'Unfreezable',
    display_type: 'enum',
    values: ['Yes', 'No'],
  },
  { index: 13, trait_type: 'Generation', display_type: 'number', min: 0, max: 100 },
];

export default function FilterCollection({ setShowFilter, setObjectFilter, objectFilter }) {
  return (
    <div className='collection-filter'>
      <div className='row-title-filter'>
        <h1 className='textmode'>Filter</h1>
        <div
          className='btn-clear-filter'
          onClick={() => {
            setShowFilter(false);
            setTimeout(() => {
              setShowFilter(true);
              setObjectFilter({});
            }, 10);
          }}
        >
          Clear Filter
        </div>
      </div>
      <div className='list-properties'>
        <Collapse className='background-mode'>
          {attributes.map((attribute, index) => (
            <Panel
              header={<span className='text-trait-type'>{attribute.trait_type}</span>}
              key={index}
            >
              <RenderSwitch
                attribute={attribute}
                setObjectFilter={setObjectFilter}
                objectFilter={objectFilter}
              />
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}

function RenderSwitch({ attribute, setObjectFilter, objectFilter }) {
  switch (attribute.display_type) {
    case 'enum':
      return (
        <TypeEnum
          attribute={attribute}
          setObjectFilter={setObjectFilter}
          objectFilter={objectFilter}
        />
      );
    case 'number':
      return (
        <TypeNumber
          attribute={attribute}
          setObjectFilter={setObjectFilter}
          objectFilter={objectFilter}
        />
      );
    case 'date':
      return (
        <TypeDate
          attribute={attribute}
          setObjectFilter={setObjectFilter}
          objectFilter={objectFilter}
        />
      );
    default:
      return null;
  }
}

function TypeEnum({ attribute, setObjectFilter, objectFilter }) {
  const handleOnChange = (e, element) => {
    if (!!e.target.checked) {
      if (!!objectFilter[`${attribute.index}`]) {
        let attrs = objectFilter;
        attrs[`${attribute.index}`] = [...attrs[`${attribute.index}`], element];
        setObjectFilter({ ...attrs });
      } else {
        let attrs = objectFilter;
        attrs[`${attribute.index}`] = [element];
        setObjectFilter({ ...attrs });
      }
    } else {
      let attrs = objectFilter;
      let traitTypes = objectFilter[`${attribute.index}`];
      const index = traitTypes.indexOf(element);
      if (index > -1) {
        traitTypes.splice(index, 1);
      }
      attrs[`${attribute.index}`] = traitTypes;
      setObjectFilter({ ...attrs });
    }
  };

  return (
    <div className='type-enum'>
      <div className='list-enum'>
        <Row>
          {attribute.values.map((element, index) => (
            <Col xs={{ span: 8 }} lg={{ span: 12 }} key={index}>
              <div className='item-enum'>
                <Checkbox
                  value={element}
                  className='backgound-mode'
                  onChange={(e) => handleOnChange(e, element)}
                >
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

function TypeNumber({ attribute, setObjectFilter, objectFilter }) {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [minSlider, setMinSlider] = useState(attribute.min);
  const [maxSlider, setMaxSlider] = useState(attribute.max);
  const [inputSlider, setInputSlider] = useState([
    typeof attribute.min !== 'undefined' ? attribute.min : 0,
    typeof attribute.max !== 'undefined' ? attribute.max : 0,
  ]);
  // const [sort, setSort] = useState();

  useEffect(() => {
    if (!!attribute && typeof attribute.max !== 'undefined') {
      setMax(attribute.max);
    }
    if (!!attribute && typeof attribute.min !== 'undefined') {
      setMin(attribute.min);
    }
  }, [attribute]);

  const changeMinMax = (_min, _max) => {
    setMin(_min);
    setMax(_max);
    let attrs = objectFilter;
    if (typeof _min !== 'undefined') {
      attrs[`${attribute.index}`] = { ...attrs[`${attribute.index}`], min: _min };
    }
    if (typeof _max !== 'undefined') {
      attrs[`${attribute.index}`] = { ...attrs[`${attribute.index}`], max: _max };
    }
    setObjectFilter({ ...attrs });
  };

  // const changeSort = (e) => {
  //   setSort(e.target.value);
  //   let attrs = objectFilter;
  //   attrs[`${attribute.index}`] = e.target.value;
  //   setObjectFilter({ ...attrs });
  // };

  return (
    <div className='type-number'>
      {typeof attribute.max !== 'undefined' && typeof attribute.min !== 'undefined' && (
        <Slider
          range={{ draggableTrack: true }}
          defaultValue={[min, max]}
          value={inputSlider}
          onChange={(e) => {
            setInputSlider(e);
            changeMinMax(e[0], e[1]);
          }}
          min={minSlider}
          max={maxSlider}
        />
      )}
      <div className='row-min-max'>
        <div className='min-slider textmode'>{minSlider}</div>
        <div className='max-slider textmode'>{maxSlider}</div>
      </div>

      <Row justify='center'>
        <Col span={12}>
          <div className='textmode text-center'>Min </div>
          <InputNumber
            value={min}
            className='textmode input-min'
            onChange={(value) => {
              setMin(value);
              setInputSlider([value, max]);
              changeMinMax(value, max);
              value < attribute.min && setMinSlider(value);
            }}
          />
        </Col>
        <Col span={12}>
          <div className='textmode text-center'>Max</div>
          <InputNumber
            value={max}
            className='textmode input-max'
            onChange={(value) => {
              setMax(value);
              setInputSlider([min, value]);
              changeMinMax(min, value);
              value > attribute.max && setMaxSlider(value);
            }}
          />
        </Col>
      </Row>
      {/* <Radio.Group onChange={changeSort} value={sort}>
        <Radio value='desc'>Desc</Radio>
        <Radio value='asc'>Asc</Radio>
      </Radio.Group> */}
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
