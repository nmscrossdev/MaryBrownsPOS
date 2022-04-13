import Analytics from 'analytics-node';
import Config from '../Config';

var analytics = new Analytics(Config.key.SEGMENT_ANALYTIC_KEY);

var _data = localStorage.getItem('clientDetail');
var clientDetail = _data ? JSON.parse(_data) : null; 
var _user=  localStorage.getItem('user');
var _userName = _user ? JSON.parse(_user).display_name : null; 
var _clientID="";
var _clientEmail="";
if(clientDetail){
    _clientID= clientDetail && clientDetail.subscription_detail ?clientDetail.subscription_detail.client_guid:"";
    _clientEmail=clientDetail && clientDetail.user_email? clientDetail.user_email:"";
    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    if(demoUser  && (demoUser==true|| demoUser=="true")){
        var _clientID = localStorage.getItem("VisiterUserID") ?  localStorage.getItem("VisiterUserID")  : "";
        var _clientEmail = localStorage.getItem("VisiterUserEmail") ?  localStorage.getItem("VisiterUserEmail")  : "";          
        _userName =_clientEmail
    } 
}
console.log("ENVIRONMENT",process.env.ENVIRONMENT,process.env.ENVIRONMENT !=='production')
export const trackShopDetail=()=>{
     _data = localStorage.getItem('clientDetail');
        clientDetail = _data ? JSON.parse(_data) : null; 
        _user=  localStorage.getItem('user');
        _userName = _user ? JSON.parse(_user).display_name : null; 
        _clientID="";
        _clientEmail="";
    if(clientDetail){
        _clientID= clientDetail && clientDetail.subscription_detail ?clientDetail.subscription_detail.client_guid:"";
        _clientEmail=clientDetail && clientDetail.user_email? clientDetail.user_email:"";
        demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        if(demoUser  && (demoUser==true|| demoUser=="true")){
            _clientID = localStorage.getItem("VisiterUserID") ?  localStorage.getItem("VisiterUserID")  : "";
            _clientEmail = localStorage.getItem("VisiterUserEmail") ?  localStorage.getItem("VisiterUserEmail")  : "";          
            _userName =_clientEmail
        } 
    }

   
    if(_clientID && _clientID !=='' && process.env.ENVIRONMENT !=='production'){
        analytics.track({
            userId: _clientID,
            event: 'shoplogin',
            properties: {
                'oliverpos-client-url':  clientDetail && clientDetail.subscription_detail && clientDetail.subscription_detail.host_name ? clientDetail.subscription_detail.host_name : "",
                'oliverpos-client-email': _clientEmail ? _clientEmail : "",
                'oliverpos-user-name': _userName ?_userName : "",
                'is-demo-user': demoUser
            }
        });
        console.log("trackShopDetail");
    }
}
export const  trackOliverCheckout=()=> {   
    var checkout_list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
   if ( _clientID && _clientID !=='' && checkout_list &&checkout_list!=="" && process.env.ENVIRONMENT !=='production') {
     
        analytics.track({
            userId: _clientID,
            event: 'checkout',
            properties: {
                'checkoutTotal': checkout_list.totalPrice,
                'is-demo-user': demoUser
            }
        });
      
        console.log("trackOliverCheckout");
   }
}
export const  trackOliverOrderPayment=(PaymentType,amount)=> {
    if(process.env.ENVIRONMENT !=='production'){
        var gtm_order = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : "";
        var oliver_order_payments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : "";  
  
        var totalPayment=0.0;
        if(oliver_order_payments && oliver_order_payments !==""){
            oliver_order_payments.map(items => {
                totalPayment=totalPayment + parseFloat(items.payment_amount);
            });
            }
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
       
        if ( _clientID && _clientID !=='' && oliver_order_payments) {
            analytics.track({
                userId: _clientID,
                event: 'payment',
                properties: {
                    'is-demo-user': demoUser,                   
                    'paymentType':PaymentType,
                    'paymentAmount': parseFloat(amount),
                    'remainingBalance':  Number(Math.round(parseFloat(gtm_order.totalPrice)-parseFloat(totalPayment) + 'e' + 2) + 'e-' + 2)  
                }
            })
            console.log("trackOliverOrderPayment");
        }
    }
}
export const  trackOliverOrderComplete=()=> {    
    if(process.env.ENVIRONMENT !=='production'){
        var gtm_order = localStorage.getItem("GTM_ORDER") ? JSON.parse(localStorage.getItem("GTM_ORDER")) : "";
        if ( gtm_order) {  // process.env.ENVIRONMENT=='development' &&   
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            if (gtm_order.status == 'completed' && gtm_order.order_payments && gtm_order.order_payments.length > 0) {                     
                analytics.track({
                    userId: _clientID,
                    event: 'checkoutComplete',
                    properties: {
                        'is-demo-user': demoUser,                   
                        'orderDetails': gtm_order                   
                    }
                })
                console.log("trackOliverOrderComplete");
            }      
        }
    }
}

export const  trackPage=(path,title,parentComponent,component)=> {    
    if(process.env.ENVIRONMENT !=='production'){
        if(_clientID && _clientID !==''){   
            analytics.page({
                userId: _clientID,       
                ParentComponent: parentComponent,
                Component:component,
                event:"uservisit",
                properties: {                     
                    path: path,
                    title: title,           
                }
            });
            console.log("trackPage");
        }
}
}