import React from 'react';
import { LoadingModal } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { AndroidAndIOSLoader ,Footer} from '../../_components';
import { Markup } from 'interweave';
const WebLoginLocation = (props) => {
    //console.log("%cWebLoginLocation state", 'color:green', props);
    const { autoFocusIs, windowLocation, handleSubmit, handleBack, checkStatus, UserLocations, check, loading, notFounLocation, isLoading, clear } = props;
    return (
        <div>
            {loading == true || isLoading === false ? <AndroidAndIOSLoader /> : ''}
            <div className="user_login user_login_center scroll-auto" onClick={autoFocusIs()}>
                <div>
                    <div className="user_login_container" onClick={() => clear()}>
                        <div className="user_login-back" onClick={() => windowLocation('/site_link')}>
                            <img src="../assets/img/onboarding/right-chevron.svg" />  {LocalizedLanguage.goBack}
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
                                                    {LocalizedLanguage.chooseLocation}
                                                </h3>
                                                <h3 className="user_login_head__title">
                                                    {/* {LocalizedLanguage.chooseLocationDetail} */}
                                                </h3>
                                            </div>
                                            <form>
                                                <div className="user_choose-links scroll-hidden">
                                                    <div className={isMobileOnly == true ? 'user_choose-list' : 'user_choose-list user_choose-list-noScroll'}>
                                                        <ul>
                                                            {UserLocations && UserLocations.length > 0 ? UserLocations.map((item, index) => {
                                                                return (
                                                                    <li key={index} onClick={() => handleSubmit(item)} onKeyDown={handleBack} style={{marginBottom:"unset"}}>
                                                                        {/* <a href="javascript:void(0)" id={`loginLocationTab${index}`} > */}
                                                                        <span id={`loginLocationTab${index}`} style={{marginBottom:"unset"}}><Markup content= {item && item.name } /></span>
                                                                        <img src="../assets/img/onboarding/left-chevron.svg" alt="" />
                                                                        {/*&& item.name.replace(/[^a-zA-Z]/g, ' ') */}
                                                                    </li>
                                                                    // <!-- <li key={index} onClick={() => handleSubmit(item)} onKeyDown={handleBack} >
                                                                    //         <span id={`loginLocationTab${index}`}  >{item.Name.replace(/[^a-zA-Z]/g, ' ')}</span>
                                                                    //         <i className="icon icon-right-fill-2 icon-css-override text-success pointer  fs36"></i>
                                                                    // </li> -->
                                                                )
                                                            }) :
                                                                UserLocations && UserLocations.length == 0 ?
                                                                    <li><a href="javascript:void(0)">{LocalizedLanguage.notFoundLocation}</a></li>
                                                                    // <!-- <li className="list-group-item" ><a href="javascript:void(0)">{LocalizedLanguage.notFoundLocation}</a></li> -->
                                                                    : ""
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="user_login__extra">
                                                    <label className="user_login-checkbox">
                                                        {/* <input type="checkbox" name="remember" onClick={() => checkStatus(!check)} />{LocalizedLanguage.rememberLocation} */}
                                                        <input type="checkbox" name="remember" onClick={() => checkStatus(!check)} defaultChecked={check} readOnly={true} />{LocalizedLanguage.rememberLocation}
                                                        <span className={'checkmark ' + (check == true ? ' checkUncheck' : ' ')}></span>
                                                    </label>
                                                </div>
                                                {notFounLocation == true ?
                                                    <div className="validationError text-center">
                                                        {LocalizedLanguage.notSetectLocation}
                                                    </div>
                                                    // <div className="user_login__extra">
                                                    //     <p>{LocalizedLanguage.notSetectLocation}</p>
                                                    // </div>
                                                    : ""
                                                }
                                            </form>
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
                <Footer />
            </div>
        </div>
    )
}
export default WebLoginLocation;