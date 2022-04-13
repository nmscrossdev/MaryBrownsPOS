import React from 'react';
import { connect } from 'react-redux';

class SettingSideList extends React.Component {

    render() {
        return (
            <div className="col-xs-5 col-sm-3 p-0">
                <div className="items">
                    <div className="panel panel-default panel-product-list p-0 bor-customer">
                        <div className="overflowscroll window-header-search">
                            <ul className="nav nav-pills nav-stacked general-setting-tabs">
                                <li className="active"><a data-toggle="tab" href="#setting-general" aria-expanded="false">General Setting</a></li>
                                <li><a data-toggle="tab" href="#setting-printer" aria-expanded="true">Printer</a></li>
                                <li><a data-toggle="tab" href="#setting-barcode" aria-expanded="false">Barcode Reader</a></li>
                                <li><a data-toggle="tab" href="#setting-connection" aria-expanded="false">Connection</a></li>
                            </ul>
                        </div>
                        <div className="searchDiv relDiv">
                            <button className="btn btn-block btn-primary total_checkout" style={{ height: '100%' }}>
                                Logout
                                    </button>
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
const connectedSettingSideList = connect(mapStateToProps)(SettingSideList);
export { connectedSettingSideList as SettingSideList };
