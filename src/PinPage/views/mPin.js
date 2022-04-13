import React from 'react';
import { AndroidAndIOSLoader } from '../../_components';
import{CommonMsgModal} from '../../_components/CommonMsgModal'
const MobilePin = (props) => {
    // console.log("%cmobile view props", 'color:#6610f2', props);
    const {handleMsgOkClick, LocalizedLanguage, LocationName, LocationName2, NumInput, RgisterName, TrashPin, addToScreen, alert, handle, handleBack, history, isloading, log_out, notxtValue, pinNumberList, registerName1, trashId, whichkey, _env } = props;
    return (
        <div>
            {isloading ? <AndroidAndIOSLoader /> : ''}
            <a href="javascript:void(0)" className="btn btn-links position-fixed text-white p-0 fixed-top-left z-index-2" onClick={() => history.push("/choose_registration", "loginpin")}>
                <img src="../mobileAssets/img/backarrowwhite.svg" className="w-20" alt="" /> <span className="fz-16 ml-2 mt-1">{LocalizedLanguage.goBack}</span>
            </a>
            <div className="background-image-1">
                <div className="overlay2 tiled_owl background-image-2"></div>
                <div className="container-fluid">
                    <div className="row vh-100 align-items-center">
                        <div className="col-auto mx-auto text-center text-white">
                            <div className="page-title mb-20 mx-width-410 mx-auto">
                                <h1 className="h1 fz-20">{LocalizedLanguage.enterPin}</h1>
                                <p className="m-0 fz-13 lh-26">{LocalizedLanguage.enterFourDigitPin}</p>
                            </div>
                            <div className="setupCalculater">
                                <table className="table table-layout-fixed fw700">
                                    <tbody>
                                        <NumInput type="mobile" numbers={pinNumberList} onClick={addToScreen} readOnly={false} />
                                    </tbody>
                                </table>
                                {alert ?
                                    <div className="error">
                                        <p className="fz-13 mb-0">{alert == "Invalid Pin. Please try again!" ? LocalizedLanguage.pinErrMsg : alert}</p>
                                    </div>
                                    : ""}
                                <div className="setupPin text-center">
                                    <TrashPin style={{ margin: 3 }} trshPin={trashId} className="dot bg_trasn" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tagOwls">
                {LocalizedLanguage.powerdByOliver}
            </div>
            <button onClick={() => log_out()} className="btn btn-links position-fixed text-white p-0 fixed-bottom-left fz-30">
                <img src="../assets/img/logout-btn_wht.png" style={{width:70}} />
            </button>
            <CommonMsgModal msg_text='Firefox private window not supported by app' close_Msg_Modal={handleMsgOkClick} />
        </div>
    )
}

export default MobilePin;