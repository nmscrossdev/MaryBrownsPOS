import React from 'react';
import { connect } from 'react-redux';
import { GetRoundCash } from '../Checkout';
import { LoadingModal, NavbarPage, CommonHeader, AndroidAndIOSLoader,CommonMsgModal } from '../../_components';
import { get_UDid } from '../../ALL_localstorage';
import { CardPayment, CashPayment, GlobalPayment, OtherPayment, NormalKeypad, StripePayment } from '../../_components/PaymentComponents';
import ActiveUser from '../../settings/ActiveUser';
import { checkoutActions } from '../';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import Footer from '../../_components/views/m.Footer';
import WarningMessage from '../../_components/views/m.WarningMessage';
import { isMobileOnly } from "react-device-detect";
import { RoundAmount } from "../../_components/TaxSetting";
import { GTM_oliverOrderPayment } from '../../_components/CommonfunctionGTM';
import CardpaymentRes from '../../SelfCheckout/components/CheckoutPage/cardpaymentRes';
import { history } from '../../_helpers'
import { trackOliverOrderPayment } from '../../_components/SegmentAnalytic'
import { ManualPayment } from '../../_components/PaymentComponents/ManualPayment';
import paymentsType from '../../settings/PaymentsType'
import { UPIPayments } from '../../_components/PaymentComponents/UPIPayments';
// import '../../../assets/css_new/Pagewise.css'
//import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
var cash_rounding = ActiveUser.key.cash_rounding;

class CheckoutViewThird extends React.Component {
    constructor(props) {
        super(props);
        const getRemainingPrice = this.getRemainingPrice();
        this.state = {
            payingAmount: 0,
            emptyPaymentFlag: true,
            checkList: null,
            paidAmount: getRemainingPrice ? parseFloat(RoundAmount(getRemainingPrice)).toFixed(2) : 0,
            CashRound: '',
            paymentType: '',
            paidAmountStatus: false,
            isFirstKeyPressed: true,
            paymentTypeName: (typeof localStorage.getItem('PAYMENT_TYPE_NAME') !== 'undefined') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : null,
            isPaymentStart: false,
            loading: false,
            globalPayments: '',
            closingTab: false,
            activeDisplay: false,
            activeForCash: false,
            activeCashSplitDiv: false,
            activeCashItems: "",
            activeGlobalSplitDiv: false,
            activeGlobalItems: "",
            landingScreen: '',
            onlinePayments: '',
            onlinePayCardData: '',
            //IsPaymentButtonClicked:false
        }
    }
    OpenPxtensionPaymentPopup=(extId)=>{
        //if(this.state.IsPaymentButtonClicked==false){
            console.log("paymentButtonClicked")
            //this.state.IsPaymentButtonClicked=true;
            this.props.handleExtensionPaymentClick(extId)
       // }
       
    }
    updateStoreCreditPayment = () => {
        const { updateStoreCreditPayment, amountStoreCreditPayment, typeStoreCreditPayment } = this.props;
        this.state.paidAmount = amountStoreCreditPayment;
        this.setState({
            paidAmount: amountStoreCreditPayment
        })
        this.closingTab(true);
        setTimeout(function () {
            this.pay_amount(typeStoreCreditPayment);
        }.bind(this), 500)
        // this.setPartialPayment(typeStoreCreditPayment, amountStoreCreditPayment)
        updateStoreCreditPayment(0, '', false);
    }

    activeForCash = (st) => {
        this.setState({
            activeForCash: st
        })
    }

    activeDisplay(st) {
        this.closingTab()
        this.setState({ activeDisplay: st })
    }

    /** Updated By :Aman Singhai, Updated Date : 10-08-2020, Description : Commented from the line 88 to 91, As aatifa mam said to remove it.
     */
    componentDidMount() {
        this.props.onRef(this);
        if (ActiveUser.key.isSelfcheckout == true && this.props.SelfCheckoutStatus == "sfcheckoutpayment") {
            setTimeout(function () {
               // selfCheckoutJs();
                if (typeof EnableContentScroll != "undefined") { EnableContentScroll(); }
            }, 200)
        }
    }

    componentWillUnmount() {
        this.setState({ loading: false });
        this.props.onRef(null);
    }


