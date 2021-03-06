import React from 'react';
import { LoadingModal } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { AndroidAndIOSLoader ,Footer} from '../../_components';
import { Markup } from 'interweave';
import {encodeHtml} from '../../settings/SelfCheckoutSettings';
const WebLoginLocation = (props) => {
    //console.log("%cWebLoginLocation state", 'color:green', props);
    var subscriptionClientDetail = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : '';
    const { autoFocusIs, windowLocation, handleSubmit, handleBack, checkStatus, UserLocations, check, loading, notFounLocation, isLoading, clear } = props;
    return (
        <div>
            {loading == true || isLoading === false ? <LoadingModal /> : ''}
            <div className="login-header">
                <div className="login-go-back"  onClick={() =>windowLocation('/site_link')}>
                    <img src="../Assets/Images/SVG/LesserThan.svg" alt="" />
                    <p> {LocalizedLanguage.goBack}</p>
                </div>
                <p>{subscriptionClientDetail && subscriptionClientDetail.user_full_name}</p>
            </div>
            <div className="login-selection-wrapper">
			<p> {LocalizedLanguage.chooseLocation}</p>
			<div className="divider"></div>
			<div className="login-card-container">
            {
           
           UserLocations && UserLocations.length > 0 ? UserLocations.map((item, index) => {
            return (
              <button key={"item_"+index} className="login-card" onClick={() => handleSubmit(item)} onKeyDown={handleBack} >
              <div className="icon-container">
                  <img src="../Assets/Images/SVG/Store.svg" alt="" className="fix-1" />
              </div>
              <div className="text-group" id={`loginLocationTab${index}`} >
                  <p>{item && item.name ?encodeHtml(item && item.name ):''}</p>
              </div>
              <div className="button">Select</div>
          </button>
            )
        }) :
            UserLocations && UserLocations.length == 0 ?
            <div ><p>{LocalizedLanguage.notFoundLocation} </p></div> : ""
        }
			</div>
            {notFounLocation == true ?
                    <div >
                        {LocalizedLanguage.notSetectLocation}
                    </div>
                    : ""
                } 
                
    </div>
           
        </div>
    )
}
export default WebLoginLocation;