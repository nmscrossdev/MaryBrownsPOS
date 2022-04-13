import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { HelpingTeamImages } from '../'
import { OnboardingShopViewPopup } from './OnboardingShopViewPopup';
import { onboardingActions } from '../action/onboarding.action';
import { get_UDid } from '../../ALL_localstorage';
import { connect } from 'react-redux';
import Config from '../../Config'

class LoadMyProductsModal extends React.Component {
    handleBtnClick = () => {
        //  window.location.href = `https://oliverpos.com/contact-oliver-pos/`
        window.open(
            Config.key.OLIVERPOS_CONTACT_LINK,
            '_blank'
        );
    }
    handleContinueClick = () => {
        hideModal('onBoardingPopupProduct');
        var VisiterShopAuthToken = localStorage.getItem('VisiterShopAuthToken') ? localStorage.getItem('VisiterShopAuthToken') : ''
        var VisiterClientID = localStorage.getItem('VisiterClientID') ? localStorage.getItem('VisiterClientID') : ''

        // process.env.BRIDGE_DOMAIN + `account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}`,
        window.open(
            process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}`,
            '_blank'
        );
        //    window.location.href = process.env.BRIDGE_DOMAIN + `account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}`
    }
    // https://dev1.shop.olivertest.com/Account/VerifyClient/?_client=f9f1832c-89d0-471a-8146-ac26160caa7f&_token=XYNcNEMmJDkvXd3BAUk83f+2Bzj5DdpV8X/6IM50HwMikfYIQBZ7CgTCEn6c8stqlK81/bSbKoV4q4L15T3rAJmxVrZ/HrdXwfz8nj5Pm6M=
    handleLoadProductCLick = () => {
        var VisiterShopAuthToken = localStorage.getItem('VisiterShopAuthToken') ? localStorage.getItem('VisiterShopAuthToken') : ''
        var VisiterClientID = localStorage.getItem('VisiterClientID') ? localStorage.getItem('VisiterClientID') : ''
        // process.env.BRIDGE_DOMAIN + `account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}`,
        window.open(
            process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}`,
            '_blank'
        );

        // open onBoardingPopupProduct modal  
        // showModal('onBoardingPopupProduct')
        //    }
    }
    render() {
        return (
            <div>
                <div id="LoadMyProduct" className="modal fade popupOnboarding" role="dialog">
                    {/* <div id="AlreadyConnected" classNameName="modal fade" role="dialog"> */}
                    {/* <div className="modal fade popupOnboarding" id="needhelpinghand" role="dialog"> */}
                    <div className="modal-dialog modal-lg modal-center-block">
                        <div className="modal-content">
                            <div className="data-dismiss" data-dismiss="modal">

                                <img src="../assets/img/onboarding/closenew3.svg" alt="" className="need-desktop" />
                                {/* <img src="assets/img/onboarding/closenew3.svg" alt="" className="need-mobile"> */}

                                {/* <img src="../assets/img/onboarding/closenew.svg" alt="" /> */}
                            </div>
                            <div className="modal-body p-0">
                                <div className="row card-need-help">
                                    <div className="col-sm-12 col-md-5 card-need-left">
                                        <h1>Need a helping hand?</h1>
                                        <div className="card-need-content">
                                            <div className="card-need-inner">
                                                <div className="card-need-media">
                                                <img src="../assets/img/onboarding/team-g.png" className="img-responsive" />
                                                    {/* <div className="user_bridge_people">
                                                        <div className="block-helping-team" id="getteamheight">
                                                            <div className="block-help-team-memeber">
                                                                <img src="../assets/img/onboarding/team1.png" alt="" />
                                                            </div>
                                                            <div className="block-help-team-memeber-overlay">
                                                                <div className="block-help-team-memeber">
                                                                    <img src="../assets/img/onboarding/team2.png" alt="" />
                                                                </div>
                                                                <div className="block-help-team-memeber">
                                                                    <img src="../assets/img/onboarding/team3.png" alt="" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            Our support team can walk you through the setup process and get you started in minutes.
                                            <button className="card-need-button" onClick={this.handleBtnClick}>
                                                    Contact Us
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-7 card-need-right">
                                        <h1>Ready to Sync your Products?</h1>
                                        <div className="card-need-content">
                                            <div className="card-need-inner">
                                                <div className="card-need-media">
                                                    <img src="../assets/img/onboarding/screen2.png" className="img-responsive" />
                                                </div>
                                            Now that you’ve connected your Oliver POS Bridge on your Website, Let’s sync your WooCommerce Products!
                                            <button className="card-need-button" onClick={this.handleLoadProductCLick}>
                                                    Sync my WooCommerce Products
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <OnboardingShopViewPopup
                    title={"Yes, I'm ready to Sync my WooCommerce products "}
                    subTitle={"Once you select 'Continue' your account will be updated and your demo products will be replaced with your WooCommerce Products!"}
                    onClickContinue={this.handleContinueClick}
                    imageSrc={'../assets/img/onboarding/bridgeconnected.svg'}
                    id={'onBoardingPopupProduct'}
                    btnTitle={LocalizedLanguage.Continue}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { UpdateGoToDemo } = state;
    return {
        response: UpdateGoToDemo.response
    };
}
const connectedModal = connect(mapStateToProps)(LoadMyProductsModal);
export { connectedModal as LoadMyProductsModal };