    setPartialPayment(paymentType, paymentAmount) {
        this.activeForCash(false);
        var checkList = this.props.checkList;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        var paid_amount = 0;
        this.setState({ paidAmount: 0 })
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var remianAmount = parseFloat(checkList.totalPrice) - parseFloat(paid_amount + parseFloat(paymentAmount));

        if (typeof paymentType !== 'undefined') {
            if (parseFloat(paymentAmount) <= 0) {
                this.setState({ paidAmount: parseFloat(RoundAmount(remianAmount)).toFixed(2) })
                this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
            } else if (parseFloat(RoundAmount(checkList.totalPrice)) >= parseFloat(parseFloat(paid_amount + parseFloat(paymentAmount))) && paymentType !== paymentsType.typeName.cashPayment) {
                this.setState({ paidAmount: parseFloat(RoundAmount(remianAmount)).toFixed(2), loading: true })
                this.props.setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (paymentType == paymentsType.typeName.cashPayment) {
                this.setState({ paidAmount: parseFloat(RoundAmount(remianAmount)).toFixed(2), loading: true })
                this.props.setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (parseFloat(checkList.totalPrice) == parseFloat(RoundAmount(parseFloat(paid_amount) + parseFloat(paymentAmount)))) {
                this.setState({ paidAmount: parseFloat(RoundAmount(remianAmount)).toFixed(2), loading: true })
                this.props.setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            } else if (parseFloat(checkList.totalPrice) < parseFloat(parseFloat(paid_amount) + parseFloat(paymentAmount))) {
                this.setState({ paidAmount: parseFloat(RoundAmount(checkList.totalPrice - paid_amount)).toFixed(2) })
                this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
            } else if (RoundAmount(parseFloat(checkList.totalPrice)) == parseFloat(RoundAmount(parseFloat(paid_amount) + parseFloat(paymentAmount)))) {
                this.setState({ paidAmount: 0, loading: true })
                this.props.setOrderPartialPayments(parseFloat(paymentAmount), paymentType);
            }
        } else {
            this.props.extraPayAmount(LocalizedLanguage.validModeMsg)
        }
    }

    getRemainingPrice() {
        var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        if (checkList && checkList.totalPrice && parseFloat(checkList.totalPrice) >= paid_amount) {
            return (parseFloat(checkList.totalPrice) - parseFloat(paid_amount));
        }
    }

    getRemainingPriceForCash() {
        var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = checkList && checkList.totalPrice ? parseFloat(RoundAmount(checkList.totalPrice)) : 0;
        var cashRoundReturn = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        this.state.CashRound = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        var new_total_price = (totalPrice - paid_amount) + parseFloat(cashRoundReturn)
        return new_total_price;
    }

    /**
     * Updated By :Shakuntala jatav
     * Updated Date : 23-03-2020
     * @param {*} status
     * Description : Update payment type lay-away and park sale
     */
    parkOrder(status) {
        this.props.orderPopup(status);
        this.props.paymentType(status);
    }

    normapNUM(val) {
        this.setState({
            paidAmount: val
        })
    }

    addPayment = (type) => {
        var checkList = this.props.checkList;
        var amount = $('#calc_output').text();
        if (checkList.totalPrice >= amount) {
            this.props.addPayment(type, amount);
        }
    }

    UpdatePaidAmount = () => {
        const getRemainingPrice = this.getRemainingPrice();
        this.state.paidAmount = parseFloat(RoundAmount(getRemainingPrice)).toFixed(2);
        this.setState({
            paidAmount: parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
        })
        this.props.extraPayAmount("Please fill the required fields !");
    }

    updateClosingTab = (st)=>{
        this.setState({closingTab : st})
    }

    //  function use to check for payment types and perform action accordingly 
    pay_amount = (paymentType, TerminalCount = 0, Support = '', paymentCode = '',paidConfirmAmount=0) => {
        const { paidAmount, closingTab } = this.state;
        if(paidConfirmAmount !==0){// set the achual payment done by payconiq
            this.setState({paidAmount:paidConfirmAmount})   
        }
       
        var payment_amount = paidAmount ? paidAmount : 0;
        this.props.paymentType(paymentType);
        const getRemainingPrice = this.getRemainingPrice() ? this.getRemainingPrice() : 0;
        const getRemainingPriceForCash = this.getRemainingPriceForCash();

        if (paymentType == paymentsType.typeName.cashPayment) {
            var amount = $('#calc_output_cash').val();
            payment_amount = amount
            if (payment_amount == 0) {
                this.state.paidAmount = parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
                this.setState({
                    paidAmount: parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
                })
                if (RoundAmount(parseFloat(getRemainingPriceForCash)).toFixed(2) == 0) {
                    this.props.setOrderPartialPayments(0, paymentType);
                } else {
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
                }
            }
        } else {
            if (parseFloat(payment_amount) == 0) {
                this.state.paidAmount = parseFloat(RoundAmount(getRemainingPrice));
                this.setState({
                    paidAmount: parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)
                })
                if (paymentType !== true && RoundAmount(parseFloat(getRemainingPrice)) == 0) {
                    this.props.setOrderPartialPayments(0, paymentType);
                } else if (paymentType !== true) {
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
                }
            }
        }
        this.setState({ paymentType: paymentType })
        if (parseFloat(payment_amount) > 0) {
            if (paymentType !== true && paymentType !== paymentsType.typeName.cashPayment && TerminalCount == 0 && paymentType !== paymentsType.typeName.storeCredit && paymentType !== 'manual_global_payment' && Support !== paymentsType.typeName.Support && paymentType !== 'stripe_terminal' && Support !== paymentsType.typeName.UPISupport) {
                if (closingTab == false) {
                    payment_amount = parseFloat(RoundAmount(getRemainingPrice))
                    this.setPartialPayment(paymentType, payment_amount)
                } else {
                    this.setPartialPayment(paymentType, payment_amount)
                }
            }
            if (TerminalCount > 0 && paymentType !== 'manual_global_payment') {

                var global_amount = (isMobileOnly == true) ? payment_amount : $('#my-input').val();
                if (ActiveUser.key.isSelfcheckout == true) {
                    global_amount = !global_amount ? payment_amount : global_amount;
                }
                payment_amount = parseFloat(RoundAmount(getRemainingPrice));
                if (parseFloat(global_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(global_amount)) {
                    this.setState({
                        isPaymentStart: true
                    })
                    this.globalPayments(paymentType, global_amount)
                } else if (parseFloat(global_amount) == 0) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(global_amount)) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            if (paymentType == 'manual_global_payment') {
                var global_amount = (isMobileOnly == true) ? payment_amount : $('#my-input').val();
                global_amount = ActiveUser.key.isSelfcheckout == true ? payment_amount : global_amount
                var paymentMode = paymentType == "manual_global_payment" ? paymentCode : paymentType;
                payment_amount = parseFloat(RoundAmount(getRemainingPrice));
                if (parseFloat(global_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(global_amount)) {
                    this.setPartialPayment(paymentMode, global_amount)
                } else if (parseFloat(global_amount) == 0) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(global_amount)) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            if (paymentType == paymentsType.typeName.storeCredit) {
                this.setPartialPayment(paymentType, payment_amount)
            }

            if (paymentType == paymentsType.typeName.cashPayment) {
                if (getRemainingPriceForCash > 0) {
                    this.setPartialPayment(paymentType, payment_amount)
                } else if (getRemainingPriceForCash == 0 && payment_amount > 0) {
                    this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                } else {
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)
                }
            }

            // payamount for online manula card payment
            if (paymentType == paymentsType.typeName.manualPayment || Support == "Online") {

                let online_amount = (isMobileOnly == true) ? payment_amount : $('#my-input').val();
                if (ActiveUser.key.isSelfcheckout == true) {
                    online_amount = !online_amount ? payment_amount : online_amount;
                }
                payment_amount = parseFloat(RoundAmount(getRemainingPrice));
                if (parseFloat(online_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(online_amount)) {
                    this.setState({
                        isPaymentStart: true
                    })
                    this.state.onlinePayCardData.amount = online_amount
                    this.onlineCardPayments(paymentType, online_amount)
                } else if (parseFloat(online_amount) == 0) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(online_amount)) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            // payamount forStripe payment

            if (paymentType == 'stripe_terminal') {
                var stripePayAmount = (isMobileOnly == true) ? payment_amount : $('#my-input').val();
                stripePayAmount = ActiveUser.key.isSelfcheckout == true ? payment_amount : stripePayAmount
                var paymentMode = paymentType;
                payment_amount = parseFloat(RoundAmount(getRemainingPrice));
                if (parseFloat(stripePayAmount) !== 0 && parseFloat(payment_amount) >= parseFloat(stripePayAmount)) {
                    this.setPartialPayment(paymentMode, stripePayAmount)
                } else if (parseFloat(stripePayAmount) == 0) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(stripePayAmount)) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }
            if (Support == paymentsType.typeName.UPISupport) {
                var payconiqAmount = (isMobileOnly == true) ? payment_amount : $('#my-input').val();
                payconiqAmount = ActiveUser.key.isSelfcheckout == true ? payment_amount : payconiqAmount
                var paymentMode = paymentType;
                payment_amount = parseFloat(RoundAmount(getRemainingPrice));
                if (parseFloat(payconiqAmount) !== 0 && parseFloat(payment_amount) >= parseFloat(payconiqAmount)) {
                    this.setPartialPayment(paymentMode, payconiqAmount)
                } else if (parseFloat(payconiqAmount) == 0) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.zeroPaymentMsg)

                } else if (parseFloat(payment_amount) < parseFloat(payconiqAmount)) {
                    this.setState({ paidAmount: parseFloat(payment_amount).toFixed(2) })
                    this.props.extraPayAmount(LocalizedLanguage.amountNotExceedMsg)
                }
            }

            //Call GTM paymeny---------------------------
            if (process.env.ENVIRONMENT == 'production') {
                GTM_oliverOrderPayment(paymentType, payment_amount)
            }
            trackOliverOrderPayment(paymentType, payment_amount)
            //------------------------------------
        }
    }

