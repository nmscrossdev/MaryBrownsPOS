import * as React from 'react';
import { connect } from 'react-redux';
import { externalLoginActions } from './action/externalLogin.actions';
import { history } from '../_helpers';
import { encode_UDid } from '../ALL_localstorage';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import {GTM_ClientDetail} from '../../src/_components/CommonfunctionGTM'
import LoaderOnboarding from '../onboarding/components/LoaderOnboarding'
import {isShowWrapperSetting} from '../WrapperSettings/CommonWork';
function LoadingMessage() {
  var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
  return (
    (isMobileOnly == true) ?
      <div className="background-image-1">
        <div className="container-fluid">
          <div className="row vh-100 align-items-center">
            <div className="col-auto mx-auto text-center text-white">
              <div className="page-title mb-20 mx-width-410 mx-auto">
                <img src="mobileAssets/img/owl_tween.gif" style={{ height: '10%', width: '30%' }} />
                <h1 className="h1 fz-20">{LocalizedLanguage.pleaseWait}</h1>
                <p className="m-0 fz-12 lh-26">{LocalizedLanguage.dontCloseWindow}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tagOwls">
          {LocalizedLanguage.powerdByOliver}
        </div>
      </div>
       :
       <div className="user_login">
       <div className="user__login_header">
           <div className="user_login_container">
               <img alt="Logo" src="../assets/images/logo-dark-sm.svg" />
           </div>
       </div>
       <div className="user_login_pages">
           <div className="user_login_container">
               <div className="user_login_row">
                   <div className="user_login_form_wrapper">
                       <div className="user_login_form_wrapper_container">
                           <div className="user_login_form">
                               <div className="">
                                   <div className="user_login_scroll_in">
                                       <div className="user_login_center">
                                           <div className="user_login_head user_login_join">
                                               <h3 className="user_login_head_title">
                                                   {LocalizedLanguage.pleaseWait}                                                  
                                               </h3>
                                               <h3 className="user_login_head__title">{LocalizedLanguage.dontCloseWindow}</h3>
                                               <div className="user_login_head_logo">
                                               <div className="w-100 text-center">
                                               <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="120" height="120" viewBox="0 0 400 400" enableBackground="new 0 0 400 400">
                                                      <g>
                                                          <rect x="249.28" y="156.01" className="st0 ologo-1" width="103.9" height="103.9"></rect>
                                                          <path id="teal" className="st1 ologo-2" d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z"></path>
                                                          <rect id="cyan" x="145.38" y="259.91" className="st2 ologo-3" width="103.9" height="103.89"></rect>
                                                          <path id="blue" className="st3 ologo-4" d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z"></path>
                                                          <rect id="purple" x="41.49" y="156.01" className="st4 ologo-5" width="103.9" height="103.9"></rect>
                                                          <path id="red" className="st5 ologo-6" d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z"></path>
                                                          <rect id="orange" x="145.38" y="52.12" className="st6 ologo-7" width="103.9" height="103.9"></rect>
                                                          <path id="yellow" className="st7 ologo-8" d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z"></path>
                                                      </g>
                                                  </svg>
                                                  <div>
                                                      <span className="">Loading...</span>
                                                  </div> 
                                              </div>                             
                                                                   {/* <a href="#">
                                                       <img src="../assets/img/onboarding/logo-2-sm.png" alt="" />
                                                   </a> */}
                                               </div>                                             
                                             
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
      
</div>
      // <div className="bgimg-1">
      //   <div className="content_main_wapper">
      //     <div className="onboarding-loginBox">
      //       <img src="assets/img/frame02-03s.gif" style={{ height: '40%', width: '40%' }} />
      //       <div className="onboarding-pg-heading" ><h1>{LocalizedLanguage.pleaseWait}</h1><h2>{LocalizedLanguage.dontCloseWindow}</h2></div>
      //     </div>
      //     <div className="powered-by-oliver">
      //       <a href="javascript:void(0)">{LocalizedLanguage.powerdByOliver}</a>
      //     </div>
      //   </div>
      // </div>
  );
}

