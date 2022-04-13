import React from 'react';
import { SiteLinkViewFirst } from '../components/SubSiteLinkView';
import { PopupShopStatus } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

const goBack = () => {
if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
    {
        Android.wrapperLogout();
    }
    else
    {
        window.location = "/login";

    }
}

const MobileSiteLinkView = (props) => {
    // console.log("%cmobile view props", 'color:yellow', props);
    const { autoFocusIs } = props;
    backToLogin()
    return (
        <div>
            <a href="javascript:void(0)" className="btn btn-links position-fixed text-white p-0 fixed-top-left z-index-2" onClick={this.goBack}>
                <img src="../mobileAssets/img/backarrowwhite.svg" className="w-20" alt="" /> <span className="fz-16 ml-2 mt-1">{LocalizedLanguage.goBack}</span>
            </a>
            <div className="background-image-1">
                <div className="overlay2 tiled_owl background-image-2">
                </div>
                <div className="container-fluid">
                    <div className="row vh-100 align-items-center">
                        <div className="col-auto mx-auto text-center text-white mx-width-410 fz-13">
                            <div className="page-title mb-20">
                                <h1 className="h1 fw300">{LocalizedLanguage.selectSite}</h1>
                                <p className="lh-24">{LocalizedLanguage.selectSiteDetail}</p>
                            </div>
                            <div className="card text-dark text-left rounded-10 overflow-hidden" style={{height: 200}}>
                                <div className="card-body list-group-steps scrollbar overflow-auto">
                                        <SiteLinkViewFirst />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tagOwls">
                        {LocalizedLanguage.powerdByOliver}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileSiteLinkView;