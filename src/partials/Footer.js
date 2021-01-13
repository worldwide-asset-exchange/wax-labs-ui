import * as React from 'react';

import TwitterIcon from '../icons/TwitterIcon'
import TelegramIcon from '../icons/TelegramIcon'
import DiscordIcon from '../icons/DiscordIcon'
import builtWithLove from '../images/built-with-love.svg'

import './Footer.scss'

function RenderFooter(props) {
    return (
        <footer className="footer">
            <div className="footer__socialMedia">
                <a href="https://twitter.com/WAX_io" target="__blank" className="footer__socialMediaIcon">
                    <TwitterIcon/>
                </a>
                <a href="https://go.wax.io/Discord" target="__blank" className="footer__socialMediaIcon">
                    <DiscordIcon/>
                </a>
                <a href="https://t.me/wax_io" target="__blank" className="footer__socialMediaIcon">
                    <TelegramIcon/>
                </a>
            </div>
            <p className="footer__disclaimer">{`© ${new Date().getFullYear()} WAX, Worldwide Asset eXchange™ All rights reserved.`}</p>
            <img src={builtWithLove} alt="Built with love by EOS Detroit." className="footer__builtWithLove"/>
        </footer>
    );
}

export default RenderFooter;