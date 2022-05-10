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
            {/* <button onClick={props.close_Msg_Modal} type="button" className="popup-close">
                <img src="../assets/img/Close.svg" />
            </button> */}
            <h4 id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
            <p id="epos_error_model_message" >{props.msg_text}</p>
            <button type="button" className="popup-close" onClick={() => hideModal('common_msg_popup')}>{LocalizedLanguage.okTitle}</button>
        </div>
    );
}