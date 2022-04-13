import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { AndroidAndIOSLoader } from '../../_components';

const MobileLoginRegisterView = (props) => {
    //console.log("%cmobile view props", 'color:#20c997', props);
    const { autoFocusIs, checkStatus, handleBack, handleSubmit, registers, removeLocation, LocationName, check, loading } = props;
    return (
        <div>
            {loading == true ? <AndroidAndIOSLoader /> : ''}
            <a href="/login_location" className="btn btn-links position-fixed text-white p-0 fixed-top-left z-index-2" onClick={() => removeLocation()}>
                <img src="../mobileAssets/img/backarrowwhite.svg" className="w-20" alt="" /> <span className="fz-16 ml-2 mt-1">{LocalizedLanguage.goBack}</span>
            </a>
            <div className="background-image-1">
                <div className="overlay2 tiled_owl background-image-2">
                </div>
                <div className="container-fluid">
                    <div className="row vh-100 align-items-center">
                        <div className="col-auto mx-auto text-center text-white mx-width-410 fz-13">
                            <div className="page-title mb-20">
                                <h1 className="h1 fw300">{LocalizedLanguage.chooseRegister}
                                </h1>
                                <p className="lh-24">{LocalizedLanguage.chooseRegisterDetail}</p>
                            </div>
                            <div className="card text-dark text-left rounded-10 overflow-hidden" style={{ height: 200 }}>
                                <div className="card-body list-group-steps scrollbar overflow-auto">
                                    <ul className="list-group list-group-striped">
                                        {
                                            registers && registers.length > 0 ?
                                                registers && registers.map((item, index) => {
                                                    return (
                                                        <li key={item.id} onClick={() => handleSubmit(item)} onKeyDown={handleBack} id={`loginRegisterTab${index}`} className="list-group-item">
                                                            <a href="javascript:void(0)" className="fz-18 d-flex justify-content-between align-items-center">
                                                                <span className="text-truncate pr-2 text-lowercase">{item.name}</span>
                                                                {/* .replace(/[^a-zA-Z]/g, ' ') */}
                                                                <img src="../mobileAssets/img/BackFill.svg" alt="" className="w-30" />
                                                            </a>
                                                        </li>
                                                    )
                                                })
                                                :
                                                registers && registers.length == 0 ?
                                                    <li className="list-group-item" id="loginRegisterTab" ><a href="javascript:void(0)" className="fz-18 d-flex justify-content-between align-items-center"><span className="text-truncate pr-2 text-lowercase">{LocalizedLanguage.notFoundRegister}</span></a></li>
                                                    : ""
                                        }
                                    </ul>
                                </div>
                            </div>
                            <form className="form-addon-medium mt-3" autoComplete="on">
                                <div className="input-group flex-nowrap  mb-3 custom-checkbox-override">
                                    <div className="form-control shadow-none">
                                        <div className="custom-control custom-checkbox text-left">
                                            <input type="checkbox" className="custom-control-input shadow-none" id="customCheck"
                                                name="example1" onClick={() => checkStatus(!check)} id="customCheck" />
                                            <label className="custom-control-label shadow-none" htmlFor="customCheck">{LocalizedLanguage.rememberRegister}</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="tagOwls">
                    {LocalizedLanguage.powerdByOliver}
                </div>
            </div>
        </div>
    )
}

export default MobileLoginRegisterView;