/**
 * Created By:priyanka
 * Created Date:14/6/2019
 * Description:quantity msg poppup 
 */

import React from 'react';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';

export const CommonMsgModal = (props) => {
    return (
        <div id="common_msg_popup" className="modal modal-wide modal-wide1 fade modal-wide-sm">
            <div className="modal-dialog" id="dialog-midle-align">
                <div className="modal-content">
                    <div className="modal-header">
                        <button onClick={props.close_Msg_Modal} type="button" className="close" data-dismiss="modal" aria-hidden="true">
                            <img src="../assets/img/Close.svg" />
                        </button>
                        <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div id="epos_error_model_message" className="popup_payment_error_msg">{props.msg_text}</div>
                    </div>
                    <div className="modal-footer p-0" onClick={props.close_Msg_Modal}>
                        <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}