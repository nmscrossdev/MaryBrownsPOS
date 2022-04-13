import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import $ from 'jquery';
import moment from 'moment';
import { cashManagementAction } from '../actions/cashManagement.action';
import { LoadingModal } from '../../_components';
import { userActions } from '../../_actions/user.actions';
import { setAndroidKeyboard, openCahsDrawer } from "../../settings/AndroidIOSConnect";
import { CloseRegisterPopup } from '../../CashManagementPage/components/CloseRegisterPopup'
import Config from '../../Config';
class CloseRegisterPopupTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSaveCount: false,
            enteredCashAmount: '',
            enteredCardAmount: '',
            enteredOthersAmount: '',
            enterNote: "",
            isloading: false,
            cashSummery: null,
            closeRegister: null,
            otherPaymentID: '',
            cardPaymentID: ''
        }
        this.closeRegisterPopupOnClosing = this.closeRegisterPopupOnClosing.bind(this);
        this.validateEnteredCashAmount = this.validateEnteredCashAmount.bind(this);
        this.validateEnteredCardAmount = this.validateEnteredCardAmount.bind(this);
        this.validateEnteredOthersAmount = this.validateEnteredOthersAmount.bind(this);
        this.callOpenCashDrawer = this.callOpenCashDrawer.bind(this);
        this.enterNote = this.enterNote.bind(this);
        this.saveCount = this.saveCount.bind(this);
    }

    componentDidMount() {
        var registerId = localStorage.getItem('register');
        var CashManagementId = localStorage.getItem('Cash_Management_ID');
        var user = JSON.parse(localStorage.getItem("user"));
        var LoggenInUserId = user && user.user_id ? user.user_id : '';
        //Added By: Aman Singhai, Added Date: 27/07/2020, Decription: For showing payment field dynamic
        var cashManagementID = localStorage.getItem('Cash_Management_ID');
        if (cashManagementID) {
            this.props.dispatch(cashManagementAction.getDetails(cashManagementID));
        }
        if (cashManagementID && registerId && LoggenInUserId && cashManagementID !== '' && registerId !== '') {
            this.props.dispatch(cashManagementAction.getSummery(cashManagementID, registerId, LoggenInUserId));
        }
    }
    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For sending entered amount
    */
    validateEnteredCashAmount(e) {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
           this.setState({ enteredCashAmount: value });
        }
    }

    // call openCashDrawer function from AndroidIOSConnect on click 
    callOpenCashDrawer() {
        openCahsDrawer()
    }

    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For sending entered Card amount
    */
    validateEnteredCardAmount(e) {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
           this.setState({ enteredCardAmount: value });
        }
    }

    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For sending entered Others amount
    */
    validateEnteredOthersAmount(e) {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
           this.setState({ enteredOthersAmount: value });
       }
    }
    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For closing the close register popup
    */
    closeRegisterPopupOnClosing() {
        //Geting cash Summary---------------------------------------   
        var registerId = localStorage.getItem('register');
        var CashManagementId = localStorage.getItem('Cash_Management_ID');
        var user = JSON.parse(localStorage.getItem("user"));
        var LoggenInUserId = user && user.user_id ? user.user_id : '';
        hideModal('ClosingFloat');
        $('ClosingFloat').removeClass('show');
        $('.form-control').val('');
        //Modified by- Aman, Date-24/07/2020, Decriptionn- for showing the value to zero
        this.setState({
            enteredCashAmount: '',
            enteredCardAmount: '',
            enteredOthersAmount: ''
        })
    }
    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For sending the note
    */
    enterNote(e) {
        const { value } = e.target;
        this.state.enterNote = value;
    }
    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For saving the save count
    */
    saveCount() {
        if (this.state.enteredCashAmount || this.state.enteredCardAmount || this.state.enteredOthersAmount) {
            this.setState({ isloading: true, isSaveCount: false })
            var last_login_register_id = (localStorage.getItem("register"));
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var cashManagementID = localStorage.getItem('Cash_Management_ID');
            var otherPaymentTypes ='[';
            var  otherPaymentAmount= this.state.enteredOthersAmount && this.state.enteredOthersAmount !==""?this.state.enteredOthersAmount:0
            var cardPaymentAmount=this.state.enteredCardAmount && this.state.enteredCardAmount !==""?this.state.enteredCardAmount:0
            if(this.state.otherPaymentID && this.state.otherPaymentID !==""){
                otherPaymentTypes += '{"Id": "' + this.state.otherPaymentID + '","Slug": "other","ActualCloingBalance": "' + otherPaymentAmount + '"}';
            }
            if( this.state.cardPaymentID &&  this.state.cardPaymentID !==''){
                otherPaymentTypes += (otherPaymentTypes =='['?'':',')+ '{"Id": "' + this.state.cardPaymentID + '","Slug": "card","ActualCloingBalance": "' + cardPaymentAmount + '"}'
            }

             //'[{"Id": "' + this.state.otherPaymentID + '","Slug": "other","ActualCloingBalance": "' + this.state.enteredOthersAmount + '"},{"Id": "' + this.state.cardPaymentID + '","Slug": "card","ActualCloingBalance": "' + this.state.enteredCardAmount + '"}';
            if (this.props.cashDetails && this.props.cashDetails.cashDetail && this.props.cashDetails.cashDetail.content) {
                var _cashDetails = this.props.cashDetails.cashDetail.content;
                _cashDetails && _cashDetails.PaymentSummery && _cashDetails.PaymentSummery.map((item, index) => {
                    if (item.Slug.toLowerCase() !== 'card' && item.Slug.toLowerCase() !== 'other') {
                        var ele = document.getElementById("_txtpayment"+item.Id);
                        if (ele) {
                            var _val = ele.value;
                            if (!_val || _val == '' ) {
                                _val = 0;
                            }
                            var _otherPayType = '{ "Id": "' + item.Id + '","Slug": "' + item.Slug + '","ActualCloingBalance":"' + _val + '"}';
                            otherPaymentTypes = (otherPaymentTypes !== '' && otherPaymentTypes !== '[' ? otherPaymentTypes + ',' : otherPaymentTypes) + _otherPayType;
                        }
                    }
                })
            }
            otherPaymentTypes = otherPaymentTypes + ']';
            var saveCountParm = {
                "Id": cashManagementID,
                "RegisterId": last_login_register_id,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "ActualClosingBalance": this.state.enteredCashAmount,
                "ClosingNote": this.state.enterNote,
                "PaymentSummeryClosing": JSON.parse(otherPaymentTypes)
            }
            this.props.dispatch(cashManagementAction.closeRegister(saveCountParm));
            $('.form-control').val('');          
        }
        else
        {
            this.setState({ isSaveCount: true })
        }
    }

    componentWillReceiveProps(nextprop) {        
        if (nextprop && nextprop.closeRegister && nextprop.closeRegister.closeRegister && nextprop.closeRegister.closeRegister.is_success == true) {
            this.setState({ closeRegister: nextprop.closeRegister });
            this.closeRegisterPopupOnClosing();
            this.setState({ isloading: false })
            showModal('CloseRegister');           
        }
        if (nextprop && nextprop.cashSummery) {
            var _cashSummeryContent = nextprop.cashSummery;
            _cashSummeryContent && _cashSummeryContent.PaymentSummery && _cashSummeryContent.PaymentSummery.map(item => {
                item.Slug == 'other' ?
                    this.setState({ otherPaymentID: item.Id })
                    :
                    item.Slug == 'card' ?
                        this.setState({ cardPaymentID: item.Id })
                        : ''
            })
        }
    }

    render() {
        const { cashSummery, cashDetails } = this.props;
        var user = JSON.parse(localStorage.getItem("user"));
        var isDemoUser = localStorage.getItem('demoUser');
        var demoUserName= Config.key.DEMO_USER_NAME;
        var loggendUser = isDemoUser  ? demoUserName : user && user.display_name;
        if (cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content) {
            var _cashDetails = cashDetails.cashDetail.content;
        }
        return (
            <div>
                <div className="modal fade popUpMid" id="ClosingFloat" role="dialog" data-backdrop="static">
                    <div className="modal-dialog modal-sm modal-center-block">
                        {this.state.isloading == true ? <LoadingModal /> : ''}
                        <div className="modal-content">
                            <div className="modal-header header-modal">
                                <h1>{LocalizedLanguage.closeRegister}</h1>
                                <div className="data-dismiss" data-dismiss="modal" id='closeRegister' onClick={() => this.closeRegisterPopupOnClosing()}>
                                    <img src="../assets/img/closenew.svg" alt="" />
                                </div>
                            </div>
                            <div className="modal-body scroll-auto">
                                <div className="overflow-auto ">
                                    <form className="form-addon">
                                        <div className="form-group mb-0">
                                            <div className="input-group input-group-no-border">
                                                <div className="input-group-addon border-0">{LocalizedLanguage.loggedUser}</div>
                                                <div className="form-control border-0">{loggendUser}</div>
                                            </div>
                                        </div>
                                        <div className="radio--custom radio-primary radio-primary-addon" onClick={() => this.callOpenCashDrawer()}>
                                        	<input type="radio" id="radio-2" name="radio-group" defaultChecked/>
                                            <label htmlFor="radio-2">
                                                <i className="icons8-cash-register mr-2"></i>
                                                {LocalizedLanguage.opencashdrawer}
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.cashInTill}</div>
                                                <input type="text" className="form-control" id="_txtCash" value={this.state.enteredCashAmount} placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateEnteredCashAmount(e)} />                                                
                                            </div>
                                            {
                                                (this.state.isSaveCount === true) ?
                                                <small className="form-text text-danger">{LocalizedLanguage.AmountShouldntbeblank}</small>
                                                :null
                                            }
                                        </div>
                                        {_cashDetails && _cashDetails.PaymentSummery && _cashDetails.PaymentSummery.map((item, index) => {
                                            return (
                                                item.Slug.toLowerCase() == 'card' ?
                                                    <div className="form-group" key={index}>
                                                        <div className="input-group">
                                                            <div className="input-group-addon">{item.Name}</div>
                                                            <input type="text" className="form-control" id="_txtCard" value={this.state.enteredCardAmount} placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateEnteredCardAmount(e)} />
                                                        </div>
                                                    </div>
                                                    : item.Slug.toLowerCase() == 'other' ?
                                                        <div className="form-group" key={index}>
                                                            <div className="input-group">
                                                                <div className="input-group-addon">{item.Name}</div>
                                                                <input type="text" className="form-control" id="_txtOther" value={this.state.enteredOthersAmount} placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateEnteredOthersAmount(e)} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="form-group" key={index}>
                                                            <div className="input-group">
                                                                <div className="input-group-addon">{item.Name}</div>
                                                                <input type="text" className="form-control" id={"_txtpayment"+item.Id} placeholder={LocalizedLanguage.EnterAmount} />
                                                            </div>
                                                        </div>
                                            )
                                        })
                                        }
                                        {/* <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">{LocalizedLanguage.Debit_CreditCard}</div>
                                            <input type="text" className="form-control" id="_txtCard" value={this.state.enteredCardAmount} placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateEnteredCardAmount(e)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">{LocalizedLanguage.others}</div>
                                            <input type="text" className="form-control" id="_txtOther" value={this.state.enteredOthersAmount} placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateEnteredOthersAmount(e)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-reverse">
                                            <div className="input-group-addon">{LocalizedLanguage.addNote}</div>
                                            <textarea type="text" className="form-control" id="_txtNote" placeholder={LocalizedLanguage.Pleaseaddnotehere} onChange={(e) => this.enterNote(e)} style={{ "height": "115px" }}></textarea>
                                        </div>
                            </div> */}
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer no-padding bt-0">
                                <button className="btn btn-primary btn-block h-70 btn-capitalize" onClick={() => this.saveCount()}>
                                    {LocalizedLanguage.saveCount}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <CloseRegisterPopup closeRegister={this.state.closeRegister} />
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { closeRegister, cashSummery, cashDetails } = state;
    return {
        closeRegister: closeRegister,
        cashSummery: cashSummery && cashSummery.cashSummery && cashSummery.cashSummery.content,
        cashDetails: cashDetails
    }
}
const connectedCloseRegisterPopupTwo = connect(mapStateToProps)(CloseRegisterPopupTwo);
export { connectedCloseRegisterPopupTwo as CloseRegisterPopupTwo };