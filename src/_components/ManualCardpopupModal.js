import React from 'react';
import { connect } from 'react-redux';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';

class ManualCardpopupModal extends React.Component {
    constructor(props) {
        super(props);           
        this.state = {
            CardNo : '',
            CardName : '',
            ExpirMonth : '',
            ExpirYear : '',
            CVVNo : '',
            City : '',
            BillAddress : '',
            BillAddress2 : '',
            Country : '',
            State : '',
            ZipCode : ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {        
        var CardNo = this.state.CardNo;
        const { name, value } = e.target;
        var pin;
        switch (name) {
            case 'CardNo':
                this.setState({ CardNo: value && value != "" ? value.match(/^[0-9]*$/) : '' }) 
           default:
                break;
        }
        this.setState({ [name]: value });
    }

    render() {  
        return (
            <div className="modal fade popUpMid" id="manualcardentry" role="dialog">
                <div className="modal-dialog modal-sm modal-center-block">
                    <div className="modal-content">
                        <div className="modal-header header-modal">
                            <h1>Manual Card Entry</h1>
                            <div className="data-dismiss" data-dismiss="modal">
                                <img src="assets/img/closenew.svg"  alt=""/>
                            </div>
                        </div>
                        <div className="modal-body popScroll">
                            <div className="overflowscroll">
                                <form className="form-addon">
                                    <h3 className="manual-title">Card Information </h3>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Card Number</div>
                                            <input type="tel" className="form-control" maxLength={13} id="CardNo" placeholder="Enter Card Number" name="CardNo" value={this.state.CardNo} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Cardholder Name</div>
                                            <input type="text" className="form-control" id="" placeholder="John Smith"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Expiry Month</div>
                                            <input type="number" className="form-control" id="" maxLength={13} placeholder="MM"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Expiry Year</div>
                                            <input type="number" className="form-control" maxLength={2} id="" placeholder="XXXX"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">CVC/CVV</div>
                                            <input type="number" className="form-control" maxLength={2} id="" placeholder="XXXX"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">City</div>
                                            <input type="text" className="form-control" id="" placeholder="City"/>
                                        </div>
                                    </div>
                                    <h3 className="manual-title manual-title-space">Billing Information</h3>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Billing Address</div>
                                            <input type="text" className="form-control" id="" placeholder="Enter Billing Address" value=""/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Billing Address 2</div>
                                            <input type="text" className="form-control" id="" placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Country</div>
                                            <input type="text" className="form-control" id="" placeholder="Enter Country"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">City</div>
                                            <input type="text" className="form-control" id="" placeholder="Enter City"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">State/Province</div>
                                            <input type="text" className="form-control" id="" placeholder="XXX"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">Zip/Postal Code</div>
                                            <input type="text" className="form-control" id="" placeholder="XXX"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer no-padding bt-0">
                            <button className="btn btn-primary btn-block h-70">
                                Charge Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>   
        )
    }
}
function mapStateToProps(state) {
    const {  } = state;
    return {
    };
}
const connectedManualCardpopupModal = connect(mapStateToProps)(ManualCardpopupModal);
export { connectedManualCardpopupModal as ManualCardpopupModal };