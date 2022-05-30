/**
 * Created By:priyanka
 * Created Date:14/6/2019
 * Description:quantity msg poppup 
 */

 import React from 'react';
 import  LocalizedLanguage  from '../settings/LocalizedLanguage';
 
 export const CommonMsgModal = (props) => {
     return (
         <div id="common_msg_popup" className="popup hide" style={{overflow:"hidden"}}>
         <div className="product-container">
            <div type="button" className="popup-close">
            <svg onClick={() => hideModal('common_msg_popup')}
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M19.0466 21L10.7521 12.9L2.45762 21L0 18.6L8.29448 10.5L0 2.4L2.45762 0L10.7521 8.1L19.0466 0L21.5042 2.4L13.2097 10.5L21.5042 18.6L19.0466 21Z"
                    fill="#050505"
                />
            </svg>
                {/* <img src="../assets/img/Close.svg" onClick={() => hideModal('common_msg_popup')}/> */}
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