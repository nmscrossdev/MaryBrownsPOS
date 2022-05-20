import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import ActiveUser from '../../settings/ActiveUser';
import { checkoutActions } from '../../CheckoutPage';
import { get_UDid } from '../../ALL_localstorage';
import { LoadingModal } from '../LoadingModal';
import { AndroidAndIOSLoader } from '../AndroidAndIOSLoader';
class ManualPayment extends React.Component {
    constructor(props) {
        super(props);
        var UID = get_UDid('UDID');

        this.state = {
            paidAmount: '',
            displaybuttonStyle: '',
            displayPopupStyle: 'none',
            CardNo: '',
            CardName: '',
            ExpirMonth: '',
            ExpirYear: '',
            CVVNo: '',
            City: '',
            BillAddress: '',
            BillAddress2: '',
            Country: '',
            State: '',
            ZipCode: '',
            validationError: '',
            UDID: UID,
            cardData: '',
            popupClass: '',
            CustInfor: 'cardInfo'
        }
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        var CardNo = this.state.CardNo;
        const { name, value } = e.target;
        var pin;
        switch (name) {
            case 'CardNo':
                var val = value.match(/^[0-9]*$/)
                if (val) {
                    this.setState({ CardNo: value && value != "" ? value : '' })
                } else {
                    this.setState({ CardNo: CardNo })
                }
                break;
            case 'card_holder_name': {
                this.setState({ CardName: value })
                break;
            }
            case 'card_expiry_month':
                {
                    var rgex = value.match(/^[0-9]*$/)
                    if (rgex && value.length <= 2 && value <= 12) {
                        this.setState({ ExpirMonth: value })
                    }
                    break;
                }
            case 'card_expiry_year':
                {
                    var rgex = value.match(/^[0-9]*$/)
                    if (rgex && value.length <= 4) {
                        this.setState({ ExpirYear: value })
                    }
                    break;
                }
            case 'card_CVC':
                {
                    var rgex = value.match(/^[0-9]*$/)
                    if (rgex && value.length <= 5) {
                        this.setState({ CVVNo: value })
                    }
                    break;
                }
            case 'card_city':
                {
                    this.setState({ City: value })
                    break;
                }
            case 'billing_address':
                {
                    this.setState({ BillAddress: value })
                    break;
                }
            case 'billing_address2':
                {
                    this.setState({ BillAddress2: value })
                    break;
                }
            case 'country':
                {
                    this.setState({ Country: value })
                    break;
                }
            case 'city':
                {
                    this.setState({ City: value })
                    break;
                }
            case 'province':
                {
                    if (value)
                        this.setState({ State: value })
                    break;
                }
            case 'zip_code':
                {
                    // var rgex = value.match(/^[0-9]*$/)
                    if (value.length <= 10) {
                        this.setState({ ZipCode: value })
                    }
                    break;
                }
            default:
                break;
        }
        // this.setState({ [name]: value });
    }

