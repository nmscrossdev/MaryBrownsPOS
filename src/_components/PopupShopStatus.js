import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage';

export const PopupShopStatus = () => {
    return (
        <div id="PopupShopStatus" tabIndex="-1" className="modal modal-wide fade ">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                            <img src="assets/img/Close.svg" />
                        </button>
                        <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.warningTitle}</h4>
                    </div>
                    {/* Client is inactive. You can not make order, please contact to administrator */}
                    <div className="modal-body p-0">
                        <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.warningMessage}</h3>
                    </div>
                    <div className="modal-footer p-0">
                        <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}