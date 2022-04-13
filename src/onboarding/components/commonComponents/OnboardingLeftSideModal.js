import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';

class OnboardingLeftSideModal extends React.Component {
    render() {
        return (
            <div className="col-sm-5">
                <div className="card no-border text-center card-boarding-light card-basic">
                    <div className="card-header no-border">
                        <h1 className="userbridge-heading">{LocalizedLanguage.ConnectandSellNow}</h1>
                    </div>
                    <div className="card-body card-body-around pt-0 pb-0">
                        <div className="card-installation spacer-x-5">
                            <img src="../assets/img/onboarding/connect.png" className="img-responsive" alt="" />
                            <p className="card-description">{LocalizedLanguage.Feellikeconnectingyoursiterightnow}</p>
                            <h3 className="card-description card-description-bold"> {LocalizedLanguage.ItseasytogetstartedwithOliverPOSonyourown}</h3>
                            <button
                                className="btn btn-success btn-boarding btn-60 btn-padding-20 btn-radius-2 btn-text-white btn-break"
                                data-toggle="modal"
                                data-target="#BRIDGENOTCONNECTED"
                                data-dismiss="modal"
                            >{LocalizedLanguage.InstallOliverPOSNow}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export { OnboardingLeftSideModal };