    handleChargeButton = () => {
        const { CardNo, CardName, CVVNo, ExpirMonth, ExpirYear, UDID, BillAddress, City, State, ZipCode, Country } = this.state
        const { code, type } = this.props;

        if (CardNo !== '' && CardNo.length > 4 && CardName !== '' && CVVNo !== '' && CVVNo.length >= 3 && CVVNo.length <= 5 && ExpirMonth !== '' && ExpirYear !== '') {
            // if (ZipCode !== '' && ZipCode.length !== 6) {
            //     $('#CardNo').focus()
            //     this.setState({ validationError: 'Zip code should be 6 number' })
            //     return false
            // }
            var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
            var selectedRegister = localStorage.getItem('selectedRegister') && JSON.parse(localStorage.getItem('selectedRegister'))
            var expiryDate = ExpirYear + '-' + ExpirMonth
            var order_total = checklist && checklist.totalPrice ? checklist.totalPrice : 0
            var customerDetails = localStorage.getItem('AdCusDetail') && JSON.parse(localStorage.getItem('AdCusDetail'))

            var firstLastNameArr = CardName && CardName.split(' ')
            var firstNameByCard = firstLastNameArr && firstLastNameArr.length && firstLastNameArr[0] ? firstLastNameArr[0] : ''
            var lastNameByCard = firstLastNameArr && firstLastNameArr.length && firstLastNameArr[1] ? firstLastNameArr[1] : ''
            var data = {
                "registerId": selectedRegister ? selectedRegister.id : '',
                "amount": order_total,
                "paycode": code,
                "command": type == 'refund' ? "Refund" : "Sale",
                "refId": '', //refId will be add on refundViewThird from orderpayments transation id
                "StripeToken": "",
                "currency": "",
                // "transaction_Date": "",
                "CardInfo": {
                    "cardNumber": CardNo,
                    "expirationDate": expiryDate,
                    "cardCode": CVVNo,
                    "ExpMonth": ExpirMonth,
                    "ExpYear": ExpirYear,
                },
                "CustomerInfo": {
                    "firstName": customerDetails && customerDetails.content ? customerDetails.content.FirstName ? customerDetails.content.FirstName : '' : firstNameByCard,
                    "lastName": customerDetails && customerDetails.content ? customerDetails.content.LastName ? customerDetails.content.LastName : '' : lastNameByCard,
                    "Email": customerDetails && customerDetails.content && customerDetails.content.Email ? customerDetails.content.Email : '',
                    "PhoneNo": customerDetails && customerDetails.content && customerDetails.content.Contact ? customerDetails.content.Contact : '',
                    "city": City ? City : customerDetails && customerDetails.content && customerDetails.content.City ? customerDetails.content.City : '',
                    "state": State ? State : customerDetails && customerDetails.content && customerDetails.content.State ? customerDetails.content.State : '',
                    "zip": ZipCode ? ZipCode : customerDetails && customerDetails.content && customerDetails.content.Pincode ? customerDetails.content.Pincode : '',
                    "country": Country ? Country : customerDetails && customerDetails.content && customerDetails.content.Country ? customerDetails.content.Country : '',
                },
                "OrderInfo": {
                    "orderNumber": "",
                    "invoiceNumber": ""
                }
            }

            this.setState({ cardData: data, validationError: '' })
            setTimeout(() => {
                this.handleCardPopup(code)
            }, 200);

            // this.props.dispatch(checkoutActions.makeOnlinePayments(data))
        } else {
            $('#CardNo').focus()
            this.setState({ validationError: LocalizedLanguage.validcarddetailalert })
            setTimeout(() => {
                //  $(".btn-primary").click(function() {
                $('.popScroll').animate({ scrollTop: 0 }, 'slow');
                return false;
                //  }) 
            }, 500);


        }
    }
    componentWillReceiveProps = (nextProps) => {
        const { code } = this.props
        if (nextProps && nextProps.online_payment && nextProps.online_payment.content && nextProps.online_payment.is_success) {
            console.log('----sucess-manualPayments.js -', nextProps);
            if (nextProps.online_payment.content.RefranseCode && nextProps.online_payment.content.IsSuccess == true) {
                this.setState({ validationError: '', popupClass: '', displayPopupStyle: 'none' })
                $(`#onlinePaymentPopup${code}`).modal("hide");
                $(`onlinePaymentPopup${code}`).removeClass('show');
            } else {
                var data = nextProps.online_payment.content
                var err = data && data.RefranseMessage ? data.RefranseMessage : 'Something went wrong'
                $('#CardNo').focus()
                if (isMobileOnly == true) {
                    this.setState({ validationError: err, popupClass: 'in', displayPopupStyle: 'block' })
                } else {
                    this.setState({ validationError: err })
                }

            }
        } else if (nextProps && nextProps.error) {
            $('#CardNo').focus()
            nextProps.error && this.setState({ validationError: 'Payment failed : ' + nextProps.error })
            // $(".btn-primary").click(function() {
            setTimeout(() => {
                $('.popScroll').animate({ scrollTop: 0 }, 'slow');
                //return false;
            }, 500);

            // }) 
        }
    }


