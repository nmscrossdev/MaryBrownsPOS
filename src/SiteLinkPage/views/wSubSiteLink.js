import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { LoadingModal, AndroidAndIOSLoader, showProductxModal } from '../../_components';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
const WebSiteLinkViewFirst = (props) => {
   // console.log("%cweb view props", 'color:pink', props);
    const { isOldVersion, handleSubmit,Sitelist, handleBack } = props;
    console.log("Sitelist",Sitelist)
        //    show popup on subscription expired
    const showSubscriptionPopup = ()=>{
        showModal('common_msg_popup')
    }
    
    return (
        <form action="index.html" >
           {!Sitelist  ? isMobileOnly == true? <AndroidAndIOSLoader/> : <LoadingModal /> : ''}
            <div className="user_choose-links scroll-hidden">
                {/* hardblocker */}
                {/* {true ? <div className="user_hard-blocker close_hard_blocker" id="test">
                        <div className="user_hard-blocker_container">
                            <div className="user_hard-blocker_pop">
                                <img src="../assets/img/onboarding/blocker.svg" alt="" />
                                <h3>Your Oliver POS Plugin must be updated! </h3>
                                <p>To continue using Oliver POS, please update your Bridge Plugin to the latest version! </p>
                                <button class="btn btn-primary btn-60" id="close_hard_blocker" onClick={handleRetryButtonClick}>Retry</button>
                            </div>
                        </div>
                    </div> : ''} */}

                    {/* hardblocker */}
                <div className="user_choose-list user_choose-list-noScroll">
                    <ul>
                        {
                            Sitelist !== null && Sitelist !== undefined ?
                                Sitelist.subscriptions.length > 0 ?
                                    Sitelist.subscriptions.map((link, index) => {
                                        return (
                                            link.subscription_detail.activated == true ?
                                                <li key={`siteLinkTab${index}`} id={`siteLinkTab${index}`} onClick={() => handleSubmit(link)} onKeyDown={handleBack} >
                                                    <span style={{marginBottom:"unset"}}>{link.subscription_detail.host_name}</span>
                                                    <img src="../assets/img/onboarding/left-chevron.svg"
                                                        alt="" />
                                                </li>
                                                :
                                                <li  key={index} title="Site is not connected to bridge!" onClick ={showSubscriptionPopup}>
                                                    <span style={{marginBottom:"unset"}}>{link.subscription_detail.host_name}</span>
                                                    <img src="../assets/img/onboarding/left-chevron.svg"
                                                        alt="" />
                                                </li>
                                        )
                                    })
                                    :
                                    <li key='1'>
                                    <span>{LocalizedLanguage.notFoundSite}</span>
                                    <img src="../assets/img/onboarding/left-chevron.svg"
                                        alt="" />
                                </li>
                                :
                                <li key='1'>
                                <span>{LocalizedLanguage.notFoundSite}</span>
                                <img src="../assets/img/onboarding/left-chevron.svg"
                                    alt="" />
                            </li>                    
                        }
                    </ul>
                </div>
            </div>
        </form>
    )
}
export default WebSiteLinkViewFirst;