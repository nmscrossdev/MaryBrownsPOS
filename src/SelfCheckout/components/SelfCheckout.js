import React from 'react';
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import ActiveUser from '../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../onboarding/components/OnboardingShopViewPopup';
import { onBackTOLoginBtnClick } from '../../_components/CommonJS';
class SelfCheckout extends React.Component {
    constructor(props) {
        super(props);
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('TIKERA_SELECTED_SEATS');
        localStorage.removeItem("CART");
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCTX_DATA");
        // const { dispatch } = this.props;
        // props.dispatch(cartProductActions.addtoCartProduct(null));
        this.state = {
            landingScreen: '',
            companyLogo: ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo:""
        }
        this.settinghandler = this.settinghandler.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.removeItem('shopstatus');
        localStorage.removeItem('user');
        history.push('/login')
    }

    settinghandler(type) {
        if (type === true) {
            localStorage.setItem("favlist", type ? type : false);
        }
        else {
            localStorage.removeItem("favlist");
        }
        if (isMobileOnly == true) {
            history.push('../SelfCheckoutView');
        }
        else {
            window.location = '../SelfCheckoutView';
        }
    }

    componentWillMount() {
        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
        var register_content = Register_Permissions ? Register_Permissions.content : '';
        // console.log("register_content", register_content);
        if (Register_Permissions) {
            Register_Permissions.content && Register_Permissions.content.map(permission => {
                if (permission && permission.slug == "landing-screen") {
                    var landing_image = permission.value;
                    // console.log("landing_image", landing_image);                   
                    // console.log("state", this.state.landingScreen);
                    //Check for if image url exist and image exist on that URL------------ 
                    if (landing_image != '') {
                        const handelImage = (val) => {
                           // console.log("val", val)
                            this.setState({ landingScreen: val });
                        }
                        var image = new Image();
                        image.onload = function () {
                            //console.log("success")
                            handelImage(landing_image);
                        }
                        image.onerror = function () {
                            //console.log("Error")
                            handelImage('');
                        }
                        if (landing_image && landing_image != '')
                            image.src = landing_image;
                    }
                    //-----------------------------------------------------------------------
                }
            })
        }
    }

    render() {
        return (
            <div>
                {(isMobileOnly == true) ?
                    <div className="app-sc-luncher">
                        {/* <a href="#" className="btn btn-links position-fixed text-white p-0 fixed-top-left z-index-2">
                            <img src="assets/img/self-checkout/setting.svg" className="w-20" alt="" onClick={() => this.settinghandler(true)} />
                        </a> */}
                        <div className="card border-0 vh-100 rounded-0">
                            <div className="card-body content-center-center app-sc-background" onClick={() => this.settinghandler(false)} style={{ "backgroundImage": `url(${this.state.landingScreen !== '' ? this.state.landingScreen : "assets/img/self-checkout/background.png"})` }}>
                                {/* <h5 className="card-title">Order <br></br> Here</h5>
                                <p className="card-text text-white"><span>&#xf104;</span> Press to Scan Product </p> */}
                            </div>
                            <div className="card-footer no-padding rounded-0">
                                <button className="btn btn-link btn-block text-decoration-none" onClick={() => this.settinghandler(false)}>
                                    <img src={ this.state.companyLogo !== '' ? this.state.companyLogo : "assets/img/self-checkout/tic-tac-logo.png"} alt="" />
                                    {LocalizedLanguage.touchtoStart}</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="portrait">
                            <div className="self-checkout-content" >
                                <div className="block_startscreen">
                                    {/* <div className="block_top__action" onClick={() => this.settinghandler(true)}>
                                            <img src="assets/img/self-checkout/setting.svg" width="30" />
                                        </div> */}
                                    <div className="block_top__action p-2" style={{ "backgroundColor": `rgb(70 169 212 / 0.5)` }} onClick={() => this.settinghandler(true)}>
                                        <img src="assets/img/self-checkout/setting.svg" width="30" />
                                    </div>
                                    <div className="block_startscreen_background background-cover background-no-repeat background-center"
                                        // style={{backgroundImage: "url(/assets/img/self-checkout/background.png)" }}>
                                        onClick={() => this.settinghandler(false)}
                                        style={{ "backgroundImage": `url(${this.state.landingScreen !== '' ? this.state.landingScreen : "assets/img/self-checkout/background.png"})` }}>
                                        {/* <h1>Order Here</h1> */}
                                        {/*<div className="block_top__action2">
                                            <a className="text-white" onClick={() => this.logout()}>
                                                <ul className="icon-bottom-text fz-48">
                                                    <li>
                                                        <i className="icon icon-css-override icon-logout"></i>
                                                        <p className="logout-text">{LocalizedLanguage.logOut}</p>
                                                    </li>
                                                </ul>
                                            </a>
                                        </div> */}
                                    </div>
                                    <button className="btn btn-light btn-block btn-self-checkout" onClick={() => this.settinghandler(false)}>
                                        <img className="btn-icon" src={this.state.companyLogo !== '' ? this.state.companyLogo : "assets/img/self-checkout/tic-tac-logo.png"} alt="" />
                                        {LocalizedLanguage.touchtoStart}</button>
                                </div>
                            </div>
                        </div>
                        <div className="landscape">
                            <div className="self-checkout-content">
                                <div className="block_startscreen">
                                    {/* <div className="block_top__action" onClick={() => this.settinghandler(true)}>
                                            <img src="assets/img/self-checkout/setting.svg" width="30" />
                                        </div> */}
                                    <div className="block_top__action p-2" style={{ "backgroundColor": `rgb(70 169 212 / 0.5)` }} onClick={() => this.settinghandler(true)}>
                                        <img src="assets/img/self-checkout/setting.svg" width="30" />
                                    </div>
                                    <div className="block_startscreen_background background-cover background-no-repeat background-center"
                                        // style={{backgroundImage: "url(/assets/img/self-checkout/background.png)" }}>
                                        onClick={() => this.settinghandler(false)}
                                        style={{"backgroundImage": `url(${this.state.landingScreen !== '' ? this.state.landingScreen : "assets/img/self-checkout/background.png"})` }}>
                                        {/* <h1>Order Here</h1> */}
                                    </div>
                                    <button className="btn btn-light btn-block btn-self-checkout" onClick={() => this.settinghandler(false)}>
                                        <img className="btn-icon" src={this.state.companyLogo !== '' ? this.state.companyLogo : "assets/img/self-checkout/tic-tac-logo.png"} alt="" />
                                            {LocalizedLanguage.touchtoStart}
                                    </button>
                                </div>
                            </div>
                            {/* <div className="fixed-bottom-left fixed-text">
                                <a onClick={() => this.logout()} >
                                    <ul className="icon-bottom-text fz-48">
                                        <li>
                                            <i className="icon icon-css-override icon-logout"></i>
                                            <p className="logout-text">{LocalizedLanguage.logOut}</p>
                                        </li>
                                    </ul>
                                </a>
                            </div> */}
                        </div>
                        
                    </div>
                }
            </div>
        )
    }
}
export default SelfCheckout;