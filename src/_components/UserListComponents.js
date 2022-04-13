/** 
 * Created By   : Priyanka
 * Created Date : 26-06-2019
 * Description : display user list. 
*/
import React from 'react';
import { connect } from 'react-redux';
import { UserPinComponents } from '../_components/UserPinComponents'
import { userActions } from '../_actions/user.actions';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import SwitchUserList from './views/m.SwitchUserList';
import $ from "jquery";

class UserListComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_data: '',
            CurrentUserActive: localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '',
            userList: localStorage.getItem('user_List') && typeof(localStorage.getItem('user_List')) !=='undefined' && localStorage.getItem('user_List') !=='undefined' ? (JSON.parse(localStorage.getItem('user_List'))) : ''
        }
        this.userPin = this.userPin.bind(this);
        this.logout = this.logout.bind(this);
    }

    userPin(item) {
        this.setState({ user_data: item })
        $("#note-views").addClass("push")
        if (isMobileOnly == true) {
            $("#changePassword").css("transform", "translateY(0%)");
            $(".appOffCanvasFooterOverlay").css({
                "display": "block",
                "opacity": 0.36
            });
            $(".calculatorSetHeight").height(($(".offcanvasOverlay").height() - $(".appBottomOnboarding").height()) / 6);
        }
        setTimeout(function(){
            $('#switch_pin').focus();
        },300)
    }

    logout() {
        localStorage.removeItem("CUSTOMER_TO_OrderId")
        this.props.dispatch(userActions.logout())
    }

    componentDidMount() {
        // if (!isMobileOnly) {
        //     $('#sidebarCollapse , .overlay').on('click', function() {
        //         $('#sidebar').toggleClass('active');
        //         $('#wrapper-module-with-slidebar').toggleClass('active');
        //         $('.overlay').fadeToggle();
        //         $(this).toggleClass('active');
        //     });
        // }
    }
    render() {
        const { userList, CurrentUserActive } = this.state;
        var isExistUser = false;
        if (userList && userList.length > 0 && CurrentUserActive) {
            var existUser = userList.filter(item => item.Id != this.state.CurrentUserActive.user_id);
         
         
            console.log('existUser', existUser)
            // var existUser = userList;
            if (existUser) {
                isExistUser = existUser;
            }
        }
        var currentUser = userList && userList.filter(item => item.Id == this.state.CurrentUserActive.user_id);
        console.log("currentUser", currentUser)
        return (
            (isMobileOnly == true) ?
                <SwitchUserList
                    {...this.state}
                    {...this.props}
                    isExistUser={isExistUser}
                    userPin={this.userPin}
                    logout={this.logout}
                    UserPinComponents={UserPinComponents}
                />
                :
                <div id="id_user" className="tab-pane fade">
                    <div className="col-lg-9 col-sm-8 col-xs-8 p-0">
                        <div className="quick_menu_body closeTabPane"></div>
                    </div>
                    <div className="col-lg-3 col-sm-4 col-xs-4 pr-0  plr-8">
                        <div className="quick_menu_panel quick-user-design">
                            <div className="quick_menu_body">
                                <div className="view-port clearfix quickview-notes" id="note-views">
                                    <div className="view list">
                                        <div className="overflowscroll" id="login_user_list">
                                            <ul>
                                                {currentUser&& currentUser.map((item, index) => {
                                                    var name = item.Name && item.Name ? item.Name.split(' ') : '';
                                                    var f_name = name[0];
                                                    var l_name = name[name.length - 1];
                                                    var intials = !item.image || item.image && item.image == '' ? f_name.charAt(0) + l_name.charAt(0) : '';
                                                return(
                                                    <li className= 'list-current-login' key={index}>                                                           
                                                        <div className="employee-details space-between pl-3 pr-3">
                                                            <div className="employee-short-descrition">
                                                                <div className="employee-image employee-no-image text-primary">
                                                                    {item.image ?
                                                                        <img src={item.image ? item.image : ' '} alt="" className="mCS_img_loaded" />
                                                                        :
                                                                        <span>{intials.toUpperCase()}</span>
                                                                    }
                                                                </div>
                                                                <div className="capital text-primary">
                                                                    {item.Name}
                                                                    <p className="employee_active_time mt-1 text-primary">{CurrentUserActive && CurrentUserActive.user_id && item.Id && CurrentUserActive.user_id == item.Id ? 'Current' : ''}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </li>

                                                )
                                                })}
                                                {isExistUser && isExistUser.map((item, index) => {
                                                    var name = item.Name && item.Name ? item.Name.split(' ') : '';
                                                    var f_name = name[0];
                                                    var l_name = name[name.length - 1];
                                                    var intials = !item.image || item.image && item.image == '' ? f_name.charAt(0) + l_name.charAt(0) : '';
                                                    return (
                                                        <li className={CurrentUserActive && CurrentUserActive.user_id && item.Id && CurrentUserActive.user_id == item.Id ? 'list-current-login' : ''} key={index}>                                                           
                                                            <div className="employee-details space-between pl-3 pr-3" onClick={() => {CurrentUserActive && CurrentUserActive.user_id && item.Id && CurrentUserActive.user_id === item.Id ? '' : this.userPin(item)}}>
                                                                <div className="employee-short-descrition">
                                                                    <div className="employee-image employee-no-image">
                                                                        {item.image ?
                                                                            <img src={item.image ? item.image : ' '} alt="" className="mCS_img_loaded" />
                                                                            :
                                                                            <span>{intials.toUpperCase()}</span>
                                                                        }
                                                                    </div>
                                                                    <div className="capital">
                                                                        {item && item.Name ? item.Name : ''}
                                                                        {/* <p className="employee_active_time mt-1 ">{CurrentUserActive && CurrentUserActive.user_id && item.Id && CurrentUserActive.user_id == item.Id ? 'Current' : ''}</p> */}
                                                                    </div>
                                                                </div>
                                                                <div className="employee-short-image switch-login-icon">
                                                                    {/* <img src="assets/img/next.png" className="mCS_img_loaded" /> */}
                                                                    <i className = "icons8-login fs30"></i>
                                                                </div>
                                                            </div>
                                                            
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                        <div className="box-logout clearfix" onClick={() => this.logout()}>
                                            <button className="btn btn-block btn-primary total_checkout text-center">
                                                {LocalizedLanguage.logout}
                                            </button>
                                        </div>
                                    </div>
                                    {/* Put pin html */}
                                    <UserPinComponents userDetail={this.state.user_data} />
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
const connectedUserListComponents = connect(mapStateToProps)(UserListComponents);
export { connectedUserListComponents as UserListComponents };