    handleFocus = (event) => {
        event.target.select();
    };

    globalPayments = (paycode, amount) => {
        var UID = get_UDid('UDID');
        this.setState({
            paidAmount: amount,
            globalPayments: paycode
        })
        this.props.dispatch(checkoutActions.getMakePayment(UID, localStorage.getItem('register'), paycode, amount, "sale"))

        // if(ActiveUser.key.isSelfcheckout==true)
        // history.push('/cardpaymentRes')
    }
    // handle online payment payamount
    onlineCardPayments(paycode, amount) {
        var UID = get_UDid('UDID');
        this.setState({
            paidAmount: amount,
            onlinePayments: paycode
        })
        this.props.dispatch(checkoutActions.makeOnlinePayments(this.state.onlinePayCardData))
    }
    onlinePayCardDetails = (data) => {
        this.setState({ onlinePayCardData: data })
    }


    componentWillReceiveProps(nextProp) {
        // console.log("called");  
        setTimeout(function () {
            // setHeightDesktop();
            if (typeof EnableContentScroll != "undefined") { EnableContentScroll(); }
            // run this when item add in cart
        }, 200);
       
        if (nextProp.checkoutlist) {
            this.closingTab(true);
            this.setState({ paidAmount: nextProp.checkoutlist.totalPrice })
        }
        if (nextProp.checkList !== this.props.checkList) {
            this.closingTab(true);
            this.setState({ paidAmount: nextProp.checkList.totalPrice })
        }
        if (nextProp.global_payment && this.state.isPaymentStart == true) {
            this.setState({ isPaymentStart: false })
            if (nextProp.global_payment.is_success === true) {
                this.setPartialPayment(this.state.globalPayments, this.state.paidAmount)
                this.setState({ isPaymentStart: false })
            }
        }
        if (nextProp && nextProp.online_payment) {
            if (nextProp.online_payment.content && nextProp.online_payment.is_success == true && this.state.isPaymentStart == true) {
                console.log('----sucess- -', nextProp);
                if (nextProp.online_payment.content.RefranseCode && nextProp.online_payment.content.IsSuccess == true)
                // if(nextProp.online_payment.content.transactionResponse && nextProp.online_payment.content.transactionResponse.transId != 0)
                {
                    //Set the actual amount paid from card
                    if(nextProp.online_payment.content.Amount && nextProp.online_payment.content.Amount !==""){ 
                        let _paidAmount=parseFloat(nextProp.online_payment.content.Amount)/100
                        this.setState({ paidAmount:_paidAmount});
                    }
                    
                    this.setState({ isPaymentStart: false })
                    this.setPartialPayment(this.state.onlinePayments, this.state.paidAmount)

                } else {
                    this.setState({ isPaymentStart: false })
                }
            } else {
                this.setState({ isPaymentStart: false })
            }
        }
        if (nextProp.onLinePaymentError) {
            this.setState({ isPaymentStart: false })
        }


    }

