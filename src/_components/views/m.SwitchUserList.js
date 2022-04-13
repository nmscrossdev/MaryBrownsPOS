import React from 'react';
import Footer from './m.Footer';

const SwitchUserList = (props) => {
    //console.log("%c SWICTH USER LIST", "color:green", props)
    const { isExistUser, CurrentUserActive, userPin, logout, UserPinComponents, user_data } = props;
    return (
        <div>
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-center position-relative">
                        {CurrentUserActive.display_name && CurrentUserActive.display_name.length > 6 ?
                            CurrentUserActive.display_name.substring(0, 5) : CurrentUserActive.display_name}
                        <a className="position-absolute left-0" onClick={()=>props.openModal("notes")}>
                            <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="appCapsule vh-100 overflow-auto" style={{ paddingBottom: 132 }}>
                <div className="container-fluid p-0">
                    <div className="row no-gutters">
                        <div className="col-sm-12">
                            <ul className="list-group list-group-flush userList">
                                {isExistUser && isExistUser.map((item, index) => {
                                    var name = item.Name && item.Name ? item.Name.split(' ') : '';
                                    var f_name = name[0];
                                    var l_name = name[name.length - 1];
                                    var intials = !item.image || item.image && item.image == '' ? f_name.charAt(0) + l_name.charAt(0) : '';
                                    return (
                                        <li key={index} className="list-group-item" data-target="changePassword">
                                            <div className="loginuser3">
                                                <div className="d-inline-flex align-items-center">
                                                    <div className="userimage rounded-circle overflow-hidden border border-primary position-relative">
                                                        {/* <!-- this is showing user image --> */}
                                                        {item.image ?
                                                            <img src={item.image ? item.image : ' '} alt="" className="rounded-circle w-100" />
                                                            :
                                                            <span className="position-absolute">{intials.toUpperCase()}</span>
                                                        }
                                                        {/* <!-- this is showing user image --> */}
                                                        {/* <!-- <img src="../img/web/user.png" alt="" className="rounded-circle w-100"> --> */}
                                                        {/* <!-- this is showing user image --> */}
                                                        {/* <!-- <div className="background"></div> --> */}
                                                    </div>
                                                    <h6>{item && item.Name ? item.Name : ''} {CurrentUserActive && CurrentUserActive.user_id && item.Id && CurrentUserActive.user_id == item.Id ? 'Current' : ''}</h6>
                                                </div>
                                                <img onClick={() => userPin(item)} src="../mobileAssets/img/next.svg" alt="" className="w-20" />
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <UserPinComponents userDetail={user_data} />
            <div className="appOffCanvasFooterOverlay"></div>

            <div className="appBottomAbove">
                <button onClick={() => logout()} className="btn shadow-none btn-block btn-danger h-100 rounded-0 text-uppercase">LOG OUT</button>
            </div>
            <Footer {...props} active="shopview" />
        </div>
    )
}

export default SwitchUserList;