import React from 'react';
import { connect } from 'react-redux';
import { NavbarPage, CommonHeader } from '../../_components';
import { SettingBarcodeReader, SettingConnection, SettingGeneral, SettingPrinter, SettingSideList } from '../';

class SettingView extends React.Component {

    render() {
        return (
            <div className="wrapper">
                <div className="overlay"></div>
                <NavbarPage {...this.props} />
                <div id="content" className="general-settings">
                    <CommonHeader {...this.props} />
                    <div className="inner_content bg-light-white clearfix">
                        <div className="content_wrapper">
                            <SettingSideList {...this.props} />
                            <div className="col-xs-7 col-sm-9 mt-4">
                                <div className="tab-content">
                                    <SettingGeneral  {...this.props} />
                                    <SettingPrinter {...this.props} />
                                    <SettingBarcodeReader {...this.props} />
                                    <SettingConnection {...this.props} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const connectedSettingView = connect(mapStateToProps)(SettingView);
export { connectedSettingView as SettingView };