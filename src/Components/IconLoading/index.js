import './index.css';
import logoMochi from 'Assets/logo-mochi.png';

export default function IconLoading() {
  return (
    <div className='box-loading center'>
      <img className='mochi-loading bounce-4' src={logoMochi} alt='logo' />
    </div>
  );
}
