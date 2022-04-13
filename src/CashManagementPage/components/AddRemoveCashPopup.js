import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import moment from 'moment';
import { cashManagementAction } from '../actions/cashManagement.action';
import $ from 'jquery';
import { LoadingModal } from '../../_components';
import { default as NumberFormat } from 'react-number-format';

class AddRemoveCashPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addCashAmount: 0.00,
            removeCashAmount: 0.00,
            enterNote: '',
            isloading: false
        }
        this.addNote = this.addNote.bind(this);
        this.validateAddNumber = this.validateAddNumber.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeAddRemoveCashPopup = this.closeAddRemoveCashPopup.bind(this);
    }

    // componentDidMount() {
    //     var registerID = localStorage.getItem('register');
    //     if (registerID && registerID > 0) {
    //         this.props.dispatch(cashManagementAction.getCashDrawerAmount(registerID));
    //     }
    // }

    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For adding/removing cash amount
    */
    validateAddNumber(e, type) {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        if (value == '' || re.test(value)) {
            if (type == 'add') {
                //this.state.addCashAmount = $('#txtAddCash').text() == "0" || $('#txtAddCash').text() == "0.00" ? value : $('#txtAddCash').val();
                this.setState({ addCashAmount : value });
                // console.log('entered value', $('#txtAddCash').text())
                // console.log('addValue', this.state.addCashAmount);
            }
            else {
                this.setState({ removeCashAmount : value });
                //this.state.removeCashAmount = $('#txtRemoveCash').text() == "0" || $('#txtRemoveCash').text() == "0.00" ? value : $('#txtRemoveCash').val();
                // console.log('removeValue', this.state.removeCashAmount);
            }
        }
    }

    /** 
    * Created By: Aman Singhai
    *  created Date: 08/07/2020
    *  Decription: For adding note
    */
    addNote(e) {
        const { value } = e.target;
        this.state.enterNote = value;
    }

    handleSubmit() {
        if (this.state.addCashAmount || this.state.removeCashAmount) {
            this.setState({ isloading: true });
            var cashManagementID = localStorage.getItem('Cash_Management_ID');
            var d = new Date();
            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
            var localTimeZoneType = moment.tz.guess(true);
            var user = JSON.parse(localStorage.getItem("user"));
            var addRemoveParm = {
                "CashManagementId": cashManagementID,
                "AmountIn": this.state.addCashAmount,
                "AmountOut": this.state.removeCashAmount,
                "LocalDateTime": dateStringWithTime,
                "LocalTimeZoneType": localTimeZoneType,
                "SalePersonId": user && user.user_id ? user.user_id : '',
                "SalePersonName": user && user.display_name ? user.display_name : '',
                "SalePersonEmail": user && user.user_email ? user.user_email : '',
                "OliverPOSReciptId": '0',
                "Notes": this.state.enterNote
            }
            this.props.dispatch(cashManagementAction.addRemoveCash(addRemoveParm));
            this.setState({
                addCashAmount: 0.00,
                removeCashAmount: 0.00,
                enterNote : ''
            })
            hideModal('AddRemoveCash');
            $('AddRemoveCash').removeClass('show');
            $('.form-control').val('');
        }
    }

    componentWillReceiveProps(nextprop) {
        if (nextprop && nextprop.addRemoveCash && nextprop.addRemoveCash.addRemoveCash && nextprop.addRemoveCash.addRemoveCash.is_success == true) {
            if(this.state.isloading ==true){
                var cashManagementID = localStorage.getItem('Cash_Management_ID');
                this.props.refreshDetail(cashManagementID, this.props.activeIndex);
            }
            
            this.closeAddRemoveCashPopup();
            this.setState({ isloading: false });
        }
    }
    /** 
     * Created By: Aman Singhai
     *  created Date: 09/07/2020
     *  Decription: For closing the add/remove cash popup
    */
    closeAddRemoveCashPopup() {      
        hideModal('AddRemoveCash');
        $('AddRemoveCash').removeClass('show');
        $('.form-control').val('');
      
    }

    render() {
        var cashDrawerBal = this.props.drawerBalance;

        return (
            <div className="modal fade popUpMid" id="AddRemoveCash" role="dialog">
                <div className="modal-dialog modal-sm modal-center-block">
                    {this.state.isloading == true ? <LoadingModal /> : ''}
                    <div className="modal-content">
                        <div className="modal-header header-modal">
                            <h1>{LocalizedLanguage.addRemoveCash}</h1>
                            <div className="data-dismiss" data-dismiss="modal" onClick={() => this.closeAddRemoveCashPopup()}>
                                <img src="../assets/img/closenew.svg" alt="" />
                            </div>
                        </div>
                        <div className="modal-body pt-0">
                            <div className="overflowscroll">
                                <form className="form-addon">
                                    <div className="form-group mb-0">
                                        <div className="input-group input-group-no-border">
                                            <div className="input-group-addon border-0">{LocalizedLanguage.currentBalance}</div>
                                            <div className="form-control border-0"><NumberFormat value={cashDrawerBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">{LocalizedLanguage.addCash}</div>
                                            <input type="text" className="form-control" id="txtAddCash" value={this.state.addCashAmount} placeholder={LocalizedLanguage.EnterAmount} onChange={(e) => this.validateAddNumber(e, 'add')} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">{LocalizedLanguage.removeCash}</div>
                                            <input type="text" className="form-control" id="txtRemoveCash" onChange={(e) => this.validateAddNumber(e, 'remove')} placeholder={LocalizedLanguage.EnterAmount} value={this.state.removeCashAmount} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-reverse">
                                            <div className="input-group-addon" >{LocalizedLanguage.addNote}</div>
                                            <textarea type="tel" className="form-control shorthight" id="" onChange={(e) => this.addNote(e)} placeholder={LocalizedLanguage.Pleaseaddnotehere}></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer no-padding bt-0">
                            <button className="btn btn-primary btn-block h-70 btn-capitalize" onClick={() => this.handleSubmit()}>
                                {LocalizedLanguage.updateBalance}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { addRemoveCash } = state;
    return {
        addRemoveCash: addRemoveCash,
    }
}
const connectedAddRemoveCashPopup = connect(mapStateToProps)(AddRemoveCashPopup);
export { connectedAddRemoveCashPopup as AddRemoveCashPopup };