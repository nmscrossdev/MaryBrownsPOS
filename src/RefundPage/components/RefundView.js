import React from 'react';
import { connect } from 'react-redux';
import { CommonHeaderFirst, LoadingModal, CommonMsgModal, AndroidAndIOSLoader } from '../../_components';
import { RefundViewFirst, RefundViewSecond, RefundViewThird } from '../';
import { checkoutActions } from '../../CheckoutPage';
import { GetRoundCash } from '../../CheckoutPage/Checkout';
import { get_UDid } from '../../ALL_localstorage';
import ActiveUser from '../../settings/ActiveUser';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import WarningMessage from '../../_components/views/m.WarningMessage';
import $ from 'jquery';
import { isMobileOnly, isIOS } from "react-device-detect";
import ReturnCashPopup from "../../_components/views/m.ReturnCashPopup";
import { default as NumberFormat } from 'react-number-format';
import { customerActions, CustomerViewEdit } from '../../CustomerPage';
import paymentsType from '../../settings/PaymentsType'
import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
import { isConstructorDeclaration } from 'typescript';
import { getHostURLsBySelectedExt, sendClientsDetails, sendRegisterDetails, sendTipInfoDetails } from '../../_components/CommonJS';
import { history } from '../../_helpers';
import { handleAppEvent,postmessage } from '../../ExtensionHandeler/commonAppHandler';
var cash_rounding = ActiveUser.key.cash_rounding;
class RefundView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            single_Order_list: (typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null,
            refundOrderId: 0,
            refundCashRound: 0,
            viewStateList: '',
            refundItems: "",
            refundingPaidAmount: 0,
            Street_Address: '',
            city: '',
            PhoneNumber: '',
            FirstName: '',
            LastName: '',
            Email: '',
            Notes: '',
            Pincode: '',
            getCountryList: localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '',
            getStateList: localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '',
            Street_Address2: '',
            country_name: '',
            state_name: '',
            emailValid: '',
            Cust_ID: 0,
            user_id: 0,
            globalUDID: udid,
            setOrderId: 0,
            refundingAmount: 0,
            isShowLoader: false,
            msg: '',
            before_paid_amount: 0,
            payments: [],
            mobileRefundActivePage: "RefundViewFirst",
            country_code: '',
            state_code: '',
            extHostUrl: '',
            extPageUrl: '',
            extensionIframe: false,
            ext_pay_desc : {}
        }
        this.refundAmount = React.createRef();
        var udid = get_UDid('UDID');
        var getOrderId = this.props.location.search;
        var order_id = 0;
        if (typeof getOrderId !== 'undefined') {
            getOrderId = getOrderId.split("=");
            if (typeof getOrderId[1] !== 'undefined') {
                order_id = getOrderId[1];
            }
        }
        this.setRefundingAmount = this.setRefundingAmount.bind(this);
        this.getRefundPayment = this.getRefundPayment.bind(this);
        this.setRefundPayment = this.setRefundPayment.bind(this);
        this.isRefundPaymentComplete = this.isRefundPaymentComplete.bind(this);
        this.setrefundingPaidAmount = this.setrefundingPaidAmount.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.min_max_add = this.min_max_add.bind(this);
        this.closeMsgModal = this.closeMsgModal.bind(this);
        this.setCashRoundedValue = this.setCashRoundedValue.bind(this);
        this.EditCustomer = this.EditCustomer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.onChangeStateList = this.onChangeStateList.bind(this);
        this.removeRefundPayments();
    }

    handleChange(e) {
        var { name, value } = e.target;

        var emailValid = this.state.emailValid;
        switch (name) {
            case 'Email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false;
                emailValid === true && (value.length <= 60) ? this.setState({ emailValid: '' }) : this.setState({ emailValid: LocalizedLanguage.emailErr });
                break;
            case 'PhoneNumber':
                value = value.match(/^[0-9]*$/) ? value : this.state.PhoneNumber
                break;
            default:
                break;
        }
        this.setState({ [name]: value });


    }

    handleSubmit(e) {
        this.state.isLoading = true;
        const { emailValid, Cust_ID, Street_Address, city, PhoneNumber, Email, FirstName, LastName, Notes, Pincode, Street_Address2, country_code, state_code } = this.state;
        const { dispatch } = this.props;
        if (Email && emailValid == '') {
            const update = {
                WPId: Cust_ID,
                FirstName: FirstName,
                LastName: LastName,
                Contact: PhoneNumber,
                startAmount: 0,
                Email: Email,
                udid: get_UDid('UDID'),
                notes: Notes,
                StreetAddress: Street_Address,
                Pincode: Pincode,
                City: city,
                Country: country_code,
                State: state_code,
                StreetAddress2: Street_Address2
            }
            this.setState({
                isShowLoader: true
            });
            dispatch(customerActions.update(update, 'check_customer'));
            $(".close").click();
        }
    }

    handleChangeList(e) {
        var finalStatelist = [];
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Country == e.target.value) {
                finalStatelist.push(element)
            }
        })
        this.setState({
            viewStateList: finalStatelist,
            country_code: e.target.value,
            state_code: ''
        })
    }

    closeModal = () => {
        setTimeout(() => {
            hideModal('edit-info');
        }, 500);
    }

    onChangeStateList(e) {
        this.setState({
            state_code: e.target.value,
        })
    }

    min_max_add(msg) {
        //alert(msg)
        this.setState({ msg: msg })
        if (msg !== "" && isMobileOnly == true) {
            $('#common_msg_popup').addClass("show");
        }
        showModal('common_msg_popup');
    }

    setRefundingAmount(amount) {
        if (!isMobileOnly) {
            this.refundpayments.setRefundAmount(amount);
        }
        this.setState({
            refundingAmount: amount,
            // refundingAmount: (parseFloat(amount) + parseFloat(cash_round))
        });
    }

    getRefundPayment(order_id, type, amount) {
        this.setState({
            paying_type: type,
            paying_amount: amount,
        });
        var paidAmount = 0;
        var CashRound = parseFloat(GetRoundCash(cash_rounding, this.state.refundingAmount))
        if (localStorage.oliver_refund_order_payments) {
            JSON.parse(localStorage.getItem("oliver_refund_order_payments")).forEach(paid_payments => {
                if (order_id == paid_payments.order_id) {
                    paidAmount += parseFloat(paid_payments.payment_amount);
                }
            });
        } else {
            //alert( "Your browser not support local storage" );
        }
        this.setState({ before_paid_amount: paidAmount })
        if (type == 'cash') {
            if ((parseFloat(parseFloat(this.state.refundingAmount) + parseFloat(CashRound)).toFixed(2) - paidAmount) < amount) {
                if (isMobileOnly == true) {
                    $('#popup_cash_rounding').addClass('show');
                }
                showModal("popup_cash_rounding")
                //$('#popup_cash_rounding').modal('show');
            } else {
                this.setRefundPayment(order_id, type, amount);
            }
        } else {
            this.setRefundPayment(order_id, type, amount);
        }
    }

    addPayment(order_id) {
        var payment = this.refundpayments.setRefundPayment(order_id);
    }

    setRefundPayment(order_id, paying_type, paying_amount) {
        var description = '';
        if (paying_type == 'econduit') {
            var g_payment = JSON.parse(localStorage.getItem('GLOBAL_PAYMENT_RESPONSE'));
            if (g_payment !== null && g_payment.is_success === true) {
                var global_payments = g_payment.content;
                description = `TerminalId-${global_payments.TerminalId} , Authrization-${global_payments.Authrization},RefranseCode-${global_payments.RefranseCode}`;
            }
        }
        // for online payments
        if (paying_type == paymentsType.typeName.manualPayment) {
            var on_payment = JSON.parse(localStorage.getItem('ONLINE _PAYMENT_RESPONSE'));
            if (on_payment !== null && on_payment.is_success === true && on_payment.content.transactionResponse && on_payment.content.transactionResponse.transId != 0) {
                var online_payments = on_payment.content && on_payment.content.transactionResponse;
                description = `TerminalId-${online_payments.transId} , Authrization-${online_payments.authCode},RefranseCode-${global_payments.refId}`;
            }
        }
        var transId = ''
        if(this.state.ext_pay_desc){
            transId = this.state.ext_pay_desc.type  == paying_type ? this.state.ext_pay_desc.transId : ''
        }
        // set order payments in localstorage
        if (typeof (Storage) !== "undefined") {
            if (localStorage.oliver_refund_order_payments) {
                var payments = JSON.parse(localStorage.getItem("oliver_refund_order_payments"));
                payments.push({
                    "payment_type": paying_type,
                    "payment_amount": paying_amount,
                    "order_id": order_id,
                    "description": description,
                    "transection_id"  : transId
                    
                });
                this.setState({ payments: payments })
                localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
            } else {
                var payments = new Array();
                payments.push({
                    "payment_type": paying_type,
                    "payment_amount": paying_amount,
                    "order_id": order_id,
                    "description": description,
                    "transection_id"  : transId
                    
                });
                this.setState({ payments: payments })
                localStorage.setItem("oliver_refund_order_payments", JSON.stringify(payments));
            }
        } else {
            // alert( "Your browser not support local storage" );
        }
        // set order payments in localstorage
        this.isRefundPaymentComplete(order_id, paying_type);
    }

    setCashRoundedValue(CashRound) {
        var order_detail = JSON.parse(localStorage.getItem("getorder"))
        var order_id = order_detail.order_id;
        var payment_amount = 0;
        var paidAmount = 0;
        const { paying_amount, refundingAmount, before_paid_amount } = this.state;
        if (parseFloat(paying_amount) > ((parseFloat(refundingAmount) + parseFloat(CashRound)) - parseFloat(before_paid_amount))) {
            payment_amount = (parseFloat(refundingAmount) + parseFloat(CashRound)) - parseFloat(before_paid_amount);
        } else {
            payment_amount = paying_amount;
            //payment_amount = parseFloat(refundingAmount + (paying_amount - refundingAmount)).toFixed(2);
        }
        var payment_type = 'cash';
        this.setRefundPayment(order_id, payment_type, payment_amount)
    }

    isRefundPaymentComplete(order_id, paying_type) {
        var payments = JSON.parse(localStorage.getItem("oliver_refund_order_payments"));
        var refundAmount = this.state.refundingAmount;
        var paidAmount = 0;
        var CashRound = 0;
        if (paying_type == 'cash') {
            CashRound = parseFloat(GetRoundCash(cash_rounding, parseFloat(this.state.refundingAmount)))
            refundAmount = parseFloat(refundAmount) + parseFloat(CashRound);
        }
        //get total paid amount
        if (localStorage.oliver_refund_order_payments) {
            JSON.parse(localStorage.getItem("oliver_refund_order_payments")).forEach(paid_payments => {
                if (order_id == paid_payments.order_id) {
                    paidAmount += parseFloat(paid_payments.payment_amount);
                }
            });
        } else {
            //alert( "Your browser not support local storage" );
        }
        this.setrefundingPaidAmount(paidAmount);
        if (parseFloat(refundAmount).toFixed(2) == parseFloat(paidAmount).toFixed(2)) {
            if (!isMobileOnly) {
                this.refundcart.refund(order_id, CashRound);
                this.removeRefundPayments();
                this.showLoader()
            }
            if (isMobileOnly == true) {
                //this.removeRefundPayments();
                this.showLoader()
                this.setRefundPayments(order_id, CashRound)
            }
            // this.refundcart.refund(order_id, CashRound);

        } else if (parseFloat(refundAmount).toFixed(2) < parseFloat(paidAmount).toFixed(2)) {
            //  alert("Can't pay more amount then refund amount.");
        }
    }

    showLoader() {
        this.setState({
            isShowLoader: true,
        });
    }

    setrefundingPaidAmount(amount) {
        if (!isMobileOnly) {
            this.refundpayments.setrefundingPaidAmount(amount);
        }
        if (isMobileOnly == true) {
            this.setSplitPayments(amount)
        }
    }

    setSplitPayments(amount) {
        this.setState({
            refundingPaidAmount: amount,
        })
    }

    removeRefundPayments() {
        if (localStorage.oliver_refund_order_payments) {
            localStorage.removeItem("oliver_refund_order_payments");
        }
    }

    componentWillMount() {
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
            // autoFocus()
        }, 1000);
        //var UID= get_UDid('UDID');
        this.props.dispatch(checkoutActions.cashRounding());
        var customer = (typeof localStorage.getItem("getorder") !== 'undefined') && JSON.parse(localStorage.getItem("getorder")).orderCustomerInfo !== null ? JSON.parse(localStorage.getItem("getorder")).orderCustomerInfo : null;
        if (customer !== null) {
            this.setState({
                Email: customer.customer_email !== null ? customer.customer_email : "",
                Cust_ID: customer.customer_id !== null ? customer.customer_id : "",
                Street_Address: customer.customer_address !== null ? customer.customer_address : "",
                city: customer.customer_city !== null ? customer.customer_city : "",
                PhoneNumber: customer.customer_phone !== null ? customer.customer_phone : "",
                FirstName: customer.customer_first_name !== null ? customer.customer_first_name : "",
                LastName: customer.customer_last_name !== null ? customer.customer_last_name : "",
                Notes: customer.customer_note !== null ? customer.customer_note : "",
                Pincode: customer.customer_post_code !== null ? customer.customer_post_code : "",
                Street_Address2: customer.customer_address !== null ? customer.customer_address : "",
                country_name: customer.customer_Country !== null ? customer.customer_Country : "",
                country_code: customer.customer_Country !== null ? customer.customer_Country : "",
                state_name: customer.customer_State !== null ? customer.customer_State : "",
                state_code: customer.customer_State !== null ? customer.customer_State : ""
            });


            var finalStatelist = [];
            this.state.getStateList && this.state.getStateList.find(function (element) {
                if (element.Country == customer.customer_Country) {
                    finalStatelist.push(element)
                }
            })
            this.setState({
                viewStateList: finalStatelist,
                // country_code: e.target.value,
                // state_code: ''
            })
        }
    }

    componentWillReceiveProps(recieveProps) {
        if (recieveProps.refundOrder) {
            this.setState({
                isShowLoader: false,
                //backToActivity:true
            });
            this.removeRefundPayments();
            this.min_max_add(recieveProps.refundOrder.message)
            setTimeout(() => {
               // if(recieveProps.refundOrder.is_success == true){
                    window.location = '/activity'
                   
                //}
            }, 2000)
        }
        if (recieveProps.customer_save_data && recieveProps.customer_save_data.items && recieveProps.customer_save_data.items.is_success == true) {
            this.setState({
                isShowLoader: false
            });
            var customerDetails = recieveProps.customer_save_data.items.content;
            var orderDetails = (typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null;
            var refundOrderCustomer = orderDetails.orderCustomerInfo ? orderDetails.orderCustomerInfo : ''
            // orderDetails.order_custom_fee.map(item => {
            if (refundOrderCustomer && refundOrderCustomer !== '' && customerDetails) {

                refundOrderCustomer.customer_city = customerDetails.City
                refundOrderCustomer.customer_phone = customerDetails.Contact
                refundOrderCustomer.customer_Country = customerDetails.Country
                refundOrderCustomer.customer_email = customerDetails.Email
                refundOrderCustomer.customer_first_name = customerDetails.FirstName
                refundOrderCustomer.customer_last_name = customerDetails.LastName
                refundOrderCustomer.customer_post_code = customerDetails.Pincode
                refundOrderCustomer.customer_State = customerDetails.State
                refundOrderCustomer.customer_address = customerDetails.StreetAddress
                refundOrderCustomer.customer_address = customerDetails.StreetAddress2
                refundOrderCustomer.customer_note = customerDetails.notes
                refundOrderCustomer.customer_name = customerDetails.UserName

                orderDetails.orderCustomerInfo = refundOrderCustomer
                localStorage.setItem('getorder', JSON.stringify(orderDetails))
                this.setState({
                    isShowLoader: false
                });
            }
        }
    }

    closeMsgModal() {
        this.setState({ common_Msg: '' });
    }

    openMobilePaymentOption = (active, items) => {
        //  console.log("openMobilePaymentOption", active, items)
        this.setState({
            mobileRefundActivePage: active,
            refundItems: items
        });
    }

    setRefundPayments(order_id, CashRound) {
        this.setState({
            refundOrderId: order_id,
            refundCashRound: CashRound
        });
    }

    EditCustomer() {
        this.setState({ emailValid: '' })
        setTimeout(() => {
            showModal('edit-info');
        }, 500);
    }

    componentDidMount = () => {
        var _user = JSON.parse(localStorage.getItem("user"));
        // ************ Update _user.instance for local testing ************* //
        // _user.instance = window.location.origin
        // localStorage.setItem("user", JSON.stringify(_user));
        // ************ End ********* //
        window.addEventListener('message', (e) => {
            if (e.origin && _user && _user.instance) {
                try {
                    var extensionData = typeof e.data == 'string' ? JSON.parse(e.data) : e.data;
                    if (extensionData && extensionData !== "" && extensionData.oliverpos) {
                        this.showExtention(extensionData);
                    }
                    var appResponse= handleAppEvent(extensionData,"RefundView");  
                    if(appResponse=='app_do_payment'){                          
                        this.handleAppPayment(extensionData)
                     } 
                }
                catch (err) {
                    console.error(err);
                }
            }
        }, false);
    }

    // *** Refudn view extension code start *** ///
    // get extension pageUrl and hostUrl of current clicked extension
    // get extension pageUrl and hostUrl of current clicked extension on pay,ment section 
    handleExtensionPaymentClick = (ext_id) => {
        // get host and page url from common fucnction   
        var data = getHostURLsBySelectedExt(ext_id)
        this.setState({
            extHostUrl: data ? data.ext_host_url : '',
            extPageUrl: data ? data.ext_page_url : '',
            selectedExtensionName:data?data.ext_name:''
        })

        this.setState({ extensionIframe: true })
        setTimeout(() => {
            showModal('common_ext_popup')
        }, 500);
    }

    close_ext_modal = () => {
        this.setState({ extensionIframe: false })
    }

    showExtention = (value) => {
        var jsonMsg = value ? value : '';
        var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (clientEvent && clientEvent !== '') {
            // console.log("clientEvent", jsonMsg)
            switch (clientEvent) {
                case "extensionReady":
                    this.extensionReady()
                    break;
                case "extensionPayment":
                    this.makePaymentByExtesion(jsonMsg.data)
                    break;
                case "registerInfo":
                    sendRegisterDetails()
                    break;
                case "clientInfo":
                    sendClientsDetails()
                    break;
                case "tipInfo":
                    sendTipInfoDetails()
                    break;
                case "addOrderNotes":
                    this.addExtensionNotesToOrderNotes(jsonMsg.data)
                    break;
                default: // extensionFinished
                    console.log('App Error : Extension event does not match ', jsonMsg);
                    break;
            }
        }
    }
    // add extensio notes to order notes 
    addExtensionNotesToOrderNotes = (data)=>{
        if (data && data.note && data.orderId) {
            var selectedOrderDetails = localStorage.getItem('getorder') ? JSON.parse(localStorage.getItem('getorder')) : null
            if (selectedOrderDetails && selectedOrderDetails.order_id && selectedOrderDetails.order_id == data.orderId) {
                this.refundcart.addNotesToRefundOrderNotes(data)
            } else {
                console.error('Extension Error : Order id does not match with selected order')
            }
        }

    }

    // extesion payment (mobilePay)
    makePaymentByExtesion = (data) => {
        try {
            if (data && data.paymentDetails && data.paymentDetails.paymentStatus == 'success') {
                var type = data && data.paymentDetails && data.paymentDetails.paymentType ? data.paymentDetails.paymentType : ''
                var transId = data.paymentDetails && data.paymentDetails.transaction_id ? data.paymentDetails.transaction_id : ''
                var ext_pay_desc = {
                    transId,
                    type
                }
                this.setState({
                    ext_pay_desc : ext_pay_desc
                })

                hideModal('common_ext_popup')
                this.refundpayments.pay_amount(type);
            }
            else {

                console.error('App Error : invalid data found ', data)
            }
        } catch (error) {
            console.error('App Error : ', error)
        }

    }

    extensionReady = () => {
        const { single_Order_list } = this.props
        // var orderDetails = single_Order_list && single_Order_list.content
        var orderDetails = localStorage.getItem('getorder') ? JSON.parse(localStorage.getItem('getorder')) : []
        // var customerDetails = orderDetails ? orderDetails.orderCustomerInfo : []
        var transectionID=""  ;
        orderDetails.order_payments && orderDetails.order_payments.length>0 && orderDetails.order_payments.map(item=>{
            if(this.state.selectedExtensionName && item.type.toLowerCase()==this.state.selectedExtensionName.toLowerCase()){
                transectionID=item.transection_id;
            }
        })
        var data = {}        
        if(data && orderDetails){
            data['email'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_email ? orderDetails.orderCustomerInfo.customer_email : ''
            data['wordpressId'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_id ? orderDetails.orderCustomerInfo.customer_id : ''
            data['addressLine1'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_address ? orderDetails.orderCustomerInfo.customer_address : ''
            data['addressLine2'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_address ? orderDetails.orderCustomerInfo.customer_address : ''
            data['city'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_city ? orderDetails.orderCustomerInfo.customer_city : ''
            data['zip'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_post_code ? orderDetails.orderCustomerInfo.customer_post_code : ''
            data['countryCode'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_country_code ? orderDetails.orderCustomerInfo.customer_country_code : ''
            data['country'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_Country ? orderDetails.orderCustomerInfo.customer_Country : ''
            data['stateCode'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_post_code ? orderDetails.orderCustomerInfo.customer_post_code : ''
            data['state'] = orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo.customer_State ? orderDetails.orderCustomerInfo.customer_State : ''
            
            data['totalTax'] = orderDetails.total_tax ? orderDetails.total_tax: ''
            data['cartProducts'] = orderDetails.line_items ? orderDetails.line_items: []
            data['total'] = this.state.paying_amount ? this.state.paying_amount : this.state.refundingAmount
            //data['transaction_id'] = orderDetails.order_payments && orderDetails.order_payments.length ? orderDetails.order_payments[0].transection_id : ''
            data['transaction_id'] =transectionID
            data['order_id'] = orderDetails && orderDetails.order_id ? orderDetails.order_id : 0
            data['order_payments']= orderDetails && orderDetails.order_payments ?orderDetails.order_payments:null
            
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
                    ...data
                },
            }
        };
        if (this.state.extensionIframe == true) {
            var iframex = ''
            iframex = document.getElementById("commoniframe").contentWindow;
        } else {
            iframex = document.getElementById("iframeViewSecond").contentWindow;
        }
        console.log("clientJSON",clientJSON);
        iframex.postMessage(JSON.stringify(clientJSON), '*');
        
    }

    // *** refund view  extension code end *** ///


    render() {
        const { paying_amount, refundingAmount, before_paid_amount, msg } = this.state;
        var CashRound = parseFloat(GetRoundCash(cash_rounding, refundingAmount));
        return (
            (isMobileOnly == true) ?
                <div>
                    {this.state.isShowLoader ? <AndroidAndIOSLoader /> : ''}
                    {/* {(this.state.mobileRefundActivePage === 'RefundViewFirst' ? */}
                    <RefundViewFirst
                        min_max_add={this.min_max_add}
                        onRef={ref => (this.refundcart = ref)}
                        {...this.props}
                        {...this.state}
                        refundingAmount={this.setRefundingAmount}
                        openMobilePaymentOption={this.openMobilePaymentOption}
                        addPayment={this.getRefundPayment}
                        close_Msg_Modal={this.closeMsgModal}
                    />
                    {/* // :
                    // this.state.mobileRefundActivePage === 'refundpayment' ?
                    //     <RefundViewThird
                    //         {...this.props}
                    //         {...this.state}
                    //         min_max_add={this.min_max_add}
                    //         onRef={ref => (this.refundpayments = ref)}
                    //         addPayment={this.getRefundPayment}
                    //         env_Type={localStorage.getItem('env_type')}
                    //     />
                        : null */}
                    {/*  )}*/}
                    <WarningMessage msg_text={msg} close_Msg_Modal={this.closeMsgModal} />
                    <ReturnCashPopup
                        type="refund"
                        closeModal={this.closeMsgModal}
                        {...this.props}
                        refundTotalAmount={parseFloat((parseFloat(refundingAmount) + parseFloat(CashRound)) - before_paid_amount).toFixed(2)}
                        NumberFormat={NumberFormat}
                        finalAdd={this.setCashRoundedValue}
                        LocalizedLanguage={LocalizedLanguage}
                        cash_payment={parseFloat(paying_amount).toFixed(2)}
                        change_amount={(parseFloat(paying_amount - (refundingAmount - before_paid_amount)).toFixed(2) > 0) ? (parseFloat(paying_amount - ((parseFloat(refundingAmount) + parseFloat(CashRound)) - before_paid_amount)).toFixed(2)) : '0.00'}
                        CashRound={CashRound}
                    />
                </div>
                :
                <div>
                    <div className="wrapper">
                        <div id="content">
                            {this.state.isShowLoader ? <LoadingModal /> : ''}
                            <CommonHeaderFirst {...this.props} />
                            <div className="inner_content bg-light-white clearfix">
                                <div className="content_wrapper">
                                    <RefundViewFirst min_max_add={this.min_max_add} onRef={ref => (this.refundcart = ref)} {...this.props} refundingAmount={this.setRefundingAmount} payments={this.state.payments} />
                                    <div className="col-lg-9 col-sm-8 col-xs-8">
                                        <div className="row">
                                            <RefundViewSecond {...this.props} EditCustomer={this.EditCustomer} />
                                            <RefundViewThird {...this.props} min_max_add={this.min_max_add} onRef={ref => (this.refundpayments = ref)} addPayment={this.getRefundPayment} env_Type={localStorage.getItem('env_type')}
                                                handleExtensionPaymentClick={(event) => this.handleExtensionPaymentClick(event)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="edit-info" className="modal fade popUpMid">
                        <CustomerViewEdit
                            onClick={() => this.handleSubmit()}
                            onChange={this.handleChange}
                            Street_Address={this.state.Street_Address ? this.state.Street_Address : ''}
                            city={this.state.city ? this.state.city : ''}
                            PhoneNumber={this.state.PhoneNumber ? this.state.PhoneNumber : ''}
                            FirstName={this.state.FirstName ? this.state.FirstName : ''}
                            LastName={this.state.LastName ? this.state.LastName : ''}
                            Email={this.state.Email ? this.state.Email : ''}
                            Notes={this.state.Notes ? this.state.Notes : ''}
                            Pincode={this.state.Pincode ? this.state.Pincode : ''}
                            getCountryList={this.state.getCountryList}
                            getState={this.state.viewStateList ? this.state.viewStateList : ''}
                            Street_Address2={this.state.Street_Address2 ? this.state.Street_Address2 : ''}
                            country_name={this.state.country_code ? this.state.country_code : ''}
                            state_name={this.state.state_code ? this.state.state_code : ''}
                            onChangeList={this.handleChangeList}
                            onChangeStateList={this.onChangeStateList}
                            Cust_ID={this.state.Cust_ID}
                            onClick1={() => this.closeModal}
                            emailValid={this.state.emailValid} />
                    </div>
                    <CommonMsgModal msg_text={this.state.msg} close_Msg_Modal={this.closeMsgModal} />
                    <div id="popup_cash_rounding" className="modal modal-wide modal-wide1 cancle_payment disabled_popup_close" >
                        <div className="modal-dialog" id="dialog-midle-align">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button onClick={() => this.closeMsgModal()} type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                        <img src="assets/img/delete-icon.png" />
                                    </button>
                                    <h4 className="modal-title">{LocalizedLanguage.refundTitle}</h4>
                                </div>
                                <div className="modal-body p-0">
                                    <h3 className="popup_payment_error_msg" id="popup_cash_rounding_error_msg">
                                        <div className="row font18 mb-3">
                                            <div className="col-sm-6 text-left">
                                                {LocalizedLanguage.total}
                                                <span className="pull-right">:</span>
                                            </div>
                                            <div className="col-sm-6">
                                                {parseFloat((parseFloat(refundingAmount) + parseFloat(CashRound)) - before_paid_amount).toFixed(2)}
                                            </div>
                                        </div><hr />
                                        <div className="row font18">
                                            <div className="col-sm-6 text-left">
                                                {LocalizedLanguage.paymentCash}
                                                <span className="pull-right">:</span>
                                            </div>
                                            <div className="col-sm-6">{parseFloat(paying_amount).toFixed(2)}</div>
                                        </div> <hr />
                                        {(parseFloat(paying_amount - (refundingAmount - before_paid_amount)).toFixed(2) > 0) ?
                                            <div className="row font18">
                                                <div className="col-sm-6 text-left">
                                                    {LocalizedLanguage.changeTitle}
                                                    <span className="pull-right">:</span>
                                                </div>
                                                <div className="col-sm-6">{parseFloat(paying_amount - ((parseFloat(refundingAmount) + parseFloat(CashRound)) - before_paid_amount)).toFixed(2)}</div>
                                            </div>
                                            :
                                            null
                                        }
                                        {(parseFloat(paying_amount - ((parseFloat(refundingAmount) + parseFloat(CashRound)) - before_paid_amount)).toFixed(2) > 0) ? <hr /> : null}
                                        <div className="row font18">
                                            <div className="col-sm-6 text-left">
                                                {LocalizedLanguage.balance}
                                                <span className="pull-right">:</span>
                                            </div>
                                            <div className="col-sm-6" id="balance_left">0.00</div>
                                        </div>
                                    </h3>
                                </div>
                                <div className="modal-footer" style={{ borderTop: 0 }}>
                                    <button type="button" className="btn btn-primary btn-block h66" style={{ backgroundColor: '#d43f3a', borderColor: '#d43f3a', borderRadius: 5, height: 70 }} data-dismiss="modal" aria-hidden="true" id="popup_cash_rounding_button" onClick={() => { this.setCashRoundedValue(CashRound); }}>{LocalizedLanguage.addPayment}</button>
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
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { refundOrder, customer_save_data } = state;
    return {
        refundOrder: refundOrder.error,
        customer_save_data: customer_save_data
    };
}
const connectedRefundView = connect(mapStateToProps)(RefundView);
export { connectedRefundView as RefundView };