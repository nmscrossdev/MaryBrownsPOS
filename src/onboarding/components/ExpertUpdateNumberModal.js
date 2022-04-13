import React from 'react';
import { OnboardingLeftSideModal, HelpingTeamImages } from '../'
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class ExpertUpdateNumberModal extends React.Component {
    render() {
        return (
            <div id="EXPERTSEnterNum" className="modal fade" role="dialog">
                <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <button className="btn btn-danger card-close card-close2" data-dismiss="modal">
                                <img src="../assets/img/onboarding/closenew3.svg" alt="" />
                            </button>
                            <div className="container-fluid">
                                <div className="row connect-no-gutters connect-row">
                                    {/* common left side modal content */}
                                    <OnboardingLeftSideModal />
                                    <div className="col-sm-7">
                                        <div className="card no-border text-center card-boarding-light card-basic card-primary full-height">
                                            <div className="card-header no-border">
                                                <h1 className="userbridge-heading">Our Experts are Superhuman.</h1>
                                            </div>
                                            <div className="card-body card-body-around pt-0 pb-0">
                                                <div className="overflowscroll block__sell_height2">
                                                    <div>
                                                        <div className="card-our-expert call-option">
                                                            <div className="card-our-expert-top">
                                                                {/* call helping team image component */}
                                                                <HelpingTeamImages />
                                                                <p className="font-sm expert-option--para">We’re here to help get you set up with Oliver POS!  Here’s how to Connect with us!</p>
                                                            </div>
                                                            <div className="card text-center card-basic card-shadow card-call-options h-100">
                                                                <div className="card-header no-border">
                                                                    <h3 className="font-lg">{LocalizedLanguage.YoullhearfromusSoon}</h3>
                                                                </div>
                                                                <div className="card-body card-body-space-15">
                                                                    <img src="../assets/img/onboarding/right.svg" className="img-responsive m-auto" width="70" alt="" />
                                                                    <h3 className="font-lg">{LocalizedLanguage.ThanksforgettinginTouch}</h3>
                                                                    <p className="font-sm">{LocalizedLanguage.Wellbecallingyouat}</p>
                                                                    <input type="text" className="text-center text-primary card-basic-input font-xl" placeholder="1-456-789-1234" />
                                                                    <button className="btn btn-success btn-break btn-40 btn-padding-20 btn-radius-2 btn-min-200 font-sm btn-break"
                                                                        data-toggle="modal" data-target="#EXPERTSgetintouch"
                                                                        data-dismiss="modal">{LocalizedLanguage.Callmenow}</button>
                                                                </div>
                                                                {/* <!-- <div className="card-footer no-border">

                                                    </div> --> */}
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
export { ExpertUpdateNumberModal };