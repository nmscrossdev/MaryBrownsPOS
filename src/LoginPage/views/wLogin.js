import React from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { connect } from 'react-redux';
import { onboardingActions } from '../../OliverlLoginPage/action/onboarding.action.js'
import { LoadingModal, CommonMsgModal, AndroidAndIOSLoader } from '../../_components';
import Language from '../../_components/Language';
import Config from '../../Config';
import { OnboardingFooter } from '../../onboarding/components/commonComponents/OnboardingFooter'
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
// const WebLoginView = (props) => {
class WebLoginView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userRes: '',
            isCallService:true
        }
    }

    componentDidMount() {
        //Apple login Listner START
        // Listen for authorization success.
        document.addEventListener('AppleIDSignInOnSuccess', (event) => {
            // Handle successful response.
            this.singInApple();
            console.log("---AppleIDSignInOnSuccess----"+ JSON.stringify(event));
        });
        // Listen for authorization failures.
        document.addEventListener('AppleIDSignInOnFailure', (event) => {
            // Handle error.
            console.log("---AppleIDSignInOnFailure---"+event.detail.error);
        });
        //Apple login Listner END

        this.googleSDK();
        this.appleLogin();

    }

    prepareGoogleLoginButton = () => {
        localStorage.removeItem('FGLoginData');
        console.log('------ref-----------', this.refs.googleLoginBtn);
        this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
            (googleUser) => {
                localStorage.setItem('FGLoginData', JSON.stringify(googleUser));
                var profile = googleUser.getBasicProfile();
                console.log("profile", profile);
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                // console.log("Birthday: " + profile.getBirthday());
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
                        access_token: googleUser && googleUser.getAuthResponse() && googleUser.getAuthResponse().access_token ? googleUser.getAuthResponse().access_token : "",
                        ModelName: "",
                        DeviceId: "",
                        Version: "",
                        // FirstName: profile.getGivenName(),
                        // LastName: profile.getFamilyName(),
                        FirstName: '',
                        LastName: "",
                        Id: "",
                        picture: '',
                        Gender: '',
                        PhoneNumber: '',
                        Dob: '',
                        AgeRange: ''
                    }
                    this.setState({ userRes: sendRes })
                    this.getProfileDetails(sendRes)
                    // this.CallService(sendRes);

                }

            }, (error) => {
                // this.setState({ isLoginSuccess: "false" })
                // alert(JSON.stringify(error, undefined, 2));
            });

    }
    // get user profile ionformation
    getProfileDetails = (param) => {
        const { dispatch } = this.props;

        var data = {
            access_token: param && param.access_token,
            userId: param && param.userLoginInfo.ProviderKey
        }
        dispatch(onboardingActions.GetUserProfile(data));


    }
    // call server on the bassis of facbook and google response 
    CallService = (FGdata) => {

        const { dispatch } = this.props;
        console.log("FGdata", FGdata)
        dispatch(onboardingActions.OliverExternalLogin(FGdata));
    }
  //Apple login methods Start
  appleLogin=()=>
  {
     let appleConnectLoaded = (AppleID) => {
      AppleID.auth.init({
          clientId    : "sell.oliverpos.com",
          scope       : 'name email',
          state : 'origin:web',
          redirectURI : Config.key.APPLE_LOGIN_RETURN_URL,
          usePopup    : true
      });
      setTimeout(() => {//To Remove the default apple logo
          // $("svg text").text('Sign in with Apple')
        //   $("svg text").text($("svg text").text().substring(1));
        //   $("svg text").removeAttr("textLength");
     }, 100);
  };

  (function(d, s, cb){
      var js, fjs = d.getElementsByTagName(s)[0];
      js = d.createElement(s);
      js.src = "//appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      fjs.parentNode.insertBefore(js, fjs);
      js.addEventListener("load", () => cb(AppleID));
  }(document, 'script', appleConnectLoaded));
  }
  singInApple = async () => {
  try {
      const response = await window.AppleID.auth.signIn();
      if(response!=null && typeof response!="undefined")
      {
          localStorage.removeItem('FGLoginData');
          localStorage.setItem('FGLoginData', JSON.stringify(response));
          console.log("successful login with apple--"+JSON.stringify(response))
          var code='';
          var id_token='';
          var state='';
          var fname='';
          var lname='';
          var email='';
          if(response.authorization && typeof response.authorization!="undefined")
          {
              code=response.authorization.code;
              id_token=response.authorization.id_token;
              state=response.authorization.state;
          }
          if(response.user && typeof response.user!="undefined" && response.user.name && response.user.email)
          {
              fname=response.user.name.firstName;
              lname=response.user.name.lastName;
              email=response.user.email;
          }
          if(id_token!="")
          {
              var _data= this.parseJwt(id_token);
              if(_data!=null && _data.email)
              {
                  email=_data.email;
              }
          }
          var data = {
              FirstName: fname,
              LastName: lname,
              Email:email,
              Id:  '',
              picture: '',
              Gender: '',
              Dob:  '',
              AgeRange: '',
              Address :'',
              AccessToken: id_token,
              userLoginInfo:{
                  LoginProvider: "apple",
                  ProviderKey:  ""
              },
              DefaultUserName: '',
              PhoneNumber: '',    
              ClientGuid: '',
              SendAuthToken:id_token!=''?true:false,
              ModelName:'',
              DeviceId:'',
              Version: '',
              CountryName :'',
              CityName :''
          }
          if(this.state.isCallService == true){
              this.setState({isCallService:false})
              this.CallService(data);
          }
      }
  } 
  catch ( error ) {
          console.log("---singInApple---catch--");
          // Handle error.
  }
  };
  parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
  };
  //Apple login methods End
    googleSDK = () => {
        // this.setState({ isLoginSuccess: "" })
        window['googleSDKLoaded'] = () => {
            window['gapi'].load('auth2', () => {
                this.auth2 = window['gapi'].auth2.init({
                    client_id: Config.key.GOOGLE_CLIENT_ID,
                    cookiepolicy: 'single_host_origin',
                    scope: 'openid profile email https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/profile.agerange.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
                    include_granted_scopes: true
                    // access_type:"offline",
                    // response_type:"code"
                });
                this.prepareGoogleLoginButton();
            });
        }

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));

    }
    componentWillReceiveProps(nextProps) {
       // console.log('------res--0---------', nextProps);
        if (nextProps && nextProps.GetUserProfile) {
            const { userRes} = this.state
            var dob = nextProps.GetUserProfile.birthdays && nextProps.GetUserProfile.birthdays[0].date
            var data = {
                FirstName: nextProps.GetUserProfile.names && nextProps.GetUserProfile.names[0]? nextProps.GetUserProfile.names[0].givenName:'',
                LastName: nextProps.GetUserProfile.names && nextProps.GetUserProfile.names[0] ?nextProps.GetUserProfile.names[0].familyName:'',
                Id:  nextProps.GetUserProfile.metadata && nextProps.GetUserProfile.metadata.sources ? nextProps.GetUserProfile.metadata.sources[0].id:'',
                picture: nextProps.GetUserProfile.photos ? nextProps.GetUserProfile.photos[0].url:'',
                Gender: nextProps.GetUserProfile.genders ? nextProps.GetUserProfile.genders[0].formattedValue:'',
                Dob: dob && dob.year ? dob.year + "-" + dob.month + "-" + dob.day : '',
                AgeRange: nextProps.GetUserProfile.ageRanges ? nextProps.GetUserProfile.ageRanges[0].ageRange:'',
                Address :nextProps.GetUserProfile.locations && nextProps.GetUserProfile.locations[0] && nextProps.GetUserProfile.locations[0].value ? nextProps.GetUserProfile.locations[0].value:'',
                AccessToken: userRes ? userRes.access_token:'',
                userLoginInfo:userRes ? userRes.userLoginInfo:'',
                DefaultUserName: userRes ? userRes.DefaultUserName:'',
                PhoneNumber: userRes && userRes.PhoneNumber ? userRes.PhoneNumber:'',    
                Email:userRes ? userRes.Email:'',
                ClientGuid: userRes ? userRes.ClientGuid:'',
                SendAuthToken:userRes ?  userRes.SendAuthToken:'',
                ModelName: userRes ? userRes.ModelName:'',
                DeviceId:userRes ?  userRes.DeviceId:'',
                Version: userRes ? userRes.Version:'',
                CountryName :userRes && userRes.country ? userRes.country:'',
                CityName :userRes && userRes.city ? userRes.city:'',

            }
           
            // this.setState({ userProfileData: nextProps.GetUserProfile })
            if(this.state.isCallService == true){
                this.setState({isCallService:false})
                this.CallService(data);
            }
        }

    }
    close() {
        //  $("#test").
    }
    render() {
        const { loggedIn, loginError, loggingIn } = this.props.authentication;
        const { handleRetryButtonClick, isOldVersion, componentClicked, responseFacebook, handleChange, handleSubmit, handleKey, closeExtraPayModal, checkStatus, username, password, submitted, check, loading, fieldErr, usernamedErr, passwordErr, common_Msg, wentWrongErr } = this.props;
        // const { username, password, submitted, check, loading, fieldErr, usernamedErr, passwordErr, common_Msg } = state;
        const bridgDomain = process.env.BRIDGE_DOMAIN;
        const handleSignInClick = () => {
            window.location = bridgDomain + '/Account/Register';
        }
        var vlidationError = fieldErr !== '' ? fieldErr : usernamedErr !== "" ? usernamedErr : passwordErr !== '' ? passwordErr : loggedIn == false ? loginError : wentWrongErr != '' ? wentWrongErr : "";
        // 
        return (
            <div className="login-wrapper">
                {loggingIn && loggingIn == true || loading == true ?  <LoadingModal /> : ''}
                
                         {isOldVersion ? <div className="user_hard-blocker close_hard_blocker" id="test">
                             <div className="user_hard-blocker_container">
                                 <div className="user_hard-blocker_pop">
                                     <img src="../assets/img/onboarding/blocker.svg" alt="" />
                                     <h3>Your Oliver POS Plugin must be updated! </h3>
                                     <p>To continue using Oliver POS, please update your Bridge Plugin to the latest version! </p>
                                     <button className="btn btn-primary btn-60" id="close_hard_blocker" onClick={handleRetryButtonClick}>Retry</button>
                                 </div>
                             </div>
                         </div> : ''}
			<form onSubmit={handleSubmit}>
				<img src="../Assets/Images/SVG/oliverlogo.svg" alt="" />
				<p>Sign in to your Oliver POS Account</p>
				<label htmlFor="email">Email</label>
				<input type="email" id="username" name="username" placeholder="Enter Email" 
                  value={username} autoFocus='autofocus' tabindex="1" onChange={handleChange} onKeyDown={handleKey} required/>
				
                <label htmlFor="password">{Language.key.PASSWORD}</label>
                <input  autoComplete="off" className="form-control"  placeholder="******" id="password"
                name="password" tabindex="2" type="password" value={password} onChange={handleChange} 
                onKeyDown={handleKey}  required/>

				<div className="row apart">					
                    <a href={bridgDomain + "/Account/ForgotPassword?_refrence=sell"} id="kt_login_forgot" className="kt-login__link">Forgot your Password?</a>
					<label className="checkbox-wrapper" >
						<input type="checkbox" />
						<div className="custom-checkbox" id="remember" name='rememberUser'>
							<img src="../Assets/Images/SVG/Checkmark.svg" alt="" />
						</div>
						Remember Me?
                       
					</label>
				</div>
                {vlidationError != "" &&
            <div className="validationError errorLogin">
            {fieldErr !== '' ? <img src='../../assets/img/images/error.svg' /> : usernamedErr !== "" ? <img src='../../assets/img/images/error.svg' /> : passwordErr !== '' ? <img src='../../assets/img/images/error.svg' /> : loggedIn == false ? <img src='../../assets/img/images/error.svg' /> : ""}
            {wentWrongErr !== '' ? wentWrongErr : fieldErr !== '' ? fieldErr : usernamedErr !== "" ? usernamedErr : passwordErr !== '' ? passwordErr : loggedIn == false ? loginError : ""}
            </div>}
                <button tabindex="3">
                    Sign In
                    </button>
			</form>
			<div className="row apart">
				<div className="divider"></div>
				<p className="largethin">OR</p>
				<div className="divider"></div>
			</div>
			<button className="logo google" type="submit" ref="googleLoginBtn" title="Log in using your Google account" tabindex="4">
				<div className="logo-container">
					<img src="../assets/images/svg/googleicon.svg" alt="google logo" className="logo" />
				</div>
                {LocalizedLanguage.SignupwithGoogle}
			</button>
			 {/* <button class="logo facebook" appId={Config.key.FACEBOOK_CLIENT_ID} 
                                                                    autoLoad={false}
                                                                    fields="first_name, last_name,name,email"
                                                                    scope="public_profile, email"
                                                                    onClick={componentClicked}
                                                                    callback={responseFacebook}
                                                                    textButton="Sign in with Facebook">
            <div class="logo-container">
					<img
						src="../Assets/Images/SVG/facebooklogo.svg"
						alt="facebook logo"
						class="logo"
					/>
				</div>
				Sign in with Facebook
				
			</button>
         */}
           <button tabindex="5" className="logo facebook">
				<div className="logo-container">
					<img
						src="../Assets/Images/SVG/facebooklogo.svg"
						alt="facebook logo"
						className="logo"
					/>
				</div>
                <FacebookLogin cssClass="logo facebook"  appId={Config.key.FACEBOOK_CLIENT_ID}
                                                        autoLoad={false}
                                                        fields="first_name, last_name,name,email"
                                                        scope="public_profile, email"
                                                        onClick={componentClicked}
                                                        callback={responseFacebook}
                                                        textButton="Sign in with Facebook">
             </FacebookLogin>
			</button>
            <button tabindex="6" type="submit" id="appleid-signin" title="Log in using your Apple account" className="btn btn-outline-secondary btn-block user_login__social appleid-signin-dv" >
                <span>Sing in with Apple</span>
            </button>
           
		
			{/* <button className="logo apple">
				<div className="logo-container">
					<img src="../Assets/Images/SVG/applelogo.svg" alt="apple logo" className="logo" />
				</div>
				Sign in with Apple
			</button> */}
			{/* <div className="row">
				<p className="standard">Don't have an account?</p>
                <a className="bold" href="#" onClick={handleSignInClick} >Sign Up Now!</a>
			</div> */}
		</div>
            // <div className="user_login user_login_center scroll-auto">
            //     <div className="user_login_pages">
            //         {loggingIn && loggingIn == true || loading == true ? isMobileOnly == true ? <AndroidAndIOSLoader /> : <LoadingModal /> : ''}
                
            //         {isOldVersion ? <div className="user_hard-blocker close_hard_blocker" id="test">
            //             <div className="user_hard-blocker_container">
            //                 <div className="user_hard-blocker_pop">
            //                     <img src="../assets/img/onboarding/blocker.svg" alt="" />
            //                     <h3>Your Oliver POS Plugin must be updated! </h3>
            //                     <p>To continue using Oliver POS, please update your Bridge Plugin to the latest version! </p>
            //                     <button className="btn btn-primary btn-60" id="close_hard_blocker" onClick={handleRetryButtonClick}>Retry</button>
            //                 </div>
            //             </div>
            //         </div> : ''}

            //         <div className="user_login_container">
            //             <div className="user_login_row">
            //                 <div className="user_login_colA">
            //                     <div className="user_login_form_wrapper">
            //                         <div className="user_login_form_wrapper_container">
            //                             <div className="user_login_form">
            //                                 <div className="">
            //                                     <div className="user_login_scroll_in">
            //                                         <div className="user_login_center">
            //                                             <div className="user_login_head">

            //                                                 <div className="user_login_head_logo">
            //                                                     <a href="#">
            //                                                         <img src="../../assets/images/logo-dark.svg" alt="" />
            //                                                     </a>
            //                                                 </div>
            //                                                 <h3 className="user_login_head_title">
            //                                                     Login to Oliver POS
            //                                 </h3>
            //                                                 <h3 className="user_login_head__title">
            //                                                     Please sign into your account by using one of the following options:
            //                                 </h3>
            //                                             </div>

            //                                             <div className="form-group user-form-group">
            //                                                 <label htmlFor="Email">{Language.key.EMAIL}</label>
            //                                                 <input autoComplete="off" type="text" autoFocus='autofocus' tabIndex="1" className="form-control" placeholder="john@example.ca" id="username"
            //                                                     name="username" value={username} onChange={handleChange} onKeyDown={handleKey} />


            //                                             </div>
            //                                             <div className="form-group user-form-group">
            //                                                 <label htmlFor="password">{Language.key.PASSWORD}</label>
            //                                                 <input autoComplete="off" className="form-control"  placeholder="******" id="password"
            //                                                     name="password" tabIndex="1" type="password" value={password} onChange={handleChange} onKeyDown={handleKey} />
            //                                             </div>
            //                                             {(typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?null:
            //                                             <div className="user_login___extra">
            //                                                 <div className="col">
            //                                                     <a href={bridgDomain + "/Account/ForgotPassword?_refrence=sell"} id="kt_login_forgot" className="kt-login__link">Forget Password ?</a>
            //                                                 </div>
            //                                                 <div className="col text-right">
            //                                                     <label className="user_login-checkbox">
            //                                                         <input type="checkbox" id="remember" name='rememberUser' /> Remember me
            //                                                         <span></span>
            //                                                     </label>
            //                                                 </div>
            //                                             </div>
            //                                             }
            //                                             <div className="user_login_action">
            //                                                 {vlidationError != "" &&
            //                                                     <div className="validationError text-center">
            //                                                         {fieldErr !== '' ? <img src='../../assets/img/images/error.svg' /> : usernamedErr !== "" ? <img src='../../assets/img/images/error.svg' /> : passwordErr !== '' ? <img src='../../assets/img/images/error.svg' /> : loggedIn == false ? <img src='../../assets/img/images/error.svg' /> : ""}
            //                                                         {wentWrongErr !== '' ? wentWrongErr : fieldErr !== '' ? fieldErr : usernamedErr !== "" ? usernamedErr : passwordErr !== '' ? passwordErr : loggedIn == false ? loginError : ""}
            //                                                     </div>}
            //                                                 <button
            //                                                     className="btn btn-primary btn-block user_login_btn_success user_login-margin-t-20" type="button"
            //                                                     onClick={handleSubmit} onKeyDown={handleKey}>
            //                                                     Sign In
            //                             </button>
            //                             {/* {(typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?null:
            //                                                 <div><div className="user-login__divider">
            //                                                     <div className="user-divider">
            //                                                         <span></span>
            //                                                         <span>OR</span>
            //                                                         <span></span>
            //                                                     </div>
            //                                                 </div>

            //                                                 <div className="user_login__button user_login__button_fill">
            //                                                     <button type="submit" ref="googleLoginBtn" title="Log in using your Google account" className="btn btn-outline-secondary btn-block user_login__social user_login_gl_on"
            //                                                        >
            //                                                         <span> {LocalizedLanguage.SignupwithGoogle}</span>
            //                                                     </button>
            //                                                 </div>

            //                                                 <div className="user_login__button user_login__button_fill">

            //                                                     <FacebookLogin cssClass="btn btn-outline-secondary btn-block user_login__social user_login_fb_on"
            //                                                         appId={Config.key.FACEBOOK_CLIENT_ID}
            //                                                         autoLoad={false}
            //                                                         fields="first_name, last_name,name,email"
            //                                                         scope="public_profile, email"
            //                                                         onClick={componentClicked}
            //                                                         callback={responseFacebook}
            //                                                         textButton="Sign in with Facebook"

            //                                                     />
            //                                                 </div>

            //                                                 <div className="user-login__account">
            //                                                     <span>Don’t have an account?</span><a href="#"
            //                                                         onClick={handleSignInClick} className="user-login__account-link"><u> Sign Up Now!</u></a>
            //                                                 </div>
            //                                                 </div>} */}
            //                                             </div>
            //                                         </div>
            //                                     </div>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 </div>
            //                 <div className="user_login_colB">
            //                     <div className="user_login_aside"
            //                         style={{ backgroundImage: "url('../../assets/img/onboarding/connect.png')" }}>

            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <OnboardingFooter />
            //     <CommonMsgModal msg_text={common_Msg} close_Msg_Modal={closeExtraPayModal} />
            // </div>
        )
    }

}
// function mapStateToProps(state) {
//     const { authentication, onboardingReducers } = state;
//     return {
//         authentication,
//         oliverExternalLoginRes: onboardingReducers.oliverExternalLoginRes,
//         loading: onboardingReducers.loading
//     };
// }
// const WebLoginView = connect(mapStateToProps)(WebLoginView1);
export default WebLoginView;
