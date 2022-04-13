import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../settings/LocalizedLanguage';

class RegisterOpenCloseModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="modal fade modal-wide in sidebar-minus" id="registeropenclose1" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header" style={{ display: 'none' }} >
                                <button type="button" className="close" data-dismiss="modal">×</button>
                                <h4 className="modal-title">{LocalizedLanguage.modalHeader}</h4>
                            </div>
                            <div className="modal-body p-0">
                                <div className="panel panel-custmer b-0">
                                    <div className="panel-default">
                                        <div className="panel-heading text-center customer_name font18 visible2">
                                            Close Register
                                        </div>
                                        <div className="panel-body customer_history p-0">
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-lg-9 col-sm-8 plr-8">
                                                        <form className="customer-detail">
                                                            <div className="form-group">
                                                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pl-0 mb-4 plr-8">
                                                                    <label htmlFor="">Register:</label>
                                                                    <div className="col-sm-12 p-0">
                                                                        <p>Register 1</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pl-0 mb-4 plr-8">
                                                                    <label htmlFor="">Date &amp; Time:</label>
                                                                    <div className="col-sm-12 p-0">
                                                                        <p className="text-blue">15. January 12:57PM</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 pl-0 mb-4 plr-8">
                                                                    <label htmlFor="">User:</label>
                                                                    <div className="col-sm-12 p-0">
                                                                        <p>Mike Kellerman</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-4 bl-1 plr-8">
                                                        <form action="#" className="w-100 pl-3">
                                                            <div className="w-100-block button_with_checkbox">
                                                                <input type="radio" id="p-report" name="radio-group" />
                                                                <label htmlFor="p-report" className="label_select_button">Print Report</label>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-footer bt-0 p-0">
                                            <div className="table_head">
                                                <table className="table table-border table-hover borderless c_change mb-0 tbl-bb-1 tbl-layout-fixe">
                                                    <colgroup>
                                                        <col width="*" />
                                                        <col width="350" />
                                                        <col width="350" />
                                                        <col width="350" />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <th className="bt-0 pb-0 bb-1">Item</th>
                                                            <th className="bt-0 pb-0 text-right bb-1">Expected</th>
                                                            <th className="bt-0 pb-0 text-right bb-1">Actual</th>
                                                            <th className="bt-0 pb-0 text-right bb-1">Difference</th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="">
                                                <table className="table table-borderless tbl-bb-1 font tbl-layout-fixe pt-3 pb-3">
                                                    <colgroup>
                                                        <col width="*" />
                                                        <col width="350" />
                                                        <col width="350" />
                                                        <col width="350" />
                                                    </colgroup>
                                                    <tbody>
                                                        <tr>
                                                            <td>Cash In Tiller</td>
                                                            <td align="right">950.00 </td>
                                                            <td align="right" className="text-blue">1050.00</td>
                                                            <td align="right">1050.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Debit/Credit Card</td>
                                                            <td align="right">950.00 </td>
                                                            <td align="right" className="text-blue">1050.00</td>
                                                            <td align="right">1050.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Gift Card</td>
                                                            <td align="right">950.00 </td>
                                                            <td align="right" className="text-blue">1050.00</td>
                                                            <td align="right">1050.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Others</td>
                                                            <td align="right">950.00 </td>
                                                            <td align="right" className="text-blue">1050.00</td>
                                                            <td align="right">1050.00</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="col-lg-offset-7 col-lg-5 col-sm-offset-6 col-sm-6 col-xs-offset-4 col-xs-8 p-0">
                                                    <table className="table table-borderless tbl-bb-1 mb-0 font pt-1 pb-1">
                                                        <tbody>
                                                            <tr>
                                                                <td className="pl-0">Total Difference</td>
                                                                <td className="text-right">10.00</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div className="register-closenote">
                                                        <textarea cols="12" rows="4" className="form-control" placeholder="Enter notes here"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer p-0">
                                <button type="button" className="btn btn-primary btn-block h66">SAVE &amp; UPDATE</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}
const connectedRegisterOpenCloseModal = connect(mapStateToProps)(RegisterOpenCloseModal);
export { connectedRegisterOpenCloseModal as RegisterOpenCloseModal };