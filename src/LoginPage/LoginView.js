import * as React from 'react';
import { connect } from 'react-redux';
import { userActions } from './action/user.actions';
import Cookies from 'universal-cookie';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import WebLoginView from './views/wLogin';
import MobileLoginView from './views/mLogin';
import { history } from '../_helpers/history';
import Config from '../Config'
import compareVersions from 'compare-versions';
import { pinLoginActions } from '../PinPage/action/PinLogin.action';
import {trackPage} from '../_components/SegmentAnalytic'

import { onboardingActions } from '../OliverlLoginPage/action/onboarding.action.js';
import {removeFirebaseSubscription} from '../firebase/Notifications'
import {sendFireBaseTokenToAdmin} from '../firebase/Notifications';
import { checkForEnvirnmentAndDemoUser } from '../_components/CommonJS';
import {isShowWrapperSetting} from '../WrapperSettings/CommonWork';
const cookies = new Cookies();
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.dispatch(userActions.logout());
        this.state = {
            username: cookies.get('user') && cookies.get('user') !== 'undefined' ? cookies.get('user') : '',
            password: cookies.get('pwd') && cookies.get('pwd') !== 'undefined' ? cookies.get('pwd') : '',
            submitted: false,
            check: true,
            loading: false,
            fieldErr: '',
            usernamedErr: '',
            passwordErr: '',
            common_Msg: '',
            isLoginSuccess: '',
            wentWrongErr: '',
            hardBlockerOliverVersion: '',
            isOldVersion: false,
            userProfileData: ''

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.closeExtraPayModal = this.closeExtraPayModal.bind(this);

        this.responseFacebook = this.responseFacebook.bind(this);
        this.componentClicked = this.componentClicked.bind(this);
        this.handleSignInClick = this.handleSignInClick.bind(this);
        

        // localStorage.removeItem("cloudPrinters");
        // localStorage.removeItem("DemoGuid");
        // localStorage.removeItem("VisiterUserID");
        // localStorage.removeItem("VisiterUserEmail");
        // localStorage.removeItem("shopstatus");
        // localStorage.removeItem('UserLocations');
        // localStorage.removeItem("userId");
        // localStorage.removeItem("LANG");
        // localStorage.removeItem('AdCusDetail')
        // localStorage.removeItem("clientDetail");
        // localStorage.removeItem("selectedRegister");
        // localStorage.removeItem("RegisterPermissions");
        // localStorage.removeItem('user');
        // localStorage.removeItem('demoUser');
        // localStorage.removeItem('productcount');
        // localStorage.removeItem("PRODUCTX_DATA");
        // localStorage.removeItem("GET_EXTENTION_FIELD");
        // localStorage.removeItem("GroupSaleRecord")


        // localStorage.removeItem("shopstatus");
        // localStorage.removeItem('UserLocations');
        // localStorage.removeItem("userId");
        // localStorage.removeItem("LANG");
        // localStorage.removeItem('AdCusDetail')
        // localStorage.removeItem("clientDetail");
        // localStorage.removeItem("selectedRegister");
        // localStorage.removeItem("RegisterPermissions");
        // localStorage.removeItem('user');
        // localStorage.removeItem('demoUser');
        // localStorage.removeItem("PRODUCTX_DATA");
        // localStorage.removeItem('CART');
        // localStorage.removeItem('firebaseStaffName');
        // localStorage.removeItem('firebaseSelectedRegisters');

        // localStorage.removeItem('pdf_format');
        // localStorage.removeItem("CustomerList");
        // localStorage.removeItem("FAV_LIST_ARRAY");
        // localStorage.removeItem("FAVROUTE_LIST_ARRAY");
        // localStorage.removeItem("categorieslist");
        // localStorage.removeItem("WarehouseId");
        // localStorage.removeItem('DEFAULT_TAX_STATUS');
        // localStorage.removeItem('APPLY_DEFAULT_TAX');
        // localStorage.removeItem("isListner");
        localStorage.clear();
        sessionStorage.clear();
        window.isListner=false;
        var demoUser = localStorage.getItem('demoUser')
        if( !demoUser || demoUser != 'true'){
            this.props.dispatch(pinLoginActions.getBlockerInfo())
        }
        //remove subscription 

        var isValidENV = checkForEnvirnmentAndDemoUser()

        if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
        removeFirebaseSubscription(this.props.dispatch);
        }

    }

    checkVersionIsAvailable(BridgeVersion) {
        const { hardBlockerOliverVersion } = this.state

          // Call API to send fairebase token to Admin----------------------
          var isValidENV = checkForEnvirnmentAndDemoUser()

          if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
          sendFireBaseTokenToAdmin(this.props.dispatch)
          }
          //----------------------------------------------------------------   
          
        if (BridgeVersion && hardBlockerOliverVersion) {
            BridgeVersion = BridgeVersion.replace(/['"]+/g, '')
            var versionCompare =true;
            try { versionCompare= compareVersions.compare(`${BridgeVersion}`, `${hardBlockerOliverVersion}`, '<') == true                
            } catch (error) {
                versionCompare =true;
            }
           
           // console.log('versionCompare----', versionCompare);
            if (versionCompare == false) {
                setTimeout(() => {
                    //history.push('/site_link');
                    isShowWrapperSetting("LoginView.js->check version",'site_link','push');
                }, 200);

            }
            this.setState({ isOldVersion: versionCompare, loading: false })
        }
    }

    // retry button click
    handleRetryButtonClick = () => {
        window.location.href = process.env.BRIDGE_DOMAIN;
    }

    componentWillReceiveProps(nextProps) {


    //     // for demo user
    //     if (nextProps && nextProps.oliverExternalLoginRes && nextProps.oliverExternalLoginRes.content && nextProps.oliverExternalLoginRes.content.UserToken) {

    //         var fbLoginData = localStorage.getItem('FGLoginData')
    //         // var googleLoginData = localStorage.getItem('googleLoginData')  // Not implemeted yet
    //         // if (fbLoginData && fbLoginData.length > 0 && nextProps.oliverExternalLoginRes.content.UserToken != '') {
    //         //     localStorage.setItem('demoUser', true)
    //         //     history.push(`/VisiterShopAccess?_u=${nextProps.oliverExternalLoginRes.content.UserToken}&_t=demo&_fg=true`);
    //         // }

    //         if (fbLoginData && fbLoginData.length > 0 && nextProps.oliverExternalLoginRes.content) {
    //             if (nextProps.oliverExternalLoginRes && nextProps.oliverExternalLoginRes !== undefined && nextProps.oliverExternalLoginRes.content && nextProps.oliverExternalLoginRes.content !== undefined && nextProps.oliverExternalLoginRes.content.subscriptions && nextProps.oliverExternalLoginRes.content.subscriptions !== undefined && nextProps.oliverExternalLoginRes.content.subscriptions.length > 0) {
    //                if(nextProps.oliverExternalLoginRes.content.subscriptions.length > 0){
    //                     if (nextProps.oliverExternalLoginRes.content.GoToDemo == true) {
    //                         //Redirect to sync page
    //                         var _client_Id = nextProps.oliverExternalLoginRes.content.subscriptions && nextProps.oliverExternalLoginRes.content.subscriptions[0].subscription_detail.client_guid;
    //                         var _token = nextProps.oliverExternalLoginRes.content.UserToken && nextProps.oliverExternalLoginRes.content.UserToken;
    //                         // window.open(
    //                         window.location.href = process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?_client=${_client_Id}&_token=${_token}`;
    //                         return;
    //                     }
    //                 }
    //             }
    //             else {
    //                 localStorage.setItem('demoUser', true)
    //                 window.location.href = `/VisiterShopAccess?_u=${nextProps.oliverExternalLoginRes.content.UserToken}&_t=demo&_fg=true`;
    //                 return;
    //             }


    //         } else {
    //             this.setState({ loading: false, wentWrongErr: 'Something went wrong' })
    //         }
    //     }
        if(nextProps.oliverExternalLoginRes && nextProps.oliverExternalLoginRes !== undefined && nextProps.oliverExternalLoginRes.exceptions && nextProps.oliverExternalLoginRes.exceptions.length>0  ){
            this.setState({
                wentWrongErr: nextProps.oliverExternalLoginRes.exceptions.toString(),
                loading: false,
                fieldErr: '',
                usernamedErr: '',
                passwordErr: '',
            });
        }
        else if (nextProps.oliverExternalLoginRes && nextProps.oliverExternalLoginRes !== undefined && nextProps.oliverExternalLoginRes.content && nextProps.oliverExternalLoginRes.content !== null) {
            if(nextProps.oliverExternalLoginRes.content.subscriptions.length > 0){
                var loginRes = nextProps.oliverExternalLoginRes.content;
                //set local storate as same as nomal login response
                var userSubscription = loginRes.subscriptions[0];
                if (!userSubscription) {
                    this.setState({
                        wentWrongErr: 'Something Went wrong',
                        loading: false,
                        fieldErr: '',
                        usernamedErr: '',
                        passwordErr: '',
                    });
                }
                userSubscription && sessionStorage.setItem("AUTH_KEY", userSubscription.subscription_detail.client_guid + ":" + userSubscription.subscription_detail.server_token);
                var lang = userSubscription && userSubscription.subscription_permission.language ? userSubscription.subscription_permission.language : 'en';
                localStorage.setItem("LANG", lang);
                var sitelis = loginRes;
                localStorage.setItem('sitelist', JSON.stringify(sitelis))
                var userID = '';
                localStorage.setItem('userId', loginRes.UserId)
                localStorage.setItem("clientDetail", JSON.stringify(userSubscription));
                localStorage.setItem("hasPin", loginRes.HasPin && loginRes.HasPin);
                userSubscription && this.checkVersionIsAvailable(userSubscription.subscription_detail.bridge_version);
            }
        }
        if (nextProps && nextProps.loading) {
            this.setState({ loading: nextProps.loading })
        }
        if (nextProps && nextProps.GetUserProfile) {
            this.setState({ userProfileData: nextProps.GetUserProfile })
            console.log('----GetUserProfile----', nextProps.GetUserProfile);
        }
    //     // end
        // version check
        if (nextProps.getversioninfo) {
            if (nextProps.getversioninfo.HardBlockerVersion && nextProps.getversioninfo.HardBlockerVersion[0]) {
                if (nextProps.getversioninfo.HardBlockerVersion && nextProps.getversioninfo.HardBlockerVersion.length > 0) {
                    var hardBlockerVersion = nextProps.getversioninfo.HardBlockerVersion.find(Items => (Items.Code == "Hard_Oliver_Version"))
                    this.setState({ hardBlockerOliverVersion: hardBlockerVersion.Value })
                }
            }
        }
        if (nextProps.authentication.user !== null && nextProps.authentication.user !== undefined) {
            if(nextProps.authentication.user.subscriptions.length > 0){
                if (nextProps.authentication.user && nextProps.authentication.user.subscriptions[0].subscription_detail.bridge_version=="") {
                    //history.push('/site_link');
                    isShowWrapperSetting("LoginView.js->WillReceive",'site_link','push');
                }
                else if (nextProps.authentication.user && nextProps.authentication.user.subscriptions[0].subscription_detail.bridge_version) {
                    this.checkVersionIsAvailable(nextProps.authentication.user.subscriptions[0].subscription_detail.bridge_version)
                }
                // end
                if (this.props.authentication.loggingIn == false) {
                    this.setState({
                        loading: false
                    });
                }
            }
        }
        if (nextProps.authentication && nextProps.authentication.loggedIn == false) {
            this.setState({
                loading: false
            });
        }
    }

    closeExtraPayModal() {
        this.setState({ common_Msg: '' })
        $('#common_msg_popup').modal('hide');
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
        else if (isMobileOnly === true) {
            localStorage.setItem("env_type", "Android")
        }
        else {
            localStorage.removeItem("env_type");
        }
        // check the user logged in with mobile send sending data in queary string------------
        var urlParam = this.props.location.search;
        var splParam = urlParam.replace("?", "").split("&");
        var finalParam = ""
        splParam.forEach(element => {
            finalParam += finalParam == "" ? "" : "&";
            if (element.substring(0, element.indexOf('=')) === "muserdata")
                finalParam += decodeURI(element.substring(element.indexOf('=') + 1));
        });
        if (finalParam !== null  && finalParam !== "") {
            var jsondata = JSON.parse(finalParam);
            var sitelist = jsondata ? jsondata.content : null ;
            var userSubscription = sitelist ? sitelist.subscriptions && sitelist.subscriptions[0] : null;
            if (userSubscription) {
                sessionStorage.setItem("AUTH_KEY", userSubscription.subscription_detail.client_guid + ":" + userSubscription.subscription_detail.server_token);
            }
            var lang = userSubscription && userSubscription.subscription_permission.language ? userSubscription.subscription_permission.language : 'en';
            localStorage.setItem("LANG", lang);
            if(sitelist){
                localStorage.setItem('sitelist', JSON.stringify(sitelist));
                var userID = '';
                localStorage.setItem('userId', sitelist.UserId)
                localStorage.setItem("clientDetail", JSON.stringify(userSubscription));
                localStorage.setItem("hasPin", sitelist.HasPin && sitelist.HasPin);
            }
            // Call API to send fairebase token to Admin----------------------
            var isValidENV = checkForEnvirnmentAndDemoUser()
            if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
             sendFireBaseTokenToAdmin(this.props.dispatch)
            }
             //----------------------------------------------------------------   
            setTimeout(() => {
                //history.push('/site_link');
                isShowWrapperSetting("LoginView.js->DidMount",'site_link','push');
            }, 200);
        }
        //---------------------------------------------------------------------------------------
        trackPage(history.location.pathname,"login","login","login");
    }
    prepareGoogleLoginButton = () => {
        localStorage.removeItem('FGLoginData');
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
                this.setState({ isLoginSuccess: "false" })
                // alert(JSON.stringify(error, undefined, 2));
            });

    }


    googleSDK = () => {
        this.setState({ isLoginSuccess: "" })
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

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));

    }

    // Handle facbook login button response 
    responseFacebook = (response) => {
        localStorage.removeItem('FGLoginData');
        const { dispatch } = this.props;
        console.log("responseFacebook", response);
        if (response && response.status !== "unknown") {
            this.setState({ isLoginSuccess: "true" })
            localStorage.setItem('FGLoginData', JSON.stringify(response))
            var dob = response && response.birthday ? response.birthday.split('/'):''
            var formatedDob = dob && dob.length == 3 ? ''+dob[2]+'-'+dob[1]+'-'+dob[0]:''


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
                FirstName: response && response.first_name ? response.first_name : "",
                LastName: response && response.last_name ? response.last_name : "",
                AccessToken: response && response.accessToken ? response.accessToken : "",
                Picture: response && response.picture ? response.picture.data && response.picture.data.url : "",
                Gender: response && response.gender ? response.gender : "",
                PhoneNumber: response && response.phoneNumber ? response.PhoneNumber:'',
                Dob: formatedDob,
                AgeRange: response && response.age_range && response.age_range.min ? response.age_range.min : "",
                // Address: response && response.address ? response.address : "",
                Address: response && response.location && response.location.name ? response.location.name : "",
                CountryName: response && response.country ? response.country : "",
                CityName: response && response.city ? response.city : "",

            }
            this.CallService(sendRes);
        } else {
            this.setState({ isLoginSuccess: "false" })
        }

    }
    // call server on the bassis of facbook and google response 
    CallService = (FGdata) => {

        const { dispatch } = this.props;
        console.log("FGdata", FGdata)
        dispatch(onboardingActions.OliverExternalLogin(FGdata));
    }

    componentClicked = () => {
        this.setState({ isLoginSuccess: "" })
        console.log("componentClicked");
    }

    // handle signIn with email button click    
    handleSignInClick = () => {
        window.location = process.env.BRIDGE_DOMAIN + '/Account/Register';
        // const { userToken } = this.state
        // var fbLoginData = localStorage.getItem('facebookLoginData')
        // // var googleLoginData = localStorage.getItem('googleLoginData')  // Not implemeted yet
        // if (fbLoginData.length > 0 && userToken != '') {
        //     history.push(`/VisiterShopAccess?_u=${userToken}&_t=demo`);
        // }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        if ($('#remember').attr('checked')) {
            var username = $('#username').attr("value");
            var password = $('#password').attr("value");
            if (name == "username") {
                cookies.set("user", value);
            }
            if (name == "password") {
                cookies.set("pwd", value);
            }
            cookies.set('remember', this.state.check);
        }
    }

    handleSubmit(e) {
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            this.setState({
                submitted: true,
                loading: true,
                fieldErr: '',
                usernamedErr: '',
                wentWrongErr: '',
                passwordErr: ''
            });
            if (this.state.check == false) {  //$('#remember').attr('checked')              

                cookies.set('user', '');
                cookies.set('pwd', '');
            }
            dispatch(userActions.login(username, password));
            this.state.username = "";
            this.state.password = "";

        } else {
            if (!username && !password) {
                this.setState({
                    fieldErr: 'Email and Password is required',
                    usernamedErr: '',
                    passwordErr: '',
                    wentWrongErr: ''
                });
                $('#username').focus();
            } else if (!username) {
                this.setState({
                    usernamedErr: 'Email is required',
                    passwordErr: '',
                    fieldErr: '',
                    wentWrongErr: ''
                });
                $('#username').focus();
            } else {
                this.setState({
                    passwordErr: 'Password is required',
                    usernamedErrL: '',
                    fieldErr: '',
                    wentWrongErr: ''
                });
                $('#password').focus();
            }
        }
        e.preventDefault();
    }

    checkStatus = (value) => {
        this.setState({ check: value })
        if (value == false) {
            var username = $('#username').attr("value");
            var password = $('#password').attr("value");
            cookies.set('user', '');
            cookies.set('pwd', '');
            cookies.set('remember', value);
        } else {
            var username = $('#username').attr("value");
            var password = $('#password').attr("value");
            cookies.set('user', '');
            cookies.set('pwd', '');
            cookies.set('remember', value);
        }
        var remem = cookies.get('remember')
        if (remem == 'true') {
            this.setState({ username: cookies.get('user') })
            this.setState({ password: cookies.get('pwd') })
        }
    }

    handleKey = (e) => {
        var key = e.which || e.keyCode;
        if (key === 13) {
            this.handleSubmit(e);
        }
    }

    autoFocus() {
        $('#username').focus();
    }

    render() {
        return (
            //isBrowser == true ?
            (isMobileOnly == true) ?
                // <MobileLoginView
                //     {...this.props}
                //     {...this.state}
                //     handleChange={this.handleChange}
                //     handleSubmit={this.handleSubmit}
                //     handleKey={this.handleKey}
                //     closeExtraPayModal={this.closeExtraPayModal}
                //     checkStatus={this.checkStatus}
                // />
                <WebLoginView
                    {...this.props}
                    {...this.state}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    handleKey={this.handleKey}
                    closeExtraPayModal={this.closeExtraPayModal}
                    checkStatus={this.checkStatus}
                    responseFacebook={this.responseFacebook}
                    componentClicked={this.componentClicked}
                    googleSDK={this.googleSDK}
                    prepareGoogleLoginButton={this.prepareGoogleLoginButton}
                    CallService={this.CallService}
                    isOldVersion={this.state.isOldVersion}
                    handleRetryButtonClick={this.handleRetryButtonClick} />
                :
                <WebLoginView
                    {...this.props}
                    {...this.state}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    handleKey={this.handleKey}
                    closeExtraPayModal={this.closeExtraPayModal}
                    checkStatus={this.checkStatus}
                    responseFacebook={this.responseFacebook}
                    componentClicked={this.componentClicked}
                    googleSDK={this.googleSDK}
                    prepareGoogleLoginButton={this.prepareGoogleLoginButton}
                    CallService={this.CallService}
                    isOldVersion={this.state.isOldVersion}
                    handleRetryButtonClick={this.handleRetryButtonClick}
                    userProfileData={this.state.userProfileData} />
        );
    }
}

function mapStateToProps(state) {
    const { authentication, onboardingReducers, getversioninfo, GetUserProfile } = state;
    return {
        authentication,
        oliverExternalLoginRes: onboardingReducers && onboardingReducers.oliverExternalLoginRes,
        loading: onboardingReducers && onboardingReducers.loading,
        getversioninfo: getversioninfo.items,
        GetUserProfile: GetUserProfile && GetUserProfile.profileData


    };
}
const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };     