import './index.scss';
import ScareEmote from 'Assets/images/scare.png';

export default function NotFound() {
    return <>
        <div className="page-not-found-container">
            <div>
                <div>
                    <img src={ScareEmote} alt="page not found" />
                </div>
                <div className="info">
                    The page you requested was not found!
                </div>
            </div>
        </div>
    </>
}
