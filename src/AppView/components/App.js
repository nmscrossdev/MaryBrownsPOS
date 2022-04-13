import React from 'react';
import { connect } from 'react-redux';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="col-lg-9 col-sm-8 col-xs-8 pt-3">
                    <div className="pg-app">
                        <div className="extension-horizontal overflowscroll window-header">
                            <div className="extension-box extension-box-active bg-white mb-3">
                                <div className="extension-image">
                                    <img src="assets/img/google2.0 1.png" />
                                </div>
                                <div className="extension-title">
                                    Google Search
                                        </div>
                            </div>
                            <div className="extension-box bg-white mb-3">
                                <div className="extension-image">
                                    <img src="assets/img/facebook_logos_PNG19750 1.png" />
                                </div>
                                <div className="extension-title">
                                    Our Facebook
                                        </div>
                            </div>
                            <div className="extension-box bg-white mb-3">
                                <div className="extension-image">
                                    <img src="assets/img/Tickera.png" />
                                </div>
                                <div className="extension-title">
                                    Tickera
                                        </div>
                            </div>
                            <div className="extension-box bg-white mb-3">
                                <div className="extension-image">
                                    <img src="assets/img/Twilio.png" />
                                </div>
                                <div className="extension-title">
                                    SMS Campaign
                                        </div>
                            </div>
                            <div className="extension-box bg-white mb-3">
                                <div className="extension-image">
                                    <img src="assets/img/Woo.png" />
                                </div>
                                <div className="extension-title">
                                    Dynamic Disco..
                                        </div>
                            </div>
                        </div>
                        <div className="panel panel-default panel-flex panel-flex-menu">
                            <div className="panel-body">
                                <img src="assets/img/Screen Shot 2020-04-02 at 8.29 1.png" alt="" />
                            </div>
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
const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };


