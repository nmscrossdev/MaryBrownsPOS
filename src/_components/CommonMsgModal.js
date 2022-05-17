/**
 * Created By:priyanka
 * Created Date:14/6/2019
 * Description:quantity msg poppup 
 */

 import React from 'react';
 import  LocalizedLanguage  from '../settings/LocalizedLanguage';
 
 export const CommonMsgModal = (props) => {
     return (
         <div id="common_msg_popup" className="popup hide" style={{overflow:"hidden",}}>
         <div className="product-container">
            <div type="button" className="popup-close">
                <img src="../assets/img/Close.svg" onClick={() => hideModal('common_msg_popup')}/>
            </div>
            <p className="prod-name" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</p>
            <div className="prod-wrapper">
                <p id="epos_error_model_message" style={{fontSize:"2.59vw",textAlign:"center",marginBottom:"3vw"}}>{props.msg_text}</p>
            </div>
            <div style={{textAlign:"center"}}>
                <button style={{width:"50vw"}} className="view-cart" type="button" onClick={() => hideModal('common_msg_popup')}>{LocalizedLanguage.okTitle}</button>
            </div>
             </div>
     </div>
     );
 }