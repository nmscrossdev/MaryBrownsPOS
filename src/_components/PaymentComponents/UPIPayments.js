import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly, isIOS } from "react-device-detect";
import { LoadingModal } from '../LoadingModal';
import Config from '../../Config'
import { v4 as uuidv4 } from 'uuid';
import ActiveUser from '../../settings/ActiveUser';
import { paymentActions } from '../../CheckoutPage';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
class UPIPayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDisplayStatus: false,
            popupClass: '',
            loading: false,
            msgColor: 'red',
            UPI_error_msg: '',
            barcodeURl: '',
            uniqueID: null,
            payconiq_payment_cancel_url: '',
            payconiq_current_status: '',
            pageSatus: true,
            minutesLeft: 0,
            secondsLeft: 0,
            sessionMsg: ''
            // payconiq_payment_cancel_url: 'https://api.ext.payconiq.com/v3/payments/f23d8c4362936d00650987e6'
        }
    }

    hideTab(st) {
        this.setState({ UPI_error_msg: '', uniqueID: uuidv4(), sessionMsg: '' })
        // setTimeout(() => {
        if (this.props.type == 'refund') {
            // check if product selected or not
            var refundItemsQuantity = []
            $(".refunndingItem").each(function () {
                var item_id = $(this).attr('data-id');
                var quantity = parseInt($(`#counter_show_${item_id}`).text());
                refundItemsQuantity.push({
                    'Quantity': quantity,
                });
            });
            if (refundItemsQuantity.length > 0) {
                this.setState({
                    activeDisplayStatus: st,
                })
            }
            this.props.pay_amount(this.props.code)


        } else {
            // call API to make payConiq payment request
            this.setState({
                activeDisplayStatus: st,
            })
            setTimeout(() => {
                this.make_payconiq_payment_request()
            }, 1000);
        }
        // }, 2000);
    }
    closePopup = () => {
        this.setState({ activeDisplayStatus: false })
    }
    componentWillReceiveProps = (nextprops) => {
        // check for payconiq payment to get barcode and other lonks
        if (nextprops && nextprops.payconiq_payment) {
            if (nextprops.payconiq_payment.error) {
                clearInterval(this.checkStatusInterval)
                clearInterval(this.countdownInterval);
                this.setState({
                    UPI_error_msg: nextprops.payconiq_payment.error,
                    payconiq_payment_cancel_url: ''
                })
            }
            else if (nextprops.payconiq_payment.items && nextprops.payconiq_payment.items.content) {
                // success case
                var payconiq_response = nextprops.payconiq_payment.items.content
                if (payconiq_response && payconiq_response.paymentId && payconiq_response._links) {
                    // set barcode url from UPIPayment API response  
                    var payconiq_response_links = payconiq_response._links
                    var barcode_url = payconiq_response_links.qrcode && payconiq_response_links.qrcode.href
                    var cancel_payconiq_url = payconiq_response_links.cancel && payconiq_response_links.cancel.href
                    this.setState((prevState) => ({
                        barcodeURl: barcode_url ? barcode_url : prevState.barcodeURl,
                        payconiq_payment_cancel_url: cancel_payconiq_url ? cancel_payconiq_url : prevState.payconiq_payment_cancel_url,
                        UPI_error_msg: '',
                        payconiq_current_status: 'PENDING'
                        // pageSatus : true
                    }));
                    this.payconiq_expires_time_diff(payconiq_response.expiresAt, payconiq_response.createdAt)
                    this.props.dispatch(paymentActions.make_payconiq_payment(null))

                }
            }
        }
        // check for payconiq payment status  
        if (nextprops.check_payconiq_pay_status) {
            if (nextprops.check_payconiq_pay_status.error) {
                this.setState({
                    UPI_error_msg: nextprops.payconiq_payment.error
                })
            } else if (nextprops.check_payconiq_pay_status.items && nextprops.check_payconiq_pay_status.items.content) {
                var _payconiq_status_res = nextprops.check_payconiq_pay_status.items.content
                var _payconiq_status = _payconiq_status_res && _payconiq_status_res.Status ? _payconiq_status_res.Status : ''
                this.setState({
                    UPI_error_msg: '',
                    payconiq_current_status: _payconiq_status
                })
                if ((_payconiq_status == "SUCCEEDED") && this.state.pageSatus == true) {
                    clearInterval(this.checkStatusInterval)
                    clearInterval(this.countdownInterval);

                    this.setState({
                        pageSatus: false,
                        UPI_error_msg: '',
                        payconiq_current_status: _payconiq_status,
                        activeDisplayStatus: false,
                        payconiq_payment_cancel_url: ''
                    })
                    var payConiqPayAmount=0;
                    if(_payconiq_status_res.Amount && _payconiq_status_res.Amount !=="" && parseFloat(_payconiq_status_res.Amount)>0){
                        payConiqPayAmount= parseFloat(_payconiq_status_res.Amount)/100
                    }                  
                    this.props.pay_amount(this.props.code, 0,  '', '', payConiqPayAmount )
                }
                if ((_payconiq_status == "CANCELLED")) {
                    this.setState({
                        UPI_error_msg: 'Payment Canceled !',
                        pageSatus: false,
                        payconiq_payment_cancel_url: ''
                    })
                    clearInterval(this.checkStatusInterval)
                    clearInterval(this.countdownInterval);
                }

                // regenerate QR code in case of status 'EXPIRED' and clear status interval
                if (_payconiq_status == 'EXPIRED') {
                    clearInterval(this.checkStatusInterval)
                    clearInterval(this.countdownInterval);
                    this.setState({
                        UPI_error_msg: 'Session Expired',
                        payconiq_payment_cancel_url: '',
                        //barcodeURl: ''
                    })
                    this.props.dispatch(paymentActions.check_payconiq_pay_status(null))

                }
            }
        }
        // cancel payment response
        if (nextprops && nextprops.cancel_payconiq_payment) {
            if (nextprops.cancel_payconiq_payment.items) {
                clearInterval(this.checkStatusInterval)
                clearInterval(this.countdownInterval);
                this.setState({
                    UPI_error_msg: '',
                    payconiq_payment_cancel_url: '',
                    activeDisplayStatus: false,
                    barcodeURl: '',
                    payconiq_current_status: 'PENDING'
                })
                // window.location = '/checkout';
                this.props.dispatch(paymentActions.cancel_payconiq_payment(null))
            } else if (nextprops.cancel_payconiq_payment.error) {
                this.setState({
                    UPI_error_msg: nextprops.cancel_payconiq_payment.error,
                    // payconiq_payment_cancel_url : ''
                })
            }
        }
        // handle refund payment error
        if (nextprops && nextprops.payconiqRefundError && nextprops.payconiqRefundError !== '') {
            this.setState({
                UPI_error_msg: nextprops.payconiqRefundError,
                payconiq_payment_cancel_url: ''
            })
        }
    }
    // fucntion to make payconiq payment request to get barcode, cancel payment response 
    make_payconiq_payment_request = async () => {
        console.log("Props", this.props)
        var payconiqPrice = 0
        // get price for mobile
        var checkList = localStorage.getItem("CHECKLIST") && JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        if (checkList && checkList.totalPrice && parseFloat(checkList.totalPrice) >= paid_amount) {
            payconiqPrice = (parseFloat(checkList.totalPrice) - parseFloat(paid_amount));
        }

        var payconiq_pay_amount = isMobileOnly == true || ActiveUser.key.isSelfcheckout == true ? payconiqPrice : $('#my-input').val();

        console.log("chargeAmount", parseFloat(payconiq_pay_amount))
        // this.setState({ chargeAmount: parseFloat(payconiq_pay_amount) })
        if (this.state.uniqueID) {
            var _requestData = {
                "registerId": localStorage.getItem('register') ? localStorage.getItem('register') : 1,
                "amount": parseFloat(payconiq_pay_amount),
                "paycode": this.props.code,
                "command": "Sale",
                "SessionId": this.state.uniqueID
            }
            this.props.dispatch(paymentActions.make_payconiq_payment(_requestData))
            this.check_payconiq_payment_status()
            this.checkStatusInterval = setInterval(() => {
                this.check_payconiq_payment_status()
            }, 5000);
        }
    }

    // check payConiq barcode scan status
    check_payconiq_payment_status = async () => {
        this.props.dispatch(paymentActions.check_payconiq_pay_status(this.state.uniqueID))
    }
    // regenerate barcoe in case of payment status 'EXPIRED
    regenerate_payconiq_barcode = () => {
        this.setState({
            UPI_error_msg: '',
            payconiq_payment_cancel_url: '',
            uniqueID: uuidv4()
        })
        setTimeout(() => {
            this.make_payconiq_payment_request()
            this.props.dispatch(paymentActions.cancel_payconiq_payment(null))

        }, 200);
    }

    // cancel UPI payments
    cancel_UPI_payment = async () => {
        const { payconiq_payment_cancel_url } = this.state
        if (payconiq_payment_cancel_url && payconiq_payment_cancel_url !== '') {
            var _requestData = {
                "Url": payconiq_payment_cancel_url
            }
            this.props.dispatch(paymentActions.cancel_payconiq_payment(_requestData))
        } else {
            clearInterval(this.checkStatusInterval)
            clearInterval(this.countdownInterval);
            this.props.dispatch(paymentActions.make_payconiq_payment(null))
            this.setState({
                activeDisplayStatus: false,
                UPI_error_msg: '',
                payconiq_payment_cancel_url: '',
                payconiq_current_status: '',
            })
        }
    }

    //get time  dierence between createAT and expiresAt session for payconiq barcode
    payconiq_expires_time_diff = (dt2, dt1) => {
        var counter = 0
        var endDate = new Date(dt2); // 2017-05-29T00:00:00Z
        var startDate = new Date(dt1);
        this.setState({ sessionMsg: LocalizedLanguage.sessionwillbeexpired })
        if (((endDate - startDate) - counter) < 0) {
            this.setState({ sessionMsg: '' })
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => {
            counter = counter + 1000;
            var diff = (endDate - startDate) - counter
            var minutes = Math.floor(diff / 60000);
            var seconds = ((diff % 60000) / 1000).toFixed(0);
             if (seconds < 0) {
                $('#counterId').text('')
                $('#counterParentId').text('')
            } else {
                $('#counterId').text('' + minutes + ' : ' + seconds + ' minutes')
            }
        }, 1000);
    }

    render() {
        const { activeDisplayStatus, UPI_error_msg } = this.state;
        const { color, Name, code, pay_amount, styles } = this.props;
       return (
            (ActiveUser.key.isSelfcheckout == true && activeDisplayStatus !== true) ?
                // <div>
                //     <button
                //         style={{ borderLeftColor: color, marginBottom: isMobileOnly == true ?15:30 }}
                //         className={isMobileOnly == true ?
                //             "btn btn-light text-dark btn-block h-60 shadow-none fz-14" :
                //             "btn btn-default btn-block btn-90 btn-uppercase"}
                //         onClick={() => this.hideTab(!activeDisplayStatus)}>
                //         {Name}
                //     </button>

                    // <div className="row">
                          <button onClick={() => this.hideTab(!activeDisplayStatus)}>{Name}</button>
                        // </div>

                // </div>   
                :
                (isMobileOnly == true) && activeDisplayStatus !== true ?
                    <button
                        type="submit"
                        style={{ borderLeftColor: color, marginBottom: 15 }}
                        className="btn btn-default btn-lg btn-block btn-style-02"
                        onClick={() => this.hideTab(!activeDisplayStatus)}>
                        {Name}
                    </button>
                    :

                    activeDisplayStatus !== true ?
                        <div style={{ display: styles }} onClick={() => this.hideTab(!activeDisplayStatus)} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0">
                            <div className="section">
                                <div className="" data-isopen="">
                                    <div className="pointer">
                                        <div style={{ borderColor: color }} className="d-flex box-flex box-flex-border-left box-flex-background-stripe border-dynamic">
                                            <div className="box-flex-text-heading">
                                                <h2>{Name}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        // <div className="loader-fixed">
                            <div className="popup productPopup bodyCenter">
                            <div className="user_login user_login_popup" style={{ textAlign: 'center' }}>
                                <div className="user__login_header">
                                    <div className="user_login_container">
                                        <img alt="Logo" src="../assets/images/logo-dark.svg" />
                                    </div>
                                </div>
                                <div className="user_login_pages">
                                    <div className="user_login_container">
                                        <div className="user_login_row">
                                            <div className="user_login_form_wrapper">
                                                <div className="user_login_form_wrapper_container">
                                                    <div className="user_login_form">
                                                        <div className="">
                                                            <div className="user_login_scroll_in">
                                                                <div className="user_login_center">
                                                                    <div className="user_login_head user_login_join">
                                                                        {this.state.barcodeURl !== "" ?
                                                                            <div>
                                                                                <img src={this.state.barcodeURl} style={{ width: '250px' }}></img>
                                                                                {/* alt="Girl in a jacket" width="500" height="600" */}
                                                                            </div>
                                                                            :
                                                                            <div>
                                                                                <h3 className="user_login_head_title">
                                                                                    {LocalizedLanguage.pleaseWait}
                                                                        </h3>
                                                                                <div className="user_login_head_logo">
                                                                                    <a href="#">
                                                                                        <svg
                                                                                            version="1.1" id="ologo"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                                            x="0px"
                                                                                            y="0px"
                                                                                            viewBox="0 0 400 400"
                                                                                            style={{ "enableBackground": 'new 0 0 400 400' }}
                                                                                            xmlSpace="preserve" width="120px" height="120px"
                                                                                        >

                                                                                            <rect id="lime" x="249.28" y="156.01"
                                                                                                className="st0 ologo-1" width="103.9" height="103.9">
                                                                                            </rect>
                                                                                            <path id="teal" className="st1 ologo-2"
                                                                                                d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z">
                                                                                            </path>
                                                                                            <rect id="cyan" x="145.38" y="259.91"
                                                                                                className="st2 ologo-3" width="103.9" height="103.89">
                                                                                            </rect>
                                                                                            <path id="blue" className="st3 ologo-4"
                                                                                                d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z">
                                                                                            </path>
                                                                                            <rect id="purple" x="41.49" y="156.01"
                                                                                                className="st4 ologo-5" width="103.9" height="103.9">
                                                                                            </rect>
                                                                                            <path id="red" className="st5 ologo-6"
                                                                                                d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z">
                                                                                            </path>
                                                                                            <rect id="orange" x="145.38" y="52.12"
                                                                                                className="st6 ologo-7" width="103.9" height="103.9">
                                                                                            </rect>
                                                                                            <path id="yellow" className="st7 ologo-8"
                                                                                                d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z">
                                                                                            </path>
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <button
                                                                        className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30"
                                                                        onClick={this.cancel_UPI_payment}
                                                                        style={{ minWidth: '220px' }}
                                                                    >
                                                                        {LocalizedLanguage.cancel}
                                                                    </button>
                                                                    <br></br><br></br>
                                                                    {/* show regenrate QR code in case of payment status 'EXPIRED' */}
                                                                    {this.state.payconiq_current_status == 'EXPIRED' || this.state.payconiq_current_status == 'CANCELLED' ?
                                                                        <button
                                                                            className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30"
                                                                            onClick={this.regenerate_payconiq_barcode}
                                                                            style={{ minWidth: '220px' }}
                                                                        >
                                                                           {LocalizedLanguage.reGenerateQRCode}
                                                                    </button> : <p id='counterParentId' style={{ color: 'black' }}>{this.state.sessionMsg}<span id='counterId' ></span></p>}
                                                                    {/* <!-- <h3 className="user_login_head__title">Loading Demo</h3> --> */}
                                                                    <p style={{ color: this.state.msgColor, paddingTop: "20px" }}>{UPI_error_msg}</p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
        )
    }
}

function mapStateToProps(state) {
    const { make_payconiq_payment, check_payconiq_pay_status, cancel_payconiq_payment } = state
    return {
        payconiq_payment: make_payconiq_payment,
        check_payconiq_pay_status: check_payconiq_pay_status,
        cancel_payconiq_payment: cancel_payconiq_payment
    };
}
const connectedUPIPayment = connect(mapStateToProps)(UPIPayments);
export { connectedUPIPayment as UPIPayments };

