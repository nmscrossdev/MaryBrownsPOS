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
                <PopupShopStatus />
                <div>
                    <div className="user_login user_login_center scroll-auto" onClick={autoFocusIs()}>
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
                        <div>
                            <div className="user_login_container"  onClick={this.goBack}>
                                <div className="user_login-back">
                                    <img src="../assets/img/onboarding/right-chevron.svg" /> Go Back
                            </div>
                            </div>
                        </div>
                        <div className="user_login_pages">
                            <div className="user_login_container">
                                <div className="user_login_row">
                                    <div className="user_login_colA">
                                        <div className="user_login_form_wrapper">
                                            <div className="user_login_form_wrapper_container">
                                                <div className="user_login_form">
                                                    <div className="user_login_head">
                                                        <div className="user_login_head_logo">
                                                            <a href="#">
                                                                <img src="../../assets/images/logo-dark.svg" alt="" />
                                                            </a>
                                                        </div>
                                                        <h3 className="user_login_head_title">
                                                            {LocalizedLanguage.selectSite}
                                                        </h3>
                                                        <h3 className="user_login_head__title">
                                                            {/* {LocalizedLanguage.selectSiteDetail} */}
                                                        </h3>
                                                    </div>
                                                    <SiteLinkViewFirst onVersionStateChange={this.handleVersionChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user_login_colB">
                                        <div className="user_login_aside"
                                            style={{ backgroundImage: "url('../assets/img/onboarding/connect.png')" }}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
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