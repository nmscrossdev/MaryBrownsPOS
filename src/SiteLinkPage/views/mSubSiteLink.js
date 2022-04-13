import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { LoadingModal } from '../../_components';

const MobileSiteLinkViewFirst = (props) => {
    console.log("%cmobile view props", 'color:yellow', props);
    const { Sitelist, handleSubmit, handleBack } = props;
    return (
        <ul className="list-group list-group-striped">
            {!Sitelist ? <LoadingModal /> : ''}
            { Sitelist && Sitelist !== undefined ?
                Sitelist.subscriptions.length > 0 ?
                    Sitelist.subscriptions.map((link, index) => {
                        return (
                            link.subscription_detail.activated == true ?
                                <li key={index} className="list-group-item">
                                    <a href="javascript:void(0)" className="fz-18 d-flex justify-content-between align-items-center" onClick={() => handleSubmit(link)} id={`siteLinkTab${index}`}>
                                        <span className="text-truncate pr-2 text-lowercase">{link.subscription_detail.host_name}</span>
                                        <img src="../mobileAssets/img/BackFill.svg" alt="" className="w-30" />
                                    </a>
                                </li>
                                :
                                <li key={index} className="list-group-item">
                                    <a className="z-18 d-flex justify-content-between align-items-center" ><span className="text-truncate pr-2 text-lowercase">{link.subscription_detail.host_name}</span>
                                        <img src="../mobileAssets/img/BackFill.svg" alt="" className="w-30" />
                                    </a>
                                </li>
                        )
                    })
                    :
                    <li key="1" className="list-group-item">
                        <a href="javascript:void(0)" className="z-18 d-flex justify-content-between align-items-center">
                            <span className="text-truncate pr-2 text-lowercase">{LocalizedLanguage.notFoundSite}</span>
                            {/* <i className="icon icon-right-fill float-right text-success fz-30-i"></i> */}
                        </a>
                    </li>
                :
                <li key="1" className="list-group-item">
                <a href="javascript:void(0)" className="z-18 d-flex justify-content-between align-items-center">
                    <span className="text-truncate pr-2 text-lowercase">{LocalizedLanguage.notFoundSite}</span>
                    {/* <i className="icon icon-right-fill float-right text-success fz-30-i"></i> */}
                </a>
            </li>
        }
        </ul>
    )
}

export default MobileSiteLinkViewFirst;