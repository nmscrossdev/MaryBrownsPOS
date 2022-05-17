import React from 'react';
import { LoadingModal } from '../../_components/LoadingModal';
import { CommonMsgModal } from '../../_components/CommonMsgModal';
import { OnboardingFooter } from '../../onboarding/components/commonComponents/OnboardingFooter';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { AndroidAndIOSLoader } from '../../_components';

import { Markup } from 'interweave';
const WebPin = (props) => {
    //console.log("%cmobile view props",'color:pink', props);
    const { hasPin, ShowCreatePin, handleMsgOkClick, LocalizedLanguage, LocationName, LocationName2, NumInput, RgisterName, TrashPin, addToScreen, alert, handle, handleBack, history, isloading, log_out, notxtValue, pinNumberList, registerName1, trashId, whichkey, _env, closeModal, ReportBug, BrowserVersionModal, OliverVersionModal } = props;
    var dispalyInput = _env == 'ios' || _env == 'android' ? false : true;

    return (
        <div>
            <div className="user_login user_login_center scroll-auto" onClick={() => whichkey()}>
                {/* {isloading ? isMobileOnly == true ? <LoadingModal />  : <LoadingModal /> : ''} */}
                {isloading ? isMobileOnly == true ? <AndroidAndIOSLoader />  : <LoadingModal /> : ''}
                <div>
                    <div className="user_login_container" onClick={() => history.push("/choose_registration", "loginpin")}>
                        <div className="user_login-back">
                            <img src="../assets/img/onboarding/right-chevron.svg" /> {LocalizedLanguage.goBack}
                        </div>
                        {/* show selected user and register */}
                        <div className="user_login-back user_login-back2">
                            <Markup content={LocationName ? LocationName : LocationName2}/>/<Markup content={RgisterName ? RgisterName : registerName1} />
                        </div>
                    </div>
                </div>
                <div className="user_login_pages">
                    <div className="user_login_container">
                        <div className="user_login_row">
                            <div className="user_login_colA">
                                <div className="user_login_form_wrapper">
                                    <div className="user_login_form_wrapper_container">
                                        <div className="user_login_form">
                                            <div className="user_login_head">
                                                <div className="user_login_head_logo">
                                                    <a href="#">
                                                        <img src="../../assets/images/logo-dark.svg" alt="" />
                                                    </a>
                                                </div>
                                                <h3 className="user_login_head_title">
                                                    {hasPin != 'false' ? LocalizedLanguage.enterPin : 'Create Your PIN'}
                                                </h3>
                                                <h3 className="user_login_head__title">
                                                    {/* {hasPin != 'false' ? LocalizedLanguage.enterFourDigitPin : 'Setup your Personal PIN which will allow access to the Web Register'} */}
                                                </h3>
                                            </div>
                                            <form>
                                                {dispalyInput == true &&
                                                    <input id="whichkey" maxLength="4" type="text" style={{ backgroundColor: 'transparent', color: 'transparent' }} value={notxtValue} autoFocus={dispalyInput == true ? true : false} onChange={handle} onKeyDown={handleBack} className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete="off" />
                                                }
                                                <div className="user_login-pin">
                                                    <div className="user_login-pin-head">
                                                        {hasPin != 'false' ? '' :
                                                            <ul>
                                                                <ShowCreatePin type="number" trshPin={trashId} />
                                                            </ul>
                                                        }
                                                    </div>
                                                    <div className="user_login-pin-body">
                                                        {/* <p id="demo"></p> */}
                                                        <table className="table table-bordered user_login-pin-calculator">
                                                            <tbody>
                                                                {/* <td> */}
                                                                <NumInput id="keyss" type="button" numbers={pinNumberList} onClick={addToScreen} readOnly={false} className2="fill-dotted-clear" />
                                                                {/* </td> */}
                                                                {/* <td>1</td>
                                                            <td>2</td>
                                                            <td>3</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>4</td>
                                                            <td>5</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6</td>
                                                            <td>7</td>
                                                            <td>8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>&nbsp;</td>
                                                            <td>0</td>
                                                            <td></td> */}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="user_login-pin-footer">
                                                        <ul>
                                                            {/* <li> */}
                                                            <TrashPin type="button" trshPin={trashId} className="if_fill" />

                                                            {/* </li> */}
                                                            {/* <input type="text" className="if_fill" /> */}
                                                            {/* <li>
                                                            <input type="text" className="if_fill" />
                                                        </li>
                                                        <li>
                                                            <input type="text" className="if_fill" />
                                                        </li>
                                                        <li>
                                                            <input type="text" className="if_fill" />
                                                        </li> */}
                                                        </ul>
                                                        {/* {alert ?
                                                     
                                                            <div className="validationError text-center p-0 m-0">
                                                                { alert == "Invalid Pin. Please try again!" ? LocalizedLanguage.pinErrMsg : alert }
                                                            </div>                 
                                                     
                                                        : ""} */}
                                                    </div>
                                                    {alert && <p className="text-danger fw-500 text-center pt-3">{alert == "Invalid Pin. Please try again!" ? LocalizedLanguage.pinErrMsg : alert}</p>}
                                                    <div className="user_login__extra user_login__center-center">
                                                        <div className="user_login-back" onClick={() => log_out()}>
                                                            <img src="../assets/img/logout.svg" alt="" onClick={() => log_out()} /> Logout
                                                    </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* <OliverVersionModal closeModal={closeModal} reportBug={ReportBug} /> */}
                            {/* <BrowserVersionModal closeModal={closeModal} reportBug={ReportBug} /> */}
                            <CommonMsgModal msg_text='Firefox private window not supported by app' close_Msg_Modal={handleMsgOkClick} />
                            <div className="user_login_colB">
                                <div className="user_login_aside"
                                    style={{ backgroundImage: "url('../assets/img/onboarding/connect.png')" }}>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <OnboardingFooter pinView = {true}/>
            </div>
        </div>

    )
}

export default WebPin;