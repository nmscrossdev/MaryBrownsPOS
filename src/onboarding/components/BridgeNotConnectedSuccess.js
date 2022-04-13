import React from 'react';
import {HelpingTeamImages } from "../";
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class BridgeNotConnectedSuccess extends React.Component {

    render() {
        return (
            <div id="BRIDGENOTCONNECTED2" className="modal fade" role="dialog">
                <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <div className="section-bridge-connect">
                                <div className="container-fluid">
                                    <div className="row connect-no-gutters connect-row">
                                        <div className="col-sm-5">
                                            <div className="block-helping-hand">
                                                <button className="btn btn-danger btn-modal-close" data-dismiss="modal" style={{backgroundColor: "white"}}>
                                                    <img src="../assets/img/images/closenew.svg" alt="" />
                                                </button>
                                                {/* Helping hands team images common modal */}
                                                <HelpingTeamImages
                                                    title={'Need a helping hand?'}
                                                    subTitle={'Sometimes it’s best to work together. Connect with one of our Oliver POS Experts and get the Guidance you need to sell better.'}
                                                    teamImg1={'../assets/img/images/team.png'}
                                                    teamImg2={'../assets/img/images/team.png'}
                                                    teamImg3={'../assets/img/images/team.png'}
                                                />
                                                <div className="helping-list">
                                                    <ul>
                                                        <li> {LocalizedLanguage.WeconnectwithofWordPressWebsites} </li>
                                                        <li> {LocalizedLanguage.WeconnectwithofWordPressWebsites} </li>
                                                        <li> {LocalizedLanguage.WeshowyouallofwhatOliverPOScando} </li>
                                                    </ul>
                                                </div>
                                                <div className="text-center btn-onboarding-spacing">
                                                    <button className="btn btn-success shadow-none btn-onboarding">{LocalizedLanguage.TalktoaHelpfulHuman}</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-7">
                                            <div className="block-helping-hand block-helping-hand-light ">
                                                <div className="block-helping-flex block-helping-flex-100">
                                                    <div>
                                                        <h1>{LocalizedLanguage.ConnectandSellNow}</h1>
                                                        <p>{LocalizedLanguage.Step4}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <img src="../assets/img/images/right.svg" width="120" alt="" />
                                                        <div className="text-center btn-onboarding-spacing">
                                                            <button
                                                                className="btn btn-success shadow-none btn-onboarding btn-block">{LocalizedLanguage.IhaveConnectedMsg}</button>
                                                            <button
                                                                className="btn btn-primary shadow-none btn-outline-onboarding btn-block">{LocalizedLanguage.GotoyourAccount}</button>
                                                        </div>
                                                    </div>
                                                    <div className="truouble-text text-center">
                                                        <span>{LocalizedLanguage.HavingTrouble}</span> {LocalizedLanguage.WatchtheTutorial}
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
export { BridgeNotConnectedSuccess };