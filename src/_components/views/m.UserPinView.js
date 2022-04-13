import React from 'react';

const UserPinView = (props) => {
    const { back_arrow, userData, CurrentUser_Active, LocalizedLanguage, activeAlertMsg, addToScreen, intials, alert } = props;
    return (
        <div className="appOffCanvasFooter" id="changePassword">
            <div className="offcanvasOverlay">
                <table className="table table-layout-fixed fw700 mb-0 tbl-calculator h-100">
                    <thead>
                        <tr className="calculatorSetHeight" data-target="changePassword">
                            <th colSpan="3">
                                <div className="loginuser3 no-justify">
                                    <img onClick={() => back_arrow()} src="../mobileAssets/img/backarrow.svg" alt="" className="w-30" />
                                    <div className="d-inline-flex align-items-center ml-15">
                                        <div className="userimage rounded-circle overflow-hidden border border-primary position-relative">
                                            {/* <!-- this is showing user image --> */}
                                            {userData.image ?
                                                <img src={userData ? userData.image : ''} alt="" className="rounded-circle w-100" />
                                                :
                                                <span className="position-absolute">{intials.toUpperCase()}</span>
                                            }
                                            {/* <span className="position-absolute">AJ</span> */}
                                            {/* <!-- this is showing user image --> */}
                                            {/* <!-- <img src="../img/web/user.png" alt="" className="rounded-circle w-100"> --> */}
                                            {/* <!-- this is showing user image --> */}
                                            {/* <!-- <div className="background"></div> --> */}
                                        </div>
                                        <h6> {userData ? userData.Name : ''}{userData ? CurrentUser_Active && CurrentUser_Active.user_id && userData.Id && CurrentUser_Active.user_id == userData.Id ? 'Current' : '' : ''}</h6>
                                    </div>

                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="calculatorSetHeight">
                            <td colSpan="3" className="p-0 border-0">
                                <h6 className="mb-0">{LocalizedLanguage.enterPin}</h6>
                                <div className="setupPin text-center">
                                    <span style={{ margin: 3 }} id="txts1" className="dot bg_trasn border-primary"></span>
                                    <span style={{ margin: 3 }} id="txts2" className="dot bg_trasn border-primary"></span>
                                    <span style={{ margin: 3 }} id="txts3" className="dot bg_trasn border-primary"></span>
                                    <span style={{ margin: 3 }} id="txts4" className="dot bg_trasn border-primary"></span>
                                </div>
                                {activeAlertMsg == true ?
                                    <p className={(alert === LocalizedLanguage.loginSuccessMsg) ? "text-danger fz-12 mb-0 text-info" : "text-danger fz-12 mb-0"}>
                                        {alert == 'Invalid Pin. Please try again!' ? LocalizedLanguage.pinErrMsg : alert}
                                    </p> : ""}
                            </td>
                        </tr>
                        <tr className="calculatorSetHeight">
                            <td onClick={() => addToScreen('1')}>1</td>
                            <td onClick={() => addToScreen('2')}>2</td>
                            <td onClick={() => addToScreen('3')}>3</td>
                        </tr>
                        <tr className="calculatorSetHeight">
                            <td onClick={() => addToScreen('4')}>4</td>
                            <td onClick={() => addToScreen('5')}>5</td>
                            <td onClick={() => addToScreen('6')}>6</td>
                        </tr>
                        <tr className="calculatorSetHeight">
                            <td onClick={() => addToScreen('7')}>7</td>
                            <td onClick={() => addToScreen('8')}>8</td>
                            <td onClick={() => addToScreen('9')}>9</td>
                        </tr>
                        <tr className="calculatorSetHeight">
                            <td onClick={() => addToScreen('c')}>C</td>
                            {/* <td  onClick={() => addToScreen('1')}>,</td> */}
                            <td colSpan="2" onClick={() => addToScreen('0')}>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserPinView;