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
                <div>
                    <h4>{LocalizedLanguage.selectAllAttributes}</h4>
                    <p>{LocalizedLanguage.selectSpecificVariation}</p>
                    <button type="button" className="popup-close"  onClick={() => this.closePopupDisplayMessage()}>Continue
                    </button>
                </div>
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
