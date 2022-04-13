import React from 'react';
import { connect } from 'react-redux';

class SettingBarcodeReader extends React.Component {

    render() {
        return (
            <div id="setting-barcode" className="tab-pane fade">
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { };
}
const connectedSettingBarcodeReader = connect(mapStateToProps)(SettingBarcodeReader);
export { connectedSettingBarcodeReader as SettingBarcodeReader };
