import React from 'react';
import { connect } from 'react-redux';
import { locationActions } from '.';
import { registerActions } from '../LoginRegisterPage/actions/register.action';
import { history } from "../_helpers";
import { get_UDid } from '../ALL_localstorage'
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import MobileLoginLocation from './views/mLoginLocation';
import WebLoginLocation from './views/wLoginLocation'
import $ from 'jquery';
import {trackPage} from '../_components/SegmentAnalytic'

class LoginLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check: true,
            loading: false,
            notFounLocation: false,
            UserLocations: this.props.locations ? this.props.locations : JSON.parse(localStorage.getItem('UserLocations')),
            isLoading: localStorage.getItem('UserLocations') ? true : false,
        };
        this.handleBack = this.handleBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.windowLocation = this.windowLocation.bind(this);
        this.checkStatus = this.checkStatus.bind(this);
        this.autoFocusIs = this.autoFocusIs.bind(this);
        this.clear = this.clear.bind(this);

      localStorage.removeItem("CHECKLIST");
      localStorage.removeItem("CARD_PRODUCT_LIST");
    }

    componentWillReceiveProps(nextProps) {
        var UDID = get_UDid('UDID');
        if (!UDID) {
            history.push('/login');
        }

        if (nextProps.registers) {
            this.setState({ loading: false })
            if (nextProps.registers && nextProps.registers.length > 0) {
                history.push('/choose_registration');
            }
            if (nextProps.registers && nextProps.registers.length == 0) {
                this.setState({
                    notFounLocation: true
                })
            }
        }
        var UserLocations = nextProps.locations ? nextProps.locations : JSON.parse(localStorage.getItem('UserLocations'));
        if (UserLocations) {
            this.setState({
                isLoading: true,
                UserLocations: UserLocations
            })
        }
    }

    componentDidMount() {
        window.indexedDB.deleteDatabase('ProductDB');
        var UDID = get_UDid('UDID');
        var userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : 0;
        if (UDID) {
            if ((!localStorage.getItem('UserLocations')) || localStorage.getItem('UserLocations') == null) {
                this.props.dispatch(locationActions.getAll(UDID, userId));
            }
        } else {
            if ((!localStorage.getItem('UserLocations')) || localStorage.getItem('UserLocations') == null) {
                history.push("/login")
            }
        }
        this.autoFocusIs()
        setTimeout(function () {
            if (typeof EnableContentScroll != "undefined"){EnableContentScroll();}

        }, 2000)

        trackPage(history.location.pathname,"Locations","login_location","login_location");
    }

    handleSubmit(item) {
        localStorage.setItem('Location', item.id);
        localStorage.setItem('LocationName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_location_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_location_name_${getudid}`, item.name);
        localStorage.setItem('WarehouseId', item.warehouse_id);
        //Check IndexDb Exists-------------
        //----------------------------------  
        this.setState({ loading: true })
        if (item.id) {

            const { dispatch } = this.props;
            dispatch(registerActions.getAll());
        }
        // history.push('/choose_registration');
    }

    windowLocation(location) {
        window.location = location
    }

    checkStatus(value) {
        this.setState({ check: value })
    }

    handleBack(e) {
        if (e.keyCode == 86 && e.ctrlKey) {
            $('#loginLoactionBackButton').focus();
        }
    }

    autoFocusIs() {
        var UserLocations = this.props.locations ? this.props.locations : JSON.parse(localStorage.getItem('UserLocations'));
        if (UserLocations) {
            setTimeout(function () {
                $('#loginLocationTab0').focus()
            }, 300);
        }
    }

    clear() {
        localStorage.removeItem('UserLocations')
    }

    render() {
        return (
            //(isMobileOnly == true) ?
                // <MobileLoginLocation
                //     {...this.state}
                //     autoFocusIs={this.autoFocusIs}
                //     windowLocation={this.windowLocation}
                //     handleSubmit={this.handleSubmit}
                //     handleBack={this.handleBack}
                //     checkStatus={this.checkStatus}
                //     clear={this.clear}
                // />
                // <WebLoginLocation
                //     {...this.state}
                //     autoFocusIs={this.autoFocusIs}
                //     windowLocation={this.windowLocation}
                //     handleSubmit={this.handleSubmit}
                //     handleBack={this.handleBack}
                //     checkStatus={this.checkStatus}
                //     clear={this.clear}
                // />
                // :
                <WebLoginLocation
                    {...this.state}
                    autoFocusIs={this.autoFocusIs}
                    windowLocation={this.windowLocation}
                    handleSubmit={this.handleSubmit}
                    handleBack={this.handleBack}
                    checkStatus={this.checkStatus}
                    clear={this.clear}
                />
        );
    }
}

function mapStateToProps(state) {
    const { locations, registers } = state;
    return {
        locations: locations.locations,
        registers: registers.registers
    };
}
const connectedLoginLocation = connect(mapStateToProps)(LoginLocation);
export { connectedLoginLocation as LoginLocation };