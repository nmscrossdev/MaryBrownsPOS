import React from 'react';
import validator from 'validator';

export const CommonAppPopup = (props) => {
    const {extHostUrl, extPageUrl,handleProduxtWindow } = props
    var extentionUrl=""
            if(extPageUrl && validator.isURL(extPageUrl)){   //check PageUrl is full URL
                extentionUrl = extPageUrl ;
            }else{
            extentionUrl = extPageUrl && extHostUrl ? extHostUrl + '/' + extPageUrl : '';
            }

    return (
        <div id="common_app_popup" className="modal modal-wide modal-wide1 fade modal-wide-sm">
            <div className="modal-dialog" id="dialog-midle-align">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" onClick={props.close_ext_modal} className="close" data-dismiss="modal" aria-hidden="true">
                            <img src="../assets/img/Close.svg" />
                        </button>
                    </div>
                    <div style={{float: 'right',marginTop:"20px",marginRight:"20px"}}>
                    {handleProduxtWindow && <button type="button" onClick={()=>handleProduxtWindow()}  >
                           Open Product
                        </button>}
                    </div>                    
                        
                    {props.showExtIframe == true ?
                        <iframe
                            width="100%"
                            height="100px"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            className="embed-responsive-item diamondSectionHeight"
                            // ref={(f) => this.ifr = f}
                            src={extentionUrl}
                             //src={'./externalApp/customer_activity_ext.html'}
                             //src={'./externalApp/OrderApp.html'}
                             
                            id="commoniframe"
                        /> : ''}
                </div>
            </div>
        </div>
    );
}