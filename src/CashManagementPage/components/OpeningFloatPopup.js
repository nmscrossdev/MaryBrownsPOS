import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { cashManagementAction } from '../actions/cashManagement.action';
import moment from 'moment';
import { openCahsDrawer } from "../../settings/AndroidIOSConnect";

import { LoadingModal, showProductxModal } from '../../_components';
import $ from 'jquery';
import { CommonConfirmationPopup } from '../../_components/CommonConfirmationPopup';
import { CheckoutViewThird } from '../../CheckoutPage';

class OpeningFloatPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAmountEntered: false,
            enteredAmount: 0.00,
            enterNote: '',
            isloading: false,
            popupMsg: ''
        }
        this.openRegister = this.openRegister.bind(this);
        this.closeOpenRegisterpopup = this.closeOpenRegisterpopup.bind(this);
        this.callOpenCashDrawer = this.callOpenCashDrawer.bind(this);
    }

    // call openCashDrawer function from AndroidIOSConnect on click 
    callOpenCashDrawer() {
        openCahsDrawer()
    }


    /** 
     * Created By: Aman Singhai
     *  created Date: 01/07/2020
     *  Decription: For calling the api
    */
    openRegister() {
        if (this.state.enteredAmount && this.state.enteredAmount != '') {
            this.setState({ isloading: true, isAmountEntered: false });
            //this.setState({ enteredAmount: 0.00, enterNote: '' });
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var registerName = (localStorage.getItem("registerName"));
            var last_login_register_id = (localStorage.getItem("register"));
            var LocationName = (localStorage.getItem("LocationName"));
            var last_login_Location_id = (localStorage.getItem("Location"));
            var open_register_param = {
                "RegisterId": last_login_register_id,
                "RegisterName": registerName,
                "LocationId": last_login_Location_id,
                "LocationName": LocationName,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "SalePersonName": user && user.display_name ? user.display_name : '',
                "SalePersonEmail": user && user.user_email ? user.user_email : '',
                "ActualOpeningBalance": this.state.enteredAmount,
                "OpeningNote": this.state.enterNote,
                "LocalTimeZoneOffsetValue": getLocalTimeZoneOffsetValue
            }
            this.props.dispatch(cashManagementAction.openRegister(open_register_param));
            $(".form-control").val('');
        }
        else{
            this.setState({ isAmountEntered: true });
        }
    }


    /** 
     * Created By: Aman Singhai
     *  created Date: 02/07/2020
     *  Decription: For validating the entered amount
    */
    validateEnteredAmount(e) {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value === '' || re.test(value)) {
            this.setState({ enteredAmount: value });
            // console.log("enteredAmount", this.state.enteredAmount);
        }
    }

    /** 
     * Created By: Aman Singhai
     *  created Date: 02/07/2020
     *  Decription: For sending the note
    */
    enterNote(e) {
        const { value } = e.target;
        this.setState({ enterNote: value })
        // console.log('value', value)
    }

    /** 
     * Created By: Aman Singhai
     *  created Date: 02/07/2020
     *  Decription: For closing the open register popup
    */
    closeOpenRegisterpopup() {
        // $('#OpeningFloat').modal("hide");
        hideModal('OpeningFloat');
        $('OpeningFloat').removeClass('show');
        $(".form-control").val('');
    }

    componentWillReceiveProps(nextprop) {
        if (nextprop && nextprop.open_register && nextprop.open_register.is_success == false && nextprop.open_register.exceptions && nextprop.open_register.exceptions[0]) {

            this.setState({
                popupMsg: nextprop.open_register.exceptions[0],
                isloading: false
            })
        }
        if (nextprop && nextprop.open_register && nextprop.open_register.is_success) {
            this.closeOpenRegisterpopup();
            this.setState({ isloading: false, popupMsg: '' })
            window.location.reload();
        }
        if (nextprop && nextprop.open_register && nextprop.open_register.content && nextprop.open_register.content != undefined) {
            localStorage.setItem("Cash_Management_ID", nextprop.open_register.content.Id);
            localStorage.setItem("IsCashDrawerOpen", "true");
        }
    }

    render() {
        return (
            // <div class="modal popUpMid shift-to-sidebar" id="OpeningFloat" role="dialog" data-backdrop="false">
            <div className="modal fade popUpMid shift-to-sidebar" id="OpeningFloat" role="dialog" data-backdrop="static">
                {(this.state.isloading == true) && <LoadingModal />}
                <div className="modal-dialog modal-sm modal-center-block">
                    <div className="modal-content">
                        <div className="modal-header header-modal">
                            <h1>{LocalizedLanguage.openingFloat}</h1>
                            {/* <div className="data-dismiss" data-dismiss="modal" onClick={() => this.closeOpenRegisterpopup()}>
                                <img src="../assets/img/closenew.svg" alt="" />
                            </div> */}
                        </div>
                        <div className="modal-body">
                            <div className="overflow-auto">
                                <form className="form-addon">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">{LocalizedLanguage.openingFloat}</div>
                                            <input type="number" className="form-control" id="" placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateEnteredAmount(e)} onKeyDown={(evt) => (evt.key === 'e' || evt.key === '+' || evt.key === '-' || evt.key === 'E') && evt.preventDefault()} />
                                        </div>
                                        {
                                            (this.state.isAmountEntered === true) ?
                                            <small className="form-text text-danger">{LocalizedLanguage.AmountShouldntbeblank}</small>
                                            :null
                                        }
                                    </div>

                                    <div className="radio--custom radio-primary radio-primary-addon" onClick={() => this.callOpenCashDrawer()}>
                                        <input type="radio" id="radio-2" name="radio-group" defaultChecked/>
                                        <label htmlFor="radio-2">
                                            <i className="icons8-cash-register mr-2"></i>
                                                     {LocalizedLanguage.opencashdrawer}
                                                    </label>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group-reverse">
                                            <div className="input-group-addon">{LocalizedLanguage.addNote}</div>
                                            <textarea type="text" className="form-control" id="" placeholder={LocalizedLanguage.Pleaseaddnotehere} style={{ height: '115px' }} onChange={(e) => this.enterNote(e)}></textarea>
                                        </div>
                                    </div>
                                    {/* <div className="text-center">
                                            <div className="radio--custom radio-default radio--inline">
                                                <input type="radio" id="radio-1" name="radio-group" />
                                                    <label for="radio-1">Print Report</label>
                                            </div>
                                        </div> */}
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer no-padding bt-0">
                            {this.state.popupMsg != '' ?
                                <div className="cashManagementError" style ={{textAlign :'center', color :'red'}}>
                                    <img src='../../assets/img/images/error.svg' />
                                    {this.state.popupMsg}
                                </div> : ''}
                            <button className="btn btn-primary btn-block h-70 btn-capitalize" onClick={() => this.openRegister()}>
                                {LocalizedLanguage.okTitle}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { open_register } = state;
    return {
        open_register: open_register.items
    };
}
const connectedOpeningFloatPopup = connect(mapStateToProps)(OpeningFloatPopup);
export { connectedOpeningFloatPopup as OpeningFloatPopup };
