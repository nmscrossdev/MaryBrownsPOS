import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';

const MCommonPopup = (props) => {
    const {userProfilePopup, createProfilePopup} = props;
    var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
    var register_content = Register_Permissions ? Register_Permissions.content : '';
    var allowtocreateProfile='';      
     if (Register_Permissions) {
         Register_Permissions.content && Register_Permissions.content.filter(item=>item. slug =="allow-customer-login").map(permission =>{
            allowtocreateProfile = permission.value;                 
         })            
     }
    return (   
        <div className="modal" id="SignInMenu" tabIndex="-1" role="dialog" aria-labelledby="usrProfile">
            <div className="modal-dialog modal-dialog-centered modal-sm modal-message">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title mx-auto" id="success">{LocalizedLanguage.userProfile}</h5>
                        <button type="button" className="close py-0 ml-0 shadow-none" data-dismiss="modal" aria-label="Close">
                            <img src="../../assets/img/closenew.svg" width="40" alt=""/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center modal-container py-3">
                            <button className="btn btn-success btn-block shadow-none h-50-pxi btn-profile-success fz-14" onClick={userProfilePopup}>{LocalizedLanguage.signin}</button>
                            {(allowtocreateProfile == "true")?
                            <button className="btn btn-outline-secondary btn-block h-50-pxi shadow-none btn-profile-secondary mt-3 fz-14" onClick={createProfilePopup}>{LocalizedLanguage.createProfile}</button>
                            :null}
                        </div>
                    </div>
                </div>
            </div>
        </div>  
  )
}
export default MCommonPopup;