import React, { Component } from 'react'
import { history } from '../../_helpers';

export class MobileEmailSuccessView extends Component {

    handleConnectAndSellBtnClick = () => {
        history.push('/connect_demo_user')
    }
    handleRedirectToShopClick = () => {
        history.push('/shopView')
    }
    render() {
        return (
            <div>
                <div className="appHeader appHeaderOnboard" onClick={this.handleRedirectToShopClick}>
                    I’m ready to connect my store
                    <button className="btn btn-link shadow-none btn-squar" onClick={this.handleConnectAndSellBtnClick}>
                        <img src="../assets/img/onboarding/arrow-down.svg" alt="" />
                    </button>
                </div>
                <div className="appCapsule overflow-auto bg-white">
                    <div className="app-form-onboard appCapsulecontainer-center pt-5">
                        <form className="app-form app-form-onboarding-login appCapsule-container">
                            <div className="hero-banner text-center fz-12">
                                <img className="img-fluid m-auto" src="../assets/img/onboarding/section-1.png" alt="" />
                                <div className="my-4 w-100">
                                    <h1 className="font-weight-bold text-center fz-20">Download <br /> Instructions Sent!</h1>
                                    <img src="img/RadioISSelect.svg" className="my-3" alt="" />
                                    <p className="mb-1">Check your email for instructions on Connecting your WordPress site!</p>
                                </div>
                            </div>
                            <div className="form-group form-group-m-5">
                            </div>
                        </form>
                    </div>
                    <div className="appCapsuleContainerOnboardFooter">
                        <img className="m-auto d-block" src="../assets/img/onboarding/logo.png" alt="" />
                    </div>
                </div>
            </div>
        )
    }
}
