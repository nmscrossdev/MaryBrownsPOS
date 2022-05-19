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
        console.log(this.props,"variation popup")
        return (
            <div className="popup hide" id="popupDisplayMessage" style={{overflowY:"hidden",textAlign:"center"}}>
                <div className="product-container">
                    <div className="modal-body center-center pt-5 pb-5">
                        <div className="plan-info">
                            <p style={{fontSize:"2.69vw"}}>{LocalizedLanguage.selectAllAttributes}</p>
                            <p style={{fontSize:"2.59vw"}}>{LocalizedLanguage.selectSpecificVariation}</p>
                            <button style={{width:"50vw",marginTop:"20px"}} className="view-cart" type="button"  onClick={() => this.closePopupDisplayMessage()}>{LocalizedLanguage.Continue}
                            </button>
                        </div>
                    </div>
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
