/**
 * Created By : Shakuntala Jatav
 * Created Date : 27-03-2020
 * Description : Detele confirmation modal for customer
 */
import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

const closeModal = () => {
    $('#delete_information').removeClass('show');
}

export const ConfirmationPopup = (props) => {
    const { deleteCustomer, popup_status, Cust_ID } = props;
    return (
        (isMobileOnly == true) ?
            <div style={{ backgroundColor: '#808080b0' }} className="modal ErrorNotification" id="delete_information" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div className="modal-content text-center">
                        <div className="modal-body py-4">
                            <div className="w-100 float-left">
                                <h6>{LocalizedLanguage.messageTitle}</h6>
                                {Cust_ID == ' ' || Cust_ID !== ' ' && popup_status == true ?
                                    <p>{LocalizedLanguage.sureDeleteMesg}</p>
                                    :
                                    Cust_ID == ' ' || Cust_ID !== ' ' && popup_status == false ?
                                        <p>{LocalizedLanguage.chooseCustomerMsg}</p>
                                        : ''}
                                <button type="button" onClick={() => deleteCustomer()} className="btn btn-primary btn-sm shadow-none" data-dismiss="modal">{LocalizedLanguage.okTitle}</button>
                                <button style={{ marginLeft: 30 }} type="button" onClick={() => closeModal()} className="btn btn-dark btn-sm shadow-none" data-dismiss="modal">{LocalizedLanguage.cancel}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div id="delete-information" className="modal modal-wide modal-wide1 fade">
                <div className="modal-dialog" id="dialog-midle-align">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                <img src="../assets/img/Close.svg" />
                            </button>
                            <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.alertMsg}</h4>
                        </div>
                        <div className="modal-body p-0">
                            {Cust_ID == ' ' || Cust_ID !== ' ' && popup_status == true ? (
                                <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.sureDeleteMesg}</h3>
                            )
                                : Cust_ID == ' ' || Cust_ID !== ' ' && popup_status == false ?
                                    <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.chooseCustomerMsg}</h3>
                                    : ''
                            }
                        </div>
                        <div className="modal-footer p-0">
                            {Cust_ID && popup_status == true ? (
                                <button type="button" onClick={() => deleteCustomer()} className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                            ) :
                                <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
    )
}