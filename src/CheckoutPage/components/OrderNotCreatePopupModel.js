import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from 'react-device-detect'

export const OrderNotCreatePopupModel = (props) => {
    return (
        (isMobileOnly == true) ?
            <div style={{ backgroundColor: '#808080b0' }} className="modal fade ErrorNotification" id="ordernotSuccesModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div className="modal-content text-center">
                        <div className="modal-body py-4">
                            <div className="w-100 float-left">
                                <h6>{LocalizedLanguage.messageTitle}</h6>
                                <p>{props.errOnPlaceOrder}</p>
                                <button onClick={() => props.statusUpdate(true)} type="button" className="btn btn-primary btn-sm shadow-none" data-dismiss="modal">{LocalizedLanguage.okTitle}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div id="ordernotSuccesModal" tabIndex="-1" className="modal modal-wide fade disabled_popup_background">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                <img src="../assets/img/delete-icon.png" />
                            </button>
                            <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                        </div>
                        <div className="modal-body p-0">
                            <h3 id="epos_error_model_message" className="popup_payment_error_msg">{props.errOnPlaceOrder}</h3>
                        </div>
                        <div className="modal-footer p-0">
                            <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true" onClick={() => props.statusUpdate(true)} >{LocalizedLanguage.okTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}