export const  GTM_ClientDetail=()=> {
    var _data = localStorage.getItem('clientDetail');
    var clientDetail = _data ? JSON.parse(_data) : null; 
    var _user=  localStorage.getItem('user');
    var _userName = _user ? JSON.parse(_user).display_name : null; 
    var _clientID="";
    var _clientEmail="";
    if(clientDetail){
        _clientID= clientDetail && clientDetail.subscription_detail ?clientDetail.subscription_detail.client_guid:"";
        _clientEmail=clientDetail && clientDetail !== null && clientDetail.user_email? clientDetail.user_email:"";
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        if(demoUser  && (demoUser==true|| demoUser=="true")){
            var _clientID = localStorage.getItem("VisiterUserID") ?  localStorage.getItem("VisiterUserID")  : "";
            var _clientEmail = localStorage.getItem("VisiterUserEmail") ?  localStorage.getItem("VisiterUserEmail")  : "";          
            _userName =_clientEmail
        } 
        var _clientData= {
            'oliverpos-client-guid': _clientID?_clientID:"" ,
            'oliverpos-client-url':  clientDetail && clientDetail.subscription_detail && clientDetail.subscription_detail.host_name ? clientDetail.subscription_detail.host_name : "",
            'oliverpos-client-email': _clientEmail ? _clientEmail : "",
            'oliverpos-user-name': _userName ?_userName : "",
            'is-demo-user': demoUser
        }
        if (process.env.ENVIRONMENT=='production' && clientDetail  && checkEventExist('',_clientData)==false) {    
           // dataLayer.push(_clientData);        
        }
    }
 }

// When a user goes to the checkout page get total amount in the checkout. We can add it to the existing dataLayer
export const  GTM_oliverCheckout=()=> {
    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    var checkout_list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
   if (process.env.ENVIRONMENT=='production' && checkout_list &&checkout_list!=="") {
      if( checkEventExist("checkoutPage")==false){ // check for duplicate
    //    dataLayer.push({
    //        'event': 'checkoutPage',
    //        'checkoutTotal': checkout_list.totalPrice,
    //        'is-demo-user': demoUser
    //    });
     }
   }
}

export const  GTM_oliverOrderPayment=(PaymentType,amount)=> {
    if(process.env.ENVIRONMENT=='production'){
        var gtm_order = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : "";
        var oliver_order_payments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : "";  
        var totalPayment=0.0;
        if(oliver_order_payments && oliver_order_payments !==""){
            oliver_order_payments.map(items => {
                totalPayment=totalPayment + parseFloat(items.payment_amount);
            });
            }
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
       
        if (oliver_order_payments) {
            //    dataLayer.push({
            //         'is-demo-user': demoUser,
            //         'event': 'payment',
            //         'paymentType':PaymentType,
            //         'paymentAmount': parseFloat(amount),
            //         'remainingBalance':  Number(Math.round(parseFloat(gtm_order.totalPrice)-parseFloat(totalPayment) + 'e' + 2) + 'e-' + 2)  
            //     });
         }
    }
}
// when place order is successfully complete
export const  GTM_oliverOrderComplete=()=> {    
    var _order = localStorage.getItem("GTM_ORDER") ? JSON.parse(localStorage.getItem("GTM_ORDER")) : "";
    var gtm_order = addUSDConversionRate( _order )
    if (process.env.ENVIRONMENT=='production' && gtm_order) {
       var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
          if (gtm_order.status == 'completed' && gtm_order.order_payments && gtm_order.order_payments.length > 0) {                     
          if( checkEventExist("checkoutComplete")==false){
                // dataLayer.push({
                //     'event': 'checkoutComplete',
                //     'orderDetails': gtm_order,
                //     'is-demo-user': demoUser
                // });
            }
        }
    }
}
const addUSDConversionRate=(_order)=>{
    var _convertionRate=localStorage.getItem("USDConversionRate")?localStorage.getItem("USDConversionRate"):0;
    if(_order !="" && _order.line_items){
        //order  total in USD
        _order["total_in_usd"]= _order.order_total ?_order.order_total * _convertionRate:0;

        //Line item total in USD
        _order.line_items.map(item=>{
            item["total_in_usd"]=item.total * _convertionRate;
        })

         //Payment total in USD
         _order.order_payments && _order.order_payments.map(item=>{
            item["amount_in_usd"]=item.amount * _convertionRate;
        })
    }
    return _order;
}
const checkEventExist=(event,_clientData =null)=>{0
    // var checkEventExit=false;
    // if(_clientData  && dataLayer){
    //     dataLayer.map((item,index)=>{
    //         try { if(JSON.parse(JSON.stringify(item))["oliverpos-client-guid"]){
    //                // console.log("Duplicate")
    //               return  checkEventExit =true;                  
    //             }
    //          } catch (error) {  }
    //         });
       
    // }
    //  else  if(event !=='' && dataLayer){
    //         dataLayer.map((item,index)=>{               
    //             if(item.event && item.event==event )
    //             checkEventExit =true;            
    //         })
    //     }
    //     return checkEventExit;
}

export const GTM_OliverDemoUser=(pageDetails)=>{
    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    if(demoUser  && (demoUser==true|| demoUser=="true")){
        var VisiterId = localStorage.getItem("VisiterUserID") ?  localStorage.getItem("VisiterUserID")  : "";
        var VisiterEmail = localStorage.getItem("VisiterUserEmail") ?  localStorage.getItem("VisiterUserEmail")  : "";
        console.log("Ënviroment", process.env.ENVIRONMENT);
            // dataLayer.push({
            //     'event':'DemoUser',
            //     'VisiterId':VisiterId,
            //     'VisiterEmail': VisiterEmail,
            //     'VisiterDetails': pageDetails,
            //     'is-demo-user': demoUser
            // });
    }  
}