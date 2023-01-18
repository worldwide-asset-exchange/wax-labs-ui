import * as React from 'react';

import TwitterIcon from '../icons/TwitterIcon';
import TelegramIcon from '../icons/TelegramIcon';
import DiscordIcon from '../icons/DiscordIcon';
import builtWithLove from '../images/built-with-love.svg';
import PoweredByWax from '../images/powered-by-WAX.svg';

import WAXLabs from '../images/labs-beaker.svg';

import './Footer.scss';

function RenderFooter(props) {
    return (
        <footer className="footer">
            <div className="footer__socialMedia">
                <a href="https://twitter.com/WAX_io" target="__blank" className="footer__socialMediaIcon">
                    <TwitterIcon />
                </a>
                <a href="https://go.wax.io/Discord" target="__blank" className="footer__socialMediaIcon">
                    <DiscordIcon />
                </a>
                <a href="https://t.me/wax_io" target="__blank" className="footer__socialMediaIcon">
                    <TelegramIcon />
                </a>
            </div>
            <div className="footer__waxLabs">
                <img src={WAXLabs} alt="WAX logo inside a beaker" />
                <p className="footer__disclaimer">{`© ${new Date().getFullYear()} WAX, Worldwide Asset eXchange™ All rights reserved.`}</p>
                <div className="footer__legal">
                    <a href="https://www.wax.io/terms-of-service" target="__blank" className="footer__legalLink">
                        Terms of Service
                    </a>
                    <a href="https://www.wax.io/privacy-policy" target="__blank" className="footer__legalLink">
                        Privacy Policy
                    </a>
                </div>
            </div>
            <div className="footer__images">
                <img src={PoweredByWax} alt="Powered by WAX." className="footer__poweredByWAX" />
                <img src={builtWithLove} alt="Built with love by EOS Detroit." className="footer__builtWithLove" />
            </div>
        </footer>
    );
}

export default RenderFooter;
