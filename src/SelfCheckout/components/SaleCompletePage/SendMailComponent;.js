import React from 'react';
import { connect } from 'react-redux';
import ActiveUser from '../../../settings/ActiveUser';
import { get_UDid } from '../../../ALL_localstorage';
import { saveCustomerInOrderAction,cartProductActions } from '../../../_actions'
import Config from '../../../Config';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { history } from '../../../_helpers';
import {getCustomLogo,centerView} from '../../../settings/SelfCheckoutSettings';
class SendMailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkList: localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null,
      IsEmailExist: true,
      CancelOrder: false,
      mailsucces: false,
      common_Msg: '',
      valiedEmail: true,
      emailSendingMessage: '',
    }
    this.sendMail = this.sendMail.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    // console.log("dt", nextProp);
    if ((typeof nextProp.getSuccess !== 'undefined') && nextProp.getSuccess !== '') {
      this.setState({
        mailsucces: nextProp.getSuccess ? nextProp.getSuccess.is_success : null,
        emailSendingMessage: nextProp.getSuccess && nextProp.getSuccess.message ? nextProp.getSuccess.message : '',
        loader: false
      })
    }
    if (nextProp.getSuccess && nextProp.getSuccess.is_success == true) {
      setTimeout(
        this.clear()
        , 1000);
    }else if(nextProp.getSuccess && nextProp.getSuccess.is_success == false){
      setTimeout(
        this.clear()
        , 10000);
    }

  }
  clear() {
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem('GTM_ORDER');
    const { dispatch } = this.props;
    localStorage.removeItem('ORDER_ID');
    localStorage.removeItem('CHECKLIST');
    localStorage.removeItem('oliver_order_payments');
    localStorage.removeItem('AdCusDetail');
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem("CART");
    localStorage.removeItem("SINGLE_PRODUCT");
    localStorage.removeItem("PRODUCT");
    localStorage.removeItem('PrintCHECKLIST');
    localStorage.removeItem('PAYCONIQ_PAYMENT_RESPONSE');
    localStorage.removeItem('ONLINE_PAYMENT_RESPONSE');
    localStorage.removeItem('STRIPE_PAYMENT_RESPONSE');
    localStorage.removeItem('GLOBAL_PAYMENT_RESPONSE');
    localStorage.removeItem('PAYMENT_RESPONSE');
    localStorage.removeItem('PENDING_PAYMENTS');
    localStorage.removeItem('taxType');
    localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
    dispatch(cartProductActions.addtoCartProduct(null));
    // if(isMobileOnly == true){
    //     history.push('/shopview')
    // }else{
    //     window.location = '/shopview';
    // }
    history.push('/SelfCheckoutView')
  }



  sendMail() {
    const { orderId, tempOrderId } = this.props;
    $(".suctext").css("display", "block");
    var udid = get_UDid('UDID');
    var order_id = orderId;
    var email_id = $("#customer-email").val();
    // console.log("email_id", email_id)
    $(".emialsuctes").css("display", "block");
    this.setState({ mailsucces: null, emailSendingMessage: '' });
    var requestData = {
      "Udid": udid,
      "OrderNo": order_id,
      "EmailTo": email_id,
    }
    if (!email_id || email_id == "") {
      this.setState({ IsEmailExist: false, common_Msg: 'Email is not exist!' })
      // setTimeout(function () {
      //     showModal('common_msg_popup');
      // }, 100)
    }
    else {
      this.setState({ IsEmailExist: true })
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id)) {
        this.setState({
          valiedEmail: true,
          loader: true
        })
        // if ($(".checkmark").hasClass("isCheck")) {
        // save new customer on sale complete
        this.props.dispatch(saveCustomerInOrderAction.saveCustomerToTempOrder(udid, tempOrderId, email_id))
        // Add into notfication list ----------------------------------------
        // Create localstorage to store temporary orders--------------------------
        $("#btnSubmit").attr("disabled", true);
        var TempOrders = [];
        if (localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) {
          TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`));
        }
        TempOrders.push({ "TempOrderID": tempOrderId, "Status": "false", "Index": TempOrders.length, "OrderID": 0, 'order_status': "completed", 'date': moment().format(Config.key.NOTIFICATION_FORMAT), 'Sync_Count': 0, 'new_customer_email': email_id, 'isCustomerEmail_send': false });
        localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders));
        $("#btnSendEmail").attr("readonly", true);
        // this.clear();
      } else {
        if (!email_id || email_id == "") {
          this.setState({ IsEmailExist: false })
        }
        this.setState({ valiedEmail: false })
      }
    }
  }

  render() {
    var custom_logo=getCustomLogo();
    var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
    console.log("this.state", this.state)
    return (
      <div className="payment-view email-payment">
         <div type="button" className="popup-close">
            <svg onClick={() => this.clear()}
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
            </div>
        <div className="wrapper">
        {custom_logo?<img src={Config.key.RECIEPT_IMAGE_DOMAIN+custom_logo.Value} alt="" />:""}
          {/* <img src="../assets/image/mblogobig.png" alt="" /> */}
          <p>Please enter your email address</p>
          <input type="email" defaultValue={(checkList.customerDetail && checkList.customerDetail.content &&
            typeof checkList.customerDetail.content.Email !== "undefined") ? checkList.customerDetail.content.Email : ''}
            id="customer-email" placeholder="example@gmail.com"
            disabled={(checkList.customerDetail && checkList.customerDetail.content &&
              typeof checkList.customerDetail.content.Email !== "undefined") ? true : false}
          />
          <label>
            <input type="checkbox" />
            <div className="custom-checkbox">
              <svg width={21} height={18} viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4237 1.42317C17.7736 1.07635 18.2459 0.881158 18.7385 0.879798C19.2312 0.878439 19.7045 1.07102 20.0563 1.4159C20.4081 1.76079 20.61 2.23027 20.6184 2.72284C20.6268 3.21541 20.441 3.6915 20.1012 4.04817L10.1212 16.5232C9.94966 16.7079 9.74265 16.8562 9.51252 16.9591C9.28238 17.062 9.03386 17.1174 8.78181 17.1221C8.52976 17.1268 8.27936 17.0806 8.04558 16.9862C7.81179 16.8919 7.59943 16.7514 7.42119 16.5732L0.808685 9.95817C0.624468 9.78651 0.476713 9.57951 0.374233 9.34951C0.271753 9.11952 0.216648 8.87123 0.212206 8.61947C0.207764 8.36772 0.254076 8.11764 0.348379 7.88417C0.442681 7.6507 0.583043 7.43862 0.76109 7.26057C0.939136 7.08253 1.15122 6.94216 1.38469 6.84786C1.61816 6.75356 1.86823 6.70725 2.11999 6.71169C2.37175 6.71613 2.62003 6.77124 2.85003 6.87372C3.08003 6.9762 3.28703 7.12395 3.45868 7.30817L8.69369 12.5407L17.3762 1.47817C17.3917 1.4588 17.4084 1.44043 17.4262 1.42317H17.4237Z" fill="#0aacdb" />
              </svg>
            </div>
            Receive promotional emails
          </label>
          <span className="emailMessage">
            {this.state.IsEmailExist == false ? LocalizedLanguage.enterEmail :
              this.state.valiedEmail == false ? LocalizedLanguage.invalidEmail :
                this.state.mailsucces == null ? LocalizedLanguage.pleaseWait :
                  this.state.mailsucces && this.state.mailsucces == true ? LocalizedLanguage.successSendEmail
                    : this.state.mailsucces == false ? this.state.emailSendingMessage : ""
            }
          </span>
          <button id="sendReceipt" onClick={() => this.sendMail()}>Send Receipt</button>
        </div>
        <div style={{display:"none"}}>
          {//Page Setup
          setTimeout(() => {
            // scaleSVG();
            centerView("email-payment");
            //Custom resize listener
            var customResizeTimer;
            window.addEventListener("resize", function () {
            clearTimeout(customResizeTimer);
            customResizeTimer = setTimeout(function () {
            centerView();
            }, 100);
            });
          }, 100)

}
        </div>
      </div>
    )
  }
}






function mapStateToProps(state) {
   const {  getSuccess } = state;
  return {
      getSuccess: getSuccess.items,
  };
}
const connectedSendMailComponent = connect(mapStateToProps)(SendMailComponent);
export { connectedSendMailComponent as SendMailComponent };



// function SendMailComponent() {
//   return (
//     <div className="payment-view email-payment">
//     <div className="wrapper">
//       <img src="../assets/image/mblogobig.png" alt="" />
//       <p>Please enter your email address</p>
//       <input type="email" placeholder="Enter Email" />
//       <label>
//         <input type="checkbox" />
//         <div className="custom-checkbox">
//           <svg width={21} height={18} viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M17.4237 1.42317C17.7736 1.07635 18.2459 0.881158 18.7385 0.879798C19.2312 0.878439 19.7045 1.07102 20.0563 1.4159C20.4081 1.76079 20.61 2.23027 20.6184 2.72284C20.6268 3.21541 20.441 3.6915 20.1012 4.04817L10.1212 16.5232C9.94966 16.7079 9.74265 16.8562 9.51252 16.9591C9.28238 17.062 9.03386 17.1174 8.78181 17.1221C8.52976 17.1268 8.27936 17.0806 8.04558 16.9862C7.81179 16.8919 7.59943 16.7514 7.42119 16.5732L0.808685 9.95817C0.624468 9.78651 0.476713 9.57951 0.374233 9.34951C0.271753 9.11952 0.216648 8.87123 0.212206 8.61947C0.207764 8.36772 0.254076 8.11764 0.348379 7.88417C0.442681 7.6507 0.583043 7.43862 0.76109 7.26057C0.939136 7.08253 1.15122 6.94216 1.38469 6.84786C1.61816 6.75356 1.86823 6.70725 2.11999 6.71169C2.37175 6.71613 2.62003 6.77124 2.85003 6.87372C3.08003 6.9762 3.28703 7.12395 3.45868 7.30817L8.69369 12.5407L17.3762 1.47817C17.3917 1.4588 17.4084 1.44043 17.4262 1.42317H17.4237Z" fill="#0aacdb" />
//           </svg>
//         </div>
//         Receive promotional emails
//       </label>
//       <button id="sendReceipt" onClick={() => this.sendMail()}>Send Receipt</button>
//     </div>
//   </div>
//   )
// }
