/**
 * Created By   : Priyanka
 * Created Date : 26-06-2019
 * Description : show user profile pin. 
 */
import React from 'react';
import { connect } from 'react-redux';
import { pinLoginActions } from '../PinPage/action/PinLogin.action';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import UserPinList from './views/m.UserPinView';
import $ from "jquery";

class UserPinComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: '',
            CurrentUser_Active: localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '',
            notxtValue: '',
            totalSize: 0,
            txtValue: "",
            alert_msg: "",
            activeAlertMsg: false,

        }
        this.handleBack = this.handleBack.bind(this)
        this.handle = this.handle.bind(this);
        this.back_arrow = this.back_arrow.bind(this);
        this.addToScreen = this.addToScreen.bind(this);
        this.whichkey = this.whichkey.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.activeAlertMsg == true) {
            this.setState({ alert_msg: nextProps.alert })
        }
        this.setState({ userData: nextProps.userDetail })
        const { alert, pinlogin } = nextProps;
        if ((alert && alert !== "") || (pinlogin == false)) {
            if (isMobileOnly == true) {
                $("#txts1").removeClass("bg-primary");
                $("#txts2").removeClass("bg-primary");
                $("#txts3").removeClass("bg-primary");
                $("#txts4").removeClass("bg-primary");
            } else {
                $("#txts1").addClass("bg_trasn");
                $("#txts2").addClass("bg_trasn");
                $("#txts3").addClass("bg_trasn");
                $("#txts4").addClass("bg_trasn");
            }
            this.state.totalSize = 0;
            this.state.txtValue = "";
            this.setState({
                totalSize: 0,
                txtValue: ''
            })
        }
    }

    back_arrow() {
        setTimeout(function () {
            if (isMobileOnly == true) {
                $("#txts1").removeClass("bg-primary");
                $("#txts2").removeClass("bg-primary");
                $("#txts3").removeClass("bg-primary");
                $("#txts4").removeClass("bg-primary");
            } else {
                $("#txts1").addClass("bg_trasn");
                $("#txts2").addClass("bg_trasn");
                $("#txts3").addClass("bg_trasn");
                $("#txts4").addClass("bg_trasn");
            }
            if (this.state.activeAlertMsg == true) {
                this.setState({
                    activeAlertMsg: false
                });
            }
            this.setState({
                alert_msg: '',
            });
            this.state.alert_msg = "";
        }.bind(this), 500)
        this.state.alert_msg = "";
        if (isMobileOnly == true) {
            $("#changePassword").removeAttr("style");
            $(".appOffCanvasFooterOverlay").removeAttr("style");
        } else {
            $("#note-views").removeClass("push");
        }

    }

    fillPass() {
        const { dispatch } = this.props;
        var i = 1;
        for (i = 1; i <= 4; i++) {
            if (this.state.totalSize >= i) {
                console.log("fill_this.state.totalSize ", this.state.totalSize )
                if (this.state.totalSize >= 4) {
                    setTimeout(function () {    //Need delay for reaset text
                        var userId = this.state.userData;
                        dispatch(pinLoginActions.switchUser(this.state.txtValue, this.state.userData.Id));
                        this.state.txtValue = "";
                        this.state.totalSize = 0;
                        this.state.activeAlertMsg = true;
                    }.bind(this), 100)
                    setTimeout(function () {
                        this.resetScreen();
                    }.bind(this), 500)
                }
                if (isMobileOnly == true) {
                    $("#txts" + i).addClass("bg-primary");
                } else {
                    $("#txts" + i).removeClass("bg_trasn");
                }

            } else {
                this.state.activeAlertMsg = true;
                if (isMobileOnly == true) {
                    $("#txts" + i).removeClass("bg-primary");
                } else {
                    $("#txts" + i).addClass("bg_trasn");
                }

            }
        }
    }
    
    handleBack(e) {
        // console.log("handleback")
        // if (e.keyCode == 76 && e.ctrlKey) {
        //     this.log_out()
        // }
        // if (e.keyCode == 86 && e.ctrlKey) {
        //     $('#PinPagebackButton').focus();
        // }
        var key = e.which || e.keyCode;
        if (key === 8) {
            this.addToScreen('c')
            e.preventDefault();
        }
        if (key === 13) {
            event.preventDefault();
        }
    }

    handle(e) {
        const { value } = e.target;
        console.log("value", value)
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
        // var key = e.which || e.keyCode;
        // if (key === 8) {
        //     this.addToScreen('c')
        //     e.preventDefault();
        // }
        // else{
        //     this.addToScreen(value)
        //     console.log("addtoscreenvalue", key)
        // }
        if (value === '' || re.test(value)) {
            this.addToScreen(value);
        }
    }

    addToScreen(e) {
        var lenght_is = e.length - 1
        console.log("lenght_is", lenght_is)
        var newString = e[lenght_is];
        console.log("e", e);
        console.log("newString", newString);
        if (e == "c") {
            if (this.state.totalSize > 0) {
                this.resetScreen();
            } else {
                if (isMobileOnly == true) {
                    $("#txts1").removeClass("bg-primary");
                    $("#txts2").removeClass("bg-primary");
                    $("#txts3").removeClass("bg-primary");
                    $("#txts4").removeClass("bg-primary");
                } 
                else {
                    $("#txts1").addClass("bg_trasn");
                    $("#txts2").addClass("bg_trasn");
                    $("#txts3").addClass("bg_trasn");
                    $("#txts4").addClass("bg_trasn");
                }
                this.state.totalSize = 0;
                this.state.txtValue = '';
            }
            return;
        }
        if (this.state.totalSize < 4) {
            console.log("add_this.state.totalSize", this.state.totalSize)
            this.state.txtValue += newString;
            console.log("this.state.txtValue + newString", this.state.txtValue);
            this.state.totalSize += 1;
            console.log("+1_this.state.totalSize", this.state.totalSize)
            setTimeout(function () {
                this.fillPass();
            }.bind(this), 100)
        }

        var _envType=  localStorage.getItem('env_type');
        if (_envType && _envType !=="") {
            $('#switch_pin').attr('readonly', true);
        } else {
            $('#switch_pin').focus();
            console.log("focused")
        }
    }

    whichkey() {
        if(localStorage.getItem('env_type')){
            $('#switch_pin').attr('readonly', true);
        }else{
            $('#switch_pin').focus();
            console.log("focused")
          }
    }

    resetScreen() {
        var str = this.state.txtValue;
        if (this.state.totalSize > 0) {
            this.state.totalSize -= 1;
            this.state.txtValue = str.substring(0, str.length - 1);
        } else {
            if (isMobileOnly == true) {
                $("#txts1").removeClass("bg-primary");
                $("#txts2").removeClass("bg-primary");
                $("#txts3").removeClass("bg-primary");
                $("#txts4").removeClass("bg-primary");
            } else {
                $("#txts1").addClass("bg_trasn");
                $("#txts2").addClass("bg_trasn");
                $("#txts3").addClass("bg_trasn");
                $("#txts4").addClass("bg_trasn");
            }
            this.state.totalSize = 0;
            this.state.txtValue = "";
        }
        this.fillPass();
    }

    render() {
        var _env = localStorage.getItem('env_type');
        console.log("_env", _env)
        const { alert_msg, userData, CurrentUser_Active } = this.state;
        const { alert } = this.props;
        var name = userData ? userData.Name.split(' ') : ''
        var intials = userData && !userData.image || userData.image && userData.image == '' ? name[0].charAt(0) + name[name.length - 1].charAt(0) : '';
        return (
            (isMobileOnly == true) ?
                <UserPinList
                    back_arrow={this.back_arrow}
                    addToScreen={this.addToScreen}
                    intials={intials}
                    {...this.state}
                    {...this.props}
                    LocalizedLanguage={LocalizedLanguage}
                />
                :
                // onClick={this.whichkey()}
                <div className="view list" >
                    <div className="box-full-height">
                        <div className="employee-details space-between pl-2 pr-2" >
                            <div className="employee-short-descrition close-note-link" >
                                <div className="mr-2" onClick={() => this.back_arrow()}>
                                    <i className="icons8-undo fs30" id="PinPagebackButton" ></i>
                                </div>
                                {/* <div className="employee-image employee-no-image">
                                    {userData.image ?
                                        <img src={userData ? userData.image : ''} alt="" />
                                        :
                                        <span >{intials.toUpperCase()}</span>
                                    }
                                </div> */}
                                <div>
                                    {userData ? userData.Name : ''}
                                    <p className="employee_active_time">{userData ? CurrentUser_Active && CurrentUser_Active.user_id && userData.Id && CurrentUser_Active.user_id == userData.Id ? 'Current' : '' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-pin center-center bb-0 switch_pin_row switch_pin_input ">                       
                            <div className="keypadPin">
                            {!_env  && _env !== '' &&
                                            <input id="switch_pin" maxLength="4" type="text"  
                                             autoFocus={!_env?true:false} onChange={this.handle} onKeyDown={this.handleBack}  value={this.state.notxtValue} 
                                             className="border-0 color-4b center-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete="off"/>
                                        }

                                {LocalizedLanguage.enterpin}
                                <div className="HightLIghtPassword shop-view-pin  mt-1" >
                                    <div className="">
                                        <input id="txts1" type="button" className="bg_trasn" readOnly={false}  />
                                        <input id="txts2" type="button" className="bg_trasn" readOnly={false} />
                                        <input id="txts3" type="button" className="bg_trasn" readOnly={false}  />
                                        <input id="txts4" type="button" className="bg_trasn" readOnly={false} />
                                    </div>
                                </div>
                                {this.state.activeAlertMsg == true?  
                               <div className={(alert === LocalizedLanguage.loginSuccessMsg) ? "invalidPin switchpineorror text-info" : "invalidPin switchpineorror"} style={{ color: "#E0654C" }}> 
                                {alert == 'Invalid Pin. Please try again!' ? LocalizedLanguage.pinErrMsg : alert}</div> : ""}
                            </div>
                        </div>
                        <div id="calculator" className="shop-view-tbl">
                            <form>
                                <div className="panel-body p-0">
                                    <div className="box__block_calculator">
                                        <table className="table table-responsive">
                                            <tbody>
                                                <tr className="switch_pin_row" >
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="1" onClick={() => this.addToScreen('1')} placeholder="1" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="2" onClick={() => this.addToScreen('2')} placeholder="2" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="3" onClick={() => this.addToScreen('3')} placeholder="3" />
                                                    </td>
                                                </tr>
                                                <tr className="switch_pin_row">
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="4" onClick={() => this.addToScreen('4')} placeholder="4" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="5" onClick={() => this.addToScreen('5')} placeholder="5" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="6" onClick={() => this.addToScreen('6')} placeholder="6" />
                                                    </td>
                                                </tr>
                                                <tr className="switch_pin_row">
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="7" onClick={() => this.addToScreen('7')} placeholder="7" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="8" onClick={() => this.addToScreen('8')} placeholder="8" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="9" onClick={() => this.addToScreen('9')} placeholder="9" />
                                                    </td>
                                                </tr>
                                                <tr className="switch_pin_row">
                                                    <td className="border-top-1" onClick={() => this.addToScreen('c')} readOnly={false}>
                                                        {/* <img width="30" src="assets/img/back_payment.svg" className="" /> */}
                                                        <i className= "icons8-go-back fs40"></i>
                                                    </td>
                                                    <td colSpan="2" className="border-left-0 border-top-1">
                                                        <input type="button" className="transparent border-0 color-4b no-outline switch_pin_input" value="0" onClick={() => this.addToScreen('0')} placeholder="0" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert: alert.message,
    };
}
const connectedUserPinComponents = connect(mapStateToProps)(UserPinComponents);
export { connectedUserPinComponents as UserPinComponents };