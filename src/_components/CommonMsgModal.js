/**
 * Created By:priyanka
 * Created Date:14/6/2019
 * Description:quantity msg poppup 
 */

 import React from 'react';
 import  LocalizedLanguage  from '../settings/LocalizedLanguage';
 
 export const CommonMsgModal = (props) => {
     return (
         <div id="common_msg_popup" className="popup hide">
         <div className="modal-content">
                 <div className="modal-header">
                     <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => hideModal('common_msg_popup')}>
                         <img src="../assets/img/Close.svg" />
                     </button>
                     <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                 </div>
                 <div className="modal-body p-0">
                     <h3 id="epos_error_model_message" className="popup_payment_error_msg">{props.msg_text}</h3>
                 </div>
                 <div className="modal-footer p-0">
                     <button className="btn btn-primary btn-block h66" type="button" onClick={() => hideModal('common_msg_popup')}>{LocalizedLanguage.okTitle}</button>
                 </div>
             </div>
     </div>
     );
 }