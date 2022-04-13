import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';

const MCancalOrderPopup = (props) => {
    const { onCancelEvent } = props;
    return (   
        <div>
            <div className="modal" id="cancle" tabIndex="-1" role="dialog" aria-labelledby="cancle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm modal-message">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title mx-auto" id="cancle">{LocalizedLanguage.cancelOrder}</h5>
                            <button type="button" className="close py-0 ml-0" data-dismiss="modal" aria-label="Close">
                                <img src="../mobileAssets/img/closenew.svg" width="40" alt=""/>
                            </button>                        
                        </div>
                        <div className="modal-body">
                            <div className="text-center p-30">
                                <p>{LocalizedLanguage.areyousureyouwanttocancelyourOrder}</p>
                                <button type="button" className="btn btn-danger shadow-none btn-yes fz-14 h-50-pxi" data-dismiss="modal" onClick={() => onCancelEvent()}>{LocalizedLanguage.yes}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
    )
}
export default MCancalOrderPopup;