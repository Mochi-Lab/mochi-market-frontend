import { useEffect, useState } from 'react';
import {
  Col,
  Collapse,
  Row,
  Checkbox,
  Slider,
  InputNumber,
  DatePicker,
  /* , Radio */
} from 'antd';
import { ArrowDownOutlined, EditOutlined } from '@ant-design/icons';
import './styleFilter.scss';

const { Panel } = Collapse;

export default function FilterCollection({
  setShowFilter,
  setObjectFilter,
  objectFilter,
  activeKeysCollapse,
  setActiveKeysCollapse,
  attributesFilter,
  setModalEditFilter,
}) {
  return (
    <div className='collection-filter'>
      <div className='row-title-filter'>
        <h1 className='textmode'>
          Filter{' '}
          <EditOutlined className='cursor-pointer' onClick={() => setModalEditFilter(true)} />
        </h1>
        <div
          className='btn-clear-filter'
          onClick={() => {
            if (Object.keys(objectFilter).length > 0) {
              setShowFilter(false);
              setTimeout(async () => {
                await setShowFilter(true);
                await setObjectFilter({});
              }, 10);
            }
          }}
        >
          Clear Filter
        </div>
      </div>
      <div className='list-properties'>
        <Collapse
          className='background-mode'
          defaultActiveKey={activeKeysCollapse}
          onChange={(e) => setActiveKeysCollapse(e)}
        >
          {attributesFilter.map((attribute) => (
            <Panel
              header={<span className='text-trait-type'>{attribute.trait_type}</span>}
              key={attribute.index}
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
          min={attribute.min}
          max={attribute.max}
        />
      )}
      <div className='row-min-max'>
        <div className='min-slider textmode'>{attribute.min}</div>
        <div className='max-slider textmode'>{attribute.max}</div>
      </div>

      <Row justify='center'>
        <Col span={12}>
          <div className='textmode text-center'>Min </div>
          <InputNumber
            value={min}
            className='textmode input-min'
            onChange={(value) => {
              if (value >= attribute.min) {
                setMin(value);
                setInputSlider([value, max]);
                changeMinMax(value, max);
              }
            }}
          />
        </Col>
        <Col span={12}>
          <div className='textmode text-center'>Max</div>
          <InputNumber
            value={max}
            className='textmode input-max'
            onChange={(value) => {
              if (value <= attribute.max) {
                setMax(value);
                setInputSlider([min, value]);
                changeMinMax(min, value);
              }
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
