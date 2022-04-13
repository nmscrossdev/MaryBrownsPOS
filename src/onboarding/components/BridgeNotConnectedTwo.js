import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class BridgeNotConnectedTwo extends React.Component {
    render() {
        return (
            <div id="BRIDGENOTCONNECTEDTWO" className="modal fade" role="dialog">
                <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <div className="section-bridge-connect">
                                <div className="container-fluid">
                                    <div className="row connect-no-gutters connect-row">
                                        <div className="col-sm-5">
                                            <div className="block-helping-hand">
                                                <h1>{LocalizedLanguage.Needahelpinghand}</h1>
                                                <div className="text-center">
                                                    <div className="block-helping-team" id="getteamheight">
                                                        <div className="block-help-team-memeber">
                                                            <img src="../assets/img/images/team.png" alt="" />
                                                        </div>
                                                        <div className="block-help-team-memeber-overlay">
                                                            <div className="block-help-team-memeber">
                                                                <img src="../assets/img/images/team.png" alt="" />
                                                            </div>
                                                            <div className="block-help-team-memeber">
                                                                <img src="../assets/img/images/team.png" alt="" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>{LocalizedLanguage.SometimesMsg}</p>
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
                                                <div>
                                                    <h1>{LocalizedLanguage.ConnectandSellNow}</h1>
                                                    <div className="block__sell">
                                                        <div className="container">
                                                            <h3>{LocalizedLanguage.Step1}</h3>
                                                            <div className="block__shadow block__image">
                                                                <img src="../assets/img/images/image-1.png" alt="" className="img-responsive"/>
                                                            </div>
                                                            <h3>{LocalizedLanguage.Step2}</h3>
                                                            <div className="block__shadow  block__image">
                                                                <img src="../assets/img/images/image-2.png" alt="" className="img-responsive"/>
                                                            </div>
                                                            <h3>{LocalizedLanguage.Step3}</h3>
                                                            <div className="block__shadow  block__image">
                                                                <img src="../assets/img/images/image-3.png" alt="" className="img-responsive"/>
                                                            </div>
                                                            <div className="section-action">
                                                                <h3>{LocalizedLanguage.Step4}</h3>
                                                                <img src="../assets/img/images/right.svg" alt="" width="120"/>
                                                                <button className="btn btn-outline-primary shadow-none btn-outline-primary-pos">{LocalizedLanguage.GotoyourAccount}</button>
                                                                <div className="form-boarding">
                                                                    <div className="truouble-text">
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export { BridgeNotConnectedTwo };