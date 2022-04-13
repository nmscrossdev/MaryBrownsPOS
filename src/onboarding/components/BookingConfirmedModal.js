import React from 'react';
import { OnboardingLeftSideModal, HelpingTeamImages } from '../';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class BookingConfirmedModal extends React.Component {

    render() {
        return (
            <div id="EXPERTSDemo2" className="modal fade" role="dialog">
                {/* <div id="EXPERTSDemoDateSuccess" className="modal fade" role="dialog"> */}
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
                                                                                    <p>{LocalizedLanguage.ExpertsWalk}</p>
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
                                                                            <div className="card text-center card-basic card-shadow card-booking">
                                                                                <div className="card-header no-border">
                                                                                    <img src="../assets/img/onboarding/done.PNG" className="img-responsive m-auto" width="70" alt="" />
                                                                                </div>
                                                                                <div className="card-body card-body-space-15">
                                                                                    <h3 className="font-lg font-light">{LocalizedLanguage.BookingConfirmed}</h3>
                                                                                    <p className="font-sm card-booking-text">{LocalizedLanguage.bookedMsg}
                                                                        </p>
                                                                                    <p className="font-sm font-bold">August 21, 2020 11:45 AM</p>
                                                                                    {/* <!-- <h1 className="font-xl text-primary pt-0">1-456-789-1234</h1> --> */}
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
export { BookingConfirmedModal };