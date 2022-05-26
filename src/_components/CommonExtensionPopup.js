import { defineLocale } from 'moment';
import React from 'react';
import validator from 'validator';
import {getInitials,get_uuid} from '../settings/SelfCheckoutSettings';
export class  CommonExtensionPopup extends React.PureComponent{
    constructor(props) {
        super(props);
    }
render() {
    const {extHostUrl, extPageUrl,extName,extLogo,handleProduxtWindow } = this.props
    var extentionUrl=""
            if(extPageUrl && validator.isURL(extPageUrl)){   //check PageUrl is full URL
                extentionUrl = extPageUrl ;
            }else{
            extentionUrl = extPageUrl && extHostUrl ? extHostUrl + '/' + extPageUrl : '';
            }
            let inName = extName?getInitials(extName):"";
            let uid=get_uuid();
console.log("extentionUrl",extentionUrl)
    return (
        <div id="common_ext_popup" className="popup hide" style={{minWidth:"80%", minHeight:"80%",overflowY:"hidden",padding: "2.78vw"}}>
           
           {/* <div className="product-container" style={{height:"94%",border:0}}> */}

            {/* <div id="productCloseButton" className="product-close"> */}
            <svg className="popup-close" onClick={this.props.close_ext_modal}
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
            <div className="popup-header" style={{marginBottom:"2vw"}}>
                <div className="popup-icon">
                <span id={"appInitial_"+uid}>{inName}</span>
                 {extLogo!=null? <img id={"appLogo_"+uid} src={extLogo} alt={inName}  onError={(e) => { e.target.onerror = null; document.getElementById("appInitial_"+uid).style.display="block";document.getElementById("appLogo_"+uid).style.display="none";/* e.target.src = showInitials(inName)*/}} />:null}
                
                </div>
                <div className="col">
                    <p>{extName}</p>
                    <div className="divider"></div>
                </div>
            </div>
            {/* </div> */}

{/* <p className="prod-name" title={this.props.proTitle}>{hasVariationProductData ? <Markup content={(variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)}></Markup> : ''}</p> */}

            
            <div className="prod-wrapper">
                    <div className="row">
                    {this.props.showExtIframe == true ?
                        <iframe
                            width="100%"
                            style={{height:"140vw",border:0}}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            className="embed-responsive-item diamondSectionHeight"
                            // ref={(f) => this.ifr = f}
                            src={extentionUrl}
                            // src={'./externalApp/customer_activity_ext.html'}
                            // src={'./externalApp/fetchpaymentApp.html'}                           
                            id="commoniframe"
                        />: ''}
                    </div>
                   
               
            </div>
        {/* </div> */}

            {/* <div className="modal-dialog" id="dialog-midle-align">
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
                            style={{height:"140vw"}}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            className="embed-responsive-item diamondSectionHeight"
                            // ref={(f) => this.ifr = f}
                            src={extentionUrl}
                            // src={'./externalApp/customer_activity_ext.html'}
                            // src={'./externalApp/fetchpaymentApp.html'}                           
                            id="commoniframe"
                        />: ''}
                        
                </div>
            </div> */}
        </div>
    )
}
}