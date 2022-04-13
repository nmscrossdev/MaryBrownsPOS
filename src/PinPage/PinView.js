import React from 'react';
import { connect } from 'react-redux';
import { pinLoginActions } from '.';
import { history } from '../_helpers';
import { checkShopSTatusAction, discountActions, attributesActions, cartProductActions,exchangerateActions } from '../_actions';
import { favouriteListActions } from '../ShopView';
import { checkoutActions } from '../CheckoutPage';
import { chunkArray } from '../ALL_localstorage';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import MobilePin from './views/mPin';
import WebPin from './views/wPin';
import { get_UDid } from '../ALL_localstorage';
import { getBrowserVersionAndName, getWebAppVersion } from '../settings/GetAPIBrowserVersion';
import { BrowserVersionModal } from "../App/BrowserVersionModal";
import { OliverVersionModal } from "../App/OliverVersionModal";
import compareVersions from 'compare-versions';
import { GTM_ClientDetail } from '../_components/CommonfunctionGTM';
import { registerActions } from '../LoginRegisterPage/actions/register.action';
import { cashManagementAction } from "../CashManagementPage/actions/cashManagement.action";
import {trackPage} from '../_components/SegmentAnalytic'
import $ from 'jquery';
const broswerdetail = getBrowserVersionAndName();
const webappversion = getWebAppVersion();

const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <tr key={index}>
            {num.map((nm, i) => {
                return (
                    props.type == "mobile" ?
                        <td key={i} onClick={() => { nm == " " ? '' : props.onClick(nm) }} readOnly={nm == " " ? props.readOnly : ''}>{nm}</td>
                        :
                        <td key={i}>
                            <input key={"input" + i} type={props.type} value={nm == 'c' ? '' : nm} id={props.id} onClick={() => { nm == " " ? '' : props.onClick(nm) }} className={nm == 'c' ? props.className2 : props.className1} readOnly={nm == " " ? props.readOnly : ''}
                            />
                            {/* style={{ backgroundColor: 'transparent', color: '#4B4B4B', borderColor: 'transparent' }}  */}
                        </td>
                )
            })
            }
        </tr>
    ))

const TrashPin = props =>
    props.trshPin.map((pinId, ind) => {
        return (
            <li key = {ind}>
                <input style={props.style} key={ind} id={pinId} type={props.type} className={props.className} />
            </li>
        )
    })
// show entered number for create pin
const ShowCreatePin = props =>
    props.trshPin.map((pinId, ind) => {
        return (
            <li key ={ind}>
                {/* <input style={props.style} key={ind} id={pinId} type={props.type} className={props.className} /> */}
                <input type="number" key={ind + 1} id={pinId + 1} type={props.type} className={props.className} />
                {/* className="if-show-only" */}
            </li>
        )
    })

class PinPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSize: 0,
            txtValue: "",
            isloading: false,
            LocationName: '',
            RgisterName: '',
            notxtValue: '',
            pinNumberList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "c"],
            trashId: ['txt1', 'txt2', 'txt3', 'txt4'],
            active: false,
            msg_text: '',
            creatPinTxt: ''

        };
        this.handle = this.handle.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.addToScreen = this.addToScreen.bind(this);
        this.log_out = this.log_out.bind(this);
        this.whichkey = this.whichkey.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.ReportBug = this.ReportBug.bind(this);
        this.handleMsgOkClick = this.handleMsgOkClick.bind(this);

        localStorage.setItem("ReloadCount", 0);
        localStorage.setItem("SelfCheckout", true);
        localStorage.removeItem('UPDATE_PRODUCT_LIST')
        localStorage.removeItem('SELECTED_TAX');
        localStorage.removeItem('TAXT_RATE_LIST');
        localStorage.removeItem('USDConversionRate');
        localStorage.removeItem("GroupSaleRecord")

        /*Created By :Priyanka Created Date :4-07-2019,Description :userList function  get staff user list. */
        const UID = get_UDid('UDID');
        if (sessionStorage.getItem("AUTH_KEY")) {
            this.props.dispatch(checkShopSTatusAction.getProductCount());
            this.props.dispatch(checkShopSTatusAction.getStatus());
            this.props.dispatch(favouriteListActions.userList());
            this.props.dispatch(favouriteListActions.get_TickeraSetting());
            this.props.dispatch(checkoutActions.cashRounding());
            this.props.dispatch(checkoutActions.getOrderReceipt());
            this.props.dispatch(discountActions.getAll());
            this.props.dispatch(attributesActions.getAll());
            this.props.dispatch(pinLoginActions.getBlockerInfo())
            this.props.dispatch(cartProductActions.getTaxRateList());
            
            this.props.dispatch(exchangerateActions.getUSDConversionRate());
           
            const register_Id = localStorage.getItem('register');
            this.props.dispatch(registerActions.GetRegisterPermission(register_Id));
            if (UID && register_Id) {
                this.props.dispatch(favouriteListActions.getAll(UID, register_Id));
                var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
                var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
                if (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true) {
                    this.props.dispatch(cashManagementAction.GetOpenRegister(register_Id));
                }
                else {
                    localStorage.setItem("IsCashDrawerOpen", "false");
                }
            }
        }
        else {
            history.push('/login');
        }
    }

    // componentDid mount 
    componentDidMount() {
        var browserName = broswerdetail[0] && broswerdetail[0].browser_name;
        // set demoUser to false 
        localStorage.removeItem('demoUser');
        localStorage.removeItem('DemoGuid');
        // Test if indexDb has error in firefox 
        if (browserName == 'Firefox') {
            var dbTest = indexedDB.open("test");
            dbTest.onerror = function () {
                if (window.location.pathname == '/loginpin')
                setTimeout(() => {
                    showModal('common_msg_popup');
                }, 500);
            };
            dbTest.onsuccess = function () {
                indexedDB.deleteDatabase('test');
            }
        }
        trackPage(history.location.pathname,"PinView","loginpin","loginpin");
       

    }
    handleMsgOkClick() {
        history.push('/login');
    }

    handle(e) {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (value === '' || re.test(value)) {
            this.addToScreen(value)
        }
    }

    handleBack(e) {
        if (e.keyCode == 76 && e.ctrlKey) {
            this.log_out()
        }
        if (e.keyCode == 86 && e.ctrlKey) {
            $('#PinPagebackButton').focus();
        }
        var key = e.which || e.keyCode;
        if (key === 8) {
            this.addToScreen('c')
            e.preventDefault();
        }
        if (key === 13) {
            event.preventDefault();
        }

    }

    componentWillUnmount = ()=> {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }


    componentWillMount() {
        // localStorage.removeItem("env_type");
        // console.log(
        //     "BrowserView",  BrowserView,
        //      "MobileView", MobileView,
        //       "isBrowser",isBrowser,
        //       "isMobileOnly",isMobileOnly,
        //       "isIOS",isIOS
        //   )
        if (isIOS === true)
            localStorage.setItem("env_type", "ios")
        else if (isMobileOnly === true || isAndroid == true) {
            localStorage.setItem("env_type", "Android")
        }
        else {
            //localStorage.removeItem("env_type");
        }


        var decodedString = localStorage.getItem('UDID');
        var decod = window.atob(decodedString);
        var getudid = decod;
        this.setState({
            LocationName: localStorage.getItem(`last_login_location_name_${getudid}`),
            RgisterName: localStorage.getItem(`last_login_register_name_${getudid}`)
        })
        if (!getudid || !localStorage.getItem('Location') || !localStorage.getItem('register')) {
            history.push('/login');
        }
        GTM_ClientDetail();
    }

    log_out() {
        localStorage.removeItem("cloudPrinters");
        localStorage.removeItem("CUSTOMER_TO_OrderId");
        localStorage.removeItem("LANG");
        var decodedString = localStorage.getItem('UDID');
        var decod = decodedString ? window.atob(decodedString) : "";
        var getudid = decod;
        if (getudid && getudid != "") {
            localStorage.removeItem(`last_login_location_name_${getudid}`);
            localStorage.removeItem(`last_login_location_id_${getudid}`);
            localStorage.removeItem(`last_login_register_id_${getudid}`);
            localStorage.removeItem(`last_login_register_name_${getudid}`);
            localStorage.removeItem(`registerName`);
            localStorage.removeItem('register');
            localStorage.removeItem('UserLocations');

        }
        localStorage.removeItem("SHOP_TAXRATE_LIST");
        // localStorage.removeItem("sitelist")
        sessionStorage.removeItem('CUSTOMER_ID');
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem('SELECTED_TAX');
        localStorage.removeItem('TAXT_RATE_LIST');
        localStorage.removeItem('DEFAULT_TAX_STATUS');
        localStorage.removeItem('APPLY_DEFAULT_TAX');
        localStorage.removeItem('CART');
        localStorage.removeItem("Productlist" + localStorage.getItem('UDID'));
        localStorage.removeItem('CASH_ROUNDING');
        localStorage.removeItem('discountlst');
        localStorage.removeItem('PAYMENT_RESPONSE');
        localStorage.removeItem("GroupSaleRecord");
        //localStorage.removeItem('userId');   this is client Id, Do not remove on it
        localStorage.removeItem('orderreciept');
        var _env = localStorage.getItem('env_type');
        setTimeout(function () {

            if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
            {
                Android.wrapperLogout();
            }
            else
            {
                var url = _env && (_env == 'ios' || _env == 'android' || _env == 'Android') ? "/login" : "/login";
                if (_env && (_env == 'ios' || _env == 'android' || _env == 'Android')) {
                    url = url + "?goto=logout";
                    window.location = url;
                }
                else
                    history.push(url);
            }

        }.bind(this), 100)
    }

    addToScreen(e) {
        var lenght_is = e.length - 1
        var newString = e[lenght_is];
        if (e == "c") {
            if (this.state.totalSize > 0) {
                this.resetScreen();
            } else {
                this.state.totalSize = 0;
                this.state.txtValue = ''
            }
            return;
        }
        if (this.state.totalSize < 4) {
            this.state.txtValue += newString;
            this.state.totalSize += 1;
            setTimeout(function () {
                this.fillPass();
            }.bind(this), 100)
        }

        // $('#whichkey').focus()
        var _envType = localStorage.getItem('env_type');
        if (_envType && _envType !== "") {
            $('#whichkey').attr('readonly', true);
        } else {
            $('#whichkey').focus();
        }
    }

    resetScreen() {
        var str = this.state.txtValue;
        if (this.state.totalSize > 0) {
            this.state.totalSize -= 1;
            this.state.txtValue = str.substring(0, str.length - 1);
        } else {
            this.state.totalSize = 0;
            this.state.txtValue = 0
        }
        this.fillPass();
    }

    fillPass() {
        var i = 1;
        for (i = 1; i <= 4; i++) {
            if (this.state.totalSize >= i) {
                if (this.state.totalSize >= 4) {
                    const { dispatch } = this.props;
                    if (this.state.isloading == false) {
                        this.setState({ isloading: true })
                        localStorage.removeItem('logoutclick'); //For webview            
                        setTimeout(function () {    //Need delay for reaset text
                            var userID = "";

                            if (localStorage.getItem("userId")) {
                                userID = localStorage.getItem("userId");
                            } else {
                                userID = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')).user_id : "";
                                localStorage.setItem("userId", userID)
                            }
                            //     else if(localStorage.getItem('sitelist'))
                            //     {              
                            //         var decodedString =localStorage.getItem('sitelist') ;     
                            //     var decod = window.atob(decodedString);
                            //    // console.log("decodedString",decod);
                            //     var divicedata=JSON.parse(decod);
                            //    // console.log("userid",divicedata[0].userId);
                            //      userID=divicedata[0].userId;

                            //     }
                            // console.log("UserID",userID);
                            if (this.state.txtValue !== null && this.state.txtValue !== '' && userID && userID !== '') {
                                // var hasPin = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')).HasPin
                                this.setState({ creatPinTxt: this.state.txtValue })
                                var hasPin = localStorage.getItem('hasPin')
                                console.log(typeof (this.state.txtValue));
                                if (hasPin != 'false') {
                                    dispatch(pinLoginActions.pinLogin(this.state.txtValue, userID));
                                } else {
                                    dispatch(pinLoginActions.createPin(this.state.txtValue, userID));
                                }
                            }

                            this.state.txtValue = "";
                            this.state.totalSize = 0;
                        }.bind(this), 100)
                    }
                }
                if (this.state.totalSize == i) {
                    var val = this.state.txtValue.charAt(this.state.totalSize - 1)
                    $("#txt" + i + '1').val(val);
                }
                $("#txt" + i).removeClass("bg_trasn");
            } else {
                $("#txt" + i + '1').val('');
                $("#txt" + i).addClass("bg_trasn");
            }
        }
    }

    componentWillReceiveProps(recieveProps) {
        const { alert, pinlogin, createPinRes } = this.props;
        if (createPinRes == true) {
            var userID = "";

            if (localStorage.getItem("userId")) {
                userID = localStorage.getItem("userId");
            } else {
                userID = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')).user_id : "";
                localStorage.setItem("userId", userID)
            }

            if (this.state.creatPinTxt !== null && this.state.creatPinTxt !== '' && userID && userID !== '') {
                // var hasPin = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')).HasPin
                console.log(typeof (this.state.creatPinTxt));
                this.props.dispatch(pinLoginActions.pinLogin(this.state.creatPinTxt, userID));
            }

        }
        if ((alert && alert !== "") || (pinlogin == false) || (createPinRes == false)) {
            $("#txt11").val("");
            $("#txt21").val("");
            $("#txt31").val("");
            $("#txt41").val("");

            $("#txt1").addClass("bg_trasn");
            $("#txt2").addClass("bg_trasn");
            $("#txt3").addClass("bg_trasn");
            $("#txt4").addClass("bg_trasn");

            this.state.totalSize = 0;
            this.state.txtValue = "";
            this.setState({
                totalSize: 0,
                txtValue: ''
            })
            setTimeout(function () {
                this.setState({
                    isloading: false
                })
            }.bind(this), 4000)
        }

        if (recieveProps.getversioninfo && this.state.active == false) {
            this.checkVersionIsAvailable(recieveProps.getversioninfo)
        }
    }

    whichkey() {

        var _envType = localStorage.getItem('env_type');
        if (_envType && _envType !== "") {
            $('#whichkey').attr('readonly', true);
        } else {
            $('#whichkey').focus();
        }

    }

    checkVersionIsAvailable(getversiondetail) {
        var browserName = broswerdetail[0] && broswerdetail[0].browser_name;
        var browserVersion = broswerdetail[0] && broswerdetail[0].full_version;
        var appVersion = webappversion;

        if (getversiondetail) {
            if (getversiondetail.SoftBlockerVersion && getversiondetail.SoftBlockerVersion.length > 0) {
                var apiversion = getversiondetail.SoftBlockerVersion.find(Items => (Items.Code == "Soft_Oliver_version" && compareVersions.compare(`${Items.Value}`, `${appVersion}`, '>')))
                var browserversion = getversiondetail.SoftBlockerVersion.find(Items => (Items.Name == browserName && compareVersions.compare(`${Items.Value}`, `${browserVersion}`, '>') == true))
                // console.log("apiversion", apiversion);
                // console.log("browserversion", browserversion);
                // if (apiversion) {
                //     $('#oliver_version').modal('show')
                //     this.disableOliverScreen();
                // }
                // else 
                if (browserversion) {
                    try {
                        $('#browser_version').modal('show')
                        this.disableBrowserScreen();
                    } catch (error) {
                        console.log("error", error.message)
                    }

                }

            }
        }
    }

    closeModal() {
        // window.open("https://help.oliverpos.com/pos-register", "_self")
        this.setState({ active: true })
    }

    ReportBug() {
        window.open("https://help.oliverpos.com/kb-tickets/new", "_self")
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

    render() {
        var _env = localStorage.getItem('env_type');
        var registerName1 = localStorage.getItem('registerName') ? localStorage.getItem('registerName') : '';
        var LocationName2 = localStorage.getItem('LocationName') ? localStorage.getItem('LocationName') : '';
        // var hasPin = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')).HasPin
        var hasPin = localStorage.getItem('hasPin')
        return (
            (isMobileOnly == true) ?
                // <MobilePin
                //     {...this.props}
                //     {...this.state}
                //     handleBack={this.handleBack}
                //     history={history}
                //     whichkey={this.whichkey}
                //     registerName1={registerName1}
                //     LocationName2={LocationName2}
                //     handle={this.handle}
                //     addToScreen={this.addToScreen}
                //     log_out={this.log_out}
                //     LocalizedLanguage={LocalizedLanguage}
                //     NumInput={NumInput}
                //     TrashPin={TrashPin}
                //     _env={_env}
                //     closeModal={this.closeModal}
                //     ReportBug={this.ReportBug}
                //     BrowserVersionModal={BrowserVersionModal}
                //     OliverVersionModal={OliverVersionModal}
                //     handleMsgOkClick={this.handleMsgOkClick}
                // />

                <WebPin
                    {...this.props}
                    {...this.state}
                    handleBack={this.handleBack}
                    history={history}
                    whichkey={this.whichkey}
                    registerName1={registerName1}
                    LocationName2={LocationName2}
                    handle={this.handle}
                    addToScreen={this.addToScreen}
                    log_out={this.log_out}
                    LocalizedLanguage={LocalizedLanguage}
                    NumInput={NumInput}
                    TrashPin={TrashPin}
                    _env={_env}
                    closeModal={this.closeModal}
                    ReportBug={this.ReportBug}
                    BrowserVersionModal={BrowserVersionModal}
                    OliverVersionModal={OliverVersionModal}
                    handleMsgOkClick={this.handleMsgOkClick}
                    hasPin={hasPin}
                    ShowCreatePin={ShowCreatePin}

                />
                :
                <WebPin
                    {...this.props}
                    {...this.state}
                    handleBack={this.handleBack}
                    history={history}
                    whichkey={this.whichkey}
                    registerName1={registerName1}
                    LocationName2={LocationName2}
                    handle={this.handle}
                    addToScreen={this.addToScreen}
                    log_out={this.log_out}
                    LocalizedLanguage={LocalizedLanguage}
                    NumInput={NumInput}
                    TrashPin={TrashPin}
                    _env={_env}
                    closeModal={this.closeModal}
                    ReportBug={this.ReportBug}
                    BrowserVersionModal={BrowserVersionModal}
                    OliverVersionModal={OliverVersionModal}
                    handleMsgOkClick={this.handleMsgOkClick}
                    hasPin={hasPin}
                    ShowCreatePin={ShowCreatePin}

                />


        )
    }
}

function mapStateToProps(state) {
    const { alert, pinlogin, getversioninfo, createPin } = state;
    return {
        alert: alert.message ? alert.message : createPin ? createPin.alert : null,
        pinlogin: pinlogin.loading,
        getversioninfo: getversioninfo.items,
        createPinRes: createPin ? createPin.alert : null
    };
}
const connectedPinPage = connect(mapStateToProps)(PinPage);
export { connectedPinPage as PinPage };