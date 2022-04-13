import React from 'react';
import { CommonMsgModal, AndroidAndIOSLoader } from '../../_components';
import Language from '../../_components/Language';
const bridgDomain = process.env.BRIDGE_DOMAIN;
const MobileLoginView = (props) => {
    //console.log("%cweb view props", 'color:yellow', props);
    const { loggedIn, loginError, loggingIn } = props.authentication;
    const { handleChange, handleSubmit, handleKey, closeExtraPayModal, checkStatus, username, password, submitted, check, loading, fieldErr, usernamedErr, passwordErr, common_Msg } = props;
    return (
        <div>
            {loggingIn && loggingIn == true || loading == true ? <AndroidAndIOSLoader /> : ''}
            <div className="background-image-1">
                <div className="overlay2 tiled_owl background-image-2"></div>
                <div className="container-fluid">
                    <div className="row vh-100 align-items-center">
                        <div className="col-auto mx-auto text-center text-white">
                            <div className="page-title mb-20 mx-width-410">
                                <h1 className="h1 fz-20">Welcome to Oliver</h1>
                                <p className="m-0 fz-13 lh-26">Lets get started!  Enter your Oliver POS account information.</p>
                            </div>
                            <form className="form-addon-medium" autoComplete="off">
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0" id="addon-wrapping">Email</span>
                                    </div>
                                    <input type="text" className="form-control border-radius-lg shadow-none" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" id="username" name="username" value={username} onChange={handleChange} autoComplete="off"/>
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0" id="addon-wrapping">Password</span>
                                    </div>
                                    <input type="password" className="form-control shadow-none" placeholder="Password" aria-label="Password" aria-describedby="addon-wrapping" id="password" name="password" value={password} onChange={handleChange} autoComplete="off"/>
                                </div>
                                <div className="input-group flex-nowrap  mb-3 custom-checkbox-override">
                                    <div className="form-control shadow-none">
                                        <div className="custom-control custom-checkbox text-left">
                                            <input type="checkbox" className="custom-control-input shadow-none" id="customCheck" name="example1" onClick={() => checkStatus(!check)} />
                                            <label className="custom-control-label shadow-none" htmlFor="customCheck">Remember Me</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={handleSubmit} type="submit" className="btn btn-success btn-md btn-block text-white rounded-8 shadow-none">Login</button>
                                    {/* <a className="btn btn-success btn-md btn-block text-white rounded-8 shadow-none" href="register.html">Login</a> */}
                                    <p className="text-white mt-2 fz-14">
                                        {/* <a href={bridgDomain + "/en/POSAdmin/ForgotPassword?_refrence=sell"} className="text-reset">Forgot your password?</a>. */}
                                         <a href={bridgDomain + "/Account/ForgotPassword?_refrence=sell"} className="text-reset">Forgot your password?</a>.
                              </p>
                                </div>
                                {
                                    <div className="validationErr">
                                        {fieldErr !== '' ? fieldErr : usernamedErr !== "" ? usernamedErr : passwordErr !== '' ? passwordErr : loggedIn == false ? loginError : ""}
                                    </div>
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tagOwls">
                {Language.key.POWERED_BY}
            </div>
        </div>
    )
}

export default MobileLoginView;