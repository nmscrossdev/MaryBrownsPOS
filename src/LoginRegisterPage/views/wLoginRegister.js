import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { LoadingModal } from '../../_components/LoadingModal';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { AndroidAndIOSLoader,Footer } from '../../_components';

const WebLoginRegisterView = (props) => {
    //console.log("%cregister view props",'color:red', props);
    const { fireBaseUsedRegister, autoFocusIs, checkStatus, handleBack, handleSubmit, registers, removeLocation, LocationName, check, loading } = props;
    var loginDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : null;
    return (
        <div>
            {loading == true ? isMobileOnly == true ? <AndroidAndIOSLoader /> : <LoadingModal /> : ''}
            <div className="user_login user_login_center scroll-auto" onClick={autoFocusIs()}>
                <div>
                    <div className="user_login_container" onClick={() => window.location = "/login_location"}>
                        <div className="user_login-back" id="loginRegisterBackButton" onClick={() => removeLocation()}>
                            <img src="../assets/img/onboarding/right-chevron.svg" /> {LocalizedLanguage.goBack}
                        </div>
                        {/* show selected shop */}
                        <div className="user_login-back user_login-back2">
                            {LocationName}
                            {/* .replace(/[^a-zA-Z]/g, ' ') */}
                        </div>
                    </div>
                </div>
                {/* <div className="fixed-text fixed-top-right">
                    <a href="javascript:void(0);" style={{ color: "#747373" }}>{LocationName.replace(/[^a-zA-Z]/g, ' ')}</a>
                </div> */}
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
                                                    {LocalizedLanguage.chooseRegister}
                                                </h3>
                                                <h3 className="user_login_head__title">
                                                    {/* {LocalizedLanguage.chooseRegisterDetail} */}
                                                </h3>
                                            </div>
                                            <form>
                                                <div className="user_choose-links scroll-hidden">
                                                    <div className={isMobileOnly == true ? 'user_choose-list' : 'user_choose-list user_choose-list-noScroll'}>
                                                        <ul> {
                                                                registers && registers.length > 0 ?
                                                                    registers && registers.map((item, index) => {
                                                                        var inr = true
                                                                        return (
                                                                            (item.IsSelfCheckout == false || (item.IsSelfCheckout == true && loginDetails && loginDetails.subscription_permission && loginDetails.subscription_permission.AllowSelfCheckout == true)) ?
                                                                                <li key={item.id} id={`loginRegisterTab${index}`} onClick={() => handleSubmit(item)} onKeyDown={handleBack} >
                                                                                    <div  className="user_choose-list-in" id={`div${item.id}`}>
                                                                                        <span>{item.name}
                                                                                        {/* .replace(/[^a-zA-Z]/g, ' ') */}
                                                                                            {fireBaseUsedRegister && fireBaseUsedRegister.length > 0 && fireBaseUsedRegister.map((firebaseItem, indx) => {
                                                                                                if (inr == true) {
                                                                                                    if (firebaseItem.RegisterId == item.id && firebaseItem.Status !=="available") {
                                                                                                        localStorage.setItem('firebaseStaffName', firebaseItem.StaffName)
                                                                                                        localStorage.setItem('firebaseSelectedRegisters', JSON.stringify(fireBaseUsedRegister))
                                                                                                        inr = false
                                                                                                        return <small key = {indx} className="ml-2">{firebaseItem.Status ? firebaseItem.Status=="in-use"?"In Use":firebaseItem.Status:"In Use" }</small>
                                                                                                        //  <input type='button'
                                                                                                        //     id="registerAlreadyUsed"
                                                                                                        //     className="transparent no-outline  btnpark btnpark-reverse"
                                                                                                        //     value='in Use'
                                                                                                        //     style={{ marginLeft: '15px', borderRadius: '20px', fontStyle: 'italic' }}
                                                                                                        // />
                                                                                                    }
                                                                                                }

                                                                                            })}
                                                                                            </span>                                                                                        
                                                                                    </div>
                                                                                   <img src="../assets/img/onboarding/left-chevron.svg"
                                                                                        alt="" />
                                                                                </li>
                                                                                :
                                                                                null

                                                                        )
                                                                    })
                                                                    :
                                                                    registers && registers.length == 0 ?
                                                                        <li key='1' id="loginRegisterTab">
                                                                            <div className="validationError text-center p-0">
                                                                                <span>{LocalizedLanguage.notFoundRegister}</span>
                                                                                {/* <img src="../assets/img/onboarding/left-chevron.svg" alt="" /> */}
                                                                            </div>
                                                                        </li> : ''
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="user_login__extra">
                                                    <label className="user_login-checkbox">
                                                        {/* <input type="checkbox" name="remember" onClick={() => checkStatus(!check)}  readOnly={true} /> {LocalizedLanguage.rememberRegister} */}
                                                        <input type="checkbox" name="remember" onClick={() => checkStatus(!check)} defaultChecked={check} readOnly={true} /> {LocalizedLanguage.rememberRegister}
                                                        <span className={'checkmark ' + (check == true ? ' checkUncheck' : ' ')}></span>
                                                    </label>
                                                </div>
                                            </form>
                                            {/* end part */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="user_login_colB">
                                <div className="user_login_aside"
                                    style={{ backgroundImage: "url('../assets/img/onboarding/connect.png')" }}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    )
}
export default WebLoginRegisterView;