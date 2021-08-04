import tick from 'Assets/icons/tick-green.svg';
import { getLogoChainsTags } from 'utils/getContractAddress';
import logoMochi from 'Assets/logo-mochi.png';
import discord from 'Assets/icons/discord-01.svg';
import youtube from 'Assets/icons/youtube.svg';
import facebook from 'Assets/icons/facebook-01.svg';
import instagram from 'Assets/icons/instagram.svg';
import medium from 'Assets/icons/medium-01.svg';
import titok from 'Assets/icons/tiktok.svg';
import github from 'Assets/icons/github-01.svg';
import twitter from 'Assets/icons/twitter-01.svg';
import telegram from 'Assets/icons/telegram-01.svg';
import website from 'Assets/icons/website.svg';

export default function DisplayInfoCollection({
  infoCollection,
  statusEdit,
  setvisibleEitdCollection,
  verifiedContracts,
  addressToken,
}) {
  return (
    <div className='collection-info'>
      <div className='collection-info-content'>
        <div className='logo-grid'>
          <div className='logo-collection'>
            <div className='wrap-img-logo'>
              <img
                src={!!infoCollection.logo ? infoCollection.logo : logoMochi}
                alt='logo-collection'
              />
            </div>
          </div>
          <div>
            {!!statusEdit && (
              <button
                className='btn-edit-collection'
                onClick={() => setvisibleEitdCollection(true)}
              >
                <div className='textmode'>Edit Collection</div>
              </button>
            )}
          </div>
        </div>
        <div className='info-grid'>
          <div className='collection-name textmode'>
            {infoCollection.name}
            {verifiedContracts.includes(addressToken.toLocaleLowerCase()) ? (
              <img src={tick} alt='icon-tick' className='icon-tick' />
            ) : null}{' '}
          </div>
          <div className='list-tags textmode'>
            {!!infoCollection.chainId ? (
              <div className='item-tag'>
                <img src={getLogoChainsTags(infoCollection.chainId).logo} alt='img-tag' />
                <span className='textmode'>{getLogoChainsTags(infoCollection.chainId).name}</span>
              </div>
            ) : (
              'Tags: '
            )}
          </div>
          <div className='description-colletion textmode'>
            {!!infoCollection.description ? infoCollection.description : 'Description:'}
          </div>
          <div className='statistics-colletion'></div>
          <div className='contact-colletion'>
            {!!infoCollection.website ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.website}
                className='link-contact'
              >
                <img src={website} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Website</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.twitter ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.twitter}
                className='link-contact'
              >
                <img src={twitter} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Twitter</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.telegram ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.telegram}
                className='link-contact'
              >
                <img src={telegram} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Telegram</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.discord ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.discord}
                className='link-contact'
              >
                <img src={discord} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Discord</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.youtube ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.youtube}
                className='link-contact'
              >
                <img src={youtube} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>YouTube</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.facebook ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.facebook}
                className='link-contact'
              >
                <img src={facebook} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Facebook</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.instagram ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.instagram}
                className='link-contact'
              >
                <img src={instagram} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Instagram</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.github ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.github}
                className='link-contact'
              >
                <img src={github} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Github</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.medium ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.medium}
                className='link-contact'
              >
                <img src={medium} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Medium</div>
              </a>
            ) : (
              ''
            )}
            {!!infoCollection.tiktok ? (
              <a
                target='_blank'
                rel='noreferrer'
                href={infoCollection.tiktok}
                className='link-contact'
              >
                <img src={titok} alt='icon-link' className='icon-contact' />
                <div className='name-contact textmode'>Titok</div>
              </a>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className='contact-grid'></div>
      </div>
    </div>
  );
}
