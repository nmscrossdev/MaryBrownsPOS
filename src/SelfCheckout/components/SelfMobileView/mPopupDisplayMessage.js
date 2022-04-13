import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';

class MobilePopupDisplayMessage extends React.Component {
    constructor(props) {
        super(props);
        this.closePopupDisplayMessage = this.closePopupDisplayMessage.bind(this);
    }

    closePopupDisplayMessage() {
        hideModal('mobilePopupDisplayMessage');
    }

    render() {
        return (
            <div className="modal" id="mobilePopupDisplayMessage" tabIndex="-1" role="dialog" aria-labelledby="cancle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm modal-message">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="text-center p-30">
                        <h6>{LocalizedLanguage.selectAllAttributes}</h6>
                            <p>{LocalizedLanguage.selectSpecificVariation}</p>
                            <button type="button" className="btn btn-primary shadow-none btn-yes fz-14 h-50-pxi" data-dismiss="modal" onClick={() => this.closePopupDisplayMessage()}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>   
        )
    }
}
function mapStateToProps(state) {
    return {
    };
}
const connectedMobilePopupDisplayMessage = connect(mapStateToProps)(MobilePopupDisplayMessage);
export { connectedMobilePopupDisplayMessage as MobilePopupDisplayMessage };
