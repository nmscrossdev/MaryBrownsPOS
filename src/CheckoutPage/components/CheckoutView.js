import React from 'react';
import { connect } from 'react-redux';
import { customerActions, CustomerViewEdit } from '../../CustomerPage';
import { default as NumberFormat } from 'react-number-format';
import { LoadingModal, CustomerAddFee, CustomerNote, getCheckoutList, getDiscountAmount, getExtensionCheckoutList, CommonHeaderFirst, CommonMsgModal, DiscountMsgPopup, setListActivityToCheckout, AndroidAndIOSLoader, getProductxChlidProductTax, getTotalTaxByName, productxArray } from '../../_components'
//import { ManualCardpopupModal } from '../../_components/ManualCardpopupModal';
import { CommonConfirmationPopup } from '../../_components/CommonConfirmationPopup'
import { GetRoundCash } from '../Checkout'
import { history } from '../../_helpers';
import { get_UDid } from '../../ALL_localstorage'
import { OrderNotCreatePopupModel } from './OrderNotCreatePopupModel';
import ActiveUser from '../../settings/ActiveUser';
import { cartProductActions } from '../../_actions';
import { checkoutActions, CheckoutViewFirst, CheckoutViewSecond, CheckoutViewThird } from '../';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { androidDisplayScreen } from '../../settings/AndroidIOSConnect';
import { isMobileOnly, isIOS, isTablet } from "react-device-detect";
import { ParkAndLayaway } from '../views/m.ParkAndLayaway';
import CustomerEdit from '../../CustomerPage/views/m.CustomerEdit';
import Header from '../../_components/views/m.Header';
import ReturnCashPopup from "../../_components/views/m.ReturnCashPopup";
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import { GTM_ClientDetail, GTM_oliverCheckout, GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import { trackOliverCheckout, trackPage } from '../../_components/SegmentAnalytic'
import { OnBoardingAllModal } from '../../onboarding';
import { CommonDemoShopButton } from '../../_components/CommonDemoShopButton';
import { typeOfTax } from '../../_components/TaxSetting'
import paymentsType from '../../settings/PaymentsType'
import moment from 'moment'
import { getAddonsField, getBookingField } from '../../_components/CommonModuleJS';
import $ from 'jquery';

import { isIterationStatement } from 'typescript';
import { OnboardingShopViewPopup } from '../../onboarding/components/OnboardingShopViewPopup';
import { getHostURLsBySelectedExt, onBackTOLoginBtnClick, sendClientsDetails, sendRegisterDetails, sendTipInfoDetails } from '../../_components/CommonJS';
import { addExtensionCustomer } from '../../_components/CommonExtensions';
import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
import { CommonAppPopup } from '../../appManager/CommonAppPopup';
import {addEventListener} from '../../appManager/FramManager'
import { GroupSaleModal } from '../../_components/GroupSaleModal';
import { handleAppEvent,postmessage } from '../../ExtensionHandeler/commonAppHandler';

var cash_rounding = ActiveUser.key.cash_rounding;
var clientExtensionData = new Object();
var RoundAmount = (val) => {
    return Math.round(val * 100) / 100;
    //var decimals = 2;
    //return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}

class CheckoutView extends React.Component {
    constructor(props) {
        var UID = get_UDid('UDID');
        super(props);
        this.state = {
            FirstName: '',
            LastName: '',
            Street_Address: '',
            Street_Address2: '',
            city: '',
            PhoneNumber: '',
            Notes: '',
            Email: '',
            Pincode: '',
            user_id: '',
            UDID: UID,
            paying_type: '',
            paying_amount: '',
            checkList: null,
            add_note: null,
            paid_amount: null,
            location_id: null,
            lay_Away: null,
            final_place_order: null,
            store_credit: 0,
            // order_status : "pending",
            set_order_notes: new Array(),
            set_calculator_remaining_amount: 0,
            isShowLoader: false,
            msg: '',
            cash_payment: 0,
            edit_status: false,
            change_amount: 0,
            after_payment_is: 0,
            cash_round: 0,
            total_price: 0,
            getCountryList: localStorage.getItem('countrylist') && localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('countrylist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '',
            getStateList: localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '',
            isLoading: false,
            country_code: '',
            state_code: '',
            saleRep: '',
            affiliate: '',
            orderType: '',
            active_true_diamond: false,
            clientDataDictionary: new Object(),
            toggleExtentionStatus: '',
            updateStoreCreditPayment: false,
            amountStoreCreditPayment: 0,
            typeStoreCreditPayment: '',
            extensionUpdateCart: localStorage.getItem('extensionUpdateCart') ? true : false,
            envFocus: localStorage.getItem('env_type'),
            extensionReadyToPost: "",
            extenstionDiscountStatus: false,
            stateName: '',
            countryName: '',
            activeComponent: 'checkout_third',
            activeNoteButton: false,
            AllProductList: [],
            errOnPlaceOrder: '',
            SelfCheckoutStatus: "defaultcheckout",
            commonConfirmBoxMsg: '',
            payWithRedeemPoints: false,
            isPaymentByExtension: false,
            extensionPaymentType: '',
            extensionMetaData: {},
            extHostUrl: '',
            extPageUrl: '',
            extName:'',
            extLogo:'',
            extensionIframe: false,
            extensionOrderNote : [],
            UpdateCartByApp:false,
            appLock:null, //For APP lock environment 

            extbuttonClicked:false,  //check extension button double clicked
            PaymentExtensionCallData:"" // Used to check duplicate payemnt call

        }
        this.selfcheckoutstatusmanagingevnt = this.selfcheckoutstatusmanagingevnt.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getPayment = this.getPayment.bind(this);
        this.setPayment = this.setPayment.bind(this);
        this.layAwayPayment = this.layAwayPayment.bind(this);
        this.setOrderPartialPayments = this.setOrderPartialPayments.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.openOrderPopup = this.openOrderPopup.bind(this);
        this.setCalculatorRemainingprice = this.setCalculatorRemainingprice.bind(this);
        this.extraPayAmount = this.extraPayAmount.bind(this);
        // this.enterManualCard = this.enterManualCard.bind(this);
        this.closeExtraPayModal = this.closeExtraPayModal.bind(this);
        this.edit_status = this.edit_status.bind(this);
        this.paymentType = this.paymentType.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.onChangeStateList = this.onChangeStateList.bind(this);
        this.autoFocus = this.autoFocus.bind(this);
        this.showExtention = this.showExtention.bind(this);
        this.activeTrueDiamond = this.activeTrueDiamond.bind(this);
        this.updateStoreCreditPayment = this.updateStoreCreditPayment.bind(this);
        this.extensionReady = this.extensionReady.bind(this);
        this.changeComponent = this.changeComponent.bind(this);
        this.finalAdd = this.finalAdd.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.validateNote = this.validateNote.bind(this);
        this.getCountryAndStateName = this.getCountryAndStateName.bind(this);
        this.paymentWithRedeemPoints = this.paymentWithRedeemPoints.bind(this);
        this.closeRedeemConfirmationModal = this.closeRedeemConfirmationModal.bind(this);
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                this.setState({ AllProductList: [] });
            } else {
                this.setState({ AllProductList: val });
            }
        });
    }

    updateStoreCreditPayment(amount, type, status) {
        this.setState({
            amountStoreCreditPayment: amount,
            typeStoreCreditPayment: type,
            updateStoreCreditPayment: status
        })
    }

    getRemainingPriceForCash() {
        var checkList = this.state.checkList;
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = checkList && checkList.totalPrice ? parseFloat(checkList.totalPrice).toFixed(2) : 0;
        this.state.CashRound = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        var cashRoundReturn = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        var new_total_price = (totalPrice - paid_amount) + parseFloat(cashRoundReturn)
        return cashRoundReturn;
    }

    paymentType(type) {
        var totalPrice = this.state.checkList && this.state.checkList.totalPrice;
        var cash_round = parseFloat(this.getRemainingPriceForCash())
        if (type == 'cash') {
            this.state.cash_round = cash_round;
            this.setState({
                cash_round: cash_round
            })
        } else {
            this.state.cash_round = 0;
            this.setState({
                cash_round: 0,
                total_price: 0
            })
        }

    }

    edit_status(status) {
        this.setState({ edit_status: status })
    }

    getPayment(type, amount) {
        this.setState({
            paying_type: type,
            paying_amount: amount ? amount.replace(",", "") : "",
        });
    }

    layAwayPayment(type, amount) {
        this.setState({
            lay_Away: type,
            store_credit: amount
        })


        if (type == 'lay_away') {
            $('.addnoctehere').modal();
        }


    }

    componentWillMount() {
        var CurrentUserActive = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '';
        var User_Email = CurrentUserActive && CurrentUserActive !== null && CurrentUserActive.user_email;
        if (localStorage.getItem(`ACTIVE_TRUE_DIAMOND_${User_Email}`) && localStorage.getItem("showExtention")) {
            if (localStorage.getItem("showExtention") == "true" && localStorage.getItem(`ACTIVE_TRUE_DIAMOND_${User_Email}`) == `true`) {
                setTimeout(function () {
                    $('#drp-content-customer').val('true').trigger('change');
                }, 200)
            }
        }
        var checkList = localStorage.getItem('CHECKLIST');
        var location_id = localStorage.getItem('Location');
        var AdCusDetail = localStorage.getItem('AdCusDetail');
        this.props.dispatch(checkoutActions.cashRounding());

        this.setState({
            checkList: JSON.parse(checkList),
            location_id: location_id,
        })
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        if (demoUser) {
            GTM_OliverDemoUser("Visited Checkout View")
        }
    }
    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
            if (typeof selfCheckoutJs != "undefined") { selfCheckoutJs() };

        }, 1000);
        var VOID_SALE = localStorage.getItem("VOID_SALE")
        if ((typeof VOID_SALE !== 'undefined') && VOID_SALE !== null) {
        }
        var AdCusDetail = localStorage.getItem('AdCusDetail');
        const UID = this.state.UDID;
        this.setState({ UDID: UID })
        if ((typeof AdCusDetail !== 'undefined') && AdCusDetail != null) {
            var checkoutList = JSON.parse(AdCusDetail) && JSON.parse(AdCusDetail).content;
            var customerAddress = checkoutList && checkoutList.customerAddress ? checkoutList.customerAddress.find(Items => Items.TypeName == "billing") : '';
            if (checkoutList != null) {
                this.setState({
                    FirstName: checkoutList.FirstName ? checkoutList.FirstName : '',
                    LastName: checkoutList.LastName,
                    Street_Address: customerAddress ? customerAddress.Address1 : '',
                    city: customerAddress ? customerAddress.City : '',
                    PhoneNumber: checkoutList.PhoneNumber,
                    Notes: checkoutList.Notes,
                    Email: checkoutList.Email,
                    Pincode: customerAddress ? customerAddress.PostCode : '',
                    user_id: checkoutList.UID,
                    store_credit: checkoutList.StoreCredit,
                    Street_Address2: customerAddress ? customerAddress.Address2 : '',
                    country_code: customerAddress ? customerAddress.Country : '',
                    state_code: customerAddress ? customerAddress.State : '',
                })
                this.state.user_id = checkoutList.UID;

                if (customerAddress && customerAddress.Country) {
                    this.getCountryAndStateName(customerAddress.State, customerAddress.Country);
                }
            }
        }
        this.props.dispatch(checkoutActions.getOrderReceipt());

        //Call GTM ---------------------------
        if (process.env.ENVIRONMENT == 'production') {
            GTM_ClientDetail();
            GTM_oliverCheckout();
        }
        trackOliverCheckout();
        //------------------------------------------------
        trackPage(history.location.pathname, "Checkout View", "checkout", "checkout");

       // addEventListener();
        // //*** */  for checkout payment App ***// App 1.0
    //    var _user = JSON.parse(localStorage.getItem("user"));  
    //     window.removeEventListener("message", function () {});     
    //     window.addEventListener('message', (e) => {

    //         if (e.origin && _user && _user.instance) {
    //             try {
    //                 var extensionData = e.data && typeof e.data == 'string' ? JSON.parse(e.data) : e.data;                   
    //                 if (extensionData && extensionData !== "" ) {    //app version 1.0   
    //                     //For selfchcekout wrapper app
    //                     // if(extensionData && typeof extensionData.oliverpos!="undefined")
    //                     // {
    //                     //     //console.log("======"+JSON.stringify(extensionData))
                            
    //                     //     if(extensionData.oliverpos && typeof extensionData.oliverpos.event!="undefined" && extensionData.oliverpos.event=="extensionPayment")
    //                     //     {
    //                     //             this.showExtention(extensionData,'');
    //                     //     }
    //                     //     else if(extensionData.oliverpos && typeof extensionData.oliverpos.event!="undefined" )  //&& extensionData.oliverpos.event=="extensionReady"
    //                     //     {
    //                     //         // if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true) && ActiveUser.key.isSelfcheckout == true)
    //                     //         if(ActiveUser.key.isSelfcheckout == true && extensionData.oliverpos.event=="extensionReady")
    //                     //         {
    //                     //             this.extension_pay_selfcheckout();
    //                     //         }
    //                     //         else if(ActiveUser.key.isSelfcheckout == true ){
    //                     //             this.showExtention(extensionData,'');
    //                     //         }
    //                     //     }
    //                     // }
    //                     //--------
    //                 //    var appResponse= handleAppEvent(extensionData,"CheckoutView");
    //                    var appResponse= handleAppEvent(extensionData,"");                     
    //                     if(appResponse=='app_do_payment'){                          
    //                        this.handleAppPayment(extensionData)
    //                     }
    //                     else if(appResponse=='app-modificaiton-external'){    
    //                         this.setState({ UpdateCartByApp: true }) //To Refresh the cart need to update the state
    //                      }
    //                      else if(appResponse=='app-modificaiton-lock-env'){
    //                          setTimeout(() => {
    //                             this.setState({ "appLock": true })  
    //                          }, 200);
                           
    //                      }
    //                      else if(appResponse=='app-modificaiton-unlock-env'){
    //                         setTimeout(() => {
    //                             this.setState({ "appLock": false })  
    //                         }, 200);
    //                      }else if(appResponse=='app-get-lock-env'){
    //                          var  clientJSON = {
    //                             command: extensionData.command,
    //                             version:extensionData.version,
    //                             method: extensionData.method,
    //                             status: 200,
    //                             state:this.state.appLock==true?"lock":'unlock'
    //                           }
    //                          postmessage(clientJSON)
    //                      }
    //                 }
    //             }
    //             catch (err) {
    //                 console.error(err);
    //             }
    //         }
    //     }, false);
    }
    handleAppPayment(RequesteData){
        try {
            var data =RequesteData && RequesteData.data;
            const { checkList } = this.state
            if (data && data.payment_type && data.payment_type.data) {
                var type = data && data.payment_type && data.payment_type.name ? data.payment_type.name : ''
                checkList['transection_id'] = data && data.payment_type && data.payment_type.data && data.payment_type.data.transaction_id ? data.payment_type.data.transaction_id : ''
               var _amount = data && data.payment_type && data.payment_type.data && data.payment_type.data.amt ? data.payment_type.data.amt : 0
               var _emv = data && data.payment_type && data.payment_type.data && data.payment_type.data.emv_data ? data.payment_type.data.emv_data : ""
                var allEmvData=[];
                allEmvData= this.state.EmvData?this.state.EmvData:[];
                if(_emv){
                    var obj={};
                    obj[type]=_emv;
                    allEmvData.push(obj)
                }
                
                this.setState({ checkList: checkList, isPaymentByExtension: true, extensionPaymentType: type ,
                    EmvData:allEmvData}
                    )
              //  this.orderPayments.updateClosingTab(true)
              hideModal('common_ext_popup')
              this.close_ext_modal()
                setTimeout(() => {                   
                    this.orderPayments.setPartialPayment(type,_amount)                
                }, 500);
            }
            else {
                console.error('App Error : Invalid Data');
            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }
    // function to payment using store-credit.  
    paymentWithRedeemPoints() {
        this.paymentType('store-credit');
        this.updateStoreCreditPayment(0.00, 'store-credit', true);
    }
    closeRedeemConfirmationModal() {
    }

    getCountryAndStateName(stateCode, countryCode) {
        var stat_name = ''
        var count_name = ''
        var count_code = ''
        var allSelectedState = []
        var finalStatelist = []
        this.state.getCountryList && this.state.getCountryList.find(function (element) {

            if (element.Code == countryCode || element.Name == countryCode || (element.Name !== null && element.Name.replace(/[^a-zA-Z]/g, ' ') == countryCode)) {
                count_name = element
                count_code = element.Code

            }
        })
        this.setState({
            selectedCountryName: count_name ? count_name.Name : countryCode,
            country_code: count_code,
            countryName: count_name ? count_name.Name : ''
        })
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Code === stateCode && count_code === element.Country) {
                stat_name = element
                if (count_code === element.Country) {
                    allSelectedState.push(element)
                }
            } else if (element.Code === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && countryCode === element.Country) {
                stat_name = element

            } else if (element.Name === stateCode && count_code === element.Country) {
                stat_name = element

            }
        })
        this.setState({
            state_code: stateCode,
            stateName: stat_name ? stat_name.Name : ''
        })

    }

    finalAdd() {
        if (isMobileOnly == true) {
            $("#popup_cash_rounding").removeClass("show")
            hideModal('popup_cash_rounding');
        }
        const { checkList, total_price, cash_round } = this.state;
        var after_payment_is = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                after_payment_is += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = checkList && checkList.totalPrice;
        var order_id = (typeof checkList.order_id !== "undefined") ? checkList.order_id : 0;
        var cash_round_is = parseFloat(this.getRemainingPriceForCash())
        this.setState({ cash_round: cash_round_is })
        if (localStorage.oliver_order_payments) {
            var payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
            payments.push({
                "Id": 0,
                "payment_type": 'cash',
                "payment_amount": RoundAmount((totalPrice + cash_round_is) - after_payment_is),
                "order_id": order_id,
                "description": ''
            });
            localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
        } else {

            var payments = new Array();
            payments.push({
                "Id": 0,
                "payment_type": 'cash',
                "payment_amount": RoundAmount(totalPrice + cash_round),
                "order_id": order_id,
                "description": ''
            });
            localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
            localStorage.setItem("VOID_SALE", "void_sale");
            this.props.dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
        }

        this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
        this.isOrderPaymentComplete(order_id, cash_round_is);

    }
    // update pay amount when true dimond field is required
    UpdatePaidAmount() {
        this.orderPayments.UpdatePaidAmount()

    }
    /**
    * Created By : Shakuntala Jatav
    * Created Date : 28-feb-2020
    * @param {*} payments 
    * Description : call gtm event for payments and err handling
    */
    gtmEvent(payments) {
        try {
            //  GTM_oliver_payments(payments);
        } catch (error) {
        }
    }
    // its set the order payments
    setOrderPartialPayments(paying_amount, payment_type) {
        if(!this.state.checkList && localStorage.getItem('CHECKLIST')){ //IF checklist in null then reset it
            var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));
            this.state.checkList=checklist;
        }
        var totalPrice = this.state.checkList && this.state.checkList.totalPrice
        var change_amount = 0;
        var payment_is = 0;
        var order_id = this.state.checkList && this.state.checkList.order_id !== 0 ? this.state.checkList && this.state.checkList.order_id : 0;
        var transection_id = this.state.checkList && this.state.checkList.transection_id !== 0 ? this.state.checkList && this.state.checkList.transection_id : 0;
        if( this.state.checkList && this.state.checkList.transection_id){ //fix the issue same transation id should not used in other payment type 
            this.state.checkList.transection_id=0;
        }
        var actual_amount = this.state.total_price == 0 ? this.state.checkList && this.state.checkList.totalPrice : this.state.total_price;
        var cash_round = parseFloat(this.getRemainingPriceForCash())
        var check_required_field = false;
        var paymentTypeName = localStorage.getItem("PAYMENT_TYPE_NAME") && JSON.parse(localStorage.getItem("PAYMENT_TYPE_NAME"))
        var isGlobalPay = false;
        paymentTypeName.map((pay_name, index) => {
            if (pay_name.Code !== "cash" && payment_type !== 'stripe_terminal' && pay_name.Code == payment_type && (pay_name.HasTerminal == true && pay_name.TerminalCount > 0)) {
                isGlobalPay = true;
            }
        });
        var isOnline = false;
        paymentTypeName.map((pay_name, index) => {
            if (pay_name.Support == 'Online' && pay_name.Code == payment_type) {
                isOnline = true;
            }
        });

        var isUPIPayment = false;
        paymentTypeName.map((pay_name, index) => {
            if (pay_name.Support == paymentsType.typeName.UPISupport && pay_name.Code == payment_type) {
                isUPIPayment = true;
            }
        });
        if (typeof (Storage) !== "undefined") {
            var payments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
            // cash payment 
            if (payment_type == 'cash') {
                if (localStorage.oliver_order_payments) {
                    payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
                    payments.map((items) => {
                        return payment_is += parseFloat(items.payment_amount);
                    })
                    var ret = payment_is;
                    var total_pay = ret + parseFloat(paying_amount);
                    this.setState({ cash_round: cash_round })
                    paying_amount = paying_amount ? String(paying_amount).replace(',', '') : 0;
                    if (total_pay > parseFloat(RoundAmount(totalPrice + cash_round))) {
                        change_amount = paying_amount - (actual_amount - payment_is + cash_round);
                        this.setState({
                            change_amount: change_amount,
                            cash_payment: paying_amount,
                            after_payment_is: payment_is
                        })
                        this.freezScreen();
                        if (isMobileOnly == true) {
                            $('#popup_cash_rounding').addClass('show')
                        }
                        //$('#popup_cash_rounding').modal('show')
                        setTimeout(function () {
                            showModal('popup_cash_rounding');
                        }, 100)
                    } else {
                        if (paying_amount && paying_amount !== null)
                            payments.push({
                                "Id": 0,
                                "payment_type": payment_type,
                                "payment_amount": String(paying_amount).replace(',', ''),
                                "order_id": order_id,
                                "description": '',
                                "transection_id": transection_id
                            });
                        localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                        //this.gtmEvent(payments);
                        this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                        this.isOrderPaymentComplete(order_id, cash_round);
                    }

                }
                else {
                    payments = new Array();
                    this.setState({ cash_round: cash_round })
                    paying_amount = paying_amount ? String(paying_amount).replace(',', '') : 0.00;
                    if (parseFloat(paying_amount) > parseFloat(RoundAmount(actual_amount + cash_round))) {
                        change_amount = paying_amount - (actual_amount + cash_round);
                        this.setState({
                            change_amount: change_amount,
                            cash_payment: paying_amount,
                            after_payment_is: 0
                        })
                        this.freezScreen();
                        if (isMobileOnly == true) {
                            $('#popup_cash_rounding').addClass('show')
                        }
                        // $('#popup_cash_rounding').modal('show')

                        setTimeout(function () {
                            showModal('popup_cash_rounding');
                        }, 100)
                    }
                    else {
                        if (paying_amount) {
                            payments.push({
                                "Id": 0,
                                "payment_type": payment_type,
                                "payment_amount": String(paying_amount).replace(',', ''),
                                "order_id": order_id,
                                "description": "",
                                "transection_id": transection_id
                            });
                        }
                        localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                        //this.gtmEvent(payments);
                        this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                        this.isOrderPaymentComplete(order_id, cash_round);
                    }

                }
            }
            //  global  payments
            else if (isGlobalPay == true) {
                var g_payment = this.props.global_payment ? this.props.global_payment : localStorage.getItem('GLOBAL_PAYMENT_RESPONSE') && localStorage.getItem('GLOBAL_PAYMENT_RESPONSE') !== 'undefined' && JSON.parse(localStorage.getItem('GLOBAL_PAYMENT_RESPONSE'));
                if (g_payment && g_payment !== null && g_payment.is_success === true) {
                    var global_payments = g_payment.content;
                    var data = `TerminalId-${global_payments.TerminalId} , Authrization-${global_payments.Authrization},RefranseCode-${global_payments.RefranseCode}`;

                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": global_payments.RefranseCode ? global_payments.RefranseCode : transection_id
                        });
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                }
            }
            // online payments
            else if (isOnline == true) {
                let g_payment = localStorage.getItem('ONLINE_PAYMENT_RESPONSE') && localStorage.getItem('ONLINE_PAYMENT_RESPONSE') !== 'undefined' ? JSON.parse(localStorage.getItem('ONLINE_PAYMENT_RESPONSE')) : null
                if (g_payment !== null && g_payment.is_success === true) {
                    let olnine_payments = g_payment.content;
                    let data = `RefTransID-${olnine_payments.RefranseCode},Authrization-${olnine_payments.Authrization} ,RefranseCode-${olnine_payments.RefranseCode}`;
                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": olnine_payments.RefranseCode ? olnine_payments.RefranseCode : transection_id
                        });

                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                }
            }
            // payconiq payments
            else if (isUPIPayment) {
                let payconiq_pay = localStorage.getItem('PAYCONIQ_PAYMENT_RESPONSE') && localStorage.getItem('PAYCONIQ_PAYMENT_RESPONSE') !== 'undefined' ? JSON.parse(localStorage.getItem('PAYCONIQ_PAYMENT_RESPONSE')) : null
                if (payconiq_pay !== null && payconiq_pay.is_success === true) {
                    let payconiqPaymentData = payconiq_pay.content;
                    let data = `RefTransID-${payconiqPaymentData.RefrenceID},Authrization-${payconiqPaymentData.RefrenceID} ,RefranseCode-${payconiqPaymentData.RefrenceID}`;
                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": payconiqPaymentData.RefrenceID ? payconiqPaymentData.RefrenceID : transection_id
                        });

                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                }
            }
            // Stripe terminal
            else if (payment_type == 'stripe_terminal') {
                let s_payment = localStorage.getItem('STRIPE_PAYMENT_RESPONSE') && localStorage.getItem('STRIPE_PAYMENT_RESPONSE') !== 'undefined' ? JSON.parse(localStorage.getItem('STRIPE_PAYMENT_RESPONSE')) : null
                if (s_payment && s_payment.is_success) {
                    let stripe_payments = s_payment.content;
                    let data = `RefTransID-${stripe_payments.RefranseCode},Authrization-${stripe_payments.RefranseCode} ,RefranseCode-${stripe_payments.RefranseCode}`;
                    if (paying_amount && data)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": data,
                            "transection_id": stripe_payments.RefranseCode ? stripe_payments.RefranseCode : transection_id
                        });

                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                } else {
                    if (paying_amount)
                        payments.push({
                            "Id": 0,
                            "payment_type": payment_type,
                            "payment_amount": String(paying_amount).replace(',', ''),
                            "order_id": order_id,
                            "description": "",
                            "transection_id": transection_id
                        });
                    localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                    //this.gtmEvent(payments);
                    this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                    this.isOrderPaymentComplete(order_id, 0);
                }
            }
            // other payments
            else {
                if (paying_amount) {
                   var emvData =this.state.EmvData
                   var emvPaymentdata=""
                    if(emvData){
                        emvData.map(item=>{
                            emvPaymentdata= item[payment_type]});
                    }
                    payments.push({
                        "Id": 0,
                        "payment_type": payment_type,
                        "payment_amount": String(paying_amount).replace(',', ''),
                        "order_id": order_id,
                        "description": "",
                        "transection_id": transection_id,
                        "emv_data":emvPaymentdata
                    });
                }
                localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
                //this.gtmEvent(payments);
                this.orderCart && this.orderCart.getPaymentDetails ? this.orderCart.getPaymentDetails() : null;
                this.isOrderPaymentComplete(order_id, 0);
            }
            // ***  ***//      
            localStorage.setItem("VOID_SALE", "void_sale");
            this.props.dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
        } else {
            //alert("Your browser not support local storage");
        }
    }

    // its get the payment from checkout third view
    getOrderPartialPayments() {
        this.orderPayments.setPartialPayment();
    }
    // its check the order paymets complete or not
    isOrderPaymentComplete(order_id, cash_round1) {
        const { checkList, total_price } = this.state;
        var amountToBePaid = checkList && (typeof checkList !== 'undefined') ? parseFloat(checkList.totalPrice) : 0;
        var paidPaments = this.getOrderPayments(order_id);
        var paidAmount = 0;
        var cash_round = (cash_round1 == 'undefined') ? 0 : cash_round1
        paidPaments.forEach(paid_payments => {
            paidAmount += parseFloat(paid_payments.payment_amount);
        });
        if (cash_round > 0) {
            if (parseFloat(RoundAmount(amountToBePaid + cash_round)) == parseFloat(RoundAmount(paidAmount))) {
                this.createOrder("completed");
            } else if (parseFloat(amountToBePaid) <= parseFloat(paidAmount)) {
                this.createOrder("completed");
            } else if (parseFloat(RoundAmount(amountToBePaid)) <= parseFloat(RoundAmount(paidAmount))) {
                this.createOrder("completed");
            }

        } else {
            if (parseFloat(RoundAmount(amountToBePaid + cash_round)) == parseFloat(RoundAmount(paidAmount))) {
                this.createOrder("completed");
            }
        }

    }
    //its used for get the order payments
    getOrderPayments(order_id) {
        if (localStorage.oliver_order_payments) {
            var paid_amount = 0;
            var payments = new Array();

            JSON.parse(localStorage.getItem("oliver_order_payments")).forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
                var paymentObj = {
                    "Id": paid_payments.Id !== 0 ? paid_payments.Id : 0,
                    "payment_type": paid_payments.payment_type,
                    "payment_amount": paid_payments.payment_amount,
                    "order_id": order_id,
                    "transection_id": paid_payments.transection_id ? paid_payments.transection_id : 0,
                    "emv_data":paid_payments.emv_data,
                    "description": paid_payments.emv_data && paid_payments.emv_data !=""? JSON.stringify(paid_payments.emv_data): paid_payments.description,
                    
                }
                if (paid_payments.payment_date && paid_payments.payment_date != "") {
                    paymentObj['payment_date'] = paid_payments.payment_date;
                }
                payments.push(paymentObj);
            });
            return payments;
        } else {
            //alert("Your browser not support local storage");
        }
    }
    //its used to remove the order payments
    removeOrderPayments() {
        if (localStorage.oliver_order_payments) {
            localStorage.removeItem("oliver_order_payments");
        } else {
            // alert("Your browser not support local storage");
        }
        // location.reload()
    }

    setCalculatorRemainingprice(amount) {
        this.setState({
            set_calculator_remaining_amount: amount,
        })
    }

    createOrder(status) {
        this.setState({
            isShowLoader: true,
        });
        this.setPayment(status);
    }

    openOrderPopup(status) {
        if (isMobileOnly == true) {
            this.setState({
                activeComponent: status
            })
        }
        // $("#park-sale-and-layaway-modal").modal("show"); 
        if (ActiveUser.key.isSelfcheckout !== true && isMobileOnly !== true) {
            setTimeout(function () {
                showModal('park-sale-and-layaway-modal')
            }, 100)
        }
        var orderStatus = status == 'park_sale' ? LocalizedLanguage.parkSale : LocalizedLanguage.layAwayModalTilte;
        $("#park-sale-and-layaway-modal-title").text(orderStatus);
        // $("#park-sale-and-layaway-modal-title").text(status.replace("_", " "));
        $("#park-sale-and-layaway-modal").data("status", status);
    }

    placeParkLayAwayOrder() {
        var status = (isMobileOnly == true) ? this.state.activeComponent : $("#park-sale-and-layaway-modal").data("status");
        var notes = this.state.set_order_notes;
        var note = $("#park-sale-and-layaway-modal-note").val();
        if (note.length === 0) {
            note = `order ${status}`;
        }

        notes.push({
            note_id: '',
            note: note,
            is_customer_note: true,
            is_extension_note: false
        })
        this.setState({
            set_order_notes: notes,
            add_note: note,
            isShowLoader: true,
        })
        this.createOrder(status);
        // $("#park-sale-and-layaway-modal").modal("hide");
        hideModal('park-sale-and-layaway-modal')
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        this.state.isLoading = true;
        const { UDID, user_id, Street_Address, city, PhoneNumber, Email, FirstName, LastName, Notes, Pincode, Street_Address2, country_code, state_code } = this.state;
        const { dispatch } = this.props;
        if (Email) {
            const update = {
                WPId: user_id,
                FirstName: FirstName,
                LastName: LastName,
                Contact: PhoneNumber,
                startAmount: 0,
                Email: Email,
                udid: UDID,
                notes: Notes,
                StreetAddress: Street_Address,
                Pincode: Pincode,
                City: city,
                Country: country_code,
                State: state_code,
                StreetAddress2: Street_Address2
            }
            this.edit_status(false)
            this.setState({
                isLoading: true
            });
            dispatch(customerActions.update(update, 'check_customer'));
            $(".close").click();

        }
    }
    /* Created By:priyanka,Created Date:28/6/2019,Description:using tickera print*/
    /**
     * Updated By :Shakuntala Jatav
     * Updated Date : 13-02-2020
     * @param {*} get_order_status return order status
     * Description : Add productx data
     */
    setPayment(get_order_status) {
        var location_id = localStorage.getItem('Location');
        const activityToCheckout = localStorage.getItem("BACK_CHECKOUT");
        const { extensionMetaData, cash_payment, change_amount, cash_round, PhoneNumber, Email, FirstName, LastName, Notes, checkList, UDID, user_id, orderType, extensionUpdateCart, AllProductList } = this.state;
        const { dispatch } = this.props;
        var checkoutList = checkList && checkList.customerDetail && checkList.customerDetail.content;
        var place_order;
        var order_payments = [];
        var newList = [];
        var order_custom_fee = [];
        var order_notes = [];
        var totalPrice = checkList && checkList.totalPrice;
        var order_id = checkList && (typeof checkList.order_id !== "undefined") && checkList.order_id !== null && checkList.order_id !== 0 ? checkList.order_id : 0;
        var oliver_pos_receipt_id = checkList && (typeof checkList.oliver_pos_receipt_id !== "undefined") && checkList.oliver_pos_receipt_id !== 0 ? checkList.oliver_pos_receipt_id : "";
        var status = get_order_status;
        var storeCredit = checkoutList ? checkoutList.StoreCredit : 0;
        var paidAmount = 0;
        var managerData = JSON.parse(localStorage.getItem('user'));
        var manager_name = '';
        var ListItem = null;
        var discountIs = 0;
        var update_local_payment = [];
        var order_meta = [];
        var oliver_order_payments = this.getOrderPayments(order_id);
        var redeemAmount = checkList && checkList._wc_amount_redeemed ? parseFloat(checkList._wc_amount_redeemed) : 0;
        var productXArray = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : "";
        var checkoutProductList = [];
        var productxAddons = {}
        // add extention field in meta data
        const productX = productXArray && productXArray.length > 0 ? [...new Map(productXArray.map(item =>
            [item['strProductX'], item])).values()] : "";
            //for uniqness we used strProductX instead of product_id

        productX && productX.map((prodX) => {
            //productxAddons[prodX.product_id] = prodX.addons
            var _detail = prodX.details ? prodX.details : [];

            //for addOns 
            if (prodX.addons && prodX.addons.length > 0) {
                _detail = [..._detail, ...getAddonsField(prodX)];
                prodX["details"] = _detail;
            }
            //for Measurement 
            if (prodX.addons && prodX.pricing_item_meta_data) {
                _detail = [..._detail, ...getAddonsField(prodX)];
                prodX["details"] = _detail;
            }
            //for booking
            if (prodX.booking) {
                _detail = [..._detail, ...getBookingField(prodX)];
                prodX["details"] = _detail;
            }
        })

        // add Tip to order notes
        var tipAmount=0;
        var tipPaymentRefrence=''
        var tipNoteData = localStorage.getItem('PAYMENT_RESPONSE') ? JSON.parse(localStorage.getItem('PAYMENT_RESPONSE')) : null
        if (tipNoteData && tipNoteData.is_success == true && tipNoteData.content && tipNoteData.content.Tip) {
            tipAmount = tipNoteData.content.Tip && tipNoteData.content.Tip > 0 ? (tipNoteData.content.Tip / 100) : 0
            tipPaymentRefrence=tipNoteData.content.RefranseCode;
            // order_notes.push({
            //     note_id: '',
            //     note: `Tip : ${tipAmount}`,
            //     is_customer_note: 1,
            // })
            var tipPercent=0;
            if( checkList.totalPrice &&  checkList.totalPrice!=0 && tipAmount!=0)
            {
                tipPercent=(tipAmount/ checkList.totalPrice)*100;
            }
            var customfeeData={
                fee_id: '',
                Title: `Tip (${ parseFloat(tipPercent).toFixed(2)}%)`,
                amount: tipAmount,
                Price:tipAmount
            }           
            checkList.ListItem.push(customfeeData)
        
        }
        if (typeof oliver_order_payments !== "undefined") {
            var _paymentNotes = [];
            oliver_order_payments.map(items => {
                var amountForPayType=0.0;
                if(tipPaymentRefrence && tipPaymentRefrence !=='' && tipPaymentRefrence== items.transection_id){
                    //Add tip amount into payment amount..
                    paidAmount += parseFloat(items.payment_amount)+parseFloat(tipAmount);
                    amountForPayType= parseFloat(items.payment_amount)+parseFloat(tipAmount);
                }else{
                      paidAmount += parseFloat(items.payment_amount);
                      amountForPayType= parseFloat(items.payment_amount);
                }
              
                var _paymentDetail = {
                    "Id": (typeof items.Id !== "undefined") ? items.Id : 0,
                    "amount": amountForPayType,
                    "payment_type": "order",
                    "type": items.payment_type,
                    "description": (typeof items.Id !== "undefined") ? items.description : '',
                    "transection_id": items.transection_id && items.transection_id !== 0 ? (items.transection_id).toString() : "",
                    "emv_data":items.emv_data ?items.emv_data:""
                }
                if (items.payment_date) {
                    _paymentDetail["payment_date"] = items.payment_date;
                }
                order_payments.push(_paymentDetail);

                //  add order notes for payments type and transaction id 
                var transactionStr = items.transection_id && items.transection_id !== 0 ? `(${(items.transection_id).toString()})` : ""
                _paymentNotes.push(`${items.payment_type}${transactionStr}`)

            })
            if (_paymentNotes.length > 0){}
                order_notes.push({
                    note_id: '',
                    note: `Payment done with: ${_paymentNotes.join(", ")}`,
                    is_customer_note: 0,
                    is_extension_note: true
                })
            }
            
            // add extension's notes for order to order_notes field
            //Need to display into receipt so make the is_customer_note=ture
        if (this.state.extensionOrderNote && this.state.extensionOrderNote.length) {
            this.state.extensionOrderNote.map((itm, ind) => {
                order_notes.push({
                    note_id: '',
                    note: itm,
                    is_customer_note: true, 
                     is_extension_note: false
                })
            });

        }



       

        // update payments for place order
        if (cash_round > 0) {
            var length_is = order_payments.length - 1;
            var update_rounding_amount = parseFloat(totalPrice + cash_round) - parseFloat(paidAmount);
            var new_amount = parseFloat(order_payments[length_is].amount);
            order_payments[length_is].amount = parseFloat(parseFloat(new_amount) + parseFloat(RoundAmount(update_rounding_amount)))
        }

        // update loacal staorage for show payment in rounded amount
        if (order_payments) {
            order_payments.map(items => {
                var _paymentDetail = {
                    "Id": items.Id,
                    "payment_type": items.type,
                    "payment_amount": items.amount,
                    "order_id": order_id,
                    "description": items.description,
                    "emv_data":items.emv_data
                };
                if (items.payment_date) {
                    _paymentDetail["payment_date"] = items.payment_date;
                }
                update_local_payment.push(_paymentDetail)
            })
        }
        ListItem = checkList && checkList.ListItem;
        localStorage.setItem('oliver_order_payments', JSON.stringify(update_local_payment))
         //discountIs = checkList && checkList.discountCalculated ? getDiscountAmount(ListItem) : 0;    note: generate wrong calc when product and cart discount applied
         discountIs = checkList && checkList.discountCalculated ?checkList.discountCalculated  : 0; // getDiscountAmount(ListItem)
        if (this.state.extensionUpdateCart == true) {
            getExtensionCheckoutList(ListItem);
            if (productX) { getProductxChlidProductTax(productX, AllProductList) }
        } else if (activityToCheckout == "true") {
            setListActivityToCheckout(ListItem)
        } else {
            getCheckoutList(ListItem);
            if (productX) { getProductxChlidProductTax(productX, AllProductList) }
        }
        var SingleTax = checkList && checkList.TaxId && checkList.TaxId.length > 0 ? checkList.TaxId[0] : '';
        var _tax_id = SingleTax ? Object.keys(SingleTax)[0] : 0;
        var _subtotal_tax = 0;
        var _total_tax = 0;
        if (ListItem !== null && ListItem.length > 0) {
            var ListItemLenght = ListItem.length
            ListItem.map((items, i) => {
                if (items.product_id != null) {
                    var _details = [];

                    // fix issue for other tax class other then standerd -------  
                    var _subtotaltax=0.00;

                      if(  items.subtotal_tax ){ //&& items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id] ==undefined
                           items.subtotal_tax.map(itm=>{
                               for(var k in itm){
                                  _subtotaltax +=itm[k];
                                }                             
                           }) 
                      }
                      //-----------------------------------------------------------------
                      _subtotal_tax=_subtotaltax
                      _total_tax=_subtotaltax
                      // _subtotal_tax = _tax_id !== 0 ? items.subtotal_tax ? items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id]==undefined ? _subtotaltax : items.subtotal_tax[0] && items.subtotal_tax[0][_tax_id]  : items.subtotaltax ? items.subtotaltax : 0 : 0;
                    // _total_tax = _tax_id !== 0 ? items.total_tax ? items.total_tax[0] && items.total_tax[0][_tax_id]==undefined ? _subtotaltax :items.total_tax[0] && items.total_tax[0][_tax_id] : items.totaltax ? items.totaltax : 0 : 0;

                    var _addOns = productX && productX.filter(prodX => (prodX.product_id == items.product_id && prodX.strProductX  ==items.strProductX)) //strProductX added in condition if the same product having the diffrent variation 

                    if (items.Sku && items.Sku != '') {
                        _details.push({ "Sku": items.Sku });
                    }
                    if (_addOns && _addOns.length > 0 && _addOns[0].addons) {
                        _details = [..._details, ..._addOns[0].addons];
                    }

                    var _addExtMetaData = ''
                    if (extensionMetaData && extensionMetaData.line_item_id && extensionMetaData.line_item_id == items.product_id) {
                        _addExtMetaData = extensionMetaData.metaData
                    }
                    else if (extensionMetaData && ListItemLenght == i + 1) {
                        _addExtMetaData = extensionMetaData.metaData
                    }
                    var productCost=AllProductList && AllProductList.length>0 && AllProductList.find(element => element.WPID ==((typeof items.variation_id !== "undefined" && items.variation_id !== 0) ? items.variation_id : (typeof items.product_id !== "undefined") ? items.product_id : items.WPID))
                    newList.push({
                        line_item_id: items.line_item_id,
                        name: items.Title,
                        Sku: items.Sku,
                        product_id: (typeof items.product_id !== "undefined") ? items.product_id : items.WPID,
                        variation_id: _addOns && _addOns[0] && _addOns[0].variation_id && _addOns[0].variation_id !== 0 ? _addOns[0].variation_id : items.variation_id,
                        quantity: items.quantity,
                        subtotal: items.subtotal ? items.subtotal : items.subtotalPrice,
                        subtotal_tax: _subtotal_tax,
                        subtotal_taxes: items.subtotal_tax ? items.subtotal_tax : items.subtotaltax,
                        total: items.total || items.total == 0 ? items.total : items.totalPrice,
                        total_tax: _total_tax,
                        total_taxes: items.total_tax ? items.total_tax : items.totaltax,
                        isTaxable: items.isTaxable,
                        ticket_info: items.ticket_info,
                        is_ticket: items.ticket_status ? items.ticket_status : '',
                        discount_amount: items.discount_amount ? items.discount_amount : 0,
                        // Type: items && items.Type ? items.Type : '', // added Type to check product simple and variation for productX
                        Type: _addOns && _addOns[0] && _addOns[0].Type ? _addOns[0].Type : items && items.Type ? items.Type : '',

                        addons_meta_data:items.addons_meta_data,//_addOns && _addOns.length > 0 && _addOns[0].addons ? JSON.stringify(_addOns[0].addons) : '',
                        meta_data: items.addons_meta_data? items.addons_meta_data: _addExtMetaData && _addExtMetaData !== '' ? [_addExtMetaData] : '',
                        details: _details,
                        cost_per_item:productCost && productCost.Cost?productCost.Cost:0,
                        psummary:items && items.psummary?items.psummary:''
                    })


                }
                if (items.product_id == null) {
                    if ((typeof items.Price !== 'undefined') && items.Price !== null) {
                        order_custom_fee.push({
                            amount: items.Price,
                            note: items.Title,
                            fee_id: '',
                            Price: items.Price,
                            TaxClass: items.TaxClass,
                            TaxStatus: items.TaxStatus,
                            Title: items.Title,
                            Sku: items.Sku,
                            after_discount: items.after_discount,
                            cart_after_discount: items.cart_after_discount,
                            cart_discount_amount: items.cart_discount_amount,
                            discount_amount: items.discount_amount,
                            discount_type: items.discount_type,
                            excl_tax: items.excl_tax,
                            incl_tax: items.incl_tax,
                            isTaxable: items.isTaxable,
                            new_product_discount_amount: items.new_product_discount_amount,
                            old_price: items.old_price,
                            product_after_discount: items.product_after_discount,
                            product_discount_amount: items.product_discount_amount,
                            quantity: items.quantity,
                        })
                    } else {
                        order_notes.push({
                            note_id: items.id ? items.id : '',
                            note: items.Title,
                            is_customer_note: items.extention_custom_id ? 0 : 1
                        })
                    }
                }
            })
        }
        if (this.state.set_order_notes.length !== 0) {
            var note = this.state.set_order_notes[0]
            order_notes.push({
                note_id: '',
                note: note.note,
                is_customer_note: note.is_customer_note,
                is_extension_note: note.is_extension_note
            })
        }
        var Index = [];
        newList.map(calc => {
            if (calc.total_taxes && calc.total_taxes.length > 0) {
                calc.total_taxes.map(ids => {
                    Index.push(ids)
                })
            }
        })
        var distinctTaxIdsObject = new Object();
        Index.map(function (element, index) {
            var getObjectKey = Object.keys(element)[0];
            var getObjectValues = Object.values(element)[0];
            if (distinctTaxIdsObject.hasOwnProperty(getObjectKey)) {
                var existingValue = parseFloat(distinctTaxIdsObject[getObjectKey]);
                distinctTaxIdsObject[getObjectKey] = existingValue + parseFloat(getObjectValues);
            } else {
                distinctTaxIdsObject[getObjectKey] = getObjectValues;
            }
        });
        var distinctTaxIdsArray = new Array();
        for (var key in distinctTaxIdsObject) {
            var obj = new Object();
            obj[key] = distinctTaxIdsObject[key];
            distinctTaxIdsArray.push(obj)
        }
        if (managerData && managerData.display_name !== " " && managerData.display_name !== 'undefined') {
            manager_name = managerData.display_name;
        } else {
            manager_name = managerData !== null ? managerData.user_email : ''
        }

        //Updating the productX data from LineItem Data to calculate tax, total and subtotal;S
        if (productX && newList && newList.length > 0) {
            productX.map(_prodx => {
                var findProdxItems = newList.filter(_Item => (parseInt(_Item.product_id) == parseInt(_prodx.product_id)));
                if (findProdxItems && findProdxItems.length > 0) {
                    _prodx['SKu'] = findProdxItems[0].Sku;
                    _prodx['line_tax_data'] = [{ subtotal: findProdxItems[0].subtotal_taxes }, { total: findProdxItems[0].total_taxes }];
                    _prodx['line_subtotal'] = findProdxItems[0].subtotal;
                    _prodx['line_subtotal_tax'] = findProdxItems[0].subtotal_tax;
                    _prodx['line_total'] = findProdxItems[0].total;
                    _prodx['line_tax'] = findProdxItems[0].total_tax;
                    _prodx['line_subtotal_taxes'] = findProdxItems[0].subtotal_taxes;
                    _prodx['line_total_taxes'] = findProdxItems[0].total_taxes;
                }
            })
            // removing simpleproductX and variationProductX type from productX to show data into wooCommerce 
            newList.map((removeProductxItems, i) => {
                productX.map((prod, index) => {
                    if ((removeProductxItems.Type == 'simple' || removeProductxItems.Type == 'variable') && removeProductxItems.product_id == prod.product_id) {
                        //This field is added to dispaly the simple and variation productX measurement data 
                        removeProductxItems["pricing_item_meta_data"] = prod.pricing_item_meta_data ? prod.pricing_item_meta_data : "";
                        //for Measurement 
                        if (prod && prod.pricing_item_meta_data) {
                            removeProductxItems["details"] = getAddonsField(prod);
                        }
                        productX.splice(index, 1);
                    }
                })
            })

            localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
        }
        checkoutProductList = newList;
        //Removing the productX data from the LineItem because we are passing ProductX data in saperate variavle i.e. productx_line_items
        if (checkoutProductList && checkoutProductList.length > 0 && productX && productX.length > 0) {
            productX.map(prod => {
                checkoutProductList.map((removeProductxItems, index) => {
                    if (removeProductxItems.Type !== 'simple' && removeProductxItems.Type !== 'variable' && removeProductxItems.product_id == prod.product_id) {
                        checkoutProductList.splice(index, 1);
                    }
                })
            })
        }
        //Geting the all product of the order and their discount applied on them to send into meta-data, this will used when reopen the park sale
        var productDiscout = []
        var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));
        const cartProducts = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';

        if (cartProducts && cartProducts.length > 0) {
            // sent total_subTotal_fileds to use in activity view  incase of park and lay-away  
            var subTotal_Total_sent_to_part = {
                'total_subTotal_fileds':{
                    subTotal:checklist && checklist.subTotal ? checklist.subTotal : 0,
                    totalPrice:checklist && checklist.totalPrice ? checklist.totalPrice : 0 
                }    
            }
            productDiscout && productDiscout.push(subTotal_Total_sent_to_part)

            // var discount_amount = 0
            cartProducts.map((item, index) => {
                if (item.product_id) {

                    var _product=AllProductList && AllProductList.length>0 && AllProductList.find(element => element.WPID ==((typeof item.variation_id !== "undefined" && item.variation_id !== 0) ? item.variation_id : (typeof item.product_id !== "undefined") ? item.product_id : item.WPID))
                    // if (item.product_id && item.variation_id) {
                    // discount_total += item.cart_discount_amount 
                    productDiscout.push({
                        // order_notes: (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [],
                        product_id: item.product_id,
                        variation_id: item.variation_id ? item.variation_id : 0,
                        product_discount_amount: item.product_discount_amount,
                        cart_discount_amount: item.cart_discount_amount,
                        discount_type: item.discount_type,
                        after_discount: item.after_discount,
                        discount_amount: item.discount_amount,
                        cart_after_discount: item.cart_after_discount,
                        product_after_discount: item.product_after_discount,
                        ticket_status: item.ticket_status,
                        tick_event_id: item.tick_event_id,
                        ticket_info: item.ticket_info,
                        product_ticket: item.product_ticket,
                        new_product_discount_amount: item.new_product_discount_amount,
                        TaxStatus: item.TaxStatus,
                        tcForSeating: item.tcForSeating,
                        TaxClass: item.TaxClass,
                        old_price: item.old_price,
                        Price: item.Price,
                        Title: item.Title,
                        Sku: item.Sku,
                        quantity: item.quantity,
                        discountCart: CartDiscountAmount,
                        shortDescription:_product && _product.ShortDescription ? _product.ShortDescription:""
                        // subTotal: checklist && checklist.subTotal ? checklist.subTotal : 0,
                        // totalPrice: checklist && checklist.totalPrice ? checklist.totalPrice : 0
                    });
                }
            })
        }


        // get system ip, system id and device type 
        var deviceType = ''
        var deviceIP = ''
        var deviceName = ''
        if (isMobileOnly == true) {
            deviceType = 'Mobile'
        } else if (isTablet == true) {
            deviceType = 'Tablet'
        } else {
            deviceType = 'Desktop'
        }
        $.getJSON("http://jsonip.com/?callback=?").then((data) => {
            deviceIP = data.ip
            place_order.device_ip = data.ip
        });

        // push order_custom_fee in discount meta data
        productDiscout && productDiscout.push({ order_custom_fee: order_custom_fee })
        productDiscout && productDiscout.push({ order_notes: (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [] })
        productDiscout && productDiscout.push({ taxType: typeOfTax()})
        var selectedGroupSale=localStorage.getItem('selectedGroupSale') ? JSON.parse(localStorage.getItem('selectedGroupSale')): null; 
      
        order_meta.push({
            "manager_id": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserID') : localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')).user_id : "",
            "manager_name": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserEmail') : manager_name,
            "location_id": location_id,
            "register_id": localStorage.getItem('register'),
          
            "_order_oliverpos_group_name" : selectedGroupSale && selectedGroupSale.GroupName,
            "_order_oliverpos_group_slug": selectedGroupSale && selectedGroupSale.Slug,
            "_order_oliverpos_group_qrcode":selectedGroupSale && selectedGroupSale.QRCode,
            "_order_oliverpos_group_label":selectedGroupSale && selectedGroupSale.Label,     
            "cash_rounding": cash_round,
            "refund_cash_rounding": 0,
            "_order_oliverpos_extension_data": orderType,
            "_wc_points_logged_redemption": checkList && checkList._wc_points_logged_redemption ? checkList._wc_points_logged_redemption : "",
            // "_wc_amount_redeemed":  checkList && checkList._wc_amount_redeemed ? checkList._wc_amount_redeemed:"",
            "_wc_points_redeemed": checkList && checkList._wc_points_redeemed ? checkList._wc_points_redeemed : "",
            "_order_oliverpos_product_discount_amount": productDiscout,
            // "_order_oliverpos_order_custom_fee" : order_custom_fee
            "_order_oliverpos_park_sale_notes": (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [],
            "_order_oliverpos_cash_change": { "cashPayment": cash_payment, "change": change_amount },
            //"_order_oliverpos_addons" : productxAddons && productxAddons!== {} ? JSON.stringify(productxAddons) : {}        
        })

        var loginUser = JSON.parse(localStorage.getItem("user"));
        var CustomerDetail = JSON.parse(localStorage.getItem('AdCusDetail'));
        var ShippingAddress = CustomerDetail && CustomerDetail.content.customerAddress ? CustomerDetail.content.customerAddress.find(Items => Items.TypeName == "shipping") : '';
        place_order = {
            order_id: order_id,
            oliver_pos_receipt_id: oliver_pos_receipt_id,
            status: status,
            customer_note: Notes ? Notes : 'Add Note',
            customer_id: CustomerDetail && CustomerDetail.content && CustomerDetail.content.WPId ? CustomerDetail.content.WPId : 0,
            order_tax: checkList && checkList.tax ? checkList.tax : 0,
            order_total: (status == 'park_sale' || status == 'lay_away') ? checkList && checkList.totalPrice+tipAmount : checkList && parseFloat(RoundAmount(checkList.totalPrice + cash_round+tipAmount)),
            order_discount: parseFloat(discountIs) + redeemAmount,
            tax_id: _tax_id,
            tax_ids: distinctTaxIdsArray,
            //line_items: newList,
            line_items: checkoutProductList,
            productx_line_items: productX, //Sending the ProductX data.
            customer_email: CustomerDetail && CustomerDetail.content && CustomerDetail.content.Email ? CustomerDetail.content.Email : '',
            billing_address: [{
                first_name: FirstName ? FirstName : '',
                last_name: LastName ? LastName : '',
                company: "",
                email: Email ? Email : '',
                phone: PhoneNumber ? PhoneNumber : '',
                address_1: loginUser ? loginUser.shop_address1 : "", // Street_Address ? Street_Address : '',
                address_2: loginUser ? loginUser.shop_address2 : "", // Street_Address2 ? Street_Address2 : '',
                city: loginUser ? loginUser.shop_city : "", //  city ? city : '',
                state: loginUser ? loginUser.shop_state : "", //  "",
                postcode: loginUser ? loginUser.shop_postcode : "", //  Pincode ? Pincode : '',
                country: loginUser ? loginUser.shop_country_full_Name : ""
            }],
            shipping_address: [{
                first_name: CustomerDetail ? CustomerDetail.content.FirstName : "", // FirstName ? FirstName : '',
                last_name: CustomerDetail ? CustomerDetail.content.LastName : "", //  LastName ? LastName : '',
                company: "",
                email: Email ? Email : '',
                phone: PhoneNumber ? PhoneNumber : '',
                address_1: ShippingAddress ? ShippingAddress.Address1 : "", // CustomerDetail. Street_Address ? Street_Address : '',
                address_2: ShippingAddress ? ShippingAddress.Address2 : "", //  Street_Address2 ? Street_Address2 : '',
                city: ShippingAddress ? ShippingAddress.City : "", // city ? city : '',
                state: ShippingAddress ? ShippingAddress.State : "", // ,
                postcode: ShippingAddress ? ShippingAddress.PostCode : "",  // Pincode ? Pincode : '',
                country: ShippingAddress ? ShippingAddress.Country : "", // 
            }],
            order_custom_fee: order_custom_fee,
            order_notes: (typeof order_notes !== "undefined") && order_notes.length > 0 ? order_notes : [],
            order_payments: order_payments,
            order_meta: order_meta,
            Udid: UDID,
            device_type: deviceType,
            // device_ip: deviceIP,
            device_id: deviceName,
            _currentTime: moment().format('YYYY-MM-DD, h:mm:ss a') //date used for cloud print
        }
        localStorage.setItem('placedOrderList', JSON.stringify(newList));
        // add cash rounding amount in localstorage for android and ios section
        // get tax name for android and ios section
        var TotalTaxByName = getTotalTaxByName('completecheckout', productX);
        if (localStorage.getItem('CHECKLIST')) {
            var checklist = JSON.parse(localStorage.getItem('CHECKLIST'));
            if (productX && productX.length > 0) {
                checklist.ListItem.map(item => {
                    var sub_tilte = productxArray(item.product_id, AllProductList, 'setPayment');
                    if (sub_tilte && sub_tilte !== "") {
                        item['productx_subtitle'] = sub_tilte;
                    }
                })
            }
            checklist['cash_rounding'] = cash_round;
            checklist['servedby'] = manager_name;
            checklist['multiple_tax'] = TotalTaxByName;
            //added into checklist for android print receipt
            checklist['_order_oliverpos_cash_change'] = { "cashPayment": cash_payment, "change": change_amount };

            localStorage.setItem('CHECKLIST', JSON.stringify(checklist))
        }
        //------------------------------------
       
        setTimeout(() => {
            localStorage.setItem("GTM_ORDER", JSON.stringify(place_order));
            if (status.includes("park_sale") || status.includes("lay_away")) {
                setTimeout(() => {
                   dispatch(checkoutActions.save(place_order, 2));
                }, 500);
            } else {
               dispatch(checkoutActions.save(place_order, 1));
            }
            //Android Call----------------------------
            androidDisplayScreen("Total", place_order.order_total, 0, "finalcheckout");
            //-----------------------------------------

        }, 1000);
    }

    cancel_VoidSale() {
        const { checkList, UDID } = this.state;
        this.setState({
            isLoading: true
        });
        localStorage.removeItem('extensionUpdateCart');
        localStorage.removeItem('PRODUCTX_DATA');
        var order_id = (typeof checkList.order_id !== "undefined") ? checkList.order_id : 0;
        this.props.dispatch(checkoutActions.orderToVoid(order_id, UDID))
    }

    freezBackendScreen() {
        setTimeout(function () {
            showModal('disabled_popup_background');
        }, 100)
    }

    componentWillReceiveProps(prevProps) {
        //Checking the error when new customer added and email already exist-------------------------------------- 
        if (prevProps.customer_save_data && prevProps.customer_save_data.error && prevProps.customer_save_data.error !== '') {

            this.setState({
                isShowLoader: false,
                errOnPlaceOrder: LocalizedLanguage.alreadyExistEmailMsg,
                isLoading: false
            })
            if (isMobileOnly == true) { $('#ordernotSuccesModal').addClass('show'); }
            setTimeout(function () {
                showModal('ordernotSuccesModal');
            }, 100)
        }
        //-----------------------------------------------------------------------------------------------------

        if (prevProps.shop_order && prevProps.shop_order.error && (!prevProps.shop_order.error.toLowerCase().includes("reject"))) {
            this.setState({ isShowLoader: false, errOnPlaceOrder: prevProps.shop_order.error });
            if (isMobileOnly == true) { $('#ordernotSuccesModal').addClass('show'); }
            setTimeout(function () {
                showModal('ordernotSuccesModal');
            }, 100)
            this.freezBackendScreen();
            //this.extraPayAmount(prevProps.shop_order.error);
        }
        var AdCusDetail = prevProps.single_cutomer_list && prevProps.single_cutomer_list.content && prevProps.single_cutomer_list.content.customerDetails;
        if ((typeof AdCusDetail !== 'undefined') && AdCusDetail != null) {
            this.setState({
                isShowLoader: false,
                isLoading: false
            })
            var checkoutList = AdCusDetail;
            var customerAddress = AdCusDetail && AdCusDetail.customerAddress ? AdCusDetail.customerAddress.find(Items => Items.TypeName == "billing") : '';
            if (checkoutList != null) {
                this.setState({
                    FirstName: checkoutList.FirstName ? checkoutList.FirstName : '',
                    LastName: checkoutList.LastName,
                    Street_Address: customerAddress ? customerAddress.Address1 : '',
                    Street_Address2: customerAddress ? customerAddress.Address2 : '',
                    city: customerAddress ? customerAddress.City : '',
                    PhoneNumber: checkoutList ? checkoutList.Phone ? checkoutList.Phone : checkoutList.PhoneNumber : '',
                    Notes: checkoutList.Notes,
                    Email: checkoutList.Email,
                    Pincode: customerAddress ? customerAddress.PostCode : '',
                    user_id: checkoutList.UID,
                    country_code: customerAddress ? customerAddress.Country : '',
                    store_credit: checkoutList.StoreCredit,

                    oliver_pos_receipt_id: CHECKLIST && CHECKLIST !== null && CHECKLIST.oliver_pos_receipt_id ? CHECKLIST.oliver_pos_receipt_id : 0,
                    order_id: CHECKLIST && CHECKLIST !== null && CHECKLIST.order_id ? CHECKLIST.order_id : 0,
                })
                this.state.user_id = checkoutList.UID;

                if (customerAddress && customerAddress.Country) {
                    this.getCountryAndStateName(customerAddress.State, customerAddress.Country);
                    this.setCountryToStateList(customerAddress.Country, customerAddress.State)
                }
                if (this.state.edit_status == true) {
                    //$('#edit-info-checkout').modal('show');
                    setTimeout(function () {
                        showModal('edit-info-checkout');
                    }, 100)
                }
            }
        }

        if (prevProps.cartproductlist && (this.state.extenstionDiscountStatus == true || this.state.UpdateCartByApp==true)) {
            var _subtotal = 0.0;
            var _total = 0.0;
            var _taxAmount = 0.0;
            var _totalDiscountedAmount = 0.0;
            var _exclTax = 0;
            var _inclTax = 0;
            var _subtotalPrice = 0;
            var _subtotalDiscount = 0;
            var cartproductlist = prevProps.cartproductlist
            this.setState({ extenstionDiscountStatus: false,UpdateCartByApp:false })
            var CHECKLIST = (typeof localStorage.getItem("CHECKLIST") !== 'undefined') ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
            prevProps.cartproductlist && prevProps.cartproductlist.map((item, index) => {
                if (item.Price) {
                    _subtotalPrice += item.Price
                    _subtotalDiscount += parseFloat(item.discount_amount)
                    if (item.product_id) {//donothing
                        _exclTax += item.excl_tax ? item.excl_tax : 0,
                            _inclTax += item.incl_tax ? item.incl_tax : 0
                    }
                }
            })
            _subtotalDiscount = RoundAmount(_subtotalDiscount);
            _exclTax = RoundAmount(_exclTax);
            _inclTax = RoundAmount(_inclTax);
            _subtotal = _subtotalPrice - _subtotalDiscount;
            _totalDiscountedAmount = _subtotalDiscount;
            _taxAmount = parseFloat(_exclTax) + parseFloat(_inclTax);
            _total = parseFloat(_subtotal) + parseFloat(_exclTax);
            const { dispatch } = this.props;
            const CheckoutList = {
                ListItem: cartproductlist,
                customerDetail: CHECKLIST ? CHECKLIST.customerDetail : '',
                totalPrice: _total,
                discountCalculated: _totalDiscountedAmount,
                tax: _taxAmount,
                subTotal: _subtotal,
                TaxId: CHECKLIST ? CHECKLIST.TaxId : 0,
                TaxRate: CHECKLIST ? CHECKLIST.TaxRate : 0,
                order_id: CHECKLIST && CHECKLIST !== null ? CHECKLIST.order_id : 0,
                oliver_pos_receipt_id: CHECKLIST && CHECKLIST !== null && CHECKLIST.oliver_pos_receipt_id ? CHECKLIST.oliver_pos_receipt_id : 0,
                showTaxStaus: CHECKLIST ? CHECKLIST.showTaxStaus : 'tax',
                _wc_points_redeemed: CHECKLIST._wc_points_redeemed,
                _wc_amount_redeemed: CHECKLIST._wc_amount_redeemed,
                _wc_points_logged_redemption: CHECKLIST._wc_points_logged_redemption
            }
            this.setState({ checkList: CheckoutList })
            // localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
            //this.props.dispatch(checkoutActions.getAll(CheckoutList));

            localStorage.setItem("VOID_SALE", "void_sale")
            setTimeout(function () {
                $('#my-input').val(parseFloat(_total).toFixed(2))
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
            }, 1000)
        }
    }

    closeModal() {
        this.setState({
            isShowLoader: false,
            paidAmount: '',
            customerData: this.props.single_cutomer_list && this.props.single_cutomer_list.content && this.props.single_cutomer_list.content.customerDetails ? this.props.single_cutomer_list.content.customerDetails : ''
        })
        this.edit_status(false);
        if (isMobileOnly == true) {
            $("#popup_cash_rounding").removeClass("show")
        }
    }

    extraPayAmount(msg) {
        this.setState({ common_Msg: msg })
        setTimeout(function () {
            showModal('common_msg_popup');
        }, 100)
        if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
    }

    closeExtraPayModal() {
        this.setState({ common_Msg: '' })
        if (isMobileOnly == true) { $('#common_msg_popup').removeClass('show') }
    }

    freezScreen() {
        setTimeout(function () {
            showModal('disabled_popup_close');
        }, 100)
    }

    statusUpdate(text) {
        this.removeOrderPayments();
        this.setState({ isShowLoader: false })

    }

    handleChangeList(e) {
        var finalStatelist = [];
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Country == e.target.value) {
                finalStatelist.push(element)
            }
        }

        )
        this.setState({
            viewStateList: finalStatelist,
            country_code: e.target.value,
            state_code: ''
        })
    }

    onChangeStateList(e) {
        this.setState({
            state_code: e.target.value,
        })

    }

    autoFocus(event) {
        setTimeout(function () {
            $(`#${event}`).focus();
        }, 500)

    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 18-07-2019
    // Description : for update true diamond inner state
    showExtention(value, type) {
        var jsonMsg = value ? value : '';
        var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (clientEvent && clientEvent !== '') {
            switch (clientEvent) {
                case "addData":
                    //setTimeout(() => {
                         this.addData(jsonMsg.data);
                       this.addExtentionData(jsonMsg.data)
                   //}, 200);
                    
                    break;
                case "saveCustomFee":
                    this.addData(jsonMsg.data);
                    this.addExtentionCustomFee(jsonMsg.data);
                    break;
                case "deleteCustomFee":
                    this.deleteExtentionCustomFee(jsonMsg.data);
                    break;
                case "togglePaymentButtons":
                    this.toggleExtentionPaymentButton(jsonMsg.data);
                    break;
                case "updateProductTaxes":      
                        setTimeout(() => {
                            this.updateExtentionProductTaxes(jsonMsg.data);
                        }, 500);              
                         
                    break;
                case "saveDiscount":
                    this.saveExtentionCartDiscount(jsonMsg.data);
                    break;
                // function for redeem points on total price
                case "redeemPoints":
                    this.redeemPointsExtentionCart(jsonMsg.data);
                    break;
                // call for reverse redeem points on total price
                case "cancelRedeemedPoints":
                    this.cancelRedeemedPointsExtentionCart(jsonMsg.data);
                    break;
                case "extensionReady":
                    this.extensionReady(true);
                    break;
                case "addCustomerAddress":
                    this.addCustomerAddress(jsonMsg.data)
                    break;
                case "addCustomer":
                    addExtensionCustomer(jsonMsg.data) // calling common fucntion from commonExtension
                    break;
                case "extensionPayment":
                    this.makePaymentByExtesion(jsonMsg.data)
                    break;
                case "addMetaData":
                   // setTimeout(() => {
                        this.addExtensionMetaData(jsonMsg.data)
                   // }, 200);
                    
                    break;
                case "registerInfo":
                    sendRegisterDetails(!(this.state.extensionIframe))
                    break;
                case "clientInfo":
                    sendClientsDetails(!(this.state.extensionIframe))
                    break;
                case "tipInfo":
                    sendTipInfoDetails(!(this.state.extensionIframe))
                    break;
                case "addOrderNotes":
                    this.addExtensionNotesToOrderNotes(jsonMsg.data)
                    break;
                case "extensionFinished":
                    setTimeout(() => {
                         var wordpressAction = jsonMsg.oliverpos.wordpressAction;
                    this.extensionFinished(wordpressAction);
                    }, 100);
                   
                    break;
                default: // extensionFinished
                    console.error('App Error : Extension Event does not match ', jsonMsg);
                    var wordpressAction = jsonMsg.oliverpos.wordpressAction;
                    this.extensionFinished(wordpressAction);
                    break;
            }
        }
    }

    extensionReady(status) {
        this.setState({ extensionReadyToPost: status ? status : '' });
    }

    // add extensio notes to order notes 
    addExtensionNotesToOrderNotes = (data)=>{
        if(data && data.note){
            this.state.extensionOrderNote.push(data.note)
        }
    }

    // add extension meta data in order meta 
    addExtensionMetaData = (data) => {
        if (data && data.metaData) {
            this.setState({ extensionMetaData: data })
        }
        else {
            console.error('App Error :Invalid Data');
        }
    }

    // extesion payment (mobilePay)
    makePaymentByExtesion = (data) => {
        try {
            const { checkList } = this.state
            if (data && data.paymentDetails && data.paymentDetails.paymentStatus.toLowerCase() == 'success') {
                var type = data && data.paymentDetails && data.paymentDetails.paymentType ? data.paymentDetails.paymentType : ''
                checkList['transection_id'] = data.paymentDetails && data.paymentDetails.transaction_id ? data.paymentDetails.transaction_id : ''

                this.setState({ checkList: checkList, isPaymentByExtension: true, extensionPaymentType: type })
                this.orderPayments.updateClosingTab(true)
                setTimeout(() => {
                    if(this.state.PaymentExtensionCallData ==""){   
                        console.log("CallPayment",data)  
                        this.orderPayments.pay_amount(type)
                        hideModal('common_ext_popup')
                    this.state.PaymentExtensionCallData=data;
                     this.close_ext_modal()
                }
                   
                }, 500);
            }
            else {
                console.error('App Error : Invalid Data');
            }
        } catch (error) {
            console.error('App Error : ', error);
        }

    }

    percentage(num, per) {
        return (parseFloat(num) / 100) * parseFloat(per);
    }

    number(num, per) {
        return parseFloat(num) * 100 / parseFloat(per);
    }



    /**
     * Created by :Shakuntala Jatav
     *  Created Date: 03-01-2020
     * @param {*} data 
     */
    redeemPointsExtentionCart(data) {
        try {
            var redeemAmount = data.points && data.points.amount && data.points.amount !== null ? parseFloat(data.points.amount) : 0;
            var redeemPoints = data.points && parseFloat(data.points.points);
            var discount_code = data.points && data.points.discount_code;

            //getting below field for reduce redeem tax amount from exclusive and inclusive----------------------------       
            var opr_tax_inclusive = data.points && data.points.opr_tax_inclusive;
            // var redeem_amount_tax = data.points && data.points.amount_tax !== "" && opr_tax_inclusive && opr_tax_inclusive == "exclusive" && data.points.amount_tax ? parseFloat(data.points.amount_tax) : 0;
            var redeem_amount_tax = data.points && data.points.amount_tax !== "" && opr_tax_inclusive && data.points.amount_tax ? parseFloat(data.points.amount_tax) : 0;
            //-------------------------------------------------------------------------------------------

            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            var redeemAmt = redeemAmount + redeem_amount_tax * (opr_tax_inclusive == "inclusive" ? -1 : 1);
            var totalPrice = parseFloat(list.totalPrice) - redeemAmt;
            //reduce the inclusive tax from redeem amount.......
            redeemAmount = redeemAmount - (opr_tax_inclusive == "inclusive" ? redeem_amount_tax : 0);

            var discountCalculated = parseFloat(list.discountCalculated) + redeemAmount;
            redeemPoints = redeemPoints + parseFloat(list._wc_points_redeemed)
            redeemAmount = redeemAmount + parseFloat(list._wc_amount_redeemed)
            localStorage.setItem('extensionUpdateCart', true);
            this.setState({ extensionUpdateCart: true })
            const CheckoutList = {
                ListItem: list.ListItem,
                customerDetail: list.customerDetail,
                totalPrice: totalPrice,
                discountCalculated: discountCalculated,
                tax: list.tax - redeem_amount_tax,
                subTotal: list.subTotal,
                TaxId: list.TaxId,
                order_id: list.order_id !== 0 ? list.order_id : 0,
                showTaxStaus: list.showTaxStaus,
                _wc_points_redeemed: redeemPoints,
                _wc_amount_redeemed: redeemAmount,
                _wc_tax_redeemed: redeem_amount_tax,
                _wc_points_logged_redemption: [{
                    "points": redeemPoints,
                    "amount": redeemAmount,
                    "discount_code": discount_code,
                    "redeem_amount_tax": redeem_amount_tax,
                    "opr_tax_inclusive": opr_tax_inclusive
                }]

            }
            const { dispatch } = this.props;
            this.setState({ checkList: CheckoutList })
            localStorage.setItem("VOID_SALE", "void_sale")
            setTimeout(() => {
                $('#my-input').val(parseFloat(CheckoutList.totalPrice).toFixed(2))
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
            }, 1000);

            // check redeem points equal to order amount then set default store credit payment
            if (totalPrice == 0) {
                this.setState({
                    commonConfirmBoxMsg: 'Do you want to do full payment with redeemed points?',
                    payWithRedeemPoints: true
                })
                setTimeout(function () {
                    showModal('redeem_confirmation');
                }, 100)
            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }
    /**
     * Created By :Shakuntala Jatav
     * Created Date:07-01-2020
     * @param {*} data 
     */
    cancelRedeemedPointsExtentionCart(data) {
        try {
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            var redeemAmount = list && list._wc_amount_redeemed ? parseFloat(list._wc_amount_redeemed) : 0;
            var redeemTax = list && list._wc_tax_redeemed ? parseFloat(list._wc_tax_redeemed) : 0;
            var redeemPoints = 0;
            var discount_code = 0;

            var totalPrice = parseFloat(list.totalPrice) + parseFloat(redeemAmount) + parseFloat(redeemTax);
            localStorage.setItem('extensionUpdateCart', true);
            this.setState({ extensionUpdateCart: true })
            const CheckoutList = {
                ListItem: list.ListItem,
                customerDetail: list.customerDetail,
                totalPrice: totalPrice,
                discountCalculated: parseFloat(list.discountCalculated) - redeemAmount,
                tax: list.tax + redeemTax,
                subTotal: list.subTotal,
                TaxId: list.TaxId,
                order_id: list.order_id !== 0 ? list.order_id : 0,
                showTaxStaus: list.showTaxStaus,
                _wc_points_redeemed: redeemPoints,
                _wc_amount_redeemed: 0,
                _wc_points_logged_redemption: [{
                    "points": redeemPoints,
                    "amount": 0,
                    "discount_code": discount_code
                }]

            }
            const { dispatch } = this.props;
            this.setState({ checkList: CheckoutList })
            localStorage.setItem("VOID_SALE", "void_sale")
            setTimeout(() => {
                $('#my-input').val(parseFloat(CheckoutList.totalPrice).toFixed(2))
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
            }, 1000);

            // when cancel redeem points do false the payWithRedeemPoints to enabled payments methods
            if (CheckoutList._wc_amount_redeemed == 0) {
                this.setState({ payWithRedeemPoints: false })
            }
        } catch (error) {
            console.error('App Error : ', error);
        }

    }
    /**
     * Created by :Shakuntala Jatav
     * Created Date: 17-10-2019
     * @param {*} data 
     * Description apply discount on cart list product.
     */
    saveExtentionCartDiscount(data) {
        try {
            const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
            const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';
            var subTotal = this.state.checkList && this.state.checkList.subTotal;
            var previousCartDiscount = 0;
            var product_after_discount = 0;
            var totalPrice = 0;
            var discount_amount = 0;
            var status = false;
            var discount_type = data && data.discount && data.discount.type ? data.discount.type : 'number';
            cartproductlist && cartproductlist.map((item, index) => {
                product_after_discount += parseFloat(item.product_discount_amount);
                if (item.product_id) {//donothing
                    totalPrice += item.Price
                }
            })

            if (CartDiscountAmount) {
                if (CartDiscountAmount.discountType == "Number" && discount_type == "percent") {
                    previousCartDiscount = this.percentage(CartDiscountAmount.discount_amount, totalPrice - product_after_discount)
                } else if (CartDiscountAmount.discountType == "Percentage" && discount_type == "number") {
                    previousCartDiscount = this.number(CartDiscountAmount.discount_amount, subTotal - product_after_discount)
                } else if (CartDiscountAmount.discountType == "Number" && discount_type == "number") {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                } else {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                }
            }
            discount_amount = data && data.discount ? parseFloat(data.discount.amount) + parseFloat(previousCartDiscount) : 0;
            if (discount_type == "percent") {
                if (discount_amount > 100) {
                    status = true
                    setTimeout(function () {
                        showModal('no_discount');
                    }, 100)
                }
            }
            if (discount_type == "number") {
                if (discount_amount > totalPrice) {
                    status = true
                    setTimeout(function () {
                        showModal('no_discount');
                    }, 100)
                }
            }

            if (status == false) {
                var cart = {
                    type: 'card',
                    discountType: data.discount && data.discount.type ? data.discount.type == "percent" ? "Percentage" : "Number" : "Number",
                    discount_amount: parseFloat(data.discount.amount) + parseFloat(previousCartDiscount),
                    Tax_rate: 0
                }
                this.setState({ extenstionDiscountStatus: true })
                localStorage.setItem("CART", JSON.stringify(cart))
                this.props.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }

    updateExtentionProductTaxes(data) {
        try {
            var listItems = data && data != undefined && data.products;
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            localStorage.setItem('extensionUpdateCart', true);
            this.setState({ extensionUpdateCart: true })
            if (list != null) {
                var _price = 0;
                var _tax = 0;
                var _discount = 0;
                var _incltax = 0;
                var _excltax = 0;
                list.ListItem.map(items => {
                    var findItems = listItems && listItems.find(check => check.variationId !== 0 ? check.variationId == items.variation_id : check.productId == items.product_id);
                    if (findItems) {
                        items['Price'] = findItems.amount;
                        items['excl_tax'] = items.incl_tax == 0 ? parseFloat(findItems.tax) : 0;
                        items['incl_tax'] = items.excl_tax == 0 ? parseFloat(findItems.tax) : 0;
                        items['discount_amount'] = findItems.discountAmount;
                    }

                })

                list.ListItem.map(items => {
                    if (items.Price) {
                        _price += parseFloat(items.Price);
                        _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                        _discount += parseFloat(items.discount_amount);
                        _incltax += parseFloat(items.incl_tax);
                        _excltax += parseFloat(items.excl_tax)
                    }
                })

                const CheckoutList = {
                    ListItem: list.ListItem,
                    customerDetail: list.customerDetail,
                    totalPrice: (_price + _excltax) - _discount,
                    discountCalculated: _discount,
                    tax: _tax,
                    subTotal: _price - _discount,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                const { dispatch } = this.props;
                this.setState({ checkList: CheckoutList })
                localStorage.setItem("VOID_SALE", "void_sale");
                setTimeout(() => {
                    $('#my-input').val(parseFloat(CheckoutList.totalPrice).toFixed(2))
                    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                    dispatch(checkoutActions.changeStatusSaleToVoid("void_sale"));
                    dispatch(checkoutActions.getAll(CheckoutList));
                }, 1000);
            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }

    filterDuplicate(myArr) {
        var res = {};
        var resArr = [];
        for (var elem of myArr) {
            res[elem.extention_custom_id] = elem;
        }
        for (var [index, elem] of Object.entries(res)) {
            resArr.push(elem);
        }
        return resArr;
    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 27-08-2019
    // Description : disable and enable Payment Buttons.
    toggleExtentionPaymentButton(data) {
        try {
            this.setState({
                toggleExtentionStatus: data.togglePayment && data.togglePayment.flag
            })
        } catch (error) {
            console.error('App Error : ', error);
        }
    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 23-08-2019
    // Description : extention data add in cart list.
    addExtentionData(data) {
        try {
            for (var extensionData in data) {
                clientExtensionData[extensionData] = data[extensionData];
            }
            var newObjKey = "";
            const { active_true_diamond } = this.state;
            var true_dimaond_field = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
            var active_true_diamond_field = active_true_diamond !== 'false' ? true_dimaond_field.find(Items => `true_${Items.Id}` == active_true_diamond) : '';
            var cartlist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST')) ? JSON.parse(localStorage.getItem('CHECKLIST')).ListItem : null;
            cartlist = cartlist == null ? [] : cartlist;
            var new_title = 'Extension(' + active_true_diamond_field.Name + ')';
            var title = new_title;
            var new_array = [];
            var i = 0;
            var data1 = '';
            if (cartlist.length > 0) {
                cartlist.map(item => {
                    if (item.customTags && item.customTags !== "") {
                        new_array.push(item)
                    }
                })
            }
            for (var key in data) {
                newObjKey = key;
            }
            if (new_array.length > 0) {
                var findStatus = false;
                cartlist.map(item => {
                    if (item.customTags && item.customTags !== "") {
                        if (item.extention_custom_id == newObjKey) {
                            findStatus = true
                            item.customTags = data
                        }
                    }
                })
                if (findStatus == false) {
                    var data_is = cartlist.find(item => (typeof item.extention_custom_id !== undefined && item.extention_custom_id !== newObjKey));
                    if (data_is) {
                        data1 = {
                            Title: new_title,
                            customTags: data,
                            extention_custom_id: newObjKey,
                        }
                    }

                }

            } else {
                data1 = {
                    Title: new_title,
                    customTags: clientExtensionData,
                    extention_custom_id: newObjKey,
                }
            }


            if (data1 !== "") {
                cartlist.push(data1);
            }
            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: parseFloat(list.subTotal), //+ parseFloat(list.tax),
                    discountCalculated: list.discountCalculated,
                    tax: parseFloat(list.tax),
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                try {
                    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                    this.setState({ checkList: CheckoutList })
                    this.props.dispatch(checkoutActions.getAll(CheckoutList));
                } catch (error) {
                }
            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 14-08-2019
    // Description : for delete custom fee in cart 
    deleteExtentionCustomFee(data) {
        try {
            var id = "Extension"
            //var id = data.customFee.id;
            var removeprice = 0;
            var tax = 0;
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            cartlist = cartlist == null ? [] : cartlist;
            var lastExtId = "";
            cartlist.length > 0 && cartlist.map((items, index) => {
                if (items.custom_fee_id == id) {
                    lastExtId = items;

                }
            })
            if (lastExtId !== "") {
                removeprice = lastExtId.Price;
                cartlist.splice(cartlist.lastIndexOf(lastExtId), 1);
            }

            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                var subTotal = parseFloat(parseFloat(list.subTotal) - parseFloat(removeprice)).toFixed(2);
                tax = this.getExtentionFeeTax(removeprice)
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: parseFloat(Number(subTotal) + Number(list.tax)) - parseFloat(tax),
                    discountCalculated: list.discountCalculated,
                    tax: parseFloat(list.tax) - parseFloat(tax),
                    subTotal: subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                this.props.dispatch(checkoutActions.getAll(CheckoutList));
            }
        } catch (error) {
            console.error('App Error : ', error);
        }

    }
    // Created by :Shakuntala Jatav
    // Description : calculate tax of extention fee tax 
    getExtentionFeeTax = (price) => {
        try {
            var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
            var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
            var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : null;
            var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
            var tax_rate = 0;
            if (TaxRate && TaxRate.length > 0) {
                TaxRate.map(addTax => {
                    if (addTax.check_is == true) {
                        if (apply_defult_tax == "true") {
                            tax_rate += parseFloat(addTax.TaxRate);
                        }
                        if (apply_defult_tax == "false") {
                            tax_rate += parseFloat(addTax.TaxRate);
                        }
                    }
                })
            }
            var exclusiveTax = 0;
            exclusiveTax = parseFloat((parseFloat(price) * tax_rate) / 100);
            return exclusiveTax
        } catch (error) {
            console.error('App Error : ', error);
        }
    }
    ////////////////priyanka ////////////////////////////
    // Updated by :Shakuntala Jatav
    // Updated Date: 23-07-2019
    // Description : create and update custom fee data by key
    addExtentionCustomFee(extcustomfee) {
        try {
            this.setState({isLoading:true})
            const { active_true_diamond } = this.state;
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            cartlist = cartlist == null ? [] : cartlist;
            var extens = extcustomfee && extcustomfee.customFee;
            var true_dimaond_field = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
            var active_true_diamond_field = active_true_diamond !== 'false' ? true_dimaond_field.find(Items => `true_${Items.Id}` == active_true_diamond) : '';
            var new_title = extens.key;
            var new_array = [];
            var data = '';
            var customTags = 'Extension(' + active_true_diamond_field.Name + ')';
            var tax = this.getExtentionFeeTax(extens.amount);
            var old_tax = 0;
            var old_Price = 0;
            var taxType = typeOfTax()
            if (cartlist.length > 0) {
                cartlist.map(item => {
                    if (typeof item.custom_fee_id) {
                        if (item.Price !== null) {
                            new_array.push(item)
                        }
                    }
                })
            }

            if (parseFloat(extens.amount) > 0) {
                if (new_array.length > 0) {
                    var matchData = new_array.find(item => item.custom_fee_id == new_title);
                    if (matchData) {
                        cartlist.map(item => {
                            if (matchData.custom_fee_id == item.custom_fee_id) {
                                old_tax = item.tax;
                                old_Price = item.Price
                                item['Price'] = parseFloat(extens.amount)
                            }
                        })
                    }
                    if (!matchData) {
                        data = {
                            Title: new_title,
                            Price: parseFloat(extens.amount),
                            custom_fee_id: new_title,
                            tax: tax,
                            customExtFee: customTags,
                            TaxClass: "",
                            TaxStatus: "taxable",
                            isTaxable: true,
                            excl_tax: taxType !== 'incl' ? tax : 0,
                            incl_tax: taxType == 'incl' ? tax : 0,
                            old_price: parseFloat(extens.amount),
                            quantity: 1

                        }
                    }
                } else {
                    data = {
                        Title: new_title,
                        Price: parseFloat(extens.amount),
                        custom_fee_id: new_title,
                        tax: tax,
                        customExtFee: customTags,
                        TaxClass: "",
                        TaxStatus: "taxable",
                        isTaxable: true,
                        excl_tax: taxType !== 'incl' ? tax : 0,
                        incl_tax: taxType == 'incl' ? tax : 0,
                        old_price: parseFloat(extens.amount),
                        quantity: 1
                    }
                }
            }
            if (data !== "") {
                cartlist.push(data)
            }
            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                var _price = 0;
                var _tax = 0
                cartlist.map(items => {
                    if (items.Price) {
                        _price += parseFloat(items.Price);
                        _tax +=items.excl_tax+items.incl_tax;                        
                    }
                })
                //_tax = this.getExtentionFeeTax(_price);      //this commented due to calculate whole tax not on the basis of the product taxClass basis

                var dataPrice = data ? data.Price : extens.amount;
                var subTotal = parseFloat(parseFloat(list.subTotal) + parseFloat(dataPrice) - parseFloat(old_Price)).toFixed(2);
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: _price + (taxType == 'incl' ? 0 : _tax) - (list.discountCalculated),
                    discountCalculated: list.discountCalculated,
                    tax: _tax,
                    subTotal: subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                this.props.dispatch(checkoutActions.getAll(CheckoutList));
                this.setState({checkList:CheckoutList})
               // window.location = "/checkout";
               setTimeout(() => {
                this.setState({isLoading:false})
               }, 500);
              
            }
        } catch (error) {
            console.error('App Error : ', error);
        }
    }

    extensionFinished(wordpressAction) {
        try {
            const { clientDataDictionary } = this.state;
            var wordPress = new Object();
            wordPress["wordpress"] = {};
            wordPress["wordpress"]["action"] = wordpressAction;
            wordPress["wordpress"]["data"] = clientDataDictionary;
            this.setState({ orderType: wordPress })
        } catch (error) {
            console.error('App Error : ', error);
        }
    }

    addData(data) {
        try {
            const { clientDataDictionary } = this.state;
            for (var key in data) {
                clientDataDictionary[key] = data[key];
            }
            this.setState({ orderType: clientDataDictionary })
        } catch (error) {
            console.error('App Error : ', error);
        }
    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 19-07-2019
    // Description : check for true diamond field is active or not
    activeTrueDiamond(status) {
        if (status === "false") {
            this.setState({
                toggleExtentionStatus: ""
            })
        }
        this.setState({
            active_true_diamond: status,
        })
    }
    // Updated by :Shakuntala Jatav
    // Cerated Date: 22-07-2019
    // Description : for set state of state list
    setCountryToStateList(country_code, state_code) {
        var count_code = '';
        var finalStatelist = [];
        this.state.getCountryList && this.state.getCountryList.find(function (element) {
            if (element.Code == country_code || element.Name == country_code || (element.Name !== null && element.Name.replace(/[^a-zA-Z]/g, ' ') == country_code)) {
                count_code = element.Code
            }
        })
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Country == count_code) {
                finalStatelist.push(element)
            } else if (element.Country == country_code) {
                finalStatelist.push(element)
            }
        })
        if (finalStatelist.length > 0) {
            this.setState({
                viewStateList: finalStatelist
            })
        }
    }

    changeComponent(component_name) {
        this.setState({
            activeComponent: component_name
        })
    }
  
    handleNote() {
        var txtNote = jQuery("#orderInstrucions").val();
        jQuery("#orderInstrucions").val('');
        if (typeof txtNote!="undefined" && txtNote != "") {
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
            cartlist = cartlist == null ? [] : cartlist;
            cartlist.push({ "Title": txtNote })
            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
                this.setState({ checkList: CheckoutList })
            }
            
        }
    }
    
    selfcheckoutstatusmanagingevnt(checkoutstatus) {
        this.handleNote();
        if (checkoutstatus == "defaultcheckout") {
            this.setState({
                SelfCheckoutStatus: checkoutstatus
            })
            // if (isMobileOnly == true) {
            //     history.push('../SelfCheckoutView');
            // }
            // else {
            //     localStorage.removeItem("isListner");
            //     window.location = '../SelfCheckoutView';
            // }
        }
        else {
            this.setState({
                SelfCheckoutStatus: checkoutstatus
            })
        }
    }

    validateNote(e) {
        var value = (e.target.value).trim();
        if (value.length > 0) {
            this.setState({ activeNoteButton: true })
        } else {
            this.setState({ activeNoteButton: false })
        }
    }

    // add Customer shiping adderess to the customerAdderess extension
    addCustomerAddress = (data) => {
        try {
            var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
            var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            var billingAddress = ''
            var shippingAddress = ''
            var customerId = ''
            if (checkList && checkList !== 'undefined' && checkList.customerDetail && checkList.customerDetail !== 'null' && checkList.customerDetail.content) {
                var address = checkList.customerDetail.content && checkList.customerDetail.content.customerAddress
                billingAddress = address && address.find(cust => cust.TypeName == 'billing')
                shippingAddress = address && address.find(cust => cust.TypeName == 'shipping')
                customerId = checkList.customerDetail.content.ASPId
            }
            else {
                billingAddress = {
                    "CustomerId": '',
                    "Customer": null,
                    "Type": 0,
                    "Position": 1,
                    "FirstName": user && user.display_name,
                    "LastName": "",
                    "Company": "",
                    "Address1": user && user.shop_address1,
                    "Address2": user && user.shop_address2,
                    "City": user && user.shop_city,
                    "State": user && user.shop_state,
                    "PostCode": "",
                    "Country": user && user.shop_country,
                    "Email": user && user.user_email,
                    "Phone": user && user.user_phone,
                    "TypeName": "billing",
                    "CreatedOn": "",
                    "CreatedBy": null,
                    "ModifiedOn": null,
                    "ModifiedBy": null,
                    "DeletedOn": null,
                    "DeletedBy": null,
                    "Id": '',
                    "IsDeleted": false
                }
            }

            var clientJSON =
            {
                oliverpos:
                {
                    event: "customerAddress"
                },
                data:
                {
                    customer_id: customerId,
                    invoice_address: billingAddress,
                    shipping_address: shippingAddress,
                }
            };
            return iframex.postMessage(JSON.stringify(clientJSON), '*');
        } catch (error) {
            console.error('App Error : ', error);
        }
    }

    // payment extension

    // get extension pageUrl and hostUrl of current clicked extension on pay,ment section 
    handleExtensionPaymentClick = (ext_id) => {
        // get host and page url from common fucnction   
        if(this.state.extensionIframe==false && this.state.extbuttonClicked==false){ //check for bouble button clicked 
            this.state.extbuttonClicked=true;   
        var data = getHostURLsBySelectedExt(ext_id)
        this.setState({
            extensionIframe: true,
            extHostUrl: data ? data.ext_host_url : '',
            extPageUrl: data ? data.ext_page_url : '',
            extName: data ? data.ext_name : '',
            extLogo: data ? data.ext_logo : ''
        })
        setTimeout(() => {
            showModal('common_ext_popup');
            //For selfchcekout wrapper app
            // if(ActiveUser.key.isSelfcheckout == true)
            // {
            //     this.extension_pay_selfcheckout();
            // }
            //---------
            //showModal('common_app_popup')
        }, 200);
        setTimeout(() => { //enabled after 2 second
            this.state.extbuttonClicked=false;  
        }, 2000);
    }
    }

    close_ext_modal = () => {
        this.setState({ extensionIframe: false })
        hideModal('common_ext_popup')
    }
   //For selfchcekout wrapper app
    extension_pay_selfcheckout()
    {
            var checkCartList = this.props.checkoutlist ? this.props.checkoutlist : localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST')) ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
            const { checkList } = this.state;            
            var extentionTotal = checkList && checkList.totalPrice ? checkList.totalPrice : 0;
            var extentionCustomerDetail = checkList && checkList.customerDetail && checkList.customerDetail.content ? checkList.customerDetail.content : '';
            var extentionProductTax = checkCartList ? checkCartList.tax : checkList && checkList.tax ? checkList.tax : '';
            this.ExtentionCartDataEvent(extentionCustomerDetail, extentionProductTax, extentionTotal, checkCartList);
            console.log("selfcheckout","clientExtensionData",clientExtensionData)
            if(clientExtensionData && clientExtensionData !=""){
                this.sendMessageToExtention(JSON.stringify(clientExtensionData));
            }
    }
    //For selfchcekout wrapper app
    ExtentionCartDataEvent(CustomerDetail, extentionProductTax, totalAmount, chekoutData) {
        const { countryName, stateName, countryCode, stateCode } = this.state;
        var products = this.productParameter();
        var _wc_points_redeemed = chekoutData && chekoutData._wc_points_redeemed ? chekoutData._wc_points_redeemed : 0
        var _addressLine1 = "";
        var _addressLine2 = "";
        var _city = "";
        var _zip = "";
        var _country = "";
        var _state = "";
        var _email = CustomerDetail ? CustomerDetail.Email : "";
        var _customerId = CustomerDetail ? CustomerDetail.UID : "";
        if (CustomerDetail) {
            if (CustomerDetail.customerAddress) {
                if (CustomerDetail.customerAddress.length > 0) {
                    var customerAddress = CustomerDetail.customerAddress ? CustomerDetail.customerAddress.find(Items => Items.TypeName == "billing") : '';
                    _addressLine1 = customerAddress ? customerAddress.Address1 : '';
                    _addressLine2 = customerAddress ? customerAddress.Address2 : '';
                    _city = customerAddress ? customerAddress.City : '';
                    _zip = customerAddress ? customerAddress.PostCode : '';
                    _country = customerAddress ? customerAddress.Country : '';
                    _state = customerAddress ? customerAddress.State : '';

                }
            } else {
                _addressLine1 = CustomerDetail ? CustomerDetail.StreetAddress : '';
                _addressLine2 = CustomerDetail ? CustomerDetail.StreetAddress2 : '';
                _city = CustomerDetail ? CustomerDetail.City : '';
                _zip = CustomerDetail ? CustomerDetail.Pincode : '';
                _country = CustomerDetail ? CustomerDetail.Country : '';
                _state = CustomerDetail ? CustomerDetail.State : '';

            }
        }

        if (!countryCode && _country !== "") {
            this.getCountryAndStateName(_state, _country);
        }
       
        var clientJSON =
        {
            oliverpos:
            {
                event: "shareCheckoutData"
            },
            data:
            {
                checkoutData:
                {
                    "email": _email,
                    "wordpressId": _customerId,
                    "totalTax": extentionProductTax,
                    "cartProducts": products,
                    "addressLine1": _addressLine1,
                    "addressLine2": _addressLine2,
                    "city": _city,
                    "zip": _zip,
                    "countryCode": countryCode,
                    "country": countryName,
                    "stateCode": stateCode,
                    "state": stateName,
                    "total": totalAmount,
                    "_wc_points_redeemed": _wc_points_redeemed
                },
            }
        };

        // Make sure you are sending a string, and to stringify JSON
        clientExtensionData = clientJSON;
        console.log("clientJSON--", clientExtensionData)
    }
    //For selfchcekout wrapper app
    productParameter() {
        var checkList = this.props.checkoutlist ? this.props.checkoutlist : localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST')) ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
        var listItems = checkList ? checkList.ListItem : this.state.checkList && this.state.checkList.ListItem;
        //var listItems =  this.state.checkList && this.state.checkList.ListItem;
        var itemsForExtention = [];
        listItems && listItems.length > 0 && listItems.map(items => {
            if (items.product_id) {
                itemsForExtention.push({
                    "amount": items.Price,
                    "productId": items.product_id,
                    "variationId": items.variation_id,
                    "tax": (items.excl_tax + items.incl_tax),
                    "discountAmount": items.discount_amount,
                    "quantity": items.quantity,
                    "title": items.Title
                })
            }
        })
        return itemsForExtention;
    }
    //For selfchcekout wrapper app
    sendMessageToExtention = (msg)=> {
        //console.log("call sendMessage to extension",msg)
        //this.extensionReady();
        var iframex =undefined;

        //if(this.state.extensionIframe == true){
             iframex = document.getElementById("commoniframe") && document.getElementById("commoniframe").contentWindow;
        // }else{
        //      iframex = document.getElementById("iframeid") && document.getElementById("iframeid").contentWindow;
        // }
        if(iframex){
            console.log("post msg from oliver:",msg)
            iframex.postMessage(msg, '*');//_user.instance
        }        
        else
        console.log("iframe issue")

        this.extensionReady(false);
    }

    /** 
   * Created By:priyanka
   * Created Date:8/7/2019
   * CustomerViewEdit  popup   is used to   update customer detail   
   */
    render() {
        const { isShowLoader, store_credit, total_price, change_amount, after_payment_is, cash_payment, checkList, paying_amount, paying_type, isLoading, Street_Address, Street_Address2, city, PhoneNumber, Email, FirstName, LastName, Notes, Pincode, cash_round, toggleExtentionStatus, active_true_diamond, updateStoreCreditPayment, amountStoreCreditPayment, typeStoreCreditPayment, common_Msg, extensionReadyToPost, countryName, stateName, country_code, state_code, activeComponent, activeNoteButton, AllProductList } = this.state;
        const { shop_order } = this.props;
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        return (
            // (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true) ?
            //     <div><CheckoutViewThird SelfCheckoutStatus={this.state.SelfCheckoutStatus}
            //         selfcheckoutstatusmanagingevnt={this.selfcheckoutstatusmanagingevnt}
            //         env_type={this.state.envFocus} updateStoreCreditPayment={this.updateStoreCreditPayment}
            //         InactiveStoreCredit={updateStoreCreditPayment} amountStoreCreditPayment={amountStoreCreditPayment}
            //         typeStoreCreditPayment={typeStoreCreditPayment} active_true_diamond={active_true_diamond}
            //         toggleExtentionStatus={toggleExtentionStatus} autoFocus={this.autoFocus} storeCredit={store_credit}
            //         paymentType={this.paymentType} extraPayAmount={this.extraPayAmount} onRef={ref => (this.orderPayments = ref)}
            //         {...this.props} checkList={checkList} addPayment={this.getPayment} setOrderPartialPayments={this.setOrderPartialPayments}
            //         orderPopup={this.openOrderPopup} 
            //         handleExtensionPaymentClick={this.handleExtensionPaymentClick}
            //         showExtIframe={this.state.extensionIframe}
            //         />
            //         {(typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?
            //         <CommonExtensionPopup
            //         showExtIframe={this.state.extensionIframe}
            //         close_ext_modal={this.close_ext_modal}
            //         extHostUrl={this.state.extHostUrl}
            //         extPageUrl={this.state.extPageUrl}
            //     />:null}
            //     </div>
            //     :
                (ActiveUser.key.isSelfcheckout == true && this.state.SelfCheckoutStatus == "defaultcheckout") ?
                    <CheckoutViewFirst
                        onRef={ref => (this.orderCart = ref)}
                        checkList={localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))}
                        paying_amount={paying_amount}
                        paying_type={paying_type}
                        SelfCheckoutStatus={this.state.SelfCheckoutStatus}
                        setCalculatorRemainingprice={this.setCalculatorRemainingprice}
                        cash_round={cash_round}
                        changeComponent={this.changeComponent}
                        activeComponent={this.state.activeComponent}
                        selfcheckoutstatusmanagingevnt={this.selfcheckoutstatusmanagingevnt} />
                    :
                    (ActiveUser.key.isSelfcheckout == true && this.state.SelfCheckoutStatus == "sfcheckoutpayment") ?
                        <React.Fragment><CheckoutViewThird SelfCheckoutStatus={this.state.SelfCheckoutStatus}
                            selfcheckoutstatusmanagingevnt={this.selfcheckoutstatusmanagingevnt}
                            env_type={this.state.envFocus} updateStoreCreditPayment={this.updateStoreCreditPayment}
                            InactiveStoreCredit={updateStoreCreditPayment} amountStoreCreditPayment={amountStoreCreditPayment}
                            typeStoreCreditPayment={typeStoreCreditPayment} active_true_diamond={active_true_diamond}
                            toggleExtentionStatus={toggleExtentionStatus} autoFocus={this.autoFocus} storeCredit={store_credit}
                            paymentType={this.paymentType} extraPayAmount={this.extraPayAmount} onRef={ref => (this.orderPayments = ref)}
                            {...this.props} checkList={localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))} addPayment={this.getPayment} setOrderPartialPayments={this.setOrderPartialPayments}
                            orderPopup={this.openOrderPopup}
                            handleExtensionPaymentClick={this.handleExtensionPaymentClick} 
                            showExtIframe={this.state.extensionIframe}/>
                            {/* {(typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)? */}
                            {/* <div className="cover hide"></div> */}
                            <CommonExtensionPopup
                    showExtIframe={this.state.extensionIframe}
                    close_ext_modal={this.close_ext_modal}
                    extHostUrl={this.state.extHostUrl}
                    extPageUrl={this.state.extPageUrl}
                    extName={this.state.extName}
                    extLogo={this.state.extLogo}
                />
                {/* :null} */}
                </React.Fragment>
                        :
                        (isMobileOnly == true) ?
                            <div>
                                {isShowLoader == true || isLoading == true ? <AndroidAndIOSLoader /> : ''}
                                {activeComponent == "checkout_first" || activeComponent == "notes" ?
                                    <CheckoutViewFirst
                                        onRef={ref => (this.orderCart = ref)}
                                        checkList={checkList}
                                        paying_amount={paying_amount}
                                        paying_type={paying_type}
                                        setCalculatorRemainingprice={this.setCalculatorRemainingprice}
                                        cash_round={cash_round}
                                        changeComponent={this.changeComponent}
                                        activeComponent={this.state.activeComponent}
                                    />
                                    : activeComponent == "checkout_second" ?
                                        <CheckoutViewSecond
                                            extensionReady={this.extensionReady}
                                            extensionReadyToPost={extensionReadyToPost}
                                            updateStoreCreditPayment={this.updateStoreCreditPayment}
                                            activeTrueDiamond={this.activeTrueDiamond}
                                            showExtention={this.showExtention}
                                            paymentType={this.paymentType}
                                            extraPayAmount={this.extraPayAmount}
                                            edit_status={this.edit_status}
                                            {...this.props}
                                            addPayment={this.layAwayPayment}
                                            getPayment={this.getPayment}
                                            orderPopup={this.openOrderPopup}
                                            setOrderPartialPayments={this.setOrderPartialPayments}
                                            customerData={this.state.customerData}
                                            countryName={countryName}
                                            stateName={stateName}
                                            countryCode={country_code}
                                            stateCode={state_code}
                                            activeComponent={activeComponent}
                                            changeComponent={this.changeComponent}
                                            getCountryAndStateName={this.getCountryAndStateName}
                                            extensionIframe={this.state.extensionIframe}                                          
                                        />
                                        :
                                        (activeComponent == "park_sale" || activeComponent == "lay_away") ?
                                            <ParkAndLayaway
                                                LocalizedLanguage={LocalizedLanguage}
                                                onClick={() => this.placeParkLayAwayOrder()}
                                                shop_order={shop_order}
                                                {...this.state}
                                                validateNote={this.validateNote}
                                            />
                                            :
                                            activeComponent == "edit_customer" ?
                                                <CustomerEdit
                                                    onClick={() => this.handleSubmit()}
                                                    onChange={this.handleChange}
                                                    Street_Address={Street_Address ? Street_Address : ''}
                                                    city={city ? city : ''}
                                                    PhoneNumber={PhoneNumber ? PhoneNumber : ''}
                                                    FirstName={FirstName ? FirstName : ''}
                                                    LastName={LastName ? LastName : ''}
                                                    Email={Email ? Email : ''}
                                                    Notes={Notes ? Notes : ''}
                                                    Pincode={Pincode ? Pincode : ''}
                                                    getCountryList={this.state.getCountryList}
                                                    getState={this.state.viewStateList ? this.state.viewStateList : ''}
                                                    Street_Address2={this.state.Street_Address2 ? this.state.Street_Address2 : ''}
                                                    country_name={this.state.country_code ? this.state.country_code : ''}
                                                    state_name={this.state.state_code ? this.state.state_code : ''}
                                                    onChangeList={this.handleChangeList}
                                                    onChangeStateList={this.onChangeStateList}
                                                    Cust_ID={this.state.user_id}
                                                    onClick1={() => this.closeModal()}
                                                    Header={Header}
                                                    LocalizedLanguage={LocalizedLanguage}
                                                />
                                                :
                                                activeComponent == "add_note" ?
                                                    <CustomerNote
                                                        changeComponent={this.changeComponent}
                                                        type="checkout"
                                                    />
                                                    :
                                                    activeComponent == "add_fee" ?
                                                        <CustomerAddFee
                                                            changeComponent={this.changeComponent}
                                                            type="checkout"
                                                        />
                                                        : <CheckoutViewThird
                                                            env_type={this.state.envFocus}
                                                            updateStoreCreditPayment={this.updateStoreCreditPayment}
                                                            InactiveStoreCredit={updateStoreCreditPayment}
                                                            amountStoreCreditPayment={amountStoreCreditPayment}
                                                            typeStoreCreditPayment={typeStoreCreditPayment}
                                                            active_true_diamond={active_true_diamond}
                                                            toggleExtentionStatus={toggleExtentionStatus}
                                                            autoFocus={this.autoFocus}
                                                            storeCredit={store_credit}
                                                            paymentType={this.paymentType}
                                                            extraPayAmount={this.extraPayAmount}
                                                            onRef={ref => (this.orderPayments = ref)}
                                                            {...this.props}
                                                            checkList={checkList}
                                                            addPayment={this.getPayment}
                                                            setOrderPartialPayments={this.setOrderPartialPayments}
                                                            orderPopup={this.openOrderPopup}
                                                            changeComponent={this.changeComponent}
                                                            activeComponent={activeComponent}
                                                            msg_text={common_Msg}
                                                            close_Msg_Modal={this.closeExtraPayModal}
                                                            voidSale={() => this.cancel_VoidSale()}
                                                            handleExtensionPaymentClick={this.handleExtensionPaymentClick}
                                                            showExtIframe={this.state.extensionIframe}
                                                        />}
                                <ReturnCashPopup
                                    closeModal={this.closeModal}
                                    {...this.state}
                                    RoundAmount={RoundAmount}
                                    NumberFormat={NumberFormat}
                                    finalAdd={this.finalAdd}
                                    LocalizedLanguage={LocalizedLanguage}
                                />
                                <OrderNotCreatePopupModel errOnPlaceOrder={this.state.errOnPlaceOrder} statusUpdate={(text) => { this.statusUpdate(text) }} />
                                {(typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?<CommonExtensionPopup
                                    showExtIframe={this.state.extensionIframe}
                                    close_ext_modal={this.close_ext_modal}
                                    extHostUrl={this.state.extHostUrl}
                                    extPageUrl={this.state.extPageUrl}
                                />:null}
                            </div>
                            :
                            <div >
                                <div className="wrapper" style={{pointerEvents: this.state.appLock && this.state.appLock==true ?'none':'all'}}>
                                    <div id="content" >
                                        {isShowLoader == true || isLoading == true ? <LoadingModal /> : ''}
                                        <CommonHeaderFirst {...this.props} void_sale={localStorage.getItem("VOID_SALE")} 
                                        />
                                        <div className="inner_content bg-light-white clearfix">
                                            <div className="content_wrapper">
                                                <CheckoutViewFirst selfcheckoutCart="true" onRef={ref => (this.orderCart = ref)} checkList={checkList} paying_amount={paying_amount}
                                                    paying_type={paying_type} setCalculatorRemainingprice={this.setCalculatorRemainingprice} cash_round={cash_round}
                                                    AllProductList={AllProductList} />
                                                <div className="col-lg-9 col-sm-8 col-xs-8">
                                                    <div className="row">
                                                        <CheckoutViewSecond getCountryAndStateName={this.getCountryAndStateName} extensionReady={this.extensionReady} extensionReadyToPost={extensionReadyToPost} updateStoreCreditPayment={this.updateStoreCreditPayment} activeTrueDiamond={this.activeTrueDiamond} showExtention={this.showExtention} paymentType={this.paymentType} extraPayAmount={this.extraPayAmount} edit_status={this.edit_status} {...this.props} addPayment={this.layAwayPayment} getPayment={this.getPayment} orderPopup={this.openOrderPopup} setOrderPartialPayments={this.setOrderPartialPayments} customerData={this.state.customerData} countryName={countryName} stateName={stateName} countryCode={country_code} stateCode={state_code}
                                                            extensionIframe={this.state.extensionIframe} />
                                                        <CheckoutViewThird env_type={this.state.envFocus} updateStoreCreditPayment={this.updateStoreCreditPayment}
                                                            InactiveStoreCredit={updateStoreCreditPayment} amountStoreCreditPayment={amountStoreCreditPayment}
                                                            typeStoreCreditPayment={typeStoreCreditPayment} active_true_diamond={active_true_diamond}
                                                            toggleExtentionStatus={toggleExtentionStatus} autoFocus={this.autoFocus} storeCredit={store_credit}
                                                            paymentType={this.paymentType} extraPayAmount={this.extraPayAmount} onRef={ref => (this.orderPayments = ref)}
                                                            {...this.props} checkList={checkList} addPayment={this.getPayment} setOrderPartialPayments={this.setOrderPartialPayments}
                                                            orderPopup={this.openOrderPopup}
                                                            payWithRedeemPoints={this.state.payWithRedeemPoints}
                                                            handleExtensionPaymentClick={this.handleExtensionPaymentClick}
                                                            appLock={this.state.appLock}
                                                            showExtIframe={this.state.extensionIframe}
                                                        />
                                                        {/* enterManualCard={this.enterManualCard} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* add connect your shop button for guest user */}
                                        {/* {isDemoUser && (isDemoUser == 'true' || isDemoUser == true) &&
                                            <CommonDemoShopButton />
                                        } */}
                                    </div>
                                </div>
                                <div id="edit-info-checkout" className="modal modal-wide fade full_height_one disabled_popup_edit_close"
                                style={{pointerEvents: this.state.appLock && this.state.appLock==true ?'none':'all'}} >
                                    <CustomerViewEdit
                                        onClick={() => this.handleSubmit()}
                                        onChange={this.handleChange}
                                        Street_Address={Street_Address ? Street_Address : ''}
                                        city={city ? city : ''}
                                        PhoneNumber={PhoneNumber ? PhoneNumber : ''}
                                        FirstName={FirstName ? FirstName : ''}
                                        LastName={LastName ? LastName : ''}
                                        Email={Email ? Email : ''}
                                        Notes={Notes ? Notes : ''}
                                        Pincode={Pincode ? Pincode : ''}
                                        //submitted={submitted}
                                        getCountryList={this.state.getCountryList}
                                        getState={this.state.viewStateList ? this.state.viewStateList : ''}
                                        Street_Address2={this.state.Street_Address2 ? this.state.Street_Address2 : ''}
                                        country_name={this.state.country_code ? this.state.country_code : ''}
                                        state_name={this.state.state_code ? this.state.state_code : ''}
                                        onChangeList={this.handleChangeList}
                                        onChangeStateList={this.onChangeStateList}
                                        Cust_ID={this.state.user_id}
                                        onClick1={() => this.closeModal()} />
                                </div>
                                {/* this modal used for showing park sale note */}
                                <div tabIndex="-1" className="modal fade in mt-5 modal-wide addnoctehere" id="park-sale-and-layaway-modal" data-status="park_sale" role="dialog">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header bb-0">
                                                <button type="button" className="close opacity-1 mt-1" data-dismiss="modal" aria-hidden="true">
                                                    <img src="../assets/img/Close.svg" />
                                                </button>
                                                <h1 className="modal-title" id="park-sale-and-layaway-modal-title">{LocalizedLanguage.addNote}</h1>
                                            </div>
                                            <div className="modal-body p-0">
                                                <textarea className="form-control modal-txtArea" id="park-sale-and-layaway-modal-note" onChange={(e) => this.validateNote(e)} placeholder={LocalizedLanguage.placeholderNote}></textarea>
                                            </div>
                                            <div className="modal-footer p-0 b-0">
                                                {(activeNoteButton == true) ?
                                                    <button onClick={() => this.placeParkLayAwayOrder()} type="button" className="btn btn-primary btn-block btn-primary-cus pt-2 pb-2">{LocalizedLanguage.saveAndClose}</button>
                                                    :
                                                    <button disabled type="button" className="btn btn-primary btn-block btn-primary-cus pt-2 pb-2">{LocalizedLanguage.saveAndClose}</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* this modal used for showing park sale note */}
                                <div id="popup_cash_rounding" className="modal modal-wide modal-wide1 cancle_payment disabled_popup_close">
                                    <div className="modal-dialog" id="dialog-midle-align">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" onClick={() => this.closeModal()} className="close" data-dismiss="modal" aria-hidden="true">
                                                    <img src="../assets/img/Close.svg" />
                                                </button>
                                                <h4 className="modal-title">{LocalizedLanguage.cash}</h4>
                                            </div>
                                            <div className="modal-body p-0">
                                                <h3 className="popup_payment_error_msg" id="popup_cash_rounding_error_msg">
                                                    <div className="row font18 mb-3">
                                                        <div className="col-sm-6 text-left">
                                                            {LocalizedLanguage.total}
                                                            <span className="pull-right">: </span>
                                                        </div>
                                                        <div className="col-sm-6"><NumberFormat value={total_price == 0 ? checkList && parseFloat(RoundAmount(checkList.totalPrice + cash_round)) - after_payment_is : total_price - after_payment_is} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row font18">
                                                        <div className="col-sm-6 text-left">{LocalizedLanguage.paymentCash}
                                                            <span className="pull-right">:</span>
                                                        </div>
                                                        <div className="col-sm-6"><NumberFormat value={RoundAmount(cash_payment)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                                    </div> <hr />
                                                    <div className="row font18">
                                                        <div className="col-sm-6 text-left">{LocalizedLanguage.change}
                                                            <span className="pull-right">:</span>
                                                        </div>
                                                        <div className="col-sm-6"><NumberFormat value={RoundAmount(change_amount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                                    </div>
                                                    <hr />
                                                    <div className="row font18">
                                                        <div className="col-sm-6 text-left">{LocalizedLanguage.balance}
                                                            <span className="pull-right">:</span>
                                                        </div>
                                                        <div className="col-sm-6" id="balance_left"> <NumberFormat value='0.00' displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                                    </div>
                                                </h3>
                                            </div>
                                            <div className="modal-footer" style={{ borderTop: 0 }} onClick={() => this.finalAdd()}>
                                                <button type="button" className="btn btn-primary btn-block h66" style={{ height: 70 }} data-dismiss="modal" aria-hidden="true" id="popup_cash_rounding_button">{LocalizedLanguage.addPayment}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CustomerNote />
                                <CustomerAddFee />
                                <CommonMsgModal msg_text={common_Msg} close_Msg_Modal={this.closeExtraPayModal} />
                                {/* <ManualCardpopupModal /> */}
                                <CommonConfirmationPopup msg_text={this.state.commonConfirmBoxMsg} close_confirm_modal={this.closeRedeemConfirmationModal} okClick={this.paymentWithRedeemPoints} />                    <DiscountMsgPopup />
                                <div id="popup_void_sale" className="modal modal-wide modal-wide1 cancle_payment fade">
                                    <div className="modal-dialog" id="dialog-midle-align">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                                    <img src="../assets/img/Close.svg" />
                                                </button>
                                                <h4 className="modal-title"></h4>
                                            </div>
                                            <div className="modal-body p-0">
                                                <h3 className="popup_payment_error_msg">{LocalizedLanguage.voidSaleMsg}</h3>
                                            </div>
                                            <div className="modal-footer" style={{ borderTop: 0 }}>
                                                <button type="button" className="btn btn-primary btn-block h66" style={{ backgroundColor: '#d43f3a', borderRadius: 5, height: 70, borderColor: '#d43f3a' }} id="addDiscount" data-dismiss="modal" aria-hidden="true" onClick={() => this.cancel_VoidSale()}>{LocalizedLanguage.voidSale}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CommonExtensionPopup
                                    showExtIframe={this.state.extensionIframe}
                                    close_ext_modal={this.close_ext_modal}
                                    extHostUrl={this.state.extHostUrl}
                                    extPageUrl={this.state.extPageUrl}
                                />
                                {/* <CommonAppPopup 
                                 showExtIframe={this.state.extensionIframe}
                                 close_ext_modal={this.close_ext_modal}
                                 extHostUrl={this.state.extHostUrl}
                                 extPageUrl={this.state.extPageUrl}
                                 /> */}
                                <OrderNotCreatePopupModel errOnPlaceOrder={this.state.errOnPlaceOrder} statusUpdate={(text) => { this.statusUpdate(text) }} />
                                <OnBoardingAllModal />
                                <GroupSaleModal />
                            </div>
        )
    }
}

function mapStateToProps(state) {
    const { checkoutlist, checkout_list, shop_order, single_cutomer_list, global_payment, cartproductlist, customer_save_data } = state;
    return {
        checkoutlist: checkoutlist.items,
        checkout_list: checkout_list.items,
        shop_order: shop_order,
        single_cutomer_list: single_cutomer_list.items,
        global_payment: global_payment.items,
        cartproductlist: cartproductlist.cartproductlist,
        customer_save_data: customer_save_data
    };
}
const connectedCheckoutView = connect(mapStateToProps)(CheckoutView);
export { connectedCheckoutView as CheckoutView };