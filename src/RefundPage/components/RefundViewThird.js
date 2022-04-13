import React from 'react';
import { connect } from 'react-redux';
import { refundActions } from '../';
import { GetRoundCash } from '../../CheckoutPage/Checkout';
import { checkoutActions, paymentActions } from '../../CheckoutPage';
import { LoadingModal, AndroidAndIOSLoader } from '../../_components';
import { get_UDid } from '../../ALL_localstorage';
import { CardPayment, CashPayment, GlobalPayment, OtherPayment, NormalKeypad, StripePayment } from '../../_components/PaymentComponents';
import ActiveUser from '../../settings/ActiveUser';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import Footer from '../../_components/views/m.Footer';
import { ManualPayment } from '../../_components/PaymentComponents/ManualPayment';
import paymentsType from '../../settings/PaymentsType'
import { UPIPayments } from '../../_components/PaymentComponents/UPIPayments';

var cash_rounding = ActiveUser.key.cash_rounding;
class RefundViewThird extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refundingAmount: 0,
            refundPayments: 0,
            refundingPaidAmount: 0,
            cash_round: 0,
            single_Order_list: (typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null,
            refundingCashAmount: 0,
            paidAmountStatus: false,
            refunding_amount: 0,
            paymentTypeName: (typeof localStorage.getItem('PAYMENT_TYPE_NAME') !== 'undefined') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : null,
            globalPayments: '',
            orderId: 0,
            globalStatus: false,
            isPaymentStart: false,
            activeDisplay: false,
            hideShowCash: false,
            refunding_cash_amount: 0,
            activeForCash: false,
            blankTempValue: false,
            envfocus: this.props.env_Type,
            activeCashSplitDiv: false,
            activeCashItems: "",
            activeGlobalSplitDiv: false,
            activeGlobalItems: "",
            onlinePayCardData :"",
            onlinePayments: '',
            onlineStatus: false,
            stripeStatus: false,
            payconiqStatus: false,
            stripePayment : '',
            payconiqPayment : '',
            stripRefundError : '',
            payconiqRefundError : ''

        };
        this.setRefundPayment = this.setRefundPayment.bind(this);
        this.cashPayment = this.cashPayment.bind(this);
        this.hideCashTab = this.hideCashTab.bind(this);
        this.activeForCash = this.activeForCash.bind(this);
        this.ChangeTempValue = this.ChangeTempValue.bind(this);
        this.activeDivForCashPayment = this.activeDivForCashPayment.bind(this);
        this.activeDivForGlobalPayment = this.activeDivForGlobalPayment.bind(this);
        this.pay_amount = this.pay_amount.bind(this);
    }

    ChangeTempValue() {
        this.setState({
            blankTempValue: false
        })
    }

    activeForCash(st) {
        this.setState({
            activeForCash: st
        })
    }

    componentDidMount() {
        this.props.onRef(this)
        if (isMobileOnly == true) {
            console.log("componentDidMount", this.props)
            this.setRefundAmount(this.props.refund_total)
        }
    }

    componentWillUnmount() {
        this.props.onRef(null)
    }

    cashPayment(paymentType) {
        const { single_Order_list } = this.state;
        var order_id = single_Order_list.order_id
        var store_credit = single_Order_list.orderCustomerInfo && single_Order_list.orderCustomerInfo.store_credit;
        if (paymentType == 'cash') {
            var CashRound = parseFloat(GetRoundCash(cash_rounding, this.state.refundingAmount))
            if (this.state.refundingAmount + CashRound == this.state.refunding_amount) {
                this.setState({
                    cash_round: CashRound,
                    // refundingAmount: this.state.refundingAmount + CashRound
                    refundingCashAmount: this.state.refundingAmount + CashRound
                })
            } else {
                this.setState({
                    cash_round: 0,
                    //  refundingAmount: this.state.refundingAmount - CashRound
                })
            }
            this.setRefundPayment(order_id, paymentType)
        } else {
            // show  popup when no product selected from cart for refund
        var refundItemsQuantity = []
        $(".refunndingItem").each(function () {
            var item_id = $(this).attr('data-id');
            var quantity = parseInt($(`#counter_show_${item_id}`).text());
            refundItemsQuantity.push({
                'Quantity': quantity,
            });
        });

        if ( isMobileOnly !== true && refundItemsQuantity.length <= 0) {
            this.props.min_max_add(LocalizedLanguage.refundZeroPaymentMsg)
            return false;
        }
        
            this.setState({
                cash_round: 0,
                refundingAmount: this.state.refundingAmount - this.state.cash_round
            })
            // if (store_credit < this.state.refundingAmount) {
            //     this.props.min_max_add(`Store Credit Balance is $${parseFloat(store_credit).toFixed(2)}`)
            // } else {
            //     // alert(" sufficiant ");
            //     this.setRefundPayment(order_id, paymentType)
            // }
            this.setRefundPayment(order_id, paymentType)
        }
    }

    pay_amount(code, TerminalCount = 0, Support = "", paymentCode = '') {
        const { refundingAmount } = this.state;
        var paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refunding_cash_amount !== 0 ? parseFloat(this.state.refunding_cash_amount) : this.state.refundingAmount;
       
        // show  popup when no product selected from cart for refund
        var refundItemsQuantity = []
        $(".refunndingItem").each(function () {
            var item_id = $(this).attr('data-id');
            var quantity = parseInt($(`#counter_show_${item_id}`).text());
            refundItemsQuantity.push({
                'Quantity': quantity,
            });
        });

        if ( isMobileOnly !== true && refundItemsQuantity.length <= 0) {
            this.props.min_max_add(LocalizedLanguage.refundZeroPaymentMsg)
            return false;
        }
        
        var order_id = this.state.single_Order_list && this.state.single_Order_list.order_id;
        if (TerminalCount > 0 && code !== 'manual_global_payment' ) {
            var global_amount = (isMobileOnly == true) ? paymentAmount : $('#my-input').val();
            var payment_amount = refundingAmount;
            if (parseFloat(global_amount) !== 0 && parseFloat(payment_amount).toFixed(2) >= parseFloat(global_amount).toFixed(2)) {
                this.setState({
                    isPaymentStart: true
                })
                this.globalPayments(order_id, code, global_amount)
            } else if (parseFloat(global_amount) == 0) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.zeroPaymentMsg)

            } else if (parseFloat(payment_amount).toFixed(2) < parseFloat(global_amount).toFixed(2)) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.amountNotExceedMsg)
            }
            // this.globalPayments(order_id, code)
        }

        if (code == 'manual_global_payment') {
            var global_amount = (isMobileOnly == true) ? paymentAmount : $('#my-input').val();
            console.log("manual_global_payment", global_amount);
            var paymentMode = code == "manual_global_payment" ? paymentCode : code;
            var payment_amount = refundingAmount;
            if (parseFloat(global_amount) !== 0 && parseFloat(payment_amount).toFixed(2) >= parseFloat(global_amount).toFixed(2)) {
                this.setRefundPayment(order_id, paymentMode);
            } else if (parseFloat(global_amount) == 0) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.zeroPaymentMsg)

            } else if (parseFloat(payment_amount).toFixed(2) < parseFloat(global_amount).toFixed(2)) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.amountNotExceedMsg)
            }
        }
        // refund for online payment
        if (Support == paymentsType.typeName.Support) {
            var online_amount = (isMobileOnly == true) ? paymentAmount : $('#my-input').val();
            var payment_amount = refundingAmount;
            if (parseFloat(online_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(online_amount)) {
                this.setState({
                    isPaymentStart: true
                })
                this.state.onlinePayCardData.amount = online_amount
                this.onlinePayments(order_id, code, online_amount)
            } else if (parseFloat(online_amount) == 0) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.zeroPaymentMsg)

            } else if (parseFloat(payment_amount) < parseFloat(online_amount)) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.amountNotExceedMsg)
            }
        }

        // refund for stripe payment
        if (code == paymentsType.typeName.stripePayment) {
            var stripe_amount = (isMobileOnly == true) ? paymentAmount : $('#my-input').val();
            var payment_amount = refundingAmount;
            if (parseFloat(stripe_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(stripe_amount)) {
                this.setState({
                    isPaymentStart: true
                })
                // this.state.onlinePayCardData.amount = stripe_amount
                this.stripePayments(order_id, code, stripe_amount)
            } else if (parseFloat(stripe_amount) == 0) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.zeroPaymentMsg)

            } else if (parseFloat(payment_amount) < parseFloat(stripe_amount)) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.amountNotExceedMsg)
            }
        }

        // refund for payconiq (UPI) payment
        if (code == paymentsType.typeName.payconiq) {
            var payconiq_amount = (isMobileOnly == true) ? paymentAmount : $('#my-input').val();
            var payment_amount = refundingAmount;
            if (parseFloat(payconiq_amount) !== 0 && parseFloat(payment_amount) >= parseFloat(payconiq_amount)) {
                this.setState({
                    isPaymentStart: true
                })
                // this.state.onlinePayCardData.amount = payconiq_amount
                this.payconiqPayments(order_id, code, payconiq_amount)
            } else if (parseFloat(payconiq_amount) == 0) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.zeroPaymentMsg)

            } else if (parseFloat(payment_amount) < parseFloat(payconiq_amount)) {
                this.setState({ refunding_amount: parseFloat(payment_amount).toFixed(2) })
                this.props.min_max_add(LocalizedLanguage.amountNotExceedMsg)
            }
        }

        if (code !== false && code !== true && code !== 'cash' && !(TerminalCount > 0) && code !== 'manual_global_payment' && Support !== paymentsType.typeName.Support && code !==paymentsType.typeName.stripePayment && code !==paymentsType.typeName.payconiq ) {
            this.setRefundPayment(order_id, code)
        }
    }

    setRefundPayment(order_id, paymentType) {
         this.setState({
            globalStatus: false,
            hideShowCash: false,
            onlineStatus : false,
            stripeStatus : false,
            payconiqStatus : false
        })
        var paymentAmount = 0;
        if (typeof paymentType !== 'undefined') {
            // if (this.state.paidAmountStatus == true) {
            //     paymentAmount = this.state.refunding_amount;
            // } else {
            paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refunding_cash_amount !== 0 ? parseFloat(this.state.refunding_cash_amount) : this.state.refundingAmount;
            //}
            var paymentAmount2 = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refunding_cash_amount !== 0 ? parseFloat(this.state.refunding_cash_amount).toFixed(2) : this.state.refundingCashAmount;
            if (paymentType !== 'cash') {
                this.setState({ paidAmountStatus: false })
                this.state.paidAmountStatus = false;
                // if (paymentAmount <= 0) {
                //     this.setState({
                //         refunding_amount: parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount).toFixed(2)
                //     })
                //     this.props.min_max_add(LocalizedLanguage.greaterThanMsg);
                // } else
                 if (parseFloat(paymentAmount) > parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount)) {
                    if (parseFloat(paymentAmount) == parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount).toFixed(2)) {
                        this.props.addPayment(order_id, paymentType, paymentAmount);
                        return true;
                    } else if (parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount).toFixed(2) == 0) {
                        this.props.min_max_add(LocalizedLanguage.selectAnyOrder)
                    } else {
                        if (paymentType == 'store-credit') {
                            this.setState({ blankTempValue: true })
                        } else {
                            this.setState({ blankTempValue: false })
                        }
                        this.setState({
                            refunding_amount: parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount).toFixed(2)
                        })
                        this.props.min_max_add(LocalizedLanguage.greaterThanAmountMsg)
                    }
                } else {
                    if (paymentType == 'store-credit') {
                        this.setState({
                            blankTempValue: true
                        })
                    }
                    this.props.addPayment(order_id, paymentType, paymentAmount);
                    return true;
                }
            } else {
                if (paymentAmount2 <= 0) {
                    this.props.min_max_add(LocalizedLanguage.greaterThanMsg)
                } else if (paymentAmount2 > parseFloat(this.state.refundingCashAmount - this.state.refundingPaidAmount).toFixed(2)) {
                    if (parseFloat(this.state.refundingCashAmount - this.state.refundingPaidAmount).toFixed(2) == 0) {
                        this.props.min_max_add(LocalizedLanguage.selectAnyOrder)
                    } else {
                        this.props.addPayment(order_id, paymentType, paymentAmount2);
                    }
                } else {
                    this.props.addPayment(order_id, paymentType, paymentAmount2);
                    return true;
                }
            }
        } else {
            this.props.min_max_add(LocalizedLanguage.validModeMsg)
        }
        return false;
    }

    setRefundAmount(amount) {
        var CashRound = parseFloat(GetRoundCash(cash_rounding, amount))
        this.setState({
            refundingAmount: amount,
            refundingCashAmount: parseFloat(amount) + parseFloat(CashRound),
            // refunding_amount  : amount
            // paidAmountStatus : amount == 0  && paidAmountStatus == true ? false : true
        });
    }

    setrefundingPaidAmount(amount) {
        this.setState({
            refundingPaidAmount: amount,
            refunding_amount: this.state.refundingAmount - amount
        });
    }

    handleFocus = (event) => {
        if (this.state.envfocus) {
            $('#my-input').attr('readonly', true);
            $('#calc_output').attr('readonly', true);
        } else {
            event.target.select();
        }
    };

    globalPayments(order_id, paycode) {
        this.setState({
            globalPayments: paycode,
            orderId: order_id,
            globalStatus: true,
            isPaymentStart: true
        })
        var paymentAmount = 0;
        if (this.state.paidAmountStatus == true) {
            paymentAmount = this.state.refunding_amount;
        } else {
            paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refundingAmount;
        }
        var UID = get_UDid('UDID');
        this.setState({
            refunding_amount: paymentAmount,
            paidAmountStatus: true
        })
        const {single_Order_list, paymentTypeName} = this.state
        var orderTransacion = ''

        paymentTypeName.map((pay_name, index) => {
            var data  = this.checkIfOrderTypeGlobal(single_Order_list, pay_name)
            if(data){
                orderTransacion = data
            }

        })
        // var ordertransId = single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments[0] ? single_Order_list.order_payments[0].transection_id:''
        var ordertransId = orderTransacion  ? orderTransacion.transection_id:''
        this.props.dispatch(checkoutActions.getMakePayment(UID, localStorage.getItem('register'), paycode, paymentAmount, "refund",ordertransId))
        //this.setRefundPayment(order_id , paycode)
    }
    
    // refund online payments
    onlinePayments(order_id, paycode) {
        this.setState({
            onlinePayments: paycode,
            orderId: order_id,
            onlineStatus: true,
            isPaymentStart: true
        })
        var paymentAmount = 0;
        if (this.state.paidAmountStatus == true) {
            paymentAmount = this.state.refunding_amount;
        } else {
            paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refundingAmount;
        }
        var UID = get_UDid('UDID');
        this.setState({
            refunding_amount: paymentAmount,
            paidAmountStatus: true
        })
        const {single_Order_list, paymentTypeName,onlinePayCardData} = this.state
        var orderTransacion = ''

        paymentTypeName.map((pay_name, index) => {
            // var data  = this.checkIfOrderTypeGlobal(single_Order_list, pay_name)
            var data = single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code && pay_name.Support == paymentsType.typeName.Support )
            if(data){
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion  ? orderTransacion.transection_id:''
        onlinePayCardData["refId"] = ordertransId
        this.props.dispatch(checkoutActions.makeOnlinePayments(onlinePayCardData))

        // this.props.dispatch(checkoutActions.getMakePayment(UID, localStorage.getItem('register'), paycode, paymentAmount, "refund",ordertransId))
        //this.setRefundPayment(order_id , paycode)
    }

    // refund stripe payments
    stripePayments(order_id, paycode) {
        this.setState({
            stripePayments: paycode,
            orderId: order_id,
            stripeStatus: true,
            isPaymentStart: true,
            globalPayments: paycode,
            globalStatus: true,
        })
        var paymentAmount = 0;
        if (this.state.paidAmountStatus == true) {
            paymentAmount = this.state.refunding_amount;
        } else {
            paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refundingAmount;
        }
        var UID = get_UDid('UDID');
        this.setState({
            refunding_amount: paymentAmount,
            paidAmountStatus: true
        })
        const {single_Order_list, paymentTypeName,onlinePayCardData} = this.state
        var orderTransacion = ''

        paymentTypeName.map((pay_name, index) => {
            // var data  = this.checkIfOrderTypeGlobal(single_Order_list, pay_name)
            var data = single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code)
            if(data){
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion  ? orderTransacion.transection_id:''
        // onlinePayCardData["refId"] = ordertransId
        this.props.dispatch(checkoutActions.getMakePayment(UID, localStorage.getItem('register'), paycode, paymentAmount, "refund",ordertransId))

        // this.props.dispatch(checkoutActions.makeOnlinePayments(onlinePayCardData))

        // this.props.dispatch(checkoutActions.getMakePayment(UID, localStorage.getItem('register'), paycode, paymentAmount, "refund",ordertransId))
        //this.setRefundPayment(order_id , paycode)
    }
    // refund payconiq payments
    payconiqPayments(order_id, paycode) {
        this.setState({
            payconiqPayments: paycode,
            orderId: order_id,
            payconiqStatus: true,
            isPaymentStart: true,
        })
        var paymentAmount = 0;
        if (this.state.paidAmountStatus == true) {
            paymentAmount = this.state.refunding_amount;
        } else {
            paymentAmount = this.state.refunding_amount !== 0 ? this.state.refunding_amount : this.state.refundingAmount;
        }
        var UID = get_UDid('UDID');
        this.setState({
            refunding_amount: paymentAmount,
            paidAmountStatus: true
        })
        const {single_Order_list, paymentTypeName,onlinePayCardData} = this.state
        var orderTransacion = ''

        paymentTypeName.map((pay_name, index) => {
            // var data  = this.checkIfOrderTypeGlobal(single_Order_list, pay_name)
            var data = single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code)
            if(data){
                orderTransacion = data
            }
        })
        var ordertransId = orderTransacion  ? orderTransacion.transection_id:''
        // onlinePayCardData["refId"] = ordertransId
        var _requestData = {
            "registerId": localStorage.getItem('register') ? localStorage.getItem('register') : 1,
            "amount": parseFloat(paymentAmount),
            "paycode": paycode,
            "command": "refund",
            'refId' : ordertransId,
            "SessionId": ''
        }
        this.props.dispatch(paymentActions.make_payconiq_payment(_requestData))
    }

    onlinePayCardDetails = (data) => {
        this.setState({ onlinePayCardData: data })
    }

    componentWillReceiveProps(nextProp) {
        //console.log("componentWillReceiveProps", this.props.refundingPaidAmount, nextProp.refundingPaidAmount)
        if (nextProp.refundingPaidAmount) {
            this.setrefundingPaidAmount(nextProp.refundingPaidAmount)
        }
        // if (nextProp.global_payment) {
        //     if (this.state.globalStatus === true) {
        //         this.setState({ isPaymentStart: false })
        //         if (nextProp.global_payment.IsSuccess === true) {
        //             this.setRefundPayment(this.state.orderId, this.state.globalPayments)
        //         }
        //     }
        // }
        if (nextProp.global_payment) {
            if (nextProp.global_payment.is_success === true && this.state.isPaymentStart == true) {
                if(this.state.stripeStatus == true){
                    // this.setState({stripRefundError : })
                }

                this.setState({ isPaymentStart: false })
                this.setRefundPayment(this.state.orderId, this.state.globalPayments);
            }

            if (nextProp.global_payment.is_success === false) {
                if(this.state.stripeStatus == true){
                    this.setState({stripRefundError : nextProp.global_payment.message})
                }
                this.setState({ isPaymentStart: false })
            }
        }

        if (nextProp && nextProp.online_payment) {
            if (nextProp.online_payment.content && nextProp.online_payment.is_success == true && this.state.isPaymentStart == true) {
                console.log('----sucess- -', nextProp);
                if(nextProp.online_payment.content.RefranseCode && nextProp.online_payment.content.IsSuccess ==true)
                {
                    this.setState({ isPaymentStart: false })
                    this.setRefundPayment(this.state.orderId, this.state.onlinePayments);                    
                }else{
                    this.setState({ isPaymentStart: false })
                }
            }else{
                this.setState({ isPaymentStart: false })
            }
        }
        if(nextProp.onLinePaymentError){
            this.setState({ isPaymentStart: false })
        }

        // payconiq refud API response
        if (nextProp.payconiq_payment) {
            if (nextProp.payconiq_payment.items && nextProp.payconiq_payment.items.is_success === true && this.state.isPaymentStart == true) {
                this.setState({ isPaymentStart: false })
                this.setRefundPayment(this.state.orderId, this.state.payconiqPayments);
            }

            if (nextProp.payconiq_payment.error) {
                if(this.state.payconiqStatus == true){
                    this.setState({payconiqRefundError : nextProp.payconiq_payment.error})
                }
                this.setState({ isPaymentStart: false })
            }
        }
    }

    activeDisplay(st) {
        this.setState({ activeDisplay: st })
    }

    closingTab(st) {
        this.setState({ closingTab: st })
        if (this.state.envfocus) {
            $('#my-input').attr('readonly', true);
            $('#calc_output').attr('readonly', true);

        }
    }

    normapNUM(val) {
        if (this.state.hideShowCash == true) {
            this.state.hideShowCash = false
            this.setState({
                refunding_amount: 0,
                refunding_cash_amount: parseFloat(this.state.refundingAmount) - parseFloat(this.state.refundingPaidAmount)
            })
        } else {
            this.setState({
                refunding_amount: val,
                refunding_cash_amount: 0
            })
        }
    }

    hideCashTab(st) {
        if (this.state.envfocus) {
            setTimeout(function () {
                $('#my-input').attr('readonly', true);
                $('#calc_output').attr('readonly', true);

            }, 100)
        }
        this.state.hideShowCash = st
    }

    activeDivForCashPayment(items, st) {
        // this.state.activeCashSplitDiv = st
        // this.state.activeCashItems = items
        this.setState({
            activeCashSplitDiv: st,
            activeCashItems: items
        })
    }

    activeDivForGlobalPayment(items, st) {
        this.setState({
            activeGlobalSplitDiv: st,
            activeGlobalItems: items
        })
    }
    checkIfOrderTypeGlobal = (single_Order_list,pay_name)=>{
         return single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code && pay_name.HasTerminal == true && pay_name.TerminalCount > 0 )
    }
    checkIfOrderTypeOnline = (single_Order_list,pay_name)=>{
         return single_Order_list && single_Order_list.order_payments && single_Order_list.order_payments.find((orderItem) => orderItem.type == pay_name.Code && pay_name.Support == paymentsType.typeName.Support )
        }

        //  Fetch extension payments type from GET_EXTENTION_FIELD to show on payment section 
    showExtensionPayments = (styles)=>{
        var ext_Payment_Fields = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
        var extension_views_field = []
        var counter = 1
        if (ext_Payment_Fields && ext_Payment_Fields !== []) {
            extension_views_field = ext_Payment_Fields && ext_Payment_Fields.length>0  && ext_Payment_Fields.filter(item => item.PluginId > 0  && extension_views_field.removed_from_origin !==true )
            return extension_views_field && extension_views_field !== [] &&
                extension_views_field.map((ext, ind) => {
                    return ext.viewManagement && ext.viewManagement !== [] && ext.viewManagement.map((type, ind) => {
                        return type && type.ViewSlug == 'Payment Types' ? <div key ={ind}>
                            {counter == 1 ? <h6 className="box-mid-heading" style={{ display: styles }}>{LocalizedLanguage.extensionPayments}</h6> : ''}
                            {/* incr counter to show zextension payment heading only once */}
                            <p style ={{display : 'none'}}>{counter ++ }</p> 
                            <div className="white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0" style={{ display: styles }}>
                                <div className="section">
                                    <div className="accordion_header" data-isopen="false">
                                        <div className="pointer">
                                            <div
                                                style={{ borderColor: '#46A9D4' }}
                                                id={ext.Id}
                                                onClick ={() =>this.props.handleExtensionPaymentClick(ext.Id)}
                                                className={'d-flex box-flex box-flex-border-left box-flex-background-others border-dynamic'} >
                                                <div className="box-flex-text-heading" >
                                                    <h2 id={ext.Id}>{ext.Name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            : ''
                    })  
                })
        }
    }

    render() {
        const { single_Order_list, paidAmountStatus, paymentTypeName, activeDisplay, blankTempValue, activeCashSplitDiv, activeCashItems, activeGlobalItems, activeGlobalSplitDiv } = this.state;
        var getorder = single_Order_list;
        var isOrderPaymentGlobal = false
        var isOrderPaymentOnline = false
       const extStyle =  activeDisplay == false ? '' : 'none'
        return (
            (isMobileOnly == true) ?
                <div>
                    {this.state.isPaymentStart === true ? <AndroidAndIOSLoader /> : ""}
                    <div className="appHeader">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <div className="col-5">
                                    <a className="appHeaderBack" href="/refund" onClick={() => this.props.openMobilePaymentOption("RefundViewFirst", "")}>
                                        <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />{LocalizedLanguage.goBack}
                                    </a>
                                </div>
                                <div className="col-8 text-right">
                                    <p className="appHeaderPgbutton text-dark disabled">
                                        {/* {customerName} */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="appCapsule h-100 overflow-auto" style={{ paddingBottom: "80px" }}> */}
                    <div className="appCapsule h-100 overflow-auto vh-100" style={{ paddingBottom: "130px" }}>
                        <div className="container-fluid pt-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    {(typeof paymentTypeName !== 'undefined') && paymentTypeName !== null ?
                                        paymentTypeName.map((pay_name, index) => {
                                            return (
                                                <div key={index}>
                                                    {
                                                    (pay_name.Code == paymentsType.typeName.payconiq) ?
                                                    <UPIPayments
                                                        type='refund'
                                                        color={pay_name.ColorCode}
                                                        Name={pay_name.Name}
                                                        code={pay_name.Code}
                                                        pay_amount={(text) => this.pay_amount(text)}
                                                        activeDisplay={(text) => this.activeDisplay(text)}
                                                        styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                        payconiqRefundError = {this.state.payconiqRefundError}
                                                    />
                                                    :
                                                        // (pay_name.HasTerminal == true && pay_name.TerminalCount > 0 && pay_name.Code != paymentsType.typeName.stripePayment) ?
                                                        (pay_name.HasTerminal == true && pay_name.Support == "Terminal" && pay_name.Code != paymentsType.typeName.stripePayment)?   
                                                        <GlobalPayment
                                                                type='refund'
                                                                color={pay_name.ColorCode}
                                                                Name={pay_name.Name}
                                                                code={pay_name.Code}
                                                                // pay_amount={this.pay_amount}
                                                                pay_amount={(text) => this.pay_amount(text, pay_name.TerminalCount, '', pay_name.Code )}
                                                                msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                                                                activeDisplay={(text) => this.activeDisplay(text)}
                                                                styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                                hideCashTab={this.hideCashTab}
                                                                activeGlobalSplitDiv={activeGlobalSplitDiv}
                                                                activeDivForGlobalPayment={this.activeDivForGlobalPayment}
                                                                closingTab={(text) => this.closingTab(text)}
                                                                paymentDetails={pay_name}
                                                                terminalPopup = {(msg) => this.props.min_max_add(msg)}

                                                            />
                                                            // :
                                                            // null
                                                        :
                                                         // for Online payment refund
                                                         (pay_name.Support == paymentsType.typeName.Support) ?
                                                         <ManualPayment
                                                         type='refund'
                                                             color={pay_name.ColorCode}
                                                             Name={pay_name.Name}
                                                             code={pay_name.Code}
                                                             pay_amount={(text) => this.pay_amount(text,pay_name.TerminalCount,pay_name.Support)}
                                                             msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                                                             activeDisplay={(text) => this.activeDisplay(text)}
                                                             styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                             closingTab={(text) => this.closingTab(text)}
                                                             onlinePayCardDetails={(cardData) => this.onlinePayCardDetails(cardData)}
                                                         /> :
                                                        pay_name.Code == 'cash' && activeCashSplitDiv == false ?
                                                            <CashPayment
                                                                type='refund'
                                                                color={pay_name.ColorCode}
                                                                Name={pay_name.Name}
                                                                detail={pay_name}
                                                                //paidAmount={this.state.refunding_amount}
                                                                placeholder={parseFloat(this.state.refundingCashAmount - this.state.refundingPaidAmount).toFixed(2)}
                                                                // pay_amount={(text) => this.cashPayment(text)}
                                                                code={pay_name.Code}
                                                                //paidAmountStatus={paidAmountStatus}
                                                                normapNUM={(text) => this.normapNUM(text)}
                                                                //cash_rounding={cash_rounding}
                                                                closingTab={(text) => this.closingTab(text)}
                                                                // handleFocus={this.handleFocus}
                                                                activeDisplay={(text) => this.activeDisplay(text)}
                                                                styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                                hideCashTab={this.hideCashTab}
                                                                //activeForCash={this.activeForCash}
                                                                //envType={this.props.env_Type}
                                                                activeDivForCashPayment={this.activeDivForCashPayment}
                                                                activeCashSplitDiv={activeCashSplitDiv}
                                                            />
                                                            :
                                                            pay_name.Code == paymentsType.typeName.stripePayment ?
                                                                <StripePayment
                                                                    type='refund'
                                                                    color={pay_name.ColorCode}
                                                                    Name={pay_name.Name}
                                                                    code={pay_name.Code}
                                                                    pay_amount={(text) => this.pay_amount(text)}
                                                                    activeDisplay={(text) => this.activeDisplay(text)}
                                                                    styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                                    hideCashTab={this.hideCashTab}
                                                                    stripRefundError = {this.state.stripRefundError}
                                                                />
                                                                :
                                                                <OtherPayment
                                                                    type='refund'
                                                                    orderId={single_Order_list.order_id}
                                                                    color={pay_name.ColorCode}
                                                                    Name={pay_name.Name}
                                                                    code={pay_name.Code}
                                                                    pay_amount={(text) => this.pay_amount(text)}
                                                                    closingTab={(text) => this.closingTab(text)}
                                                                    styles={activeDisplay == false ? '' : 'none'}
                                                                    hideCashTab={this.hideCashTab}
                                                                />

                                                    }
                                                </div>
                                            )
                                        })
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {(activeCashSplitDiv == false) &&
                        <NormalKeypad
                            paidAmount={this.state.refunding_amount}
                            parkOrder='refund'
                            paidAmountStatus={paidAmountStatus}
                            placeholder={parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount).toFixed(2)}
                            normapNUM={(text) => this.normapNUM(text)}
                            closing_Tab={this.state.closingTab}
                            closingTab={(text) => this.closingTab(text)}
                            handleFocus={this.handleFocus}
                            activeDisplay={(text) => this.activeDisplay(text)}
                            styles={activeDisplay == false || activeDisplay == 'undefined_true' ? '' : 'none'}
                            hideCashTab={this.hideCashTab}
                            activeForCash={this.activeForCash}
                            blankTempValue={blankTempValue}
                            ChangeTempValue={this.ChangeTempValue}
                            envType={this.state.envfocus}
                            activeCashSplitDiv={activeCashSplitDiv}
                        />
                    }
                    {(activeCashSplitDiv == true && activeCashItems !== "" && (typeof activeCashItems !== "undefined")) &&
                        <CashPayment
                            type='refund'
                            color={activeCashItems.ColorCode}
                            Name={activeCashItems.Name}
                            paidAmount={this.state.refunding_amount}
                            placeholder={parseFloat(this.state.refundingCashAmount - this.state.refundingPaidAmount).toFixed(2)}
                            pay_amount={(text) => this.cashPayment(text)}
                            code={activeCashItems.Code}
                            paidAmountStatus={paidAmountStatus}
                            normapNUM={(text) => this.normapNUM(text)}
                            cash_rounding={cash_rounding}
                            closingTab={(text) => this.closingTab(text)}
                            handleFocus={this.handleFocus}
                            activeDisplay={(text) => this.activeDisplay(text)}
                            styles={activeDisplay == false || activeDisplay == `${activeCashItems.Code}_true` ? '' : 'none'}
                            hideCashTab={this.hideCashTab}
                            activeForCash={this.activeForCash}
                            envType={this.props.env_Type}
                            activeDivForCashPayment={this.activeDivForCashPayment}
                            activeCashSplitDiv={activeCashSplitDiv}
                        />
                    }

                    {(activeGlobalSplitDiv == true && activeGlobalItems !== "" && (typeof activeGlobalItems !== "undefined")) &&
                        <GlobalPayment
                            type='refund'
                            color={activeGlobalItems.ColorCode}
                            Name={activeGlobalItems.Name}
                            code={activeGlobalItems.Code}
                            // pay_amount={this.pay_amount}
                            pay_amount={(text) => this.pay_amount(text, pay_name.TerminalCount, '', pay_name.Code )}
                            msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                            activeDisplay={(text) => this.activeDisplay(text)}
                            styles={activeDisplay == false || activeDisplay == `${activeGlobalItems.Code}_true` ? '' : 'none'}
                            closingTab={(text) => this.closingTab(text)}
                            activeGlobalSplitDiv={activeGlobalSplitDiv}
                            activeDivForGlobalPayment={this.activeDivForGlobalPayment}
                        />
                    }
                    <Footer {...this.props} active="refund" />
                </div>
                :
                <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12 pt-4 plr-8">
                    <div className="block__box white-background round-8 full_height overflowscroll text-center pl-3 pr-3">
                        <h2>{LocalizedLanguage.refundAmount}</h2>
                        <div className="wrapper_accordion">
                            <NormalKeypad
                                paidAmount={this.state.refunding_amount}
                                parkOrder='refund'
                                paidAmountStatus={paidAmountStatus}
                                placeholder={parseFloat(this.state.refundingAmount - this.state.refundingPaidAmount).toFixed(2)}
                                normapNUM={(text) => this.normapNUM(text)}
                                closing_Tab={this.state.closingTab}
                                closingTab={(text) => this.closingTab(text)}
                                handleFocus={this.handleFocus}
                                activeDisplay={(text) => this.activeDisplay(text)}
                                styles={activeDisplay == false || activeDisplay == 'undefined_true' ? '' : 'none'}
                                hideCashTab={this.hideCashTab}
                                activeForCash={this.activeForCash}
                                blankTempValue={blankTempValue}
                                ChangeTempValue={this.ChangeTempValue}
                                envType={this.state.envfocus}
                            />
                            {(typeof paymentTypeName !== 'undefined') && paymentTypeName !== null ?
                                paymentTypeName.map((pay_name, index) => {
                                    isOrderPaymentGlobal  = this.checkIfOrderTypeGlobal(single_Order_list,pay_name)
                                    isOrderPaymentGlobal = isOrderPaymentGlobal ? true : false
                                    isOrderPaymentOnline  = this.checkIfOrderTypeOnline(single_Order_list,pay_name)
                                    isOrderPaymentOnline = isOrderPaymentOnline ? true : false
                                    return (
                                        <div key={index}>
                                            {this.state.isPaymentStart === true ? <LoadingModal /> : ""}
                                            {

                                                (pay_name.Code == paymentsType.typeName.payconiq) ?
                                                    <UPIPayments
                                                        type='refund'
                                                        color={pay_name.ColorCode}
                                                        Name={pay_name.Name}
                                                        code={pay_name.Code}
                                                        pay_amount={(text) => this.pay_amount(text)}
                                                        activeDisplay={(text) => this.activeDisplay(text)}
                                                        styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                        payconiqRefundError = {this.state.payconiqRefundError}
                                                    />
                                                    :
                                            // (pay_name.HasTerminal == true && pay_name.TerminalCount > 0 && pay_name.Code != paymentsType.typeName.stripePayment) ?
                                            (pay_name.HasTerminal == true && pay_name.Support == "Terminal" && pay_name.Code != paymentsType.typeName.stripePayment)?
                                                    <GlobalPayment
                                                        type='refund'
                                                        color={pay_name.ColorCode}
                                                        Name={pay_name.Name}
                                                        code={pay_name.Code}
                                                        pay_amount={(text) => this.pay_amount(text, pay_name.TerminalCount, '', pay_name.Code )}
                                                        msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                                                        activeDisplay={(text) => this.activeDisplay(text)}
                                                        styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                        hideCashTab={this.hideCashTab}
                                                        closingTab={(text) => this.closingTab(text)}
                                                        isOrderPaymentGlobal = {isOrderPaymentGlobal}
                                                        paymentDetails={pay_name}
                                                        terminalPopup = {(msg) => this.props.min_max_add(msg)}

                                                    />
                                                    // :
                                                    // null
                                                :
                                                 // for Online payment refund
                                                 (pay_name.Support == paymentsType.typeName.Support) ?
                                                 <ManualPayment
                                                 type='refund'
                                                     color={pay_name.ColorCode}
                                                     Name={pay_name.Name}
                                                     code={pay_name.Code}
                                                     pay_amount={(text) => this.pay_amount(text,pay_name.TerminalCount,pay_name.Support)}
                                                     msg={this.props.global_payment ? this.props.global_payment.message : LocalizedLanguage.waitForTerminal}
                                                     activeDisplay={(text) => this.activeDisplay(text)}
                                                     styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                     closingTab={(text) => this.closingTab(text)}
                                                     onlinePayCardDetails={(cardData) => this.onlinePayCardDetails(cardData)}
                                                     isOrderPaymentOnline  = {isOrderPaymentOnline}
                                                 /> :
                                                pay_name.Code == 'cash' ?
                                                    <CashPayment
                                                        type='refund'
                                                        color={pay_name.ColorCode}
                                                        Name={pay_name.Name}
                                                        paidAmount={this.state.refunding_amount}
                                                        placeholder={parseFloat(this.state.refundingCashAmount - this.state.refundingPaidAmount).toFixed(2)}
                                                        pay_amount={(text) => this.cashPayment(text)}
                                                        code={pay_name.Code}
                                                        paidAmountStatus={paidAmountStatus}
                                                        normapNUM={(text) => this.normapNUM(text)}
                                                        cash_rounding={cash_rounding}
                                                        closingTab={(text) => this.closingTab(text)}
                                                        handleFocus={this.handleFocus}
                                                        activeDisplay={(text) => this.activeDisplay(text)}
                                                        styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                        hideCashTab={this.hideCashTab}
                                                        activeForCash={this.activeForCash}
                                                        envType={this.props.env_Type}
                                                    />
                                                    :
                                                    // pay_name.Code == 'card' ?
                                                    //     <CardPayment
                                                    //         color={pay_name.ColorCode}
                                                    //         Name={pay_name.Name}
                                                    //         code={pay_name.Code}
                                                    //         activeDisplay={(text) => this.activeDisplay(text)}
                                                    //         styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                    //     />
                                                    //     :
                                                    pay_name.Code == paymentsType.typeName.stripePayment ?
                                                        <StripePayment
                                                            type='refund'
                                                            color={pay_name.ColorCode}
                                                            Name={pay_name.Name}
                                                            code={pay_name.Code}
                                                            pay_amount={(text) => this.pay_amount(text)}
                                                            activeDisplay={(text) => this.activeDisplay(text)}
                                                            styles={activeDisplay == false || activeDisplay == `${pay_name.Code}_true` ? '' : 'none'}
                                                            hideCashTab={this.hideCashTab}
                                                            stripRefundError = {this.state.stripRefundError}
                                                        />
                                                        :
                                                        <OtherPayment
                                                            type='refund'
                                                            orderId={single_Order_list.order_id}
                                                            color={pay_name.ColorCode}
                                                            Name={pay_name.Name}
                                                            code={pay_name.Code}
                                                            pay_amount={(text) => this.pay_amount(text)}
                                                            closingTab={(text) => this.closingTab(text)}
                                                            styles={activeDisplay == false ? '' : 'none'}
                                                            hideCashTab={this.hideCashTab}
                                                        />

                                            }
                                        </div>
                                    )
                                })
                                : ''
                            }

                             {/* Extenssion payment types will show here */}
                                {/* <h6 className="box-mid-heading">Extension Payments </h6> */}
                                
                                {this.showExtensionPayments(extStyle)}
                                {/* Extenssion payment types end */}
                                
                            {(typeof getorder.orderCustomerInfo !== 'undefined') && getorder.orderCustomerInfo !== null ?
                                <button style={{ display: activeDisplay == false ? '' : 'none' }} onClick={() => { this.cashPayment('store-credit'); }} className="white-background box-flex-shadow box-flex-border mt-2 round-8 no-outline w-100 p-0 overflow-0">
                                    <div style={{ borderColor: '#46A9D4' }} id="store-credit" value="store-credit" name="payments-type" className="d-flex box-flex box-flex-border-left box-flex-background-global border-dynamic">
                                        <div className="box-flex-text-heading">
                                            <h2>{LocalizedLanguage.storeCreditTitle}</h2>
                                        </div>
                                    </div>
                                </button>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { global_payment, online_payment, make_payconiq_payment } = state;
    return {
        global_payment: global_payment.items,
        online_payment: online_payment.items,
        onLinePaymentError: online_payment.error,
        payconiq_payment: make_payconiq_payment,
    };
}
const connectedRefundViewThird = connect(mapStateToProps)(RefundViewThird);
export { connectedRefundViewThird as RefundViewThird };