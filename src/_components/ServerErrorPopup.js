import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

const reloadUrl = () => {
    // console.log("history",)
    location.reload();
}

const closeModal = () => {
    $('#ServerErrorPopup').removeClass("show"); 
}

export const ServerErrorPopup = (props) => {
    return (
    //     (isMobileOnly == true) ?
    //     <div style={{ backgroundColor: '#808080b0' }} className="modal fade ErrorNotification" id="ServerErrorPopup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    //     <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
    //         <div className="modal-content text-center">
    //             <div className="modal-body py-4">
    //                 <div className="w-100 float-left">
    //                     <h6>{LocalizedLanguage.serverErrTitle}</h6>
    //                     <p>{LocalizedLanguage.serverErrSubTitle} <br />{props.message}</p>
    //                     <button  onClick={() => reloadUrl()} type="button" className="popup-close btn btn-primary btn-sm shadow-none" data-dismiss="modal">{LocalizedLanguage.tryAgain}</button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    //         :
            <div id="ServerErrorPopup" tabIndex="-1" className="popup hide">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="popup-close" data-dismiss="modal" aria-hidden="true">
                                <img src="assets/img/Close.svg" />
                            </button>
                            <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.serverErrTitle}</h4>
                        </div>
                        <div className="modal-body p-0">
                            <h3 id="epos_error_model_message" className="popup_payment_error_msg"> {LocalizedLanguage.serverErrSubTitle} <br /><br />{props.message}</h3>
                        </div>
                        {/* <div className="modal-body p-0">
                        <h3 id="epos_error_model_message" className="popup_payment_error_msg">{props.message}</h3>
                    </div> */}
                        <div className="modal-footer p-0">
                            <button type="button" onClick={() => reloadUrl()} className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.tryAgain}</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}