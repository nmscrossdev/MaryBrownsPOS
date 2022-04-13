import React from 'react';
import $ from 'jquery'
import { OnboardingLeftSideModal, HelpingTeamImages } from '../';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class ExpertBookTimeModal extends React.Component {
    constructor(props) {
        super(props)
        this.handleCalendarClick = this.handleCalendarClick.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            if (typeof showdate != 'undefined') {
                // showdate()
            }
        }, 2000);
    }
    handleCalendarClick = () => {
        showModal('#EXPERTSDemo2')
    }
    render() {
        return (
            <div id="EXPERTSDemo" className="modal fade" role="dialog">
                {/* <div id="EXPERTSDemoDate" className="modal fade" role="dialog"> */}
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
                                                <h1 className="userbridge-heading">Need a Helping Hand?</h1>
                                            </div>
                                            <div className="card-body card-body-around pt-0 pb-0">
                                                <div className="overflowscroll block__sell_height2">
                                                    <div>
                                                        <div className="card-our-expert">
                                                            <div className="card-our-expert-top">
                                                                {/* call helping team image component */}
                                                                <HelpingTeamImages />
                                                                <p className="font-sm expert-option--para">We’re here to help get you set up with Oliver POS!  Here’s how to Connect with us!</p>
                                                            </div>
                                                            <div className="card card-basic card-shadow card-xs">
                                                                <div className="container-fluid">
                                                                    <div className="row card-body-center">
                                                                        <div className="col-sm-7 col-lg-7">
                                                                            <div className="card text-center card-basic card-expert-view">
                                                                                <div className="card-header no-border">
                                                                                    <h3>{LocalizedLanguage.ScheduleanOnlineDemo}</h3>
                                                                                </div>
                                                                                <div className="card-body card-body-space-15">
                                                                                    <img src="../assets/img/onboarding/restaurant_table.svg" className="img-responsive m-auto" width="70" alt="" />
                                                                                    <p>{LocalizedLanguage.ExpertsWalk} </p>
                                                                                    <div className="card-list">
                                                                                        <ul>
                                                                                            <li> {LocalizedLanguage.WeconnectwithofWordPressWebsites} </li>
                                                                                            <li> {LocalizedLanguage.WeconnectwithofWordPressWebsites} </li>
                                                                                            <li> {LocalizedLanguage.WeshowyouallofwhatOliverPOScando} </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="card-footer no-border">
                                                                                    <a href="#" className="text-primary">{LocalizedLanguage.Icantfindatimethatworks}</a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-5 col-lg-5">
                                                                            <div className="card text-center card-basic">
                                                                                <div className="calender-view p-3">
                                                                                    <div>
                                                                                        <div className="calender-logo">
                                                                                            <img src="../assets/img/onboarding/owl.png" />
                                                                                        </div>
                                                                                        <h3>{LocalizedLanguage.MeetingwitholiverPOS}</h3>
                                                                                        <div className="calender-content">
                                                                                            <div id="datepicker-inline" onChange ={this.handleCalendarClick} data-date="12/03/2012"></div>
                                                                                            <input type="hidden" id="my_hidden_input" />
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
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
export { ExpertBookTimeModal };