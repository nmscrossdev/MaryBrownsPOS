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
            <div className="popup hide" id="popupDisplayMessage"  data-keyboard="false" data-backdrop="static" role='dialog' >
                <div className="product-container">
                    <div type="button" className="popup-close" data-dismiss="modal" aria-hidden="true">
                        <svg onClick={() => hideModal('popupDisplayMessage')}
                            width="22"
                            height="21"
                            viewBox="0 0 22 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.0466 21L10.7521 12.9L2.45762 21L0 18.6L8.29448 10.5L0 2.4L2.45762 0L10.7521 8.1L19.0466 0L21.5042 2.4L13.2097 10.5L21.5042 18.6L19.0466 21Z"
                                fill="#050505"
                            />
                        </svg>
                    </div>
                    <p className="prod-name" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</p>
                    <div className="prod-wrapper">
                        <p id="epos_error_model_message" style={{ fontSize: "2.59vw", textAlign: "center", marginBottom: "3vw" }}>{LocalizedLanguage.selectAllAttributes}</p>
                        <p id="epos_error_model_message" style={{ fontSize: "2.59vw", textAlign: "center", marginBottom: "3vw" }}>{LocalizedLanguage.selectSpecificVariation}</p>#\
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button style={{ width: "50vw" }} className="view-cart" type="button" onClick={() => hideModal('popupDisplayMessage')}>{LocalizedLanguage.okTitle}</button>
                    </div>
                </div>


                {/* <div className="modal-dialog modal-sm modal-md2 modal-center-block">
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
