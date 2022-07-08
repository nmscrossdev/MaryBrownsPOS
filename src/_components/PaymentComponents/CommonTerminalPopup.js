import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
export const CommonTerminalPopup = (props) => {
    const { showTerinalwaitingMsg, errorMsgColor, error_msg, handleCancelButton, handleButton1Click, handleButton2Click, button1Title, button2Title,cancleTransaction } = props;
    return (
        // <div className="loader-fixed">
            <div className="popup productPopup bodyCenter">
            <div className="user_login user_login_popup"  style={{ textAlign: 'center' }}>
                <div className="user__login_header">
                    <div className="user_login_container">
                        <img alt="Logo" src="../assets/images/logo-dark.svg" />
                    </div>
                </div>
                <div className="user_login_pages">
                    <div className="user_login_container">
                        <div className="user_login_row">
                            <div className="user_login_form_wrapper">
                                <div className="user_login_form_wrapper_container">
                                    <div className="user_login_form">
                                        <div className="">
                                            <div className="user_login_scroll_in">
                                                <div className="user_login_center">
                                                    <div className="user_login_head user_login_join">
                                                        <div>
                                                            {showTerinalwaitingMsg == true ? <h3 className="user_login_head_title">
                                                                {LocalizedLanguage.waitingOnPaymentTerminal}
                                                                </h3> : ''}
                                                            <div className="user_login_head_logo" style={{padding: '39px'}}>
                                                                <a href="#">
                                                                    <svg
                                                                        version="1.1" id="ologo"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                        x="0px"
                                                                        y="0px"
                                                                        viewBox="0 0 400 400"
                                                                        style={{ "enableBackground": 'new 0 0 400 400' }}
                                                                        xmlSpace="preserve" width="120px" height="120px"
                                                                    >

                                                                        <rect id="lime" x="249.28" y="156.01"
                                                                            className="st0 ologo-1" width="103.9" height="103.9">
                                                                        </rect>
                                                                        <path id="teal" className="st1 ologo-2"
                                                                            d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z">
                                                                        </path>
                                                                        <rect id="cyan" x="145.38" y="259.91"
                                                                            className="st2 ologo-3" width="103.9" height="103.89">
                                                                        </rect>
                                                                        <path id="blue" className="st3 ologo-4"
                                                                            d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z">
                                                                        </path>
                                                                        <rect id="purple" x="41.49" y="156.01"
                                                                            className="st4 ologo-5" width="103.9" height="103.9">
                                                                        </rect>
                                                                        <path id="red" className="st5 ologo-6"
                                                                            d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z">
                                                                        </path>
                                                                        <rect id="orange" x="145.38" y="52.12"
                                                                            className="st6 ologo-7" width="103.9" height="103.9">
                                                                        </rect>
                                                                        <path id="yellow" className="st7 ologo-8"
                                                                            d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z">
                                                                        </path>
                                                                    </svg>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="view-cart payconic-btn" style={{marginRight:'20px'}}
                                                        onClick={handleButton1Click}
                                                    >
                                                        {button1Title}
                                                    </button>

                                                    <button
                                                        className="view-cart payconic-btn" style={{marginRight:'20px'}}
                                                        onClick={handleButton2Click} 
                                                    >
                                                        {button2Title}
                                                    </button>

                                                    <button
                                                        className="view-cart payconic-btn" style={{marginRight:'20px'}}
                                                        onClick={handleCancelButton}
                                                    >
                                                        {LocalizedLanguage.cancel}
                                                                    </button>
                                                    {/* <button
                                                            className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30"
                                                            onClick={handleCloseButton}
                                                            style={{ minWidth: '220px' }}
                                                        >
                                                            {closeButtonTitle}
                                                        </button> */}
                                                    {/* show regenrate QR code in case of payment status 'EXPIRED' */}
                                                    <p style={{ color: errorMsgColor, paddingTop: "20px" }}>{error_msg}</p>
                                                    {/* <button onClick={cancleTransaction}> Cancle Transation</button> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}


