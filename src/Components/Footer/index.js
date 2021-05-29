import './index.css';
import logo from 'Assets/images/logo.png';
import tele from 'Assets/icons/telegram.svg';
import twitter from 'Assets/icons/twitter.svg';
import medium from 'Assets/icons/medium.svg';
import discord from 'Assets/icons/discord.svg';

export default function Footer() {
  return (
    <div className='footer'>
      <div className='fld'>
        <div className='fla'>
          <div>
            <img className='footer-logo' src={logo} alt='logo' />
          </div>
          <div>
            <h4 className='textmode'>MochiLab Foundation Ltd</h4>
          </div>
          <div>
            <p className='address textmode'>3 Fraser Street #5-25 Duo Tower, Singapore</p>
          </div>
          <div>
            <a href='mailto:contact@mochilab.org'>
              <p className='address'>contact@mochilab.org</p>
            </a>
          </div>
        </div>
        <div className='flc'>
          <p className='fontRoboto follow'>Follow us in social media</p>

          <div className='footer-community-icon'>
            <div className='icon-item'>
              <a href='https://t.me/mochi_market' target='_blank' rel='noreferrer'>
                <img src={tele} alt='tele' />
              </a>
            </div>
            <div className='icon-item'>
              <a href='https://twitter.com/MarketMochi' target='_blank' rel='noreferrer'>
                <img src={twitter} alt='twitter' />
              </a>
            </div>
            <div className='icon-item'>
              <a href='https://mochi-market.medium.com/' target='_blank' rel='noreferrer'>
                <img src={medium} alt='medium' />
              </a>
            </div>
            <div className='icon-item'>
              <a href='https://discord.gg/ZHq7arVS' target='_blank' rel='noreferrer'>
                <img src={discord} alt='discord' />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='copyright center'>
        <p className='copyright-font textmode'>© Copyright 2021, MochiLab</p>
      </div>
    </div>
  );
}
