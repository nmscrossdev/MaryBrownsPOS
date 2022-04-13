import React from 'react';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import { connect } from 'react-redux';
import { onboardingActions } from './'
import { history } from '../_helpers';
import Config from '../Config' 
import {LoadingModal} from '../_components' 
// import { onboardingActions } from '../../onboarding/action/onboarding.action';
import {OnboardingFooter} from '../onboarding/components/commonComponents/OnboardingFooter'
import LocalizedLanguage from '../settings/LocalizedLanguage';

class OliverLogin extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            isLoginSuccess: '',
        }
        this.responseFacebook = this.responseFacebook.bind(this);
        this.componentClicked = this.componentClicked.bind(this);
        this.handleSignInClick = this.handleSignInClick.bind(this);

        localStorage.removeItem("DemoGuid");
        localStorage.removeItem("VisiterUserID");
        localStorage.removeItem("VisiterUserEmail");
        localStorage.removeItem("shopstatus");
        localStorage.removeItem('UserLocations');
        localStorage.removeItem("userId");
        localStorage.removeItem("LANG");
        localStorage.removeItem('AdCusDetail')
        localStorage.removeItem("clientDetail");
        localStorage.removeItem("selectedRegister");       
        localStorage.removeItem("RegisterPermissions");
        localStorage.removeItem('user');
        localStorage.removeItem('demoUser');
        localStorage.removeItem('productcount');
        localStorage.removeItem("PRODUCTX_DATA");
        
        
       
    }
   componentDidMount() {
        localStorage.setItem("showExtention", false);
        //localStorage.removeItem("env_type");
        // console.log(
        //     "BrowserView", BrowserView,
        //     "MobileView", MobileView,
        //     "isBrowser", isBrowser,
        //     "isMobileOnly", isMobileOnly,
        //     "isIOS", isIOS
        // )
        if (isIOS === true)
            localStorage.setItem("env_type", "ios")
        else if (isMobileOnly === true){
            localStorage.setItem("env_type", "Android")
        }
        else{
            localStorage.removeItem("env_type");
        }

        // check the user logged in with mobile send sending data in queary string------------
        var urlParam = this.props.location.search;
        var splParam = urlParam.replace("?", "").split("&");
        var finalParam = ""
        splParam.forEach(element => {
        finalParam += finalParam == "" ? "" : "&";
        if(element.substring(0, element.indexOf('=')) ==="muserdata")
        finalParam +=   decodeURI(element.substring(element.indexOf('=') + 1));
        });

       // console.log("finalParam",finalParam);
        if (finalParam && finalParam !=="") {
            var jsondata=  JSON.parse(finalParam);
            var sitelist = jsondata && jsondata.Content;
          //  console.log("sitelist",sitelist)
           if(sitelist){
            sessionStorage.setItem("AUTH_KEY",sitelist[0].ClientId + ":" +  sitelist[0].AuthToken);
           }
            // alert(sessionStorage.getItem("AUTH_KEY"));
        // console.log("Config.key.AUTH_KEY1", Config.key.AUTH_KEY);
            //    localStorage.setItem('sitelist', JSON.stringify(sitelist));
            var lang =  sitelist && sitelist.language ? sitelist.language :'en';
            localStorage.setItem("LANG", lang);  
            localStorage.setItem('sitelist', JSON.stringify(sitelist))
           // var sitelis = sitelist && btoa(JSON.stringify(sitelist));
           // var encodedString = window.btoa(localStorage.setItem('sitelist', sitelis));
           // var decodedString = localStorage.getItem('sitelist');
          //  var decod = window.atob(decodedString);
           // var divicedata=JSON.parse(decod);
           var divicedata=sitelist;
            // console.log("userid",divicedata[0].userId);
            var userID='';
            if(divicedata && divicedata.length>0)
            {
            // console.log("userid",divicedata[0].userId);
                userID=divicedata[0].userId;                        
                localStorage.setItem('userId', userID)
                localStorage.setItem("clientDetail",JSON.stringify(divicedata[0]));
            }
            history.push('/site_link');
        }
        //---------------------------------------------------------------------------------------
        this.googleSDK();
        console.log('sfsfd');

}
    // Handle facbook login button response 
    responseFacebook = (response) => {
        localStorage.removeItem('FGLoginData');
        const { dispatch } = this.props;
        console.log("responseFacebook", response);
        if (response && response.status !=="unknown") {
            this.setState({isLoginSuccess:"true"})
            localStorage.setItem('FGLoginData', JSON.stringify(response))

            var sendRes = {
                userLoginInfo: {
                    LoginProvider: response && response.graphDomain ? response.graphDomain : "",
                    ProviderKey: response && response.id ? response.id : ""
                },
                DefaultUserName: response && response.name ? response.name : "",
                Email: response && response.email ? response.email : '',
                ClientGuid: "",
                SendAuthToken: response && response.accessToken ? response.accessToken : "",
                ModelName: "",
                DeviceId: "",
                Version: "",
            }
            this.CallService(sendRes);
        }else{
            this.setState({isLoginSuccess:"false"})
        }
        
    }
    // call server on the bassis of facbook and google response 
    CallService = (FGdata) => {

        const { dispatch } = this.props;
       console.log("FGdata",FGdata)
            dispatch(onboardingActions.OliverExternalLogin(FGdata));        
    }

    componentClicked = () => {
        this.setState({isLoginSuccess:""})
        console.log("componentClicked");
    }

    // handle signIn with email button click    
        handleSignInClick = () =>  { 
       window.location= process.env.BRIDGE_DOMAIN+'/Account/Register';
        // const { userToken } = this.state
        // var fbLoginData = localStorage.getItem('facebookLoginData')
        // // var googleLoginData = localStorage.getItem('googleLoginData')  // Not implemeted yet
        // if (fbLoginData.length > 0 && userToken != '') {
        //     history.push(`/VisiterShopAccess?_u=${userToken}&_t=demo`);
        // }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.oliverExternalLoginRes && nextProps.oliverExternalLoginRes.content && nextProps.oliverExternalLoginRes.content.UserToken) {
            // this.setState({
            //     userToken: nextProps.oliverExternalLoginRes.content.UserToken
            // })           
            var fbLoginData = localStorage.getItem('FGLoginData')
            // var googleLoginData = localStorage.getItem('googleLoginData')  // Not implemeted yet
            if (fbLoginData && fbLoginData.length > 0 && nextProps.oliverExternalLoginRes.content.UserToken != '') {
                localStorage.setItem('demoUser', true)              
                history.push(`/VisiterShopAccess?_u=${nextProps.oliverExternalLoginRes.content.UserToken}&_t=demo&_fg=true`);
            }
        }
    }

    prepareGoogleLoginButton = () => {
        localStorage.removeItem('FGLoginData');
        // console.log(this.refs.googleLoginBtn);     
        this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
            (googleUser) => {     
            localStorage.setItem('FGLoginData', JSON.stringify(googleUser));
            var profile = googleUser.getBasicProfile();
            console.log("profile",profile);
            console.log('Token || ' + googleUser.getAuthResponse().id_token);
            console.log('ID: ' + profile.getId());
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            //YOUR CODE HERE           
            if (googleUser) {      
                var sendRes = {
                    userLoginInfo: {
                        LoginProvider: "google",
                        ProviderKey: profile && profile.getId() ? profile.getId() : ""
                    },
                    DefaultUserName: profile && profile.getName() ? profile.getName() : "",
                    Email: profile && profile.getEmail() ? profile.getEmail() : '',
                    ClientGuid: "",
                    SendAuthToken: googleUser && googleUser.getAuthResponse() && googleUser.getAuthResponse().id_token ? googleUser.getAuthResponse().id_token : "",
                    ModelName: "",
                    DeviceId: "",
                    Version: "",
                }
                this.CallService(sendRes);
            }
     
            }, (error) => {
                this.setState({isLoginSuccess:"false"})
               // alert(JSON.stringify(error, undefined, 2));
            });
     
        }
     
        googleSDK = () => {
            this.setState({isLoginSuccess:""})
            window['googleSDKLoaded'] = () => {
              window['gapi'].load('auth2', () => {
                this.auth2 = window['gapi'].auth2.init({
                  client_id: Config.key.GOOGLE_CLIENT_ID,
                  cookiepolicy: 'single_host_origin',
                  scope: 'profile email'
                });
                this.prepareGoogleLoginButton();
              });
            }
         
            (function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = d.createElement(s); js.id = id;
              js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'google-jssdk'));
         
        }
       
    render() {
        return (
            <div className="user_login">
                 {this.props.loading ==true?<LoadingModal/>:''}
              <div className="user_login_pages"> 
                <div className="user_login_container">
                    <div className="user_login_row">
                        <div className="user_login_colA">
                            <div className="user_login_form_wrapper">
                                <div className="user_login_form_wrapper_container">
                                    <div className="user_login_form">
                                        <div className="user_login_head">
                                            <div className="user_login_head_logo">
                                                <a href="#">
                                                    <img src="../assets/img/logo-2-sm.png" alt="" />
                                                </a>
                                            </div>  
                                            <h3 className="user_login_head_title">
                                                {LocalizedLanguage.Unleashthepower}<br />{LocalizedLanguage.ofyourwebshop}
                                            </h3>
                                            <h3 className="user_login_head__title">{LocalizedLanguage.CreateAnAccount}</h3>
                                        </div>
                                            {/* <form action="#"> */}
                                                <div className="user_login__button">                                                
                                                    <FacebookLogin cssClass="btn btn-outline-secondary btn-block user_login__social user_login_fb"
                                                        appId={Config.key.FACEBOOK_CLIENT_ID}
                                                        autoLoad={false}
                                                        fields="name,email,picture"
                                                        onClick={this.componentClicked}
                                                        callback={this.responseFacebook}                                                       
                                                        textButton="Sign up with Facebook"/>                                                  
                                                        {/* <button type="submit" className="btn btn-outline-secondary btn-block user_login__social" title="Log in using your Facebook account">
                                                        <img src="../assets/img/onboarding/facebook.svg" alt="" className="fbb-icon" />
                                                            <span>Sign up with Facebook</span>
                                                    </button> */}
                                                </div>
                                                <div className="user_login__button">
                                                    <button type="submit" ref="googleLoginBtn" className="btn btn-outline-secondary btn-block user_login__social" title="Log in using your Google account">
                                                        <img src="../assets/img/onboarding/google.svg" alt="" className="fbb-icon" />
                                                            <span>{LocalizedLanguage.SignupwithGoogle}</span>
                                                    </button>
                                                </div>
                                                <div className="user_login_action">
                                                {/* <button onClick={this.handleSignInClick} className="btn btn-success btn-block shadow-none btn-oliverpos" >Sign up with Email</button> */}
                                                    <button type="submit" className="btn btn-success btn-block user_login_btn_success user_login-margin-t-20" onClick={this.handleSignInClick} >
                                                        {LocalizedLanguage.SignupwithEmail}
                                                    </button>
                                                    <div className="user-login__account">
                                                        <span>{LocalizedLanguage.Alreadyhaveanaccount}</span><a href="/login" className="user-login__account-link"><u> {LocalizedLanguage.LoginNow}</u></a>
                                                    </div>
                                                </div>
                                                <div className="validationError">
                                                { this.state.isLoginSuccess && this.state.isLoginSuccess=="false"  ? "Something went worng! Please try again" :  ""}
                                              </div>
                                            {/* </form>  */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="user_login_colB">
                            <div className="user_login_aside" style= {{ backgroundImage: "url('../assets/img/onboarding/connect.png')" }}>
                            </div> 
                        </div>
                    </div>
                </div>
                <OnboardingFooter />
            </div> 
        </div>
        );
    }
}
function mapStateToProps(state) {
    const { onboardingReducers } = state;
    return {
        oliverExternalLoginRes: onboardingReducers.oliverExternalLoginRes,
        loading : onboardingReducers.loading
    };
}
const connectedOliverLogin = connect(mapStateToProps)(OliverLogin);
export { connectedOliverLogin as OliverLogin }; 