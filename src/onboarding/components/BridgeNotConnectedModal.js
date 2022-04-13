import React from 'react';
import { connect } from 'react-redux';
import { HelpingTeamImages } from '../'
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { onboardingActions } from '../action/onboarding.action';
import { LoadingModal, showProductxModal } from '../../_components';
import { OnboardingShopViewPopup } from './OnboardingShopViewPopup';
import Config from '../../Config'

class BridgeNotConnectedModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }
    handleClick = () => {
        // window.location.href = `https://oliverpos.com/contact-oliver-pos/`
        window.open(
            Config.key.OLIVERPOS_CONTACT_LINK,
            '_blank'
        );
    }
    handleButtonClick = () => {
        var VisiterUserID = localStorage.getItem('VisiterUserID') ? localStorage.getItem('VisiterUserID') : ''
        var VisiterUserEmail = localStorage.getItem('VisiterUserEmail') ? localStorage.getItem('VisiterUserEmail') : ''
        if (VisiterUserID && VisiterUserEmail) {
            this.props.dispatch(onboardingActions.CheckShopConnected(VisiterUserID, VisiterUserEmail))
            this.setState({ loading: true })
        }

        // window.location.href = `${process.env.BRIDGE_DOMAIN}/contact-oliver-pos/`
    }

    handlePopupOkClick = () => {
        hideModal('bridgeNotConnectedPopup');
    }
    handleResponse = (res) => {
        this.setState({ loading: false })
        if (res && res.is_success == true) {
            var VisiterClientID = res.content.VisiterClientID
            var VisiterShopAuthToken = res.content.VisiterShopAuthToken
            window.open(
                process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}&_from=reg_first`
            );
            // window.location.href = process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?_client=${VisiterClientID}&_token=${VisiterShopAuthToken}&_from=reg_first`

            // https://dev1.shop.olivertest.com/Account/VerifyClient/?_client=1be77d3b-5571-4c44-8199-dff4d684712d&_token=ox7VVh8LqtXOXcoSGn/8AAL8ClfXo8Ph3O7OwCmm5EvZkor5/YjlkC3It84+/utA6yslZeHFNg3WrNzSqMKoMraiEDYbiBdBUHdo745mKgE=&_from=reg_first
        } else {
            // showPopup
            showModal('bridgeNotConnectedPopup')
        }
        // window.location.href = `https://oliverpos.com/contact-oliver-pos/`
    }

    componentWillReceiveProps = (nextProps) => {
        console.log('------nextProps------', nextProps);
        if (nextProps && nextProps.checkShopResponse) {
            this.handleResponse(nextProps.checkShopResponse)
        }
    }
    handleBridgeBtnClick = () => {
        var VisiterShopAuthToken = localStorage.getItem('VisiterShopAuthToken') ? localStorage.getItem('VisiterShopAuthToken') : ''
        var VisiterClientID = localStorage.getItem('VisiterClientID') ? localStorage.getItem('VisiterClientID') : ''
        window.location.href = process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?${VisiterClientID}&_token=${VisiterShopAuthToken}`
    }

    showBridgeButton = () => {
        var VisiterClientConnected = localStorage.getItem('VisiterClientConnected')
        if (VisiterClientConnected == 'true') {

            return <button onClick={this.handleBridgeBtnClick} className="btn btn-text-primary btn-border-primary btn-60 btn-break font-md btn-radius-2 btn-padding-25 bg-white">{LocalizedLanguage.GotoyourAccount}
            </button>
        } else {
            return <button onClick={this.handleButtonClick} className="btn btn-text-primary btn-border-primary btn-60 btn-break font-md btn-radius-2 btn-padding-25 bg-white"> {LocalizedLanguage.BirdgeNotConnected}</button>
            // <button
            //     data-toggle="modal" data-target="#EXPERTS" data-dismiss="modal"
            //     className="btn btn-outline-primary shadow-none btn-outline-primary-pos">

            //     </button>
        }
    }
    render() {
        var { loading } = this.state
        return (
            <div id="BRIDGENOTCONNECTED" className="modal fade" role="dialog">
                {loading ? <LoadingModal /> : ''}
                <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <button className="btn btn-danger card-close" data-dismiss="modal">
                                <img src="../assets/img/onboarding/closenew.svg" alt="" />
                            </button>
                            <div className="container-fluid fullheightpopup">
                                <div className="row connect-no-gutters connect-row">
                                    <div className="col-sm-12 col-lg-12 col-xs-12">
                                        {/* showing getting startted url in the bridgeNotConnected modal when bidge not connected */}
                                        <iframe src="https://oliverpos.com/getting-started/" width='100%' height="100%" title="getting-started"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  

                {/* old code */}
                {/* <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <button className="btn btn-danger card-close" data-dismiss="modal">
                                <img src="../assets/img/onboarding/closenew.svg" alt="" />
                            </button>
                            <div className="container-fluid fullheightpopup">
                                <div className="row connect-no-gutters connect-row">
                                    <div className="col-sm-5">
                                        <div className="card no-border text-center card-boarding-light card-basic card-primary card-expert-info full-height">
                                            <div className="card-header no-border">
                                                <h1 className="userbridge-heading">{LocalizedLanguage.Needahelpinghand}</h1>
                                            </div>
                                            <div className="card-body overflowscroll block__sell_height2">
                                                <HelpingTeamImages />


                                                <p className="font-sm">{LocalizedLanguage.SometimesMsg}</p>
                                                <div className="card-list">
                                                    <ul>
                                                        <li>
                                                            {LocalizedLanguage.WeconnectwithofWordPressWebsites}
                                                        </li>
                                                        <li>
                                                            {LocalizedLanguage.Wewalkyouthroughinstallation}
                                                        </li>
                                                        <li>
                                                            {LocalizedLanguage.WeshowyouallofwhatOliverPOScando}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <button className="btn btn-success btn-boarding btn-60 btn-padding-20 btn-radius-2 btn-text-white btn-break btn-border-success"
                                                    data-toggle="modal" onClick={this.handleClick}>{LocalizedLanguage.TalktoaHelpfulHuman}</button>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-7">
                                        <div className="card card-basic card-installation-process card-boarding-light full-height">
                                            <div className="card-header no-border">
                                                <h1 className="userbridge-heading">Connect and Sell Now.</h1>
                                            </div>
                                            <div className="overflowscroll block__sell_height2">
                                                <div className="card-body card-body-padding-large pb-0">
                                                    <div className="block__cardsteps">
                                                        <p><strong className="font-bold">STEP 1</strong>: Open your Wordpress site and find the Oliver POS Plugin.</p>
                                                        <img src="../assets/img/onboarding/giphy.gif" width="100%" />
                                                    </div>
                                                    <div className="block__cardsteps">
                                                        <p><strong className="font-bold">STEP 2</strong>: Activate and Install the Oliver POS Plugin on your WordPress site</p>
                                                        <img src="https://media.giphy.com/media/SYL0dUmh2LJR9lNdRs/giphy.gif" width="100%" />
                                                    </div>
                                                    <div className="block__cardsteps">
                                                        <p><strong className="font-bold">STEP 3</strong>: Open the Bridge Plugin and Launch Oliver POS! </p>
                                                        <img src="https://media.giphy.com/media/RITEnDMEc7zS2aCiub/giphy.gif" width="100%" />
                                                    </div>
                                                    <div className="block__cardsteps">
                                                        <p>Once you’ve connected your bridge and synced your products, you’re ready to start selling with Oliver POS.</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <OnboardingShopViewPopup
                    title={'Bridge still Not connected'}
                    subTitle={""}
                    onClickContinue={this.handlePopupOkClick}
                    imageSrc={'../assets/img/onboarding/bridgeconnected.svg'}
                    id={'bridgeNotConnectedPopup'}
                />

            </div>


        )
    }
}

function mapStateToProps(state) {
    const { UpdateGoToDemo, CheckShopConnected } = state;
    return {
        response: UpdateGoToDemo.response,
        checkShopResponse: CheckShopConnected.checkShopResponse
    };
}
const connectedModal = connect(mapStateToProps)(BridgeNotConnectedModal);
export { connectedModal as BridgeNotConnectedModal };
