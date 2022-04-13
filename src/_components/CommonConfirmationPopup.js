/**
* Created By : Shakuntala Jatav
* Created Date : 27-03-2020
* Description : Detele confirmation modal for customer
*/
import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

export const CommonConfirmationPopup = (props) => {
    return (
        <div id="redeem_confirmation" className="modal modal-wide modal-wide1 fade">
            <div className="modal-dialog" id="dialog-midle-align">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={()=>props.close_confirm_modal()}>
                            <img src="../assets/img/Close.svg" />
                        </button>
                        <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.alertMsg}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <h3 id="epos_error_model_message" className="popup_payment_error_msg">{props.msg_text}</h3>


                    </div>
                    <div className="modal-footer p-0">
                        <button type="button" onClick={() => props.okClick()} className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                        {/* <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button> */}

                    </div>
                </div>
            </div>
        </div>
    );
}