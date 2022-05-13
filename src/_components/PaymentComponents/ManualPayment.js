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
            var firstNameByCard = firstLastNameArr && firstLastNameArr.length &&  firstLastNameArr[0] ? firstLastNameArr[0] : ''
            var lastNameByCard = firstLastNameArr && firstLastNameArr.length &&  firstLastNameArr[1] ? firstLastNameArr[1] : ''
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
                    "firstName":  customerDetails && customerDetails.content ? customerDetails.content.FirstName ?  customerDetails.content.FirstName : '' : firstNameByCard,
                    "lastName": customerDetails && customerDetails.content ? customerDetails.content.LastName ? customerDetails.content.LastName : '' : lastNameByCard,
                    "Email":customerDetails && customerDetails.content &&  customerDetails.content.Email ? customerDetails.content.Email : '',
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
                $('.popScroll').animate({scrollTop:0}, 'slow');
                return false;
      //  }) 
         }, 500);
              
             
        }
    }
    componentWillReceiveProps = (nextProps) => {
        const {code} = this.props
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
                $('.popScroll').animate({scrollTop:0}, 'slow');
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
            if (isMobileOnly == true) {
                this.setState({ validationError : '' })
                showModal(`onlinePaymentPopup${code}`)
            } else {
                this.setState({ popupClass: 'in', displayPopupStyle: 'block', validationError : '' })
            }
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
        this.setState({ popupClass: '', displayPopupStyle: 'none', cardData: '', validationError: '' })
        this.props.dispatch(checkoutActions.makeOnlinePayments(null))
        
    }
    onCancel = (itm) => {
        const {code} = this.props
        if (itm =="Cancel") {
            $(`#onlinePaymentPopup${code}`).modal("hide");
            $(`onlinePaymentPopup${code}`).removeClass('show');
            this.setState({ CustInfor: 'cardInfo',cardData : '' })
            this.props.dispatch(checkoutActions.makeOnlinePayments(null))
        } else {
            this.setState({ CustInfor: itm, cardData : '' })
        }

    }
    nextEventHandler = (itm) => {
        this.setState({ CustInfor: itm })
    }
    render() {
        const { isOrderPaymentOnline, color, Name, code, styles } = this.props;
        const { displaybuttonStyle, displayPopupStyle, popupClass, CustInfor } = this.state;
        return (
            // <div>
                
            displayPopupStyle=="none" ?ActiveUser.key.isSelfcheckout == true && isMobileOnly == true ?
                    <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 mb-15" onClick={() => this.handleCardPopup(code)}>{Name}</button>
                    : isMobileOnly == true ?
                        <button type="submit" style={{ borderLeftColor: color, marginBottom: 15 }} className="btn btn-default btn-lg btn-block btn-style-02" onClick={() => this.handleCardPopup(code)}>{Name}</button>
                        : ActiveUser.key.isSelfcheckout == true ?
                        // <div className="row">
                          <button onClick={() => this.handleCardPopup(code)}>{Name}</button>
                        // </div>

                            // <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => this.handleCardPopup(code)}>{Name}</button>
                            :
                            // <div>
                            <div style={isOrderPaymentOnline == false ? { display: styles, pointerEvents: 'none', borderColor: '#765b72', marginBottom: 15, opacity: 0.5 } : { display: styles }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0">
                                <div className="section">
                                    <div className="accordion_header" data-isopen="false">
                                        <div className="pointer">
                                            <div style={{ borderColor: color }} id="others" value="other" name="payments-type" onClick={() => this.handleCardPopup(code)} className="d-flex box-flex box-flex-border-left box-flex-background-others border-dynamic">
                                                <div className="box-flex-text-heading">
                                                    <h2>{Name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    // {/* show card popup */}
                    // </div>
                :
                <div className={popupClass == '' ? "popup hide" : `popup hide ${popupClass}`} id="manualcardentryin" role="dialog" style={{ display: displayPopupStyle }} >
                    {this.props.loading == true && isMobileOnly == true ? <AndroidAndIOSLoader /> : this.props.loading == true ? <LoadingModal /> : ''}
                    <div className={isMobileOnly == true ? 'modal-dialog modal-center-block text-black' : 'modal-dialog modal-sm modal-center-block'}>
                        <div className="modal-content">
                            <div className="modal-header header-modal">
                                <h1>{LocalizedLanguage.manualCardEntry}</h1>
                                <div className="popup-close data-dismiss" data-dismiss="modal" onClick={this.closePopup}>
                                    <img src="assets/img/closenew.svg" alt="" />
                                </div>
                            </div>
                            <div className="modal-body popScroll">
                            {/* overflowscroll */}
                                <div className="mb-3">
                                    <form className="form-addon">
                                        <h3 className="manual-title">{LocalizedLanguage.cardInformation}</h3>
                                        <p style={{ color: 'red' }}>{this.state.validationError}</p>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.cardNumber}</div>
                                                <input type="tel" className="form-control" id="CardNo" placeholder={LocalizedLanguage.cardNumber} name="CardNo" value={this.state.CardNo} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.cardholderName}</div>
                                                <input type="text" className="form-control" id="cardHoldername" name="card_holder_name" placeholder={LocalizedLanguage.cardholderName} value={this.state.CardName} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.expiryMonth}</div>
                                                <input type="tel" className="form-control" maxLength={2} id="cardExpiryMonth" name='card_expiry_month' placeholder={LocalizedLanguage.expiryMonth}
                                                    value={this.state.ExpirMonth} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.expiryYear}</div>
                                                <input type="tel" className="form-control" maxLength={4} id="cardExpiryYear" name='card_expiry_year' placeholder={LocalizedLanguage.expiryYear}
                                                    value={this.state.ExpirYear} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.CVVAndCVC}</div>
                                                <input type="tel" className="form-control" maxLength={5} id="cardCVC" name='card_CVC' placeholder={LocalizedLanguage.CVVAndCVC}
                                                    value={this.state.CVVNo} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        {/* <div className="form-group">
                                                            <div className="input-group">
                                                                <div className="input-group-addon">City</div>
                                                                <input type="text" className="form-control" id="cardCity" name='card_city' placeholder="City"
                                                                    value={this.state.City} onChange={this.handleChange} />
                                                            </div>
                                                        </div> */}
                                        <h3 className="manual-title manual-title-space">{LocalizedLanguage.billingInformation}</h3>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.addressOne}</div>
                                                <input type="text" className="form-control" id="billingAddress" name='billing_address' placeholder={LocalizedLanguage.addressOne}
                                                    value={this.state.BillAddress} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.addressTwo}</div>
                                                <input type="text" className="form-control" id="billingAddress2" name='billing_address2' placeholder={LocalizedLanguage.addressTwo}
                                                    value={this.state.BillAddress2} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.country}</div>
                                                <input type="text" className="form-control" id="country" name='country' placeholder={LocalizedLanguage.country}
                                                    value={this.state.Country} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.city}</div>
                                                <input type="text" className="form-control" id="city" name='city' placeholder={LocalizedLanguage.city}
                                                    value={this.state.City} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.provinceState}</div>
                                                <input type="text" className="form-control" id="province" name='province' placeholder={LocalizedLanguage.provinceState}
                                                    value={this.state.State} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.zippostalcode}</div>
                                                <input type="tel" className="form-control" id="zip" name='zip_code' placeholder={LocalizedLanguage.zippostalcode}
                                                    value={this.state.ZipCode} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        {/* <p style={{ color: 'red' }}>{this.state.validationError}</p> */}
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer no-padding bt-0">
                                <button className="btn btn-primary btn-block h-70" onClick={this.handleChargeButton}>
                                    {LocalizedLanguage.chargeCard}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                /* for mobile view */

                /* <div className="modal" id={`onlinePaymentPopup${code}`} tabIndex="-1" role="dialog" aria-labelledby="profileWizard"
                    aria-hidden="true">
                    {this.props.loading == true ? <AndroidAndIOSLoader /> : ''}
                    <div className="modal-dialog modal-dialog-centered modal-sm text-primary text-left">
                        <div className="modal-content">
                            <div className="modal-header align-items-center">
                                <h5 className="modal-title fz-14" id="success">{LocalizedLanguage.manualCardEntry}</h5>
                                <button type="button" className="close py-0 shadow-none outline-none" data-dismiss="modal" aria-label="Close" onClick={() => this.onCancel('Cancel')}>
                                    <img src="../../assets/img/closenew.svg" width="23" alt="" />
                                </button>
                            </div>
                            <div className="modal-body pl-30 pr-30">
                                <form className="app-form">
                                    {(CustInfor === "cardInfo") ?
                                        <div>
                                            <div className="text-primary text-center mb-20 fz-12">
                                                <img className="img-fluid d-block mx-auto mb-1" src="assets/img/self-checkout/circle-user.svg" width="30" />
                                                {LocalizedLanguage.cardInformation}
                                                <p style={{ color: 'red' }}>{this.state.validationError}</p>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.cardNumber}</label>
                                                <input type="text" id="CardNo" value={this.state.CardNo} name="CardNo" className="form-control shadow-none" onChange={this.handleChange} placeholder={LocalizedLanguage.cardNumber} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.cardholderName}</label>
                                                <input type="text" className="form-control shadow-none" id="cardHoldername" name="card_holder_name" placeholder={LocalizedLanguage.cardholderName} value={this.state.CardName} onChange={this.handleChange} />
                                                
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.expiryMonth}</label>
                                                <input type="tel" className="form-control shadow-none" maxLength={2} id="cardExpiryMonth" name='card_expiry_month' placeholder={LocalizedLanguage.expiryMonth}
                                                    value={this.state.ExpirMonth} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.expiryYear}</label>
                                                <input type="tel" className="form-control shadow-none" maxLength={4} id="cardExpiryYear" name='card_expiry_year' placeholder={LocalizedLanguage.expiryYear}
                                                    value={this.state.ExpirYear} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.CVVAndCVC}</label>
                                                <input type="tel" className="form-control shadow-none" maxLength={3} id="cardCVC" name='card_CVC' placeholder={LocalizedLanguage.CVVAndCVC}
                                                    value={this.state.CVVNo} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <div className="profile-action">
                                                    <button type="button" className="btn btn-light shadow-none text-dark" onClick={() => this.onCancel('Cancel')}>{LocalizedLanguage.cancel}</button>
                                                    <button type="button" className="btn btn-success shadow-none ml-10" onClick={() => this.nextEventHandler('billingInfo')}>{LocalizedLanguage.nextStep}</button>
                                                </div>
                                            </div>
                                        </div>
                                        : (CustInfor === 'billingInfo') ?
                                            <div>
                                                <div className="text-primary text-center mb-20 fz-12">
                                                    <img className="img-fluid d-block mx-auto mb-1" src="../../assets/img/self-checkout/place-maker.svg" width="30" />
                                                    {LocalizedLanguage.billingInformation}
                                                    <p style={{ color: 'red' }}>{this.state.validationError}</p>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.address}</label>
                                                    <input type="text" className="form-control shadow-none" id="billingAddress" name='billing_address' placeholder={LocalizedLanguage.addressOne}
                                                        value={this.state.BillAddress} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.addressTwo}</label>
                                                    <input type="text" className="form-control shadow-none" id="billingAddress2" name='billing_address2' placeholder={LocalizedLanguage.addressTwo}
                                                        value={this.state.BillAddress2} onChange={this.handleChange} />
                                                  
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.country}</label>
                                                    <input type="text" className="form-control shadow-none" id="country" name='country' placeholder={LocalizedLanguage.country}
                                                        value={this.state.Country} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.city} </label>
                                                    <input type="text" className="form-control shadow-none" id="city" name='city' placeholder={LocalizedLanguage.city}
                                                        value={this.state.City} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.provinceState} </label>
                                                    <input type="text" className="form-control shadow-none" id="province" name='province' placeholder={LocalizedLanguage.provinceState}
                                                        value={this.state.State} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.zippostalcode} </label>
                                                    <input type="tel" className="form-control shadow-none" id="zip" name='zip_code' placeholder={LocalizedLanguage.zippostalcode}
                                                        value={this.state.ZipCode} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <div className="profile-action">
                                                        <button type="button" className="btn btn-light shadow-none text-dark" onClick={() => this.onCancel('cardInfo')}>{LocalizedLanguage.cancel}</button>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div>
                                            </div>
                                    }
                                </form>
                            </div>
                            <div className="modal-footer no-padding overflow-hidden">
                                <button className="btn btn-primary shadow-none fz-12 btn-block rounded-0 h-40 h-50-pxi" onClick={() => this.handleChargeButton()}>{LocalizedLanguage.chargeCard}</button>
                            </div>
                        </div>
                    </div>
                </div> */


            /* </div> */
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