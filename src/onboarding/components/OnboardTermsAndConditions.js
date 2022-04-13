import React from 'react';
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage'
class OnboardTermsAndConditions extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    // render onBoardloading on accept TnC
    handleClick = () => {
        history.push('/onboard_loading');
    }

    render() {
        return (
            <div className="onboarding-screen">
                <div className="onboarding-login-content">
                    <div className="container onboarding-login-content-self">
                        <div className="row vc_row-flex">
                            <div className="col-sm-5 vc_column_container">
                                <div className="form-boarding content-center-center form-just-onething">
                                    <img src="../assets/img/images/logo.svg" alt="" className="form-title-logo" />
                                    <h1 className="form-heading">
                                        Just one last thing..
                            </h1>
                                    <p className="already-login">By clicking on the button you accept our <br /> <a href="#">Terms &amp; Conditions.</a></p>
                                    <div className="form-v2">
                                        <button className="btn btn-success btn-block" onClick={this.handleClick}>Show me that Owl Magic</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-7 vc_column_container vc_column_container-left-spacing">
                                <div className="vh_column_background vh_column_background_height" style={{ backgroundImage: "url(../assets/img/images/mobile.png)" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export { OnboardTermsAndConditions };
