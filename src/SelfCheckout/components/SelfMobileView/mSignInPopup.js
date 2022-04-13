import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';

const MobileSignInPopup = (props) => {
    const {SingInEmail} = props;
    return (
        <div className="modal" id="mobileSignIn" tabIndex="-1" role="dialog" aria-labelledby="singIn"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm modal-message">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title mx-auto" id="success">{LocalizedLanguage.signin}</h5>
                        <button type="button" className="close py-0 ml-0" data-dismiss="modal"aria-label="Close">
                            <img src="../../assets/img/closenew.svg" width="40" alt="" />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">{LocalizedLanguage.email}</label>
                                <input type="email" className="form-control shadow-none" placeholder="steve@test.com" defaultValue={SingInEmail} id="SingInEmail" name="SingInEmail"/>
                                <small id="emailHelp" className="form-text text-danger">{LocalizedLanguage.msgforemail}</small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MobileSignInPopup;