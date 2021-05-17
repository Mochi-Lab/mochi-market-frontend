import { useHistory } from 'react-router';
import './index.css';
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
        <h2 className='textmode'>Create collectible</h2>
        <p className='textmode'>
          Choose “Single” if you want your collectible to be one of a kind or “Multiple” if you want
          to sell one collectible multiple times
        </p>

        <div className='justifyContentSa'>
          <div
            className='box input-mode-bc slt center mr-1d5rem'
            onClick={() => push('/create/erc721/')}
          >
            <img src={create721Icon} alt='single' />
            <p>Single</p>
          </div>

          <div className='box input-mode-bc slt center'>
            <img src={create1155Icon} alt='multiple' />
            <p>Multiple</p>
          </div>
        </div>

        <p className='textmode'>
          We do not own your private keys and cannot access your funds without your confirmation
        </p>
      </div>
    </div>
  );
}
