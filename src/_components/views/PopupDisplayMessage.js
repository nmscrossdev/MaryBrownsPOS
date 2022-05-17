import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class PopupDisplayMessage extends React.Component {
    constructor(props) {
        super(props);
        this.closePopupDisplayMessage = this.closePopupDisplayMessage.bind(this);
    }
    /**
     * Created By: Aman Singhai
     * Created Date:12/08/2020
     * Description: for closing the popup
     */
    closePopupDisplayMessage() {
        hideModal('popupDisplayMessage');
    }

    render() {
        return (
            <div className="popup hide" id="popupDisplayMessage">
                 <div className="modal-dialog modal-sm modal-md2 modal-center-block">
                    <div className="modal-content">
                        <div className="modal-body center-center pt-5 pb-5">
                            <div className="plan-info">
                                    <h4 className='attributenameinfo'>{LocalizedLanguage.selectAllAttributes}</h4>
                                    <p className="mb-3 mt-3 newvariable">{LocalizedLanguage.selectSpecificVariation}</p>
                                <button type="button" className="btn btn-primary btn-lg mb-3" data-toggle="modal" onClick={() => this.closePopupDisplayMessage()}
                                        data-target="#myModal">Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div>
                    <h4>{LocalizedLanguage.selectAllAttributes}</h4>
                    <p>{LocalizedLanguage.selectSpecificVariation}</p>
                    <button type="button" className="popup-close"  onClick={() => this.closePopupDisplayMessage()}>Continue
                    </button>
                </div> */}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
    };
}
const connectedPopupDisplayMessage = connect(mapStateToProps)(PopupDisplayMessage);
export { connectedPopupDisplayMessage as PopupDisplayMessage };
