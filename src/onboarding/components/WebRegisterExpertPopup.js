import React from 'react';
import { OnboardingLeftSideModal, HelpCommonCard, HelpingTeamImages } from "../";

class WebRegisterExpertPopup extends React.Component {

    render() {
        return (
            <div id="EXPERTS" className="modal fade" role="dialog">
                <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <button className="btn btn-danger card-close card-close2" data-dismiss="modal">
                                <img src="../assets/img/onboarding/closenew3.svg" alt="" />
                            </button>
                            <div className="container-fluid">
                                <div className="row connect-no-gutters connect-row">
                                    <div className="col-sm-5">
                                        <div className="card no-border text-center card-boarding-light card-basic">
                                            <div className="card-header no-border">
                                                <h1 className="userbridge-heading">Connect and Sell Now.</h1>
                                            </div>
                                            <div className="card-body card-body-around pt-0 pb-0">
                                                <div className="card-installation spacer-x-5">
                                                    <img src="../assets/img/onboarding/connect.png" className="img-responsive" alt="" />
                                                    <p className="card-description">Feel like connecting your site right now?</p>
                                                    <h3 className="card-description card-description-bold"> It’s easy to get started with Oliver POS on your own. </h3>
                                                    <button className="btn btn-success btn-boarding btn-60 btn-padding-20 btn-radius-2 btn-text-white btn-break"
                                                     data-toggle="modal"
                                                     data-target="#BRIDGENOTCONNECTED"
                                                     data-dismiss="modal"
                                                     >Install Oliver POS Now!</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-7">
                                        <div className="card no-border text-center card-boarding-light card-basic card-primary card-expert-info full-height">
                                            <div className="card-header no-border">
                                                <h1 className="userbridge-heading">Need a Helping Hand?</h1>
                                            </div>
                                            <div className="card-body card-body-around pt-0 pb-0">
                                                <div className="overflowscroll block__sell_height2">
                                                    <div>
                                                        <div className="card-our-expert">
                                                            <div className="card-our-expert-top">
                                                                <div className="block-helping-team">
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
                                                                <p className="font-sm expert-option--para">We’re here to help get you set up with Oliver POS!  Here’s how to Connect with us!</p>
                                                            </div>
                                                            <div className="row row-col-equal">
                                                                <div className="col-sm-2">
                                                                    <div className="card card-basic card-shadow text-center card-equal">
                                                                        <div className="card-header no-border pb-1">
                                                                            <h1 className="font-lg">Schedule an Online Demo</h1>
                                                                        </div>
                                                                        <div className="card-body font-sm py-0">
                                                                            <img src="../assets/img/onboarding/restaurant_table.svg" className="img-responsive m-auto" width="70" alt="" />
                                                                            <p className="pt-3">Our Experts walk you through the installation and setup Process! </p>
                                                                        </div>
                                                                        <div className="card-footer no-border">
                                                                            <button className="btn btn-primary btn-40 btn-break btn-boarding btn-min-200 btn-radius-2 font-sm"
                                                                            data-toggle="modal"
                                                                            data-target="#EXPERTSDemo"
                                                                            data-dismiss="modal"
                                                                            >Book a Time</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-2">
                                                                    <div className="card card-basic card-shadow text-center card-equal">
                                                                        <div className="card-header no-border pb-1">
                                                                            <h1 className="font-lg">Live Chat with Us </h1>
                                                                        </div>
                                                                        <div className="card-body font-sm py-0">
                                                                            <img src="../assets/img/onboarding/WeChat.svg" className="img-responsive m-auto" width="70" alt="" />
                                                                            <p className="pt-3">Chat with a Support Professional Live to get the help you need Rrght now!</p>
                                                                        </div>
                                                                        <div className="card-footer no-border">
                                                                            <button className="btn btn-success btn-40 btn-break btn-boarding btn-min-200 btn-radius-2 font-sm"
                                                                             data-toggle="modal"
                                                                             data-target="#EXPERTSchat"
                                                                             data-dismiss="modal"
                                                                             >Let’s Talk it Out </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-2">
                                                                    <div className="card card-basic card-shadow text-center card-equal">
                                                                        <div className="card-header no-border pb-1">
                                                                            <h1 className="font-lg">We’ll Call You!</h1>
                                                                        </div>
                                                                        <div className="card-body font-sm py-0">
                                                                            <img src="../assets/img/onboarding/ringing_phone.svg" className="img-responsive m-auto" width="70" alt="" />
                                                                            <p className="pt-3">More of a Phone Call Person? We’ll Call you right away to answer your questions!</p>
                                                                        </div>
                                                                        <div className="card-footer no-border">
                                                                            <button className="btn btn-primary btn-40 btn-break btn-boarding btn-min-200 btn-radius-2 font-sm"
                                                                             data-toggle="modal"
                                                                             data-target="#EXPERTSCall"
                                                                             data-dismiss="modal"
                                                                             >Set up a Call</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export { WebRegisterExpertPopup };