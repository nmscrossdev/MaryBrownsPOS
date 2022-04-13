import React from 'react';
import { connect } from 'react-redux';

class SettingGeneral extends React.Component {
    render() {
        return (
            <div id="setting-general" className="tab-pane fade in active">
                <div className="panel panel-custmer">
                    <div className="panel-default">
                        <div className="panel-heading text-center customer_name font18 visible2">
                            Connect To Oliver
                                            </div>
                        <div className="panel-body customer_history p-0">
                            <form className="clearfix form_editinfo connection-setting">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                Username
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
                                                <option>*******</option>
                                                <option>*******</option>
                                                <option>*******</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon">
                                                api ley
                                                            </div>
                                            <input value="HU23984OK34MKFDDS8987023" className="form-control" id="user_email" name="user_email" type="text" style={{ borderRadius: 0 }} />
                                            <div className="input-group-addon"
                                                style={{ minWidth: 174, backgroundColor: '#46A9D4', color: ' #fff', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                            // style="min-width: 174px; border-radius: 0px 10px 10px 0px; color: #fff; background-color: #46A9D4; "
                                            >
                                                Search
                                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-addon" style={{ minWidth: 1 }}>
                                            </div>
                                            <input className="form-control bl-0" id="connect" placeholder="Connected" value="Connected" name="connect" type="button" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="panel panel-custmer mt-3">
                    <div className="panel-default">
                        <div className="panel-heading text-center customer_name font18 visible2">
                            Others
                                            </div>
                        <div className="panel-body customer_history pt-0">
                            <table className="table table-printer-setting">
                                <tbody>
                                    <tr>
                                        <td>Logout After Each Sale</td>
                                        <td align="right">
                                            <div className="flat-toggle on">
                                                <span></span>
                                                <input value="0" type="hidden" id="dashboard_reports" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Automatically Sync Products</td>
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
                            <button type="button" className="btn btn-default btn-gen-setting">Syncronize All</button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedSettingGeneral = connect(mapStateToProps)(SettingGeneral);
export { connectedSettingGeneral as SettingGeneral };