    handleCardPopup(status) {
        const { closingTab, pay_amount, code, onlinePayCardDetails } = this.props;
        const { cardData } = this.state
        // this.props.activeDisplay(true)
        if (cardData == '') {
            // if (isMobileOnly == true) {
                this.setState({ validationError: '' })
                showModal(`onlinePaymentPopup${code}`)
            // } else {
                this.setState({ popupClass: 'in', displayPopupStyle: 'block', validationError: '' })
           // }
        } else {
            closingTab(true); // commented for test
            onlinePayCardDetails && onlinePayCardDetails(cardData)
            pay_amount(code);
            if (this.props.type == 'refund') {
                // this.props.hideCashTab(false)
            }
        }
    }
    closePopup = () => {
        hideModal(`onlinePaymentPopup${this.props.code}`)
        this.setState({ popupClass: '', displayPopupStyle: 'none', cardData: '', validationError: '' })
        this.props.dispatch(checkoutActions.makeOnlinePayments(null))

    }
    onCancel = (itm) => {
        const { code } = this.props
        if (itm == "Cancel") {
            // $(`#onlinePaymentPopup${code}`).add("hide");
            // $(`onlinePaymentPopup${code}`).removeClass('show');
            hideModal(`onlinePaymentPopup${code}`)
            this.setState({ CustInfor: 'cardInfo', cardData: '' })
            this.props.dispatch(checkoutActions.makeOnlinePayments(null))
        } else {
            this.setState({ CustInfor: itm, cardData: '' })
        }

    }
    nextEventHandler = (itm) => {
        this.setState({ CustInfor: itm })
    }
    render() {
        const { isOrderPaymentOnline, color, Name, code, styles } = this.props;
        const { displaybuttonStyle, displayPopupStyle, popupClass, CustInfor } = this.state;
        console.log("displayPopupStyle",this.state.displayPopupStyle)
        return (
            <React.Fragment>

               
                    <button onClick={() => this.handleCardPopup(code)}>{Name}</button>
                 
                    
                    <div className="popup hide" id={`onlinePaymentPopup${code}`} >
                        {this.props.loading == true ? <LoadingModal /> : ''}
                        <div className="product-container">
                            <div type="button" className="popup-close">
                                <svg onClick={this.closePopup}
                                    width="22"
                                    height="21"
                                    viewBox="0 0 22 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19.0466 21L10.7521 12.9L2.45762 21L0 18.6L8.29448 10.5L0 2.4L2.45762 0L10.7521 8.1L19.0466 0L21.5042 2.4L13.2097 10.5L21.5042 18.6L19.0466 21Z"
                                        fill="#050505"
                                    />
                                </svg>
                            </div>
                            <p className="prod-name" id="epos_error_model_title">{LocalizedLanguage.manualCardEntry}</p>
                            <div className="order-summary manualcardboder">
                                <div className="order-products-wrapper manualcardalignment">
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.cardInformation}</p>
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.cardNumber}</p>
                                            <input className='manual-card-form' type="text" id="CardNo" name="CardNo" placeholder={LocalizedLanguage.cardNumber} value={this.state.CardNo} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.cardholderName}</p>
                                            <input  className='manual-card-form' type="text" id="cardHoldername" name="card_holder_name" placeholder={LocalizedLanguage.cardholderName} value={this.state.CardName} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.expiryMonth}</p>
                                            <input className='manual-card-form' type="text" id="cardExpiryMonth" name="card_expiry_month" placeholder={LocalizedLanguage.expiryMonth} value={this.state.ExpirMonth} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.expiryYear}</p>
                                            <input className='manual-card-form' type="text" id="cardExpiryYear" name="card_expiry_year" placeholder={LocalizedLanguage.expiryYear} value={this.state.ExpirYear} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.CVVAndCVC}</p>
                                            <input className='manual-card-form' type="text" id="cardCVC" name="card_CVC" placeholder={LocalizedLanguage.CVVAndCVC} value={this.state.CVVNo} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.billingInformation}</p>
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.addressOne}</p>
                                            <input className='manual-card-form' type="text" id="billingAddress" name="billingAddress" placeholder={LocalizedLanguage.BillAddress} value={this.state.CardName} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.addressTwo}</p>
                                            <input className='manual-card-form' type="text" id="billingAddress2" name="billingAddress2" placeholder={LocalizedLanguage.addressTwo} value={this.state.BillAddress2} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.country}</p>
                                            <input className='manual-card-form' type="text" id="country" name="country" placeholder={LocalizedLanguage.country} value={this.state.Country} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.city}</p>
                                            <input className='manual-card-form' type="text" id="city" name="city" placeholder={LocalizedLanguage.city} value={this.state.City} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.provinceState}</p>
                                            <input className='manual-card-form' type="text" id="province" name="province" placeholder={LocalizedLanguage.provinceState} value={this.state.State} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="order-product">
                                        <div className="row">
                                            <p className="prod-name">{LocalizedLanguage.zippostalcode}</p>
                                            <input className='manual-card-form' type="text" id="zip" name="zip_code" placeholder={LocalizedLanguage.zippostalcode} value={this.state.ZipCode} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <button onClick={this.handleChargeButton} className="view-cart manualcardviewcard">{LocalizedLanguage.chargeCard}</button>

                                </div>
                            </div>
                        </div>
                    </div>
                


            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { online_payment } = state;
    return {
        loading: online_payment.loading,
        online_payment: online_payment.items,
        error: online_payment.error
    };
}
const connectedCardPayment = connect(mapStateToProps)(ManualPayment);
export { connectedCardPayment as ManualPayment };