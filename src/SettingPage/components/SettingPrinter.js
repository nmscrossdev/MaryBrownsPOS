import React from 'react';
import { connect } from 'react-redux';

class SettingPrinter extends React.Component {

    render() {
        return (
            <div id="setting-printer" className="tab-pane fade">
                <div className="panel panel-custmer">
                    <div className="panel-default">
                        <div className="panel-heading text-center customer_name font18 visible2">
                            Connect Printer
                                            </div>
                        <div className="panel-body customer_history p-0">
                            <form className="clearfix form_editinfo connection-setting">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                Printer Model
                                                                </div>
                                            <input value=" mn@creativemaple.ca" placeholder=" mn@creativemaple.ca" className="form-control" id="Username" name="Username" type="text" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                Connection Type
                                                            </div>
                                            <select className="form-control" id="connection_type" name="connection_type">
                                                <option>Starprint TSP 100</option>
                                                <option>Starprint TSP 101</option>
                                                <option>Starprint TSP 102</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                Find Printer
                                                            </div>
                                            <input value="" className="form-control" id="user_email" name="user_email" type="text" style={{ borderRadius: 0 }} />
                                            <div className="input-group-addon" style={{ minWidth: 174, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#46A9D4', color: '#fff' }}
                                            //style="min-width: 174px; border-radius: 0px 10px 10px 0px; color: #fff; background-color: #46A9D4; "
                                            >
                                                Search
                                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="panel panel-custmer mt-2">
                    <div className="panel-default">
                        <div className="panel-heading text-center customer_name font18 visible2">
                            Printer Settings
                                            </div>
                        <div className="panel-body customer_history pt-0">
                            <table className="table table-printer-setting">
                                <tbody>
                                    <tr>
                                        <td>Automatically print after each sale</td>
                                        <td align="right">
                                            <div className="flat-toggle on">
                                                <span></span>
                                                <input value="0" type="hidden" id="dashboard_reports" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Open Cash Drawer Automatically</td>
                                        <td align="right">
                                            <div className="flat-toggle on">
                                                <span></span>
                                                <input value="0" type="hidden" id="dashboard_reports" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="panel-footer b-0 mb-0 text-right">
                            <button type="button" className="btn btn-default btn-gen-setting mr-2">Open Cash Drawer</button>
                            <button type="button" className="btn btn-default btn-gen-setting">Test Printer</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { };
}
const connectedSettingPrinter = connect(mapStateToProps)(SettingPrinter);
export { connectedSettingPrinter as SettingPrinter };
