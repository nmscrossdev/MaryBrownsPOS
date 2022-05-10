import { defineLocale } from 'moment';
import React from 'react';
import validator from 'validator';

export class  CommonExtensionPopup extends React.PureComponent{
    constructor(props) {
        super(props);
    }
render() {
    const {extHostUrl, extPageUrl,handleProduxtWindow } = this.props
    var extentionUrl=""
            if(extPageUrl && validator.isURL(extPageUrl)){   //check PageUrl is full URL
                extentionUrl = extPageUrl ;
            }else{
            extentionUrl = extPageUrl && extHostUrl ? extHostUrl + '/' + extPageUrl : '';
            }
   
console.log("extentionUrl",extentionUrl)
    return (
        <div id="common_ext_popup" className="popup hide">
            <div className="modal-dialog" id="dialog-midle-align">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" onClick={this.props.close_ext_modal} className="popup-close" data-dismiss="modal" aria-hidden="true">
                            <img src="../assets/img/Close.svg" />
                        </button>
                    </div>
                    <div style={{float: 'right',marginTop:"20px",marginRight:"20px"}}>
                    {handleProduxtWindow && <button type="button" onClick={()=>handleProduxtWindow()}  >
                           Open Product
                        </button>}
                    </div>                    
                        
                    {this.props.showExtIframe == true ?
                        <iframe
                            width="100%"
                            height="100%"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            className="embed-responsive-item diamondSectionHeight"
                            // ref={(f) => this.ifr = f}
                            // src={extentionUrl}
                            // src={'./externalApp/customer_activity_ext.html'}
                            src={'./externalApp/fetchpaymentApp.html'}                           
                            id="commoniframe"
                        />: ''}
                        
                </div>
            </div>
        </div>
    )
}
}