class ExternalLogin extends React.Component {
  constructor(props) {
    LoadingMessage()
    super(props);
    this.state = {
      loading: true
    }
    localStorage.removeItem('user');
    localStorage.removeItem('UserLocations');
    localStorage.removeItem("LANG");
    sessionStorage.removeItem('CUSTOMER_ID');
    localStorage.removeItem('CHECKLIST');
    localStorage.removeItem('AdCusDetail');
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem('SELECTED_TAX');
    localStorage.removeItem('TAXT_RATE_LIST');
    localStorage.removeItem('DEFAULT_TAX_STATUS');
    localStorage.removeItem('APPLY_DEFAULT_TAX');
    localStorage.removeItem('CART');
    localStorage.removeItem("PRODUCTX_DATA");
    localStorage.removeItem("RegisterPermissions");
    localStorage.removeItem("demoUser");
    localStorage.removeItem("DemoGuid");
    localStorage.removeItem("getorder");
    localStorage.removeItem("CustomerList");
    localStorage.removeItem("FAV_LIST_ARRAY");
    localStorage.removeItem("FAVROUTE_LIST_ARRAY");
    localStorage.removeItem("categorieslist");
  
    localStorage.removeItem("VisiterUserID");
    localStorage.removeItem("VisiterUserEmail");
    localStorage.removeItem("shopstatus");  
    localStorage.removeItem("userId");  
    localStorage.removeItem("clientDetail");
    localStorage.removeItem("selectedRegister");
    localStorage.removeItem('productcount');

  }

  componentWillMount() {
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem('user');
    this.setState({ loading: true })
  }

  componentDidMount() {
    window.indexedDB.deleteDatabase('ProductDB');
    var urlParam = this.props.location.search;
    var splParam = urlParam.replace("?", "").split("&");
    var finalParam = ""
    splParam.forEach(element => {
      finalParam += finalParam == "" ? "" : "&";
      finalParam += element.substring(0, element.indexOf('=')) + "=" + encodeURIComponent(element.substring(element.indexOf('=') + 1));
    });

    if (finalParam && finalParam !== "") {
      const { dispatch } = this.props;
      setTimeout(function () {
        dispatch(externalLoginActions.externallogin(finalParam));
      }, 500)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.externalLogin) {
      var loginRes = nextProps.externalLogin;
      this.setState({ loading: false })
      if (loginRes.subscription_detail.udid) {
        var locations = []
        locations=loginRes.locations;
        setTimeout(function () {
          localStorage.removeItem("selectedRegister");   
          localStorage.setItem("UserLocations", JSON.stringify(locations));
          encode_UDid(loginRes.subscription_detail.udid);      
            GTM_ClientDetail();      
            if (loginRes.locations.length==1 && loginRes.registers.length==1) {
          // if (loginRes.locations.length==1 && loginRes.registers.length==1) {
            localStorage.setItem("Location", loginRes.locations[0].id);
            localStorage.setItem("LocationName", loginRes.locations[0].name);
            localStorage.setItem('WarehouseId', loginRes.locations[0].warehouse_id);
            localStorage.setItem("register", loginRes.registers[0].id);
            localStorage.setItem('pdf_format', JSON.stringify(loginRes.registers));
            localStorage.setItem('registerName', loginRes.registers[0].name);
            localStorage.setItem("selectedRegister",JSON.stringify(loginRes.registers[0]));   
            
            if (localStorage.getItem('demoUser') != 'true') {
              //window.location = '/loginpin';
              isShowWrapperSetting("ExternalLogin.js",'loginpin');
            }
            //history.push('/loginpin');
          } else if (loginRes.locations) {
            localStorage.setItem('UserLocations', JSON.stringify(loginRes.locations));
            //window.location = '/login_location';
            isShowWrapperSetting("ExternalLogin.js",'login_location');
            //history.push('/login_location');
          } else {
            history.push('/login');
          }
        }, 500)
      } else {
        history.push('/login');
      }
    }
  }

  render() {
    return (
      <LoadingMessage />
    );
  }
}

function mapStateToProps(state) {
  const { externalLogin } = state;
  return {
    externalLogin: externalLogin.loginRes
  };
}

const connectedExternalLogin = connect(mapStateToProps)(ExternalLogin);
export { connectedExternalLogin as ExternalLogin }; 