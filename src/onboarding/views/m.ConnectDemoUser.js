import React, { Component } from 'react'
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { sendMailAction } from '../../_actions';
import { get_UDid } from '../../ALL_localstorage';
import { connect } from 'react-redux';
import { AndroidAndIOSLoader } from '../../_components';

class MobileConnectDemoUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailValid: false,
            email: "",
            loader: false
        }
    }
    handleConnectAndSellBtnClick = () => {
        history.push('/shopView')
    }
    handleEmailSubmitButton = () => {
        const { emailValid, email } = this.state
        console.log('------email---', this.state.emailValid);
        if (email != "") {
            this.setState({ loader: true })
            var udid = get_UDid('UDID')
            var requestData = {
                "Udid": udid,
                "OrderNo": '',
                "EmailTo": email,
            }
            this.props.dispatch(sendMailAction.sendMail(requestData));
        } else {
            this.setState({ emailValid: ' Valid Email Required' })
        }
    }
    handleEmailUpdateButton = () => {
        console.log('redirect to email update page ');
    }
    handleChange = (e) => {
        var emailValid = this.state.emailValid;
        const { name, value } = e.target;
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        emailValid ? this.setState({ emailValid: '', email: value }) : this.setState({ emailValid: LocalizedLanguage.emailErr, email: "" });
    }
    componentWillReceiveProps = (nextprops) => {
        if (nextprops && nextprops.sendEmail) {
            // if (nextprops && nextprops.sendEmail && nextprops.sendEmail.is_success !== false) {
            this.setState({ loader: false })
            history.push('/email_sent')
        }
    }
    render() {
        const { loader } = this.state
        return (
            <div>
                {loader == true ? <AndroidAndIOSLoader /> : ''}
                <div className="appHeader appHeaderOnboard">
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
                                    <h1 className="font-weight-bold text-center fz-20">Connect and Sell Now.</h1>
                                    <p className="mb-1">Ready to Sell your WooCommerce Products?</p>
                                    <p> We’ll Send you Download Instructions! </p>
                                </div>
                            </div>
                            <div className="form-group form-group-m-5">
                                <div className="form-group form-group-m-10">
                                    <label htmlFor="" className="fz-14">Email Address</label>
                                    <input type="text" className="form-control shadow-none fz-15-i" placeholder="oliver@oliverpos.com" onChange={this.handleChange} />
                                    <p style={{color:'red'}} className="fz-14">{this.state.emailValid}</p>
                                </div>
                                <button type="button" className="btn btn-success shadow-none btn-block first-last-child fz-15-i mt-1" onClick={this.handleEmailSubmitButton}>Send Download Instructions</button>
                            </div>
                            <div className="form-group mt-15">
                                <p className="mb-0 fz-13 text-center" onClick={this.handleEmailUpdateButton}>Update my email Address</p>
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

function mapStateToProps(state) {
    const { sendEmail } = state;
    return {
        sendEmail: sendEmail.sendEmail,
    };
}
const MConnectDemoUser = connect(mapStateToProps)(MobileConnectDemoUser);
export { MConnectDemoUser as MobileConnectDemoUser };




