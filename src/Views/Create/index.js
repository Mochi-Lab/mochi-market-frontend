import { useHistory } from 'react-router';
import './index.scss';
import create721Icon from 'Assets/images/create721.png';
import create1155Icon from 'Assets/images/create1155.png';
export default function Create() {
  const history = useHistory();

  function push(to) {
    history.push(to);
  }

  return (
    <div className='center create-pt'>
      <div className='create-box'>
        <h1 className='textmode title-create-collection'>Create collectible</h1>
        <p className='textmode description-create-collection'>
          Choose <span>“Single”</span> if you want your collectible to be one of a kind or{' '}
          <span>“Multiple”</span> if you want to sell one collectible multiple times
        </p>

        <div className='justifyContentSa'>
          <div className='box input-mode-bc slt center' onClick={() => push('/create/erc721/')}>
            <img src={create721Icon} alt='single' />
            <p>Single</p>
          </div>

          <div className='box input-mode-bc slt center' onClick={() => push('/create/erc1155/')}>
            <img src={create1155Icon} alt='multiple' />
            <p>Multiple</p>
          </div>
        </div>
        <div className='noti-create-collection'>
          <p className='textmode '>
            We do not own your private keys and cannot access your funds without your confirmation
          </p>
        </div>
      </div>
    </div>
  );
}
