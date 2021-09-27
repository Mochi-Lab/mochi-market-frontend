import {List} from 'antd';

export default function RenderExtraMetadata({
  addressToken,
  metadata
}) {
  if(addressToken.toLowerCase() === "0xc33d69a337b796a9f0f7588169cd874c3987bde9") {

    const toExclude = ["Affection", "Laziness", "Braveness", "Constitution", "Hunger", "Instinct", "Smart", "Generation", "Crazyness", "Color"]
    metadata = metadata.filter(i => !toExclude.includes(i.trait_type))
    metadata = metadata.map(i => {
        if(i.trait_type === "Sex" && !isNaN(i.value)) i.value = i.value <= 5 ? "Female" : "Male"
        return i
    })

    const talents = metadata.filter(i => i.trait_type.endsWith("Talent") || i.trait_type.endsWith("Genes"))
    const attributes = metadata.filter(i => !talents.includes(i))


    return <div className='properties-nft'>
      <div className='content-properties'>
        <div className='title-tab-properties'>
          <h3 className='textmode'>Extra Metadata</h3>
        </div>
        <div className='list-properties'>
          <div className='items-properties'>
            <p className={'textmode'}>This data is based on Kryptomon Whitepaper.</p>
            <p className={'textmode'}>Attributes:</p>
            <List
                grid={{
                  gutter: 16,
                  xs: 2,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={attributes}
                renderItem={(attr, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                          avatar={
                            <span className='name-properties'>{attr.trait_type}: </span>
                          }
                          description={
                            <span className='textmode'>
                                           {attr.value}
                                          </span>
                          }
                      />
                    </List.Item>
                )}
            />
            <p className={'textmode'}>Genes / Talents:</p>
            <List
                grid={{
                  gutter: 16,
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={talents}
                renderItem={(attr, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                          avatar={
                            <span className='name-properties'>{attr.trait_type}: </span>
                          }
                          description={
                            <span className='textmode'>
                                           {attr.value}
                                          </span>
                          }
                      />
                    </List.Item>
                )}
            />
          </div>
        </div>
      </div>
    </div>
  }

  return <div />
}
