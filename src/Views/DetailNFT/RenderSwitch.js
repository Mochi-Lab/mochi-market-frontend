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
      return <Cancel orderDetail={orderDetail} />;
    case 2:
      return (
        <div className='PE'>
          <div className='actions-btn'>
            <Sell token={token} is1155={is1155} available={available} />
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
      return <Buy orderDetail={orderDetail} is1155={is1155} id={id} addressToken={addressToken} />;
    default:
      return <div></div>;
  }
}
