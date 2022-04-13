import React from 'react';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';
//LocalizedLanguage.discountMoreThenMsg
export const DiscountMsgPopup = (props) => {
    var msg = (props ? props.msg_text? props.msg_text : LocalizedLanguage.discountMoreThenMsg : LocalizedLanguage.discountMoreThenMsg)
    return(
        <div id="no_discount" className="modal modal-wide modal-wide1 fade">
        <div className="modal-dialog" id="dialog-midle-align">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                        <img src="../assets/img/delete-icon.png" />
                    </button>
                    <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                </div>
                <div className="modal-body p-0">
                    <h3 id="epos_error_model_message" className="popup_payment_error_msg">{msg}</h3>
                </div>
                <div className="modal-footer p-0">
                    <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                </div>
            </div>
        </div>
    </div>
  );
}