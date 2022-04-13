
import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage'
export const Footer=()=>{
    return(
        <div className="user__login_footer">
            <div className="footer footer-light">
                <div className="user_login_container">
                    <div className="footer-space-between">
                        <div className="footer__logo">
                            <a href="#">
                            <img alt="Logo" src="../assets/images/logo-dark-sm.svg" />
                            </a>
                            <div className="footer__copyright">
                                2022&nbsp;©&nbsp;
                            <a href="#" target="_blank">Oliver POS</a>
                            </div>
                        </div>
                        <div className="footer__menu"> 
                            <a href="https://help.oliverpos.com/" target="_blank">{LocalizedLanguage.KnowledgeBase}</a>
                            <a href="https://help.oliverpos.com/kb-tickets/new" target="_blank">{LocalizedLanguage.CreateSupportTicket}</a>
                            <a href="https://oliverpos.com/contact-oliver-pos/" target="_blank">{LocalizedLanguage.Contact}</a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
)}