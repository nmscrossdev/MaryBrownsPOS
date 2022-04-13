import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

const noCallAnyFunction = () => {
    //  prevents for warning error
}

const WarningMessage = (props) => {
    const { msg_text, close_Msg_Modal, cancel_VoidSale, fl_VoidSale } = props;
    var voidButtonStyle = {
        marginRight: 10
    }
    if (LocalizedLanguage.voidSaleMsg == msg_text) {
        voidButtonStyle = {
            marginRight: 10,
            backgroundColor: '#e16b6b',
            border: '#e16b6b'
        }
    }
    return (
        <div style={{ backgroundColor: '#808080b0' }} className="modal fade ErrorNotification" id="common_msg_popup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div className="modal-content text-center">
                    <div className="modal-body py-4">
                        <div className="w-100 float-left">
                            <h6>{LocalizedLanguage.messageTitle}</h6>
                            <p>{msg_text}</p>
                            <button style={voidButtonStyle} onClick={LocalizedLanguage.voidSaleMsg == msg_text ? fl_VoidSale : noCallAnyFunction} type="button" className="btn btn-primary btn-sm shadow-none" data-dismiss="modal">{LocalizedLanguage.okTitle}</button>
                            {LocalizedLanguage.voidSaleMsg == msg_text ?
                                <button onClick={close_Msg_Modal} type="button" className="btn btn-dark btn-sm shadow-none" data-dismiss="modal">{LocalizedLanguage.cancel}</button>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default WarningMessage;