import Sell from 'Components/Sell';
import Buy from 'Components/Buy';
import Cancel from 'Components/Cancel';
import Transfer from 'Components/Transfer';

export default function RenderSwitch({
  status,
  token,
  orderDetail,
  is1155,
  available,
  web3,
  getOwners1155,
  addressToken,
  id,
}) {
  switch (status) {
    case 3:
      return <Cancel orderDetail={orderDetail} getOwners1155={getOwners1155} />;
    case 2:
      return (
        <div className='PE'>
          <div className='actions-btn'>
            <Sell
              token={token}
              is1155={is1155}
              available={available}
              getOwners1155={getOwners1155}
            />
            <div className='cAFwWB' />
            <Transfer
              token={token}
              is1155={is1155}
              available={available}
              web3={web3}
              getOwners1155={getOwners1155}
            />
          </div>
        </div>
      );
    case 1:
      return (
        <Buy
          orderDetail={orderDetail}
          is1155={is1155}
          id={id}
          addressToken={addressToken}
          getOwners1155={getOwners1155}
        />
      );
    default:
      return <div></div>;
  }
}
