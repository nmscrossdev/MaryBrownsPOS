import React from 'react';
import { SiteLinkViewFirst } from '../components/SubSiteLinkView';
import { PopupShopStatus, CommonMsgModal,Footer } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class WebSiteLinkView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOldVersion: false
        }
    }
    closeSubscriptionExpiredPopup = () => {
        hideModal('common_msg_popup')
    }
    handleVersionChange = (isOldVersion) => {
        this.setState({ isOldVersion })
    }
    // retry button click
    handleRetryButtonClick = () => {
        window.location.href = process.env.BRIDGE_DOMAIN;
    }
     goBack = () => {
        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
            {
                Android.wrapperLogout();
            }
            else
            {
                window.location = "/login";
        
            }
        }

    render() {
        const { autoFocusIs } = this.props;
        // console.log("%cweb view props",'color:blue',  this.props);
        return (
            <div>
                {this.state.isOldVersion ? <div className="user_hard-blocker close_hard_blocker" id="test">
                            <div className="user_hard-blocker_container">
                                <div className="user_hard-blocker_pop">
                                    <img src="../assets/img/onboarding/blocker.svg" alt="" />
                                    <h3>Your Oliver POS Plugin must be updated! </h3>
                                    <p>To continue using Oliver POS, please update your Bridge Plugin to the latest version! </p>
                                    <button className="btn btn-primary btn-60" onClick={this.handleRetryButtonClick} id="close_hard_blocker" >Retry</button>
                                </div>
                            </div>
                        </div> : ''}
                        <div className="login-header" >
                            <div className="login-go-back"  onClick={this.goBack}>
                                <img src="../Assets/Images/SVG/LesserThan.svg" alt="" />
                                <p>Go Back</p>
                            </div>
                        </div>
                        <div className="login-selection-wrapper">
                        <p>Choose Site</p>
                        <div className="divider"></div>
                        <div className="login-card-container">
                            
                        <SiteLinkViewFirst onVersionStateChange={this.handleVersionChange} />
                            
                        </div>
                    </div>
               
                <CommonMsgModal 
                msg_text={'Your subscription has been expired!'} 
                close_Msg_Modal={this.closeSubscriptionExpiredPopup} />

            </div>
        )
    }
}

export default WebSiteLinkView;