import React from 'react';
import { history } from '../../_helpers';
import { connect } from 'react-redux';
import {onboardingActions} from '../action/onboarding.action'
import LoaderOnboarding from '../components/LoaderOnboarding'
import { checkShopSTatusAction } from '../../_actions';
//import { LoadingModal } from '../../_components';
//import {OnboardingFooter} from './commonComponents/OnboardingFooter';
//import LocalizedLanguage from '../../settings/LocalizedLanguage';
class VisiterShopAccess extends React.Component {
    constructor(props) {
        super(props);            
        this.state = {
            fglogin: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.getDetail = this.getDetail.bind(this);

        localStorage.removeItem("DemoGuid");
        localStorage.removeItem("VisiterUserID");
        localStorage.removeItem("VisiterUserEmail");
        localStorage.removeItem('VisiterClientConnected')
        localStorage.removeItem('VisiterShopAuthToken')
        localStorage.removeItem('VisiterClientID')
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('GLOBAL_PAYMENT_RESPONSE');
        localStorage.removeItem('PAYMENT_RESPONSE');
       // localStorage.removeItem("productcount");
    }
    componentWillMount() {
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem('user');
        //this.setState({ loading: true })       
      }
      componentDidMount() {
        localStorage.setItem('showOnboardingPopup',true)
        window.indexedDB.deleteDatabase('ProductDB');
        var urlParam = this.props.location.search;
        var splParam = urlParam.replace("?", "").split("&");
        var finalParam = ""
       console.log("demouser1",localStorage.getItem('demoUser'));
        splParam.forEach(element => {
            if(element.substring(0, element.indexOf('='))=='_fg'){
                this.setState({fglogin:true});
            }
            else{
                  if(element.substring(0, element.indexOf('='))=='_t'){
                    var demoparam=element.substring(element.indexOf('=') + 1);
                        if( demoparam  && demoparam.toLowerCase()=='demo');
                        {
                            localStorage.setItem('demoUser', true)
                        }
                    }
                    finalParam += finalParam == "" ? "" : "&";
                    finalParam += element.substring(0, element.indexOf('=')) + "=" + encodeURIComponent(element.substring(element.indexOf('=') + 1));
            }
        });
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const _c_param = urlParams.get('_c')
        if(_c_param){
            finalParam +=`&${_c_param}` 
        }

    console.log("finalParam",finalParam)
        if (finalParam && finalParam !== "") {
          const { dispatch } = this.props;
        //   if(_user){pm
        //   this.props.dispatch(onboardingActions.EncriptData(_user));
        //   }    
            setTimeout(() => {
                this.getDetail(finalParam);
            }, 200);
        }else{
            history.push("/login");
        }
      }
      componentWillReceiveProps(nextProps){
          console.log('priops-------',nextProps);
          
        //console.log("nextProps.",nextProps)
        //   if(nextProps.encriptData ){
        //     console.log("nextProps.encriptData",nextProps.encriptData)
        //     if( nextProps.encriptData.encriptedData && nextProps.encriptData.encriptedData.IsSuccess==true && nextProps.encriptData.encriptedData.Content){
        //        this.setState({"externalUser": nextProps.encriptData.encriptedData.Content})
        //        this.getDetail(nextProps.encriptData.encriptedData.Content)
        //     }
        //   }
        if(nextProps.loading==false){
            this.handleClick();
        }
      }
    // render onBoardloading on accept TnC
    handleClick = () => {
        console.log("demouser2",localStorage.getItem('demoUser'));
        history.push('/onboardloading');
    }
    getDetail = (_userId) => {     
        console.log("externalUser",_userId)
        console.log("this.state.fglogin",this.state.fglogin)
        if(_userId && _userId !=="" )  { 
            this.props.dispatch(checkShopSTatusAction.getProductCount());
            this.props.dispatch(onboardingActions.VisiterShopAccessCallBack(_userId,this.state.fglogin));    
        }else {
            history.push("/login");
        }
    }
    render() {
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        // console.log("loader",this.props.loading );
        // console.log("isDemoUser",isDemoUser );
        // if(  this.props.loading==false){
        //     this.handleClick();
        // }
        return (
        //     this.state.fglogin == true?
        //     <div className="user_login">
        //          {this.props.loading ? <LoadingModal/>:''}
        //      <div className="user_login_pages">
        //         <div className="user_login_container">
        //             <div className="user_login_row">
        //                 <div className="user_login_colA">
        //                     <div className="user_login_form_wrapper">
        //                         <div className="user_login_form_wrapper_container">
        //                             <div className="user_login_form">
        //                                 <div className="user_login_head">
        //                                     <div className="user_login_head_logo">
        //                                         <a href="#">
        //                                             <img src="../assets/img/onboarding/logo-2-sm.png" alt="" />
        //                                         </a>
        //                                     </div>
        //                                     <h3 className="user_login_head_title">
        //                                         {LocalizedLanguage.Justonelastthing}
        //                                     </h3>                                            
        //                                     <div className="user-login__account">
        //                                         <span>{LocalizedLanguage.Byclickingonthebuttonyouacceptour}</span><br /><a href="#"
        //                                             className="user-login__account-link"><u> {LocalizedLanguage.TermsConditions}
        //                                             </u></a>
        //                                     </div>                                            
        //                                 </div>
        //                                 <form action="#">
        //                                     <div className="user_login_action">
        //                                         <button
        //                                             className="btn btn-success btn-block user_login_btn_success user_login-margin-t-20" onClick={this.handleClick}>
        //                                             {LocalizedLanguage.ShowmethatOwlMagic}
        //                                         </button>
        //                                      </div>
        //                                 </form>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="user_login_colB">                           
        //                     <div className="user_login_aside" style={{ backgroundImage: "url(../assets/img/onboarding/mobile.png)" }}>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <OnboardingFooter />
        //  </div>
        // :
        <LoaderOnboarding isDemoUser={isDemoUser}/>
      )
    }
}

//export { VisiterShopAccess };
function mapStateToProps(state) {
    const { encriptData, onboardingcall  } = state;
    return {
      VisiterShopAccess: onboardingcall && onboardingcall.loginRes,
      encriptData:encriptData && encriptData,
      loading :onboardingcall && onboardingcall.loading
    };
  }
  
  const connectedVisiterShopAccess = connect(mapStateToProps)(VisiterShopAccess);
  export { connectedVisiterShopAccess as VisiterShopAccess }; 
