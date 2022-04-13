import React from 'react';
import { connect } from 'react-redux';

class SettingConnection extends React.Component {

    render() {
        return (
            <div id="setting-connection" className="tab-pane fade">
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedSettingConnection = connect(mapStateToProps)(SettingConnection);
export { connectedSettingConnection as SettingConnection };
