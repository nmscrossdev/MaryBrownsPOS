import React from 'react';
import { AndroidAndIOSLoader } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { Markup } from 'interweave';
const MobileLoginLocation = (props) => {
    //console.log("%cmobile view props", 'color:green', props);
    const { autoFocusIs, windowLocation, handleSubmit, handleBack, checkStatus, UserLocations, check, loading, notFounLocation, isLoading, clear } = props;
    return (
        <div>
            {loading == true || isLoading === false ? <AndroidAndIOSLoader /> : ''}
            <a href="/site_link" className="btn btn-links position-fixed text-white p-0 fixed-top-left z-index-2" onClick={() => clear()}>
                <img src="../mobileAssets/img/backarrowwhite.svg" className="w-20" alt="" /> <span className="fz-16 ml-2 mt-1">{LocalizedLanguage.goBack}</span>
            </a>
            <div className="background-image-1">
                <div className="overlay2 tiled_owl background-image-2">
                </div>
                <div className="container-fluid">
                    <div className="row vh-100 align-items-center">
                        <div className="col-auto mx-auto text-center text-white mx-width-410 fz-13">
                            <div className="page-title mb-20">
                                <h1 className="h1 fw300">{LocalizedLanguage.chooseLocation}
                                </h1>
                                <p className="lh-24">{LocalizedLanguage.chooseLocationDetail}</p>
                            </div>
                            <div className="card text-dark text-left rounded-10 overflow-hidden" style={{ height: 200 }}>
                                <div className="card-body list-group-steps scrollbar overflow-auto">
                                    <ul className="list-group list-group-striped">
                                        {UserLocations && UserLocations.length > 0 ? UserLocations.map((item, index) => {
                                            return (
                                                <li key={index} className="list-group-item" onClick={() => handleSubmit(item)}>
                                                    <a href="javascript:void(0)" id={`loginLocationTab${index}`} className="fz-18 d-flex justify-content-between align-items-center">
                                                        <span className="text-truncate pr-2 text-lowercase"><Markup content= {item && item.name } /></span>
                                                        {/* .replace(/[^a-zA-Z]/g, ' ') */}
                                                        <img src="../mobileAssets/img/BackFill.svg" alt="" className="w-30" />
                                                    </a>
                                                </li>
                                            )
                                        }) :
                                            UserLocations && UserLocations.length == 0 ?
                                                <li className="list-group-item" >
                                                    <a href="javascript:void(0)" className="fz-18 d-flex justify-content-between align-items-center">
                                                        {LocalizedLanguage.notFoundLocation}
                                                    </a>
                                                </li>
                                                :
                                                ""}
                                    </ul>
                                </div>
                            </div>
                            <form className="form-addon-medium mt-3" autoComplete="on">
                                <div className="input-group flex-nowrap  mb-3 custom-checkbox-override">
                                    <div className="form-control shadow-none">
                                        <div className="custom-control custom-checkbox text-left">
                                            <input type="checkbox" className="custom-control-input shadow-none" id="customCheck" onClick={() => checkStatus(!check)} name="example1" />
                                            <label className="custom-control-label shadow-none" htmlFor="customCheck">{LocalizedLanguage.rememberLocation}</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            {notFounLocation == true ?
                                <div className="page-title mb-20">
                                    <p>{LocalizedLanguage.notSetectLocation}</p>
                                </div>
                                : ""
                            }
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
export default MobileLoginLocation;