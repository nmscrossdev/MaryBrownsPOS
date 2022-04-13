import React from 'react';
import { connect } from 'react-redux';
import { registerActions } from '../';
import { history } from "../../_helpers";
import { get_UDid } from '../../ALL_localstorage'
import WebLoginRegisterView from '../views/wLoginRegister';
import MobileLoginRegisterView from '../views/mLoginRegister';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import Keys from '../../settings/Keys'
import { checkForEnvirnmentAndDemoUser, redirectToURL } from '../../_components/CommonJS';
import {trackPage} from '../../_components/SegmentAnalytic';
import {GetUsedRegisters} from '../../firebase/Notifications'
import Config from '../../Config'

class LoginRegisterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check: true,
            LocationName: '',
            loading: true,
            fireBaseUsedRegister : []
          //  screenWidth: null 
        };
        this.handleBack = this.handleBack.bind(this);
        this.autoFocusIs = this.autoFocusIs.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkStatus = this.checkStatus.bind(this);
        this.removeLocation = this.removeLocation.bind(this);
        //this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
 
    }
    // updateWindowDimensions() {
    //     this.setState({ screenWidth: window.innerWidth });
    //  }
    componentWillMount() {
       // window.removeEventListener("resize", this.updateWindowDimensions)
        var getudid = get_UDid('UDID');
        var locationName = localStorage.getItem(`last_login_location_name_${getudid}`) ? localStorage.getItem(`last_login_location_name_${getudid}`) : '';
        this.setState({ LocationName: locationName })
        var location = localStorage.getItem('Location') ? localStorage.getItem('Location') : '';
        if (location) {
            const { dispatch } = this.props;
            dispatch(registerActions.getAll());
        } else {
            history.push('/login_location');
        }

        //Get all resister used by other user
        var isValidENV = checkForEnvirnmentAndDemoUser()
        if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
        GetUsedRegisters(this.props.dispatch)
        }
    }

    componentDidMount() {
        this.autoFocusIs()
        setTimeout(function () {
            if (typeof EnableContentScroll != "undefined"){EnableContentScroll();}
        }, 2000)
       // window.addEventListener("resize", this.updateWindowDimensions());
       trackPage(history.location.pathname,"Registers","choose_registration","choose_registration");
    }

    componentWillReceiveProps(next) {
        if (next.registers) {
            setTimeout(function () {
                $(".chooseregisterLinks").niceScroll({ styler: "fb", cursorcolor: "#2BB6E2", cursorwidth: '3', cursorborderradius: '10px', background: '#d5d5d5', spacebarenabled: false, cursorborder: '', scrollspeed: 60, cursorfixedheight: 70 });
            }, 500)
            this.setState({ loading: false })
        }
        if(next.usedregisters){
            this.setState({fireBaseUsedRegister : next.usedregisters})
        }

    }

    handleSubmit(item) {
        var arry = [];
        arry.push(item)
        localStorage.setItem('pdf_format', JSON.stringify(arry))
        localStorage.setItem('register', item.id);
        localStorage.setItem('registerName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_register_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_register_name_${getudid}`, item.name);
        localStorage.setItem('selectedRegister',JSON.stringify(item))
        // history.push('/loginpin');
        redirectToURL()
    }

    windowLocation(location) {
        window.location = location
    }

    checkStatus(value) {
        this.setState({ check: value })
    }

    handleBack(e) {
        if (e.keyCode == 86 && e.ctrlKey) {
            $('#loginRegisterBackButton').focus();
        }
    }

    autoFocusIs() {
        if (this.props.registers && this.props.registers.length > 0) {
            setTimeout(function () {
                $('#loginRegisterTab0').focus()
            }, 300);
        }
    }

    removeLocation() {
        //  localStorage.removeItem('UserLocations')
    }

    render() {
       
        const {registers}=this.props
       // console.log("screen" ,this.state.screenWidth, registers)
       var _registers=registers;
       var clientDetails = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')) 
       if( clientDetails && clientDetails.subscription_permission && clientDetails.subscription_permission.AllowSelfCheckout == false){
         _registers=registers && registers.filter(item => {
            return (item.IsSelfCheckout == false);
        })
       }
        
        // if(this.state.screenWidth==Keys.key.SelfCheckoutScreen )  //For seftcheckout 
        //     _registers= registers && registers.filter(item => {
        //     return (item.IsSelfCheckout == true)
        // })

        return (
            (isMobileOnly == true) ?
                // <MobileLoginRegisterView
                //     {...this.props}
                //     {...this.state}
                //     registers={_registers}
                //     handleBack={this.handleBack}
                //     autoFocusIs={this.autoFocusIs}
                //     handleSubmit={this.handleSubmit}
                //     checkStatus={this.checkStatus}
                //     removeLocation={this.removeLocation}
                // />
                <WebLoginRegisterView
                    {...this.props}
                    {...this.state}
                    registers={_registers}
                    fireBaseUsedRegister = {this.state.fireBaseUsedRegister}
                    handleBack={this.handleBack}
                    autoFocusIs={this.autoFocusIs}
                    handleSubmit={this.handleSubmit}
                    checkStatus={this.checkStatus}
                    removeLocation={this.removeLocation}
                />
                :
                <WebLoginRegisterView
                    {...this.props}
                    {...this.state}
                    registers={_registers}
                    fireBaseUsedRegister = {this.state.fireBaseUsedRegister}
                    handleBack={this.handleBack}
                    autoFocusIs={this.autoFocusIs}
                    handleSubmit={this.handleSubmit}
                    checkStatus={this.checkStatus}
                    removeLocation={this.removeLocation}
                />
        );
    }
}

function mapStateToProps(state) {
    const { registers,getFirebaseRegisters } = state;
    return {
        registers: registers.registers,
        usedregisters:getFirebaseRegisters.usedregisters
    };
}
const connectedLoginLoginRegisterView = connect(mapStateToProps)(LoginRegisterView);
export { connectedLoginLoginRegisterView as LoginRegisterView };