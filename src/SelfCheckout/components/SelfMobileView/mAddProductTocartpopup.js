import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
const MAddProductTocartpopup = (props) => {
    const {userProfilePopup, createProfilePopup} = props;
    return (   
        <div className="modal fade" id="addProductSuccess" tabIndex="-1" role="dialog" aria-labelledby="addProductSuccess" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm modal-message">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title mx-auto" id="success">{LocalizedLanguage.productadded}</h5>
                        <button type="button" className="close py-0 ml-0" data-dismiss="modal"
                            aria-label="Close">
                            <img src="img/closenew.svg" width="40" alt=""/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center">
                            <img src="img/checked.svg" className="w-80" alt=""/>
                            <div className="spacer-20"></div>
                            <p>{LocalizedLanguage.productaddedtoCart}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
export default MAddProductTocartpopup;