    closingTab(st) {
        if (st == true) {
            if (this.props.env_type && this.props.env_type !== null) {
                $('#calc_output_cash').attr('readonly', true)
            } else {
                this.props.autoFocus('calc_output_cash');
            }
        } else {
            this.props.autoFocus('my-input');
        }
        this.state.closingTab = st;
        this.setState({ closingTab: st })
    }

    handleFocus = (event) => {
        event.target.select();
    };

    // .list-disabled
    toggalExtention(toggleExtentionStatus) {
        const { active_true_diamond } = this.props;
        var true_dimaond_field = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
        var active_true_diamond_field = true_dimaond_field != [] && active_true_diamond !== false ? true_dimaond_field.find(Items => `true_${Items.Id}` == active_true_diamond) : '';
        if (toggleExtentionStatus == false && toggleExtentionStatus !== "") {
            this.props.extraPayAmount(`Payment buttons were disabled by "${active_true_diamond_field.Name}"`)
        }
    }

    activeDivForCashPayment = (items, st) => {
        this.setState({
            activeCashSplitDiv: st,
            activeCashItems: items
        })
    }

    activeDivForGlobalPayment = (items, st) => {
        this.setState({
            activeGlobalSplitDiv: st,
            activeGlobalItems: items
        })
    }

    /**
     * Created By : shakuntala Jatav
     * Created Date : 23-03-2020
     * Description : check oliver-payments if Store-credit amount already pay
     */
    checkStoreCreditBalance() {
        var paid_amount_by_store_credit = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(type => {
                if (type.payment_type == paymentsType.typeName.storeCredit) {
                    paid_amount_by_store_credit += parseFloat(type.payment_amount);
                }
            });
        }
        // console.log("paid_amount_by_store_credit", paid_amount_by_store_credit)
        return paid_amount_by_store_credit;
    }

    /**
     * Created By : Shakuntala Jatav
     * Creaded date : 23-03-2020
     * @param {*} type 
     * @param {*} store_credit 
     * Description : split payment for store-credit.
     */
    storeCreditPayment(type, store_credit) {
        const getRemainingPrice = this.getRemainingPrice() ? this.getRemainingPrice() : 0;
        var paying_amount = this.checkStoreCreditBalance();
        var store_credit_amount = RoundAmount(store_credit - paying_amount);
        this.props.paymentType(paymentsType.typeName.storeCredit);
        var amount = 0;
        var calc_output = $('#calc_output').val();
        if (calc_output !== '' && typeof calc_output !== 'undefined') {
            amount = $('#calc_output').val();
        } else {
            amount = $('#my-input').val();
        }
        if (store_credit_amount >= amount) {
            this.props.updateStoreCreditPayment(amount, type, true);
        } else if (store_credit_amount < amount) {
            this.setState({ paidAmount: RoundAmount(getRemainingPrice) })
            this.props.extraPayAmount(`${LocalizedLanguage.storeCreditMsg} $${store_credit_amount}`)
        } else if (type == 'lay_away') {
            this.props.getPayment(type);
        }
    }    

    //  Fetch extension payments type from GET_EXTENTION_FIELD to show on payment section 
    showExtensionPayments = (styles)=>{
        var ext_Payment_Fields = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
        var extension_views_field = []
        var counter = 1
        if (ext_Payment_Fields && ext_Payment_Fields !== []) {
            extension_views_field = ext_Payment_Fields && ext_Payment_Fields.length>0  && ext_Payment_Fields.filter(item => item.PluginId > 0 &&  extension_views_field.removed_from_origin !==true)
            return extension_views_field && extension_views_field !== [] &&
                extension_views_field.map((ext, index) => {
                    return ext.viewManagement && ext.viewManagement !== [] && ext.viewManagement.map((type, ind) => {
                        return type && type.ViewSlug == 'Payment Types' ?  <React.Fragment key = {ind}>
                            {/* {counter == 1 ? <h6 className={ActiveUser.key.isSelfcheckout == true? isMobileOnly==true?'': "box-mid-heading-self": "box-mid-heading"} style={{ display: styles}}>{LocalizedLanguage.extensionPayments}</h6> : ''} */}
                            {/* incr counter to show zextension payment heading only once */}
                            {/* <p style ={{display : 'none'}}>{counter ++ }</p>  */}
                           
                            <div className="row">
                                <button onClick ={() =>this.OpenPxtensionPaymentPopup(ext.Id)}>{ext.Name}</button>
                            </div>
				
			
                            
                            
                            
                            {/* <div className= {isMobileOnly==true?"white-background box-flex-shadow box-flex-border mb-2 round-8 pointer overflowHidden no-outline w-100 p-0 overflow-0":"white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0"} style={{ display: styles }}>
                                <div className="section">
                                    <div className="accordion_header" data-isopen="false">
                                        <div className="pointer">
                                            <div
                                                style={{ borderColor: '#46A9D4' }}
                                                id={ext.Id}
                                                onClick ={() =>this.OpenPxtensionPaymentPopup(ext.Id)} //this.props.handleExtensionPaymentClick(ext.Id)
                                                className={isMobileOnly==true?'d-flex box-flex-border-left box-flex-background-others border-dynamic h-60 center-center':'d-flex box-flex box-flex-border-left box-flex-background-others border-dynamic'} >
                                                <div className="box-flex-text-heading" >
                                                    <h2 id={ext.Id}>{ext.Name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            </React.Fragment>
                            : null
                    })  
                })
        }
    }

    //*  Render all payments types   *//
    renderPaymentsType = (pay_name, activeDisplay) => {
        const { paidAmount, paidAmountStatus, paymentTypeName, activeForCash, activeCashSplitDiv, activeCashItems, activeGlobalItems, activeGlobalSplitDiv } = this.state;
        const getRemainingPriceForCash = this.getRemainingPriceForCash();

        return (pay_name.Support == paymentsType.typeName.UPISupport) ?
            <UPIPayments
                color={pay_name.ColorCode}
                Name={pay_name.Name}
                code={pay_name.Code}
                pay_amount={(text) => this.pay_amount(text, pay_name.TerminalCount, pay_name.Support)}
                activeDisplay={(text) => this.activeDisplay(text)}
                styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
            />
            :
            (pay_name.HasTerminal == true && pay_name.Support == "Terminal" && pay_name.Code != paymentsType.typeName.stripePayment) ?
                <GlobalPayment
                    color={pay_name.ColorCode}
                    Name={pay_name.Name}
                    code={pay_name.Code}
                    pay_amount={(text) => this.pay_amount(text, pay_name.TerminalCount, '', pay_name.Code)}
                    msg={this.props.global_payment ? this.props.global_payment.message : ''}
                    activeDisplay={(text) => this.activeDisplay(text)}
                    styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                    closingTab={(text) => this.closingTab(text)}
                    paymentDetails={pay_name}
                    terminalPopup = {(msg) => this.props.extraPayAmount(msg)}
                />
                :
                // for Online payment
                (pay_name.Support == paymentsType.typeName.Support) ?
                    <ManualPayment
                        color={pay_name.ColorCode}
                        Name={pay_name.Name}
                        code={pay_name.Code}
                        pay_amount={(text) => this.pay_amount(text, pay_name.TerminalCount, pay_name.Support)}
                        msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                        activeDisplay={(text) => this.activeDisplay(text)}
                        styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                        closingTab={(text) => this.closingTab(text)}
                        onlinePayCardDetails={(cardData) => this.onlinePayCardDetails(cardData)}
                    /> :
                    isMobileOnly !== true && pay_name.Code == paymentsType.typeName.cashPayment ?
                        <CashPayment
                            color={pay_name.ColorCode}
                            Name={pay_name.Name}
                            paidAmounts={activeForCash == true ? paidAmount : ""}
                            placeholder={parseFloat(getRemainingPriceForCash).toFixed(2)}
                            pay_amount={(text) => this.pay_amount(text)}
                            code={pay_name.Code}
                            paidAmountStatus={paidAmountStatus}
                            normapNUM={(text) => this.normapNUM(text)}
                            cash_rounding={cash_rounding}
                            closingTab={(text) => this.closingTab(text)}
                            handleFocus={this.handleFocus}
                            activeDisplay={(text) => this.activeDisplay(text)}
                            styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                            activeForCash={this.activeForCash}
                            envType={this.props.env_type}
                        />
                        :
                        // for mobile only
                        isMobileOnly == true && pay_name.Code == paymentsType.typeName.cashPayment && activeCashSplitDiv == false ?
                            <CashPayment
                                color={pay_name.ColorCode}
                                Name={pay_name.Name}
                                code={pay_name.Code}
                                detail={pay_name}
                                activeDivForCashPayment={this.activeDivForCashPayment}
                                activeDisplay={(text) => this.activeDisplay(text)}
                                closingTab={(text) => this.closingTab(text)}
                                styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                activeCashSplitDiv={activeCashSplitDiv}
                            />
                            :
                            pay_name.Code == paymentsType.typeName.stripePayment ?
                                <StripePayment
                                    color={pay_name.ColorCode}
                                    Name={pay_name.Name}
                                    code={pay_name.Code}
                                    pay_amount={(text) => this.pay_amount(text)}
                                    activeDisplay={(text) => this.activeDisplay(text)}
                                    styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                    paymentDetails={pay_name}
                                    terminalPopup = {(msg) => this.props.extraPayAmount(msg)}
                                    paidAmount={this.state.paidAmount}
                                />
                                :
                                <OtherPayment
                                    color={pay_name.ColorCode}
                                    Name={pay_name.Name}
                                    code={pay_name.Code}
                                    pay_amount={(text) => this.pay_amount(text)}
                                    closingTab={(text) => this.closingTab(text)}
                                    styles={activeDisplay == false ? '' : 'none'}
                                />

    }

    // render normal keypad 
    renderNoramlKeypad = (activeDisplay = '') => {
        const { paidAmount, paidAmountStatus, paymentTypeName, activeForCash, activeCashSplitDiv, activeCashItems, activeGlobalItems, activeGlobalSplitDiv } = this.state;
        const getRemainingPrice = this.getRemainingPrice();
        return (
            <NormalKeypad
                paidAmount={paidAmount}
                parkOrder={() => { this.parkOrder("park_sale"); this.props.paymentType('park_sale'); }}
                paidAmountStatus={paidAmountStatus}
                placeholder={(typeof getRemainingPrice == 'undefined') ? '0.00' : parseFloat(RoundAmount(getRemainingPrice)).toFixed(2)}
                normapNUM={(text) => this.normapNUM(text)}
                closing_Tab={this.state.closingTab}
                closingTab={(text) => this.closingTab(text)}
                handleFocus={this.handleFocus}
                activeDisplay={(text) => this.activeDisplay(text)}
                // styles={'none'}
                styles={activeDisplay == false || activeDisplay == 'undefined_true' ? '' : 'none'}
                activeForCash={this.activeForCash}
                envType={this.props.env_type} />
        )
    }

    render() {
        const { global_payment, SelfCheckoutStatus, selfcheckoutstatusmanagingevnt, toggleExtentionStatus, InactiveStoreCredit, changeComponent, single_cutomer_list, payWithRedeemPoints,common_Msg,appLock } = this.props;
        const getRemainingPrice = this.getRemainingPrice();
        const getRemainingPriceForCash = this.getRemainingPriceForCash();
        if (InactiveStoreCredit == true) {
            this.updateStoreCreditPayment()
        }
        var checkList = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));
        const { paidAmount, paidAmountStatus, paymentTypeName, activeDisplay, activeForCash, activeCashSplitDiv, activeCashItems, activeGlobalItems, activeGlobalSplitDiv } = this.state;
        var checkoutList = (typeof single_cutomer_list !== 'undefined') && single_cutomer_list.content !== null ? single_cutomer_list.content.Email ? single_cutomer_list.content : single_cutomer_list.content.customerDetails : checkList && checkList.customerDetail && checkList.customerDetail.content;
        var styles = activeDisplay == false || activeDisplay == 'undefined_true' ? '' : 'none';
        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
        var register_content = Register_Permissions ? Register_Permissions.content : '';
        //var landingScreen = ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo : '';
        var isStoreCredit = false
        if (checkoutList && typeof (checkoutList) !== undefined && checkoutList !== null) {
            if (checkoutList && checkoutList.store_credit !== '' && checkoutList.store_credit !== 0) {
                isStoreCredit = true;
            }
        }
        //var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        // if(this.props.showExtIframe==false){
        //     this.state.IsPaymentButtonClicked=false;
        // }
        return (
            // (ActiveUser.key.isSelfcheckout == true && (SelfCheckoutStatus == "sfcheckoutpayment" || isMobileOnly == true)) ?
              
                    (this.state.isPaymentStart == false || !global_payment) ?
                            <div className='bodyCenter'>
                                {this.state.loading == true ? <LoadingModal /> : ''}
                                {/* <div className="payment-nav">
                                    <button className="btn btn-success text-uppercase btn-14" onClick={() => this.props.selfcheckoutstatusmanagingevnt("defaultcheckout")}>{LocalizedLanguage.goBack}</button>
                                </div> */}
                                        {/* <div className="payment-page-title">
                                            <img src={landingScreen} className="mx-auto" alt="" />
                                            <div className="spacer-40"></div>
                                            <h1 className="h2-title text-center text-white font-light m-0 pb-3">{LocalizedLanguage.howWouldYouLikeToPay}</h1>
                                        </div> */}
                                        <div className="payment-view select-payment">
                                            <div className="header">
                                        <div onClick={() => this.props.selfcheckoutstatusmanagingevnt("defaultcheckout")} className="back-button">
                                            <svg width="40" height="36" viewBox="0 0 40 36">
                                                <path
                                                    d="M37.5 15.5012H7.85L16.925 4.60118C17.3493 4.09064 17.5535 3.43243 17.4926 2.77137C17.4316 2.1103 17.1105 1.50052 16.6 1.07618C16.0895 0.651831 15.4313 0.447676 14.7702 0.508626C14.1091 0.569575 13.4993 0.890636 13.075 1.40118L0.575 16.4012C0.490902 16.5205 0.415698 16.6458 0.35 16.7762C0.35 16.9012 0.35 16.9762 0.175 17.1012C0.0616841 17.3878 0.0023528 17.693 0 18.0012C0.0023528 18.3094 0.0616841 18.6145 0.175 18.9012C0.175 19.0262 0.175 19.1012 0.35 19.2262C0.415698 19.3565 0.490902 19.4819 0.575 19.6012L13.075 34.6012C13.3101 34.8834 13.6044 35.1103 13.9371 35.2659C14.2698 35.4214 14.6327 35.5018 15 35.5012C15.5841 35.5023 16.1502 35.2989 16.6 34.9262C16.8531 34.7163 17.0624 34.4585 17.2158 34.1677C17.3692 33.8768 17.4637 33.5586 17.4938 33.2311C17.524 32.9037 17.4893 32.5735 17.3917 32.2595C17.2941 31.9455 17.1355 31.6538 16.925 31.4012L7.85 20.5012H37.5C38.163 20.5012 38.7989 20.2378 39.2678 19.7689C39.7366 19.3001 40 18.6642 40 18.0012C40 17.3381 39.7366 16.7023 39.2678 16.2334C38.7989 15.7646 38.163 15.5012 37.5 15.5012Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <img src="../assets/image/mblogobig.png" alt="" />
                                        </div>
                                    
                                        <div className="total">
                                            <p>Your Total</p>
                                            <p className="amount">${this.props.checkList.totalPrice}</p>
                                        </div>
                                        <div className="payment-options">
                                        <p>Please select a payment method:</p>
        

                                        {(typeof paymentTypeName !== 'undefined') && paymentTypeName !== null && register_content !== 'undefined' && register_content !== null ?
                                            (typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?
                                            paymentTypeName.filter(item => item.Code !== paymentsType.typeName.cashPayment).map((pay_name, index) => {
                                                { this.state.isPaymentStart && (!global_payment || !global_payment) ? <LoadingModal /> : "" }
                                                return (
                                                        this.renderPaymentsType(pay_name, activeDisplay)                                                                       
                                                )
                                            })
                                            :
                                            paymentTypeName.filter(item => item.Code !== paymentsType.typeName.cashPayment).map((pay_name, index) => {
                                                { this.state.isPaymentStart && (!global_payment || !global_payment) ? <LoadingModal /> : "" }
                                                return (
                                                    register_content.filter(item => item.subSection == "PaymentType").map((itm, index) => {
                                                        if (itm.slug == pay_name.Code && itm.value == "true") {
                                                            return (
                                                                this.renderPaymentsType(pay_name, activeDisplay)                                                                       
                                                            )
                                                        }
                                                    })
                                                )
                                            })
                                            :
                                            <div className="w-100">
                                                <p className="text-white text-center payment-description">
                                                    {LocalizedLanguage.noPaymenttypeavilable}
                                                </p>
                                            </div>
                                            
                                        }
                                        {this.showExtensionPayments(styles)}
                                    </div>
                                </div>
                                        {/* <div className="payment-button-group overflowscroll payment-otp overflowscroll pb-0 pt-0">
                                            <div style={{ display: "none" }}>
                                                {this.renderNoramlKeypad()}
                                            </div>
                                            {(typeof paymentTypeName !== 'undefined') && paymentTypeName !== null && register_content !== 'undefined' && register_content !== null ?
                                                (typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?
                                                paymentTypeName.filter(item => item.Code !== paymentsType.typeName.cashPayment).map((pay_name, index) => {
                                                    { this.state.isPaymentStart && (!global_payment || !global_payment) ? <LoadingModal /> : "" }
                                                    return (
                                                            this.renderPaymentsType(pay_name, activeDisplay)                                                                       
                                                    )
                                                })
                                                :
                                                paymentTypeName.filter(item => item.Code !== paymentsType.typeName.cashPayment).map((pay_name, index) => {
                                                    { this.state.isPaymentStart && (!global_payment || !global_payment) ? <LoadingModal /> : "" }
                                                    return (
                                                        register_content.filter(item => item.subSection == "PaymentType").map((itm, index) => {
                                                            if (itm.slug == pay_name.Code && itm.value == "true") {
                                                                return (
                                                                    this.renderPaymentsType(pay_name, activeDisplay)                                                                       
                                                                )
                                                            }
                                                        })
                                                    )
                                                })
                                                :
                                                <div className="w-100">
                                                    <p className="text-white text-center payment-description">
                                                        {LocalizedLanguage.noPaymenttypeavilable}
                                                    </p>
                                                </div>
                                            }
                                            {this.showExtensionPayments(styles)}
                                        </div> */}
                                {/* <div className="payment-footer text-center">
                                    <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                                    <img src="../../assets/img/images/logo-light.svg" alt="" />
                                </div> */}
                              
                                {/* display the message terminal not connected */}
                                <CommonMsgModal msg_text={LocalizedLanguage.terminalnotconnected} close_Msg_Modal={this.props.closeExtraPayModal} />
                            </div>
                        :
                        <CardpaymentRes
                            msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                            pay_amount={(text) => this.pay_amount(text)}
                            closingTab={(status) => this.closingTab(status)} />
                // :
                    // <div className= {payWithRedeemPoints && payWithRedeemPoints == true ?'col-lg-5 col-md-5 col-sm-6 col-xs-12 pt-4 plr-8 box-flex-disabled':'"col-lg-5 col-md-5 col-sm-6 col-xs-12 pt-4 plr-8'} onClick={() => this.toggalExtention(toggleExtentionStatus)}
                    // <div className={payWithRedeemPoints && payWithRedeemPoints == true ? 'col-lg-5 col-md-5 col-sm-6 col-xs-6 pt-4 plr-8 box-flex-disabled' : '"col-lg-5 col-md-5 col-sm-6 col-xs-6 pt-4 plr-8'} onClick={() => this.toggalExtention(toggleExtentionStatus)}
                    //     style={{ pointerEvents: ((payWithRedeemPoints && payWithRedeemPoints == true) || appLock==true ) ? 'none' : 'all' }}>
                    //     {/* <div 
                    //     className={isDemoUser ? 
                    //                 "block__box white-background round-8 full_height overflowscroll text-center pl-3 pr-3 pg-current-checkout-if_footer"
                    //                 :"block__box white-background round-8 full_height overflowscroll text-center pl-3 pr-3"}> */}

                    //     <div className="block__box white-background round-8 full_height overflowscroll text-center pl-3 pr-3 pg-current-checkout-if_footer">
                    //         <h2>{LocalizedLanguage.amountTendered}</h2>
                    //         <div className={`wrapper_accordion ${toggleExtentionStatus == false && toggleExtentionStatus !== "" ? 'list-disabled' : ''}`}>
                    //             {/* render normal keypade via function*/}
                    //             {this.renderNoramlKeypad(activeDisplay)}
                    //             {(typeof paymentTypeName !== 'undefined') && paymentTypeName !== null ?
                    //                 paymentTypeName.map((pay_name, index) => {
                    //                     return (
                    //                         <div key={index}>
                    //                             {this.state.isPaymentStart && (!global_payment || !global_payment) ? <LoadingModal /> : ""}
                    //                             {
                    //                                 this.renderPaymentsType(pay_name, activeDisplay)
                    //                             }
                    //                         </div>
                    //                     )
                    //                 })
                    //                 : ''
                    //             }
                    //             {/* <br /> */}

                    //             {/* Extenssion payment types will show here */}
                    //             {/* <h6 className="box-mid-heading">Extension Payments </h6> */}
                    //             {this.showExtensionPayments(styles)}
                    //             {/* Extenssion payment types end */}

                    //             <h6 className="box-mid-heading" style={{ display: styles }}>{LocalizedLanguage.customerPayment}</h6>
                    //             <div className="white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0" style={{ display: styles }}>
                    //                 <div className="section">
                    //                     <div className="accordion_header" data-isopen="false">
                    //                         <div className="pointer">
                    //                             <div style={checkoutList ? { borderColor: '#46A9D4' } : { borderColor: '#765b72' }} id="others" value="other" name="payments-type" className={checkoutList ? 'd-flex box-flex box-flex-border-left box-flex-background-others border-dynamic' : 'd-flex box-flex box-flex-border-left box-flex-background-others border-dynamic box-flex-disabled'} onClick={() => checkoutList ? this.parkOrder("lay_away") : this.props.extraPayAmount(LocalizedLanguage.activeButtonLayStore)}>
                    //                                 <div className="box-flex-text-heading" >
                    //                                     <h2>{LocalizedLanguage.layAway}</h2>
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //             <div className="white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0" style={{ display: styles }}>
                    //                 <div className="section">
                    //                     <div className="accordion_header" data-isopen="false">
                    //                         <div className="pointer">
                    //                             <div style={isStoreCredit ? { borderColor: '#46A9D4' } : { borderColor: '#26627b' }}
                    //                                 id="others" value="other" name="payments-type" className={typeof (checkoutList) !== undefined && checkoutList !== null ?
                    //                                     'd-flex box-flex box-flex-border-left box-flex-background-others border-dynamic' :
                    //                                     'd-flex box-flex box-flex-border-left box-flex-background-others border-dynamic box-flex-disabled'}
                    //                                 onClick={() => isStoreCredit ? this.storeCreditPayment(paymentsType.typeName.storeCredit, isStoreCredit ? checkoutList.store_credit : '')
                    //                                     : checkoutList ? this.props.extraPayAmount(LocalizedLanguage.storeCreditAmountZero)
                    //                                         : this.props.extraPayAmount(LocalizedLanguage.activeButtonLayStore)}>
                    //                                 <div className="box-flex-text-heading">
                    //                                     <h2>{LocalizedLanguage.storeCreditTitle}</h2>
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
        )
    }
}

function mapStateToProps(state) {
    const { checkoutlist, global_payment, single_cutomer_list, online_payment } = state;
    return {
        checkoutlist: checkoutlist.items,
        global_payment: global_payment.items,
        single_cutomer_list: single_cutomer_list.items,
        online_payment: online_payment.items,
        error: online_payment.error,
        onLinePaymentError: online_payment.error
    };
}
const connectedCheckoutViewThird = connect(mapStateToProps)(CheckoutViewThird);
export { connectedCheckoutViewThird as CheckoutViewThird };

