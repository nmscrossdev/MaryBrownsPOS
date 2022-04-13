import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute, LoadingIndexDB, ServerErrorPopup } from '../_components';
import { LoginPage } from '../LoginPage';
import { Activity } from '../ActivityPage';
import { CustomerView } from '../CustomerPage';
import { CheckoutView } from '../CheckoutPage';
import { RefundView } from '../RefundPage';
// import { CashReportView } from '../CashReportPage';
import { SettingView } from '../SettingPage';
import { SiteLinkView } from '../SiteLinkPage';
import { LoginRegisterView } from '../LoginRegisterPage';
import { PinPage } from '../PinPage/PinView';
import { ShopView } from '../ShopView';
import { ListView } from '../ListView';
import { AppView } from '../AppView';
import { LoginLocation } from '../LoginLocation';
import { SaleComplete } from '../CheckoutPage/components/SaleComplete';
import { RefundComplete } from '../RefundPage/components/refund_complete'; //by deepsagar
import { InternalErr } from '../Error/InternalErr'
import { RevalidatePage } from '../RevalidatePage'
import { pinLoginActions } from '../PinPage/action/PinLogin.action';
import { ExternalLogin } from '../ExternalLogin/ExternalLogin';
import { userActions } from '../_actions/user.actions';
import { get_UDid } from '../ALL_localstorage';
import { getBrowserVersionAndName, getWebAppVersion } from '../settings/GetAPIBrowserVersion';
import { BrowserVersionModal } from "./BrowserVersionModal";
import { OliverVersionModal } from "./OliverVersionModal";
import compareVersions from 'compare-versions';
import Config from '../Config'
import MobileActivityOptions from '../ActivityPage/views/m.ActivityOptions'
import { refreshwebManu } from '../_components/CommonFunction'
import { isMobileOnly, isIOS } from "react-device-detect";
import { SelfCheckoutView } from '../SelfCheckout/SelfCheckoutView'
import SelfCheckout from '../SelfCheckout/components/SelfCheckout';
// import  cardpaymentRes  from '../SelfCheckout/components/CheckoutPage/cardpaymentRes';
import { CashManagement } from '../CashManagementPage/CashManagement'
import $ from 'jquery';
import { GTM_ClientDetail } from '../../src/_components/CommonfunctionGTM'
import { OliverLogin } from '../OliverlLoginPage/OliverLogin';
import { MobileConnectDemoUser, MobileEmailSuccessView, OnboardingLoading, VisiterShopAccess } from '../onboarding';
import { checkForEnvirnmentAndDemoUser, redirectToURL } from '../_components/CommonJS';
//import firebase from '../firebase/firebase';
import {getFirebaseNotification,pingRegister} from '../firebase/Notifications';
import { CommonInfoPopup } from '../_components/CommonInfoPopup';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import {SettingView_Wrapper} from '../WrapperSettings/components/SettingView';
const broswerdetail = getBrowserVersionAndName();
const webappversion = getWebAppVersion();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ErrMessage: ""
        }
        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
        this.checkUserlogin()
        //dispatch(pinLoginActions.getBlockerInfo())
        this.closeModal = this.closeModal.bind(this)

        // call firebase notification functionality
        var isValidENV = checkForEnvirnmentAndDemoUser()
        if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
            getFirebaseNotification()
            setInterval(() => { 
                getFirebaseNotification()
            }, 40000);
        }
    }

    componentWillMount() {
        // const script = document.createElement("script");
        // script.src = `https://www.googletagmanager.com/gtag/js?id=${Config.key.GA_KEY};`;
        // script.async = true;
        // const scriptText = document.createTextNode(`window.dataLayer = window.dataLayer || [];   function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config','${Config.key.GA_KEY}');`);
        // script.appendChild(scriptText);
        // document.head.appendChild(script);
    }

    componentDidMount() {      
        if (localStorage.getItem('demoUser') == 'true') {
            // var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?newParameter=1';
            // window.history.pushState({ path: newurl }, '', newurl);
           if(window.location.pathname !="/login"){
            window.history.replaceState(null, null, "?_u=demo");}
        }
        if (!isMobileOnly) {
            refreshwebManu();
        }
        setTimeout(() => {
            GTM_ClientDetail();
        }, 1000);
        
                
        var  _register =localStorage.getItem("register") 
        var _user = localStorage.getItem('user')
        var myInterval = setInterval(() => {
            if (_register && _user) {
               // console.log("ping register")
                pingRegister(this.props.dispatch)             
            } else {
                clearInterval(myInterval);
            }
          }, 240000)
        //--------------------------------------------

        // setInterval(() => {
        //     console.log('------------------',localStorage.getItem('testData'));
        // }, 10000);
    }
    // // get device token via firebase and sent to the firebase server to get notification
    // getFirebaseNotification = () => {
    //     const messaging = firebase.messaging()
    //     messaging.requestPermission().then(() => {
    //         return messaging.getToken();
    //     }).then((token) => {
    //         console.log('---token---------------------', token);
    //         // var requestOptions = {
    //         //     method: 'POST',
    //         //     headers: {
    //         //         "access-control-allow-origin": "*",
    //         //         "access-control-allow-credentials": "true",
    //         //         'Accept': 'application/json',
    //         //         'Content-Type': 'application/json',
    //         //     }
    //         //     , mode: 'cors',
    //         //     body: JSON.stringify({ token: token })

    //         // };
    //         messaging.onMessage((payload) => {
    //             alert(payload.notification.title)
    //             console.log('Message received. ', payload);
    //         });
    //         // return fetch("http://localhost:5000/message", requestOptions)
    //         //     .then((res) => {
    //         //         console.log('----- ----------success----', res);
                    
    //         //     }).catch((err) => {
    //         //         console.log('---------------err----', err);
    //         //     })
    //     }).catch((err) => {
    //         console.log('error---', err);
    //     })
    // }


    logout() {
        this.props.dispatch(userActions.logout())
    }

    checkUserlogin() {
        var IDLE_TIMEOUT = 1800; //seconds
        var _idleSecondsCounter = 0;
        document.onclick = function () {
            _idleSecondsCounter = 0;
        };
        document.onmousemove = function () {
            _idleSecondsCounter = 0;
        };
        document.onkeypress = function () {
            _idleSecondsCounter = 0;
        };
        window.setInterval(CheckIdleTime, 1000);
        function CheckIdleTime() {
            _idleSecondsCounter++;
            var oPanel = document.getElementById("SecondsUntilExpire");
            if (oPanel)
                oPanel.innerHTML = (IDLE_TIMEOUT - _idleSecondsCounter) + "";
            if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                // if (localStorage.getItem('demoUser') != 'true')
                //     window.location = '/loginpin'
                redirectToURL()
            }
        }
    }

    checkSubscriptionStatus() {
        var UID = get_UDid('UDID');
        if (UID !== null && typeof UID !== 'undefined') {
            var check_subscription_status_datetime = localStorage.getItem("check_subscription_status_datetime")
            if (check_subscription_status_datetime && typeof check_subscription_status_datetime !== "undefined") {
                var currentDateTime = new Date();
                var existDateTime = new Date(check_subscription_status_datetime);
                currentDateTime.getHours()
                var curent = currentDateTime.getDate();
                var exist = existDateTime.getDate();
                if (curent == exist) {
                    var timeDifference = currentDateTime.getTime() - existDateTime.getTime();
                    var diff_as_date = new Date(timeDifference);
                    if (diff_as_date.getHours() > 3) {
                        this.props.dispatch(pinLoginActions.checkSubcription())
                    }
                } else {
                    this.props.dispatch(pinLoginActions.checkSubcription())
                }
            }
        }
    }

    disableBrowserScreen() {
        $('.disabled_browser_popup').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

    disableOliverScreen() {
        $('.disabled_oliver_popup').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

    checkVersionIsAvailable(getversiondetail) {
        //console.log("broswerdetail", broswerdetail)
        var browserName = broswerdetail[0] && broswerdetail[0].browser_name;
        var browserVersion = broswerdetail[0] && broswerdetail[0].full_version;
        var appVersion = webappversion;
        if (getversiondetail) {
            if (getversiondetail.HardBlockerVersion && getversiondetail.HardBlockerVersion.length > 0) {
                getversiondetail.HardBlockerVersion.map(Items => {
                    if (Items.Name == browserName) {
                        // return true
                        //console.log("version", Items.Value, browserVersion);
                        //console.log("check", compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '>'))
                        if (compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '>')) {
                            // $('#browser_version').modal('show')
                            showModal('browser_version');
                            this.disableBrowserScreen();

                        }
                        // return true
                        if (compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '=')) {
                            // console.log("STEP01", compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '='))
                        }
                        // return true
                        if (compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '<')) {
                            // console.log("STEP02", compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '<'))
                        }
                        // return true
                        if (compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '<=')) {
                            // console.log("STEP03", compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '<='))
                        }
                        // return false
                        if (compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '>=')) {
                            //  console.log("STEP04", compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '>='))
                        }
                        if (Items.Value !== browserVersion) {
                            // $('#browser_version').modal('show')
                        }
                    }
                    if (Items.Code == "Hard_Oliver_Version") {
                        if (compareVersions.compare(`${Items.Value}`, `${appVersion}`, '>')) {
                            //$('#oliver_version').modal('show')
                            showModal('oliver_version');
                            this.disableOliverScreen();
                        }
                        // if (appVersion !== Items.Value) {
                        //     this.Screen();
                        //     $('#oliver_version').modal('show')
                        // }
                    }
                })
            }
        }
    }

    componentWillReceiveProps(recieveProps) {
        if (recieveProps.getversioninfo) {
            // this.checkVersionIsAvailable(recieveProps.getversioninfo)
        }
        if (recieveProps.alert && recieveProps.alert.message) {
            if (recieveProps.alert.message == 'Internal Server Error' || recieveProps.alert.message == 'TypeError: Failed to fetch') {
                this.setState({ ErrMessage: recieveProps.alert.message })
                if (isMobileOnly == true) {
                    $('#ServerErrorPopup').addClass("show");
                }
                showModal('ServerErrorPopup');
            }
        }
    }

    closeModal() {
        //window.location = '/login';
        // window.open("about:blank", "_self");
        // window.close();
        // self.close();
        // window.close();
        window.open("https://help.oliverpos.com/pos-register", "_self")
    }
    ReportBug() {
        //window.location = '/login';
        // window.open("about:blank", "_self");
        // window.close();
        // self.close();
        // window.close();
        window.open("https://help.oliverpos.com/kb-tickets/new", "_self")
    }

    handleCloseCommonPopup = ()=>{
        hideModal('commonFirebaseNotificationPopup')
        window.location = '/login';

    }

    render() {
        //console.log("PathName", history)
        if (!isMobileOnly) {
            refreshwebManu();
        }
        return (
            <Router history={history}>
                <div>
                    {/* when shops plan update the popup called  */}
                    {/* added here because need to call in every component  (it is common and same on all component) */}
                    <CommonInfoPopup
                     title = {LocalizedLanguage.planHasBeenUpdated}
                     subTitle = {LocalizedLanguage.planUpdateNeedToRelogin}
                     buttonText = {LocalizedLanguage.logOut}
                     closeCommonPopup = {()=>this.handleCloseCommonPopup()}
                     id = {'commonFirebaseNotificationPopup'}
                     />

                    <PrivateRoute exact path="/" component={LoadingIndexDB} />
                    <PrivateRoute path="/shopview" component={ShopView} />
                    <PrivateRoute path="/SelfCheckout" component={SelfCheckout} />
                    <PrivateRoute path="/customerview" component={CustomerView} />
                    <PrivateRoute path="/checkout" component={CheckoutView} />
                    <PrivateRoute path="/SelfCheckoutView" component={SelfCheckoutView} />
                    {/* <PrivateRoute path="/cardpaymentRes" component={cardpaymentRes} /> */}
                    <PrivateRoute path="/cashdrawer" component={CashManagement} />
                    <PrivateRoute path="/setting" component={SettingView} />
                    {/* <PrivateRoute path="/cash_report" component={CashReportView} /> */}
                    <PrivateRoute path="/activity" component={Activity} />
                    <PrivateRoute path="/refund" component={RefundView} />
                    <PrivateRoute path="/salecomplete" component={SaleComplete} />
                    {/* <PrivateRoute path="/listview" component={ListView} />
                    <PrivateRoute path="/appview" component={AppView} /> */}
                    <PrivateRoute path="/refund_complete" component={RefundComplete} />
                    <Route path="/choose_registration" component={LoginRegisterView} />
                    <Route path="/ExternalLogin" component={ExternalLogin} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/login_location" component={LoginLocation} />
                    <Route path="/site_link" component={SiteLinkView} />
                    <Route exact path="/loginpin" component={PinPage} />
                    <Route path='/Error' component={InternalErr} />
                    <Route path="/revalidate" component={RevalidatePage} />
                    <Route path="/MobileActivityOptions" component={MobileActivityOptions} />
                    <Route path="/oliverlogin" component={OliverLogin} />
                    <Route path="/VisiterShopAccess" component={VisiterShopAccess} />
                    <Route path="/onboardloading" component={OnboardingLoading} />
                    <Route path="/connect_demo_user" component={MobileConnectDemoUser} />
                    <Route path="/email_sent" component={MobileEmailSuccessView} />
                    <Route path="/wsetting" component={SettingView_Wrapper} />

                    {/* <OliverVersionModal closeModal={this.closeModal} reportBug={this.ReportBug} />
                    <BrowserVersionModal closeModal={this.closeModal} reportBug={this.ReportBug}/> */}
                    <ServerErrorPopup message={this.state.ErrMessage} />
                </div>
            </Router>

        );
    }
}

function mapStateToProps(state) {
    const { alert, getversioninfo } = state;
    return {
        alert,
        getversioninfo: getversioninfo.items
    };
}
const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 