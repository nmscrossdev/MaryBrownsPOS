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
        <div className="login-card-container">
           {!Sitelist  ?  <LoadingModal /> : ''}
           
                        {
                            Sitelist !== null && Sitelist !== undefined ?
                                Sitelist.subscriptions.length > 0 ?
                                    Sitelist.subscriptions.map((link, index) => {
                                        return (
                                            link.subscription_detail.activated == true ?
                                               
                                               <button className="login-card"  key={`siteLinkTab${index}`} id={`siteLinkTab${index}`} onClick={() => handleSubmit(link)} onKeyDown={handleBack} >
                                               <div className="icon-container">
                                                   <img src="../Assets/Images/SVG/Website.svg" alt="" className="fix-1" />
                                               </div>
                                               <div className="text-group" >
                                                   <p>{link.subscription_detail.host_name}</p>
                                               </div>
                                               <div className="button">Select</div>
                                           </button>
                                                :
                                                <button className="login-card"  key={`siteLinkTab${index}`} id={`siteLinkTab${index}`} onClick ={showSubscriptionPopup}  title="Site is not connected to bridge!">
                                                <div className="icon-container">
                                                    <img src="../Assets/Images/SVG/Website.svg" alt="" className="fix-1" />
                                                </div>
                                                <div className="text-group" >
                                                    <p>{link.subscription_detail.host_name}</p>
                                                </div>
                                                <div className="button">Select</div>
                                            </button>
                                               
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
                  
            
     </div>
    )
}
export default WebSiteLinkViewFirst;