import { get_UDid } from "../ALL_localstorage";
import { customerActions } from "../CustomerPage";
import { history,store } from "../_helpers";
import Config from '../Config'
import { PrintAppData } from "../_components/PrintAppData";
import {TriggerCallBack} from '../appManager/FramManager' 
import { isMobileOnly, isIOS } from "react-device-detect";
import { activityActions } from "../ActivityPage";
import FetchIndexDB from "../settings/FetchIndexDB";
import { cartProductActions } from "../_actions";
import { checkoutActions } from "../CheckoutPage";
import { changeTaxRate, getTaxAllProduct } from "../_components";

export const handleAppEvent = (value,whereToview,isbackgroudApp=false) => {
  
    var jsonMsg = value ? value : '';
    var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.command ? jsonMsg.command : '';
    // console.log("whereToview",whereToview)
    // console.log("clientEvent",clientEvent)
    var appResponse='';
     if (clientEvent && clientEvent !== '') {
       // console.log("clientEvent", jsonMsg)
        //this.setState({ showNewAppExtension:true})
        switch (clientEvent) {
            case "appReady":
                appReady(whereToview,isbackgroudApp,isbackgroudApp)
                break;
              case "DataToReceipt":
                appResponse=DataToReceipt(jsonMsg,whereToview,isbackgroudApp);
                break;
              case "Receipt":
                      PrintReceiptWithAppData(jsonMsg,isbackgroudApp)
                break;
              case "CartValue":
                handleCartValue(jsonMsg,isbackgroudApp)
                  break;          
              case "Cart":
                handleCart(jsonMsg,isbackgroudApp)
                  break;

              case "Customers":         //Handle Customer events
                handleCustomer(jsonMsg,isbackgroudApp);
                break;
              case "CustomerDetails":
                sendCustomerDetail(jsonMsg,isbackgroudApp)
                break;
              case "CustomerInSale":
                retrieveCustomerInSale(jsonMsg,isbackgroudApp)
                  break;          
              case "CustomerToSale":
                CustomerToSale(jsonMsg,isbackgroudApp)
                  break;                        
              case "productDetail":
                productDetail(jsonMsg,isbackgroudApp)
                break
              case "Payment":
                appResponse=payfromApp(jsonMsg,isbackgroudApp)
                break
              case "rawProductData":
                rawProductData(jsonMsg,isbackgroudApp)
              break
              case "cartDiscount":
                appResponse= addCartDiscount(jsonMsg,isbackgroudApp,whereToview)
              break
              case "cartTaxes":
                appResponse=  cartTaxes(jsonMsg,isbackgroudApp)
              break 
              case "addProductToCart":
                appResponse=  addProductToCart(jsonMsg,isbackgroudApp,whereToview)
              break  
              case "Notes":
                appResponse=  Notes(jsonMsg,isbackgroudApp,whereToview)
              break  
              case "Environment":
                Environment(jsonMsg,isbackgroudApp,whereToview)
              break 
              case "lockEnvironment":
                appResponse=lockEnvironment(jsonMsg,isbackgroudApp,whereToview)
              break
              case "productPriceUpdate":
                appResponse=productPriceUpdate(jsonMsg,isbackgroudApp,whereToview)
              break
              case "sendProductQuantity":
                appResponse=sendProductQuantity(jsonMsg,isbackgroudApp,whereToview)
              break
              case "CloseExtension":
                CloseExtension();
                  break;
  
            default: // extensionFinished
                  var clientJSON = {
                    command: jsonMsg.command,
                    version:jsonMsg.version,
                    method: jsonMsg.method,
                    status: 406,
                    error: "Invalid Command" //GR[2]
                  }
                  postmessage(clientJSON)
                console.error('App Error : Extension event does not match ', jsonMsg)
                break;
        }
  return appResponse;
    }
  }
  export const appReady = (whereToview,isbackgroudApp) => {
    var clientDetails = localStorage.getItem('clientDetail') ?
    JSON.parse(localStorage.getItem('clientDetail'))  : 0 
   var client_guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : ''
  
   if(whereToview =='ActivityView'){
    // var pagesize = Config.key.ACTIVITY_PAGE_SIZE
    // var UID = get_UDid('UDID');
    // var pagno = 0;
   //store.dispatch(activityActions.getOne(UID,pagesize,pagno));
    setTimeout(() => {
      const state = store.getState();
      console.log("state",state)
      if(state.single_Order_list &&  state.single_Order_list.items  && state.single_Order_list.items.content){
        var _OrderId=state.single_Order_list.items.content.order_id;
        var OliverReciptId=state.single_Order_list.items.content.OliverReciptId;
        var _customerId=state.single_Order_list.items.content.customer_id;
        var clientJSON = {
          command: "appReady",
          version:"1.0",
          method: "get",
          status: 200,
          data:
          {
            OrderId : _OrderId,
            WooCommerceId:_customerId ,  
            clientGUID: client_guid,
            view: whereToview,
            privilege: clientDetails && clientDetails.user_role,
            viewport: isMobileOnly==true?"Mobile": "desktop"
          },
          error: null
        }
        postmessage(clientJSON)
      }
   }, 1000);
 
   } else if(whereToview =='CheckoutView' || whereToview =='RefundView'){
    var clientJSON = {
      command: "appReady",
      version:"1.0",
      method: "get",
      status: 200,
      data:
      {
        clientGUID: client_guid,
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly==true?"Mobile": "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
   }  else if(whereToview =='CustomerView'){  
    //var UID = get_UDid('UDID');
    //store.dispatch(customerActions.getAllEvents(UID));
    setTimeout(() => {
      const state = store.getState();
      console.log("state",state)
      if(state.single_cutomer_list &&  state.single_cutomer_list.items  && state.single_cutomer_list.items.content){
       var _CustomerId=state.single_cutomer_list.items.content.customerDetails.WPId;
        var clientJSON = {
          command: "appReady",
          version:"1.0",
          method: "get",
          status: 200,
          data:
          {
            CustomerId: _CustomerId,
            clientGUID: client_guid,
            view: whereToview,
            privilege: clientDetails && clientDetails.user_role,
            viewport: isMobileOnly==true?"Mobile": "desktop"
          },
          error: null
        }
        postmessage(clientJSON)
      }
     }, 1000);
   }  else if(whereToview =='ProductView'){  // this is not in used. 
    var clientJSON = {
      command: "appReady",
      version:"1.0",
      method: "get",
      status: 200,
      data:
      {
        ProductId: 445667,
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly==true?"Mobile": "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
    console.log("clientJSON from shopview",clientJSON)
     }
    
  }
  export const postmessage=(clientJSON)=> {
    //var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    var iframex=undefined;
    if(document.getElementById("commoniframe")){
            iframex = document.getElementById("commoniframe").contentWindow;
        if( !iframex)
        iframex = document.getElementById("iframeid").contentWindow;
    }else if(document.getElementById("iframeid")){
      iframex = document.getElementById("iframeid").contentWindow;
    }

    console.log(iframex)
    if(iframex){
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }
    
  }

  const  validateRequest=(RequestData)=>{     
    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var urlReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

    var isValidationSuccess=true; 
    var clientJSON={ command: RequestData.command,
                    version:RequestData.version,
                    method: RequestData.method,
                    status: 406,
                  }
      if(RequestData.command== 'Customers' || RequestData.command=='CustomerDetails'){
             //missing attributes
              if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
                isValidationSuccess=false;        
                clientJSON['error']= "Invalid Attribute"          
              }  
            else if (RequestData  && (RequestData.method=='put'||RequestData.method=='delete')){ // main attributes for customer update/delete 
                if (RequestData  && !RequestData.email){ 
                    isValidationSuccess=false;
                      clientJSON['error']="Missing Attribute(s)" //GR[3]
                  }            
                  else if (RequestData  && RequestData.email && (RequestData.email==null || RequestData.email=='') ){ // for customer update 
                    isValidationSuccess=false;
                      clientJSON['error']="Missing Value" //GR[6]
                  } else if (RequestData  && !isNaN(RequestData.email)){ //not a string
                    isValidationSuccess=false;
                      clientJSON['error']="Invalid Data Type" //GR[4]
                  }
                  else if (!(emailReg.test(RequestData.email))) { //invalid Email          
                    isValidationSuccess=false;
                    clientJSON['error']=  "Invalid Value" //GR[5]                     
                } 
            } else if(RequestData.method=='put'||RequestData.method=='post'){ //data validations
                    if (RequestData && (!RequestData.data || !RequestData.data.email)) { //missing email arribute to add customer
                      isValidationSuccess=false;
                        clientJSON['error']= "Invalid Attribute" //GR[1]          
                    }  
                    else if (RequestData && RequestData.data && (RequestData.data.email==null || RequestData.data.email=='')) { // email
                      isValidationSuccess=false;
                      clientJSON['error']=  "Missing Value" //GR[6]          
                    }
                    else if (!(emailReg.test(RequestData.data.email))) { //invalid Email          
                        isValidationSuccess=false;
                        clientJSON['error']=  "Invalid Value" //GR[4]                     
                    } 
            }       
            
              return {isValidationSuccess,clientJSON};
      }
      else if(RequestData.command=='DataToReceipt' || RequestData.command=='Receipt'){
        if (RequestData && (!RequestData.method || !RequestData.method=='post')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }else if (RequestData  && !RequestData.url){ 
          isValidationSuccess=false;
            clientJSON['error']="Missing Attribute(s)" //GR[3]
         
        }else if (RequestData  && !urlReg.test(RequestData.url)){ 
          isValidationSuccess=false;
          clientJSON['error']=  "Invalid Value" //GR[5]  
        }      
       
      }    
      else if(RequestData.command=='CartValue' ){ //|| RequestData.command=='Receipt'
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }     
        if (RequestData && RequestData.method &&  RequestData.method =='put') { 
          if(RequestData.data && RequestData.data.discount && RequestData.data.tender_amt){
            if(typeof RequestData.data.discount == 'string' || typeof RequestData.data.tender_amt=='string') {              
                isValidationSuccess=false;        
                clientJSON['error']=  "Invalid Value" //GR[4]  
              }
            } else{
              isValidationSuccess=false;        
              clientJSON['error']= "Invalid Attribute"  
            }     
        } 
      } 
      else if(RequestData.command=='Cart' ){ //|| RequestData.command=='Receipt'
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        // else if (RequestData && (RequestData.method || !RequestData.method=='post')) { //missing attribut/invalid attribute name
        //   isValidationSuccess=false;        
        //   clientJSON['error']= "Invalid Attribute"          
        // }else if (RequestData  && !RequestData.url){ 
        //   isValidationSuccess=false;
        //     clientJSON['error']="Missing Attribute(s)" //GR[3]
         
        // }else if (RequestData  && !urlReg.test(RequestData.url)){ 
        //   isValidationSuccess=false;
        //   clientJSON['error']=  "Invalid Value" //GR[5]  
        // }      
       
      } 
      else if(RequestData.command=='productDetail' ){ 
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        else if (RequestData && (RequestData.method  && !RequestData.method=='get')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
         
       
      }
      else if(RequestData.command=="CustomerToSale"){
        //missing attributes
            if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
              isValidationSuccess=false;    
              clientJSON['error']= "Invalid Attribute"
              
            }    
            else if (RequestData && !RequestData.email) { //missing email
              isValidationSuccess=false;    
              clientJSON['error']=  "Missing Attribute(s)"              
            }
            else if (!(emailReg.test(RequestData.email))) { //invalid Email
              {
                isValidationSuccess=false;    
                clientJSON['error']=  "Invalid Value"
                
              }
            }
            // else if (notFound) {   // if Customer data not found
            //   clientJSON = {
            //     command: "CustomerToSale",
            //     version:"1.0",
            //     method: "get",
            //     status: 406,
            //     error: 'No customer found in sale'    
            //   }

            // }
      } 
      else if(RequestData.command=='Payment' ){ 
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
          if(RequestData.method=='post')
          {
              if (RequestData && (RequestData.method  && 
                ( !RequestData.data || !RequestData.data.payment_type || !RequestData.data.payment_type.name ) )) { //missing attribut/invalid attribute name
                isValidationSuccess=false;        
                clientJSON['error']= "Invalid Attribute"          
              }
              else if (RequestData && RequestData.data && !RequestData.data.payment_type.data  ) { 
                isValidationSuccess=false;        
                clientJSON['error']= "Invalid Attribute"          
              }
              else if (RequestData  && !RequestData.data.payment_type.data.amt  ) { 
                isValidationSuccess=false;        
                clientJSON['error']= "Invalid Attribute"          
              }
          }else if(RequestData.method=='get'){
            if( !RequestData.order_id){              
              isValidationSuccess=false;        
              clientJSON['error']= "Invalid Command" //GR[2]
            }
          }else{
            isValidationSuccess=false;        
            clientJSON['error']= "Invalid Attribute" 
          }
      }
      else if(RequestData.command=='rawProductData' ){ 
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        else if (RequestData && (RequestData.method  && !RequestData.method=='get')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }  
        else if (RequestData && (RequestData.method  && (!RequestData.product_id || RequestData.product_id==null))) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Missing Value"  //GR[6]          
        }         
       
      }
      else if(RequestData.command=='cartDiscount' ){ 
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        else if (RequestData && (RequestData.method  && RequestData.method=='get')){
              //NOTHING
        }else{
            if (RequestData && (RequestData.method  && !RequestData.method=='post')) { //missing attribut/invalid attribute name
                    isValidationSuccess=false;        
                    clientJSON['error']= "Invalid Attribute"          
                  }  
                  else if (RequestData && (RequestData.method  && (!RequestData.amount_type  || !RequestData.amount))) { //missing attribut/invalid attribute name
                    isValidationSuccess=false;        
                    clientJSON['error']= "Missing Attribute(s)"  //GR[3]          
                  }    
                  else if (RequestData && (RequestData.method  && ( RequestData.amount_type==null || RequestData.amount==null ))) { //missing attribut/invalid attribute name
                    isValidationSuccess=false;        
                    clientJSON['error']= "Invalid Value"  //GR[5]          
                  }   
                  else if (RequestData && (RequestData.method  && isNaN(RequestData.amount))) { //missing attribut/invalid attribute name
                  isValidationSuccess=false;        
                  clientJSON['error']= "Invalid Data Type"  //GR[4]          
                }  
        }
                    
       
      }
      else if(RequestData.command=='cartTaxes' ){ 
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        else if (RequestData && (RequestData.method  && !RequestData.method=='post')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }  
        else if (RequestData && (RequestData.method  && (!RequestData.tax_name  || !RequestData.amount))) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Missing Attribute(s)"  //GR[3]          
        }    
        else if (RequestData && (RequestData.method  && ( RequestData.tax_name==null || RequestData.amount==null ))) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Value"  //GR[5]          
        }   
        else if (RequestData && (RequestData.method  && isNaN(RequestData.amount))) { //missing attribut/invalid attribute name
         isValidationSuccess=false;        
         clientJSON['error']= "Invalid Data Type"  //GR[4]          
       }               
       else if (RequestData && parseInt(RequestData.amount)>=100) { 
        isValidationSuccess=false;        
        clientJSON['error']= "Invalid Value-amount must be < 100 %"  //GR[5]          
      }  
      } 
      else if(RequestData.command=='addProductToCart' ){ 
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        else if (RequestData && (RequestData.method  && !RequestData.method=='post')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }  
        else if (RequestData && (RequestData.method  && (!RequestData.product_id  || !RequestData.product_name || !RequestData.quantity || !RequestData.total_price))) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Missing Attribute(s)"  //GR[3]          
        }    
        else if (RequestData && (RequestData.method  && (RequestData.product_id==null || RequestData.total_price==null || RequestData.quantity==null ))) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Value"  //GR[5]          
        }   
        else if (RequestData && (RequestData.method  && isNaN(RequestData.total_price))) { 
         isValidationSuccess=false;        
         clientJSON['error']= "Invalid Data Type"  //GR[4]          
       }               
      
      }  
      else if(RequestData.command=='productPriceUpdate' ){ 
        if (RequestData && (!RequestData.method  || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
      }
      else if (RequestData.command == 'Notes') {
        if (RequestData && !RequestData.method ) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
        else if (RequestData.method == 'put' || RequestData.method == 'post') {
          if (RequestData && RequestData && (RequestData.title == null || RequestData.title == '')) {
    
            isValidationSuccess = false;
            clientJSON['error'] = "Missing attribute" //GR[3] 
          }
          //  else if (RequestData && RequestData && (RequestData.description == null || RequestData.description == '')) {
    
          //   isValidationSuccess = false;
          //   clientJSON['error'] = "Missing attribute" //GR[3] 
          // }
        }
        else {
          if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Method"
          }
          else if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) { // missing commond and invalid
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Command" //GR[4]
          }
        }
      } else if (RequestData.command == 'lockEnvironment') {
        if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
          isValidationSuccess = false;
          clientJSON['error'] = "Invalid Attribute"
        }
        else if (RequestData && (RequestData.method == 'post' || RequestData.method == 'get')) {
          if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) {
            isValidationSuccess = false;
            clientJSON['error'] = "Invalid Command" //GR[2]
          }
          else if (RequestData && RequestData &&  RequestData.method == 'post' && (RequestData.state == null || RequestData.state == '')) {
            isValidationSuccess = false;
            clientJSON['error'] = "Missing Attribute - State" //GR[4]
          }
        }
      }  
      else if(RequestData.command=='Environment' ){ 
        if (RequestData && (!RequestData.method  || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
          isValidationSuccess=false;        
          clientJSON['error']= "Invalid Attribute"          
        }
      }
     
      else{// no command found
        isValidationSuccess=false;        
        clientJSON['error']=  "Invalid Value" //GR[5]          
      }             
        return {isValidationSuccess,clientJSON};
  }
  
  //Print the app data on the exsting receit
  export const  DataToReceipt = (RequestData,whereToview,isbackgroudApp) => {
    var clientJSON = ""
     
   var validationResponse= validateRequest(RequestData) 

   if(validationResponse.isValidationSuccess==false){
        clientJSON=validationResponse.clientJSON;
   }
    else {    
     clientJSON= {
      command: RequestData.command,
      version:"1.0",
      method: RequestData.method,
      status: 200,
      error: null
      }
       
    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
     
      // if(isbackgroudApp==true)
      //   TriggerCallBack("product-detail",clientJSON);
      // else
        postmessage(clientJSON)

      if(validationResponse.isValidationSuccess==false)
      return null;
      else return RequestData;
    }
    
  }
  //Print new receipt with app data only
  export const  PrintReceiptWithAppData = (RequestData,whereToview,isbackgroudApp) => {
    var clientJSON = ""
     
   var validationResponse= validateRequest(RequestData) 

   if(validationResponse.isValidationSuccess==false){
        clientJSON=validationResponse.clientJSON;
   }
    else {
     

     clientJSON= {
      command: RequestData.command,
      version:"1.0",
      method: RequestData.method,
      status: 200,
      error: null
      }
      //call print function
      PrintAppData.Print(RequestData);
    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
      // if(isbackgroudApp==true)
      //   TriggerCallBack("product-detail",clientJSON);
      // else
        postmessage(clientJSON)  
    }
    
  }

  //**** Cart Value handle**************
   //send the cart information tp app
    export const  handleCartValue = (RequestData,isbackgroudApp) => {
      var clientJSON = ""
       
     var validationResponse= validateRequest(RequestData) 
  
     if(validationResponse.isValidationSuccess==false){
          clientJSON=validationResponse.clientJSON;
     }
      else {
        var checklist=JSON.parse(localStorage.getItem("CHECKLIST"));
        var clientDetail=JSON.parse(localStorage.getItem("clientDetail"));
        var tenderAmt= $('#my-input').val()
       clientJSON= {
              command: RequestData.command,
              version:"1.0",
              method: RequestData.method,
              status: 200,
              error: null,
              data: {
                sub_total: checklist && checklist.subTotal,
                total_tax: checklist && checklist.tax,
                discount: checklist && checklist.discountCalculated,
                balance: checklist && checklist.totalPrice,
                tender_amt: tenderAmt && tenderAmt,
                currency: clientDetail && clientDetail.currency
            }        
        }       
      }
      // const { single_cutomer_list } = this.props
      if (clientJSON !== "") {
      //   if(isbackgroudApp==true)
      //   TriggerCallBack("product-detail",clientJSON);
      // else
        postmessage(clientJSON)
      }
      
    }
    export const  handleCart = (RequestData,isbackgroudApp) => {
      var clientJSON = ""
       
     var validationResponse= validateRequest(RequestData) 
  
     if(validationResponse.isValidationSuccess==false){
          clientJSON=validationResponse.clientJSON;
     }
      else {
        var checklist=JSON.parse(localStorage.getItem("CHECKLIST"));
        //var clientDetail=JSON.parse(localStorage.getItem("clientDetail"));

       clientJSON= {
              command: RequestData.command,
              version:"1.0",
              method: RequestData.method,
              status: 200,
              error: null,             
        }       
        if(  RequestData.method=='get'){
          var items={"items" :checklist && checklist.ListItem}
          console.log("items",items.items)
          items  && items.items && items.items.map(itm=>{
            delete itm.line_item_id;
            delete itm.after_discount;
            delete itm.cart_after_discount;
            delete itm.cart_discount_amount;
            delete itm.product_after_discount;
            delete itm.product_discount_amount;
            delete itm.old_price;
            delete itm.ticket_status;
            delete itm.ticket_info;
            delete itm.product_ticket;
            delete itm.discount_type;
            delete itm.tcForSeating;
            delete itm.Type;
            delete itm.ManagingStock;
          })

          clientJSON['data']=items;
        } 
      }
      // const { single_cutomer_list } = this.props
      if (clientJSON !== "") {
          // if(isbackgroudApp==true)
          //   TriggerCallBack("product-detail",clientJSON);
          // else
            postmessage(clientJSON)   
      }
      
    }

//************ Customer's Apps  handlers*/
export const  sendCustomerDetail = (RequestData,isbackgroudApp) => {  
  var validationResponse= validateRequest(RequestData) 
  if(validationResponse.isValidationSuccess==false){
    
    // if(isbackgroudApp==true)
    //   TriggerCallBack("product-detail",validationResponse.clientJSON);
    // else
    postmessage(validationResponse.clientJSON);
  }else{

    var UID = get_UDid('UDID');
     store.dispatch(customerActions.filteredList(UID,  Config.key.CUSTOMER_PAGE_SIZE, RequestData.email))
  }
 
}

export const  handleCustomer = (RequestData,isbackgroudApp) => {
  var clientJSON = ""
   
 var validationResponse= validateRequest(RequestData) 

 if(validationResponse.isValidationSuccess==false){
      clientJSON=validationResponse.clientJSON;
 }
  else {
   // addExtensionCustomer(RequestData.data);
    var UID = get_UDid('UDID');
    var data={};
    if (RequestData.data) {        
      data['udid'] = UID
      data['WPId'] = ''
      data['FirstName']= RequestData.data.first_name,
      data['LastName']= RequestData.data.last_name,
      data['Contact']= RequestData.data.phone_number,
      data['startAmount']= 0,
      data['Email']= RequestData.data.email,
      data['Pincode']= RequestData.data.postal_code,
      data['City']= RequestData.data.city,
      data['Country']= RequestData.data.country,
      data['State']=RequestData.data.state,      
      data['StreetAddress'] =RequestData.data.address_line_one
      data['StreetAddress2'] = RequestData.data.address_line_two
      data['notes'] = RequestData.data.notes
    }
  if(RequestData.method=="post"){
    store.dispatch(customerActions.save(data, 'create'));
  }else if(RequestData.method=="put"){
    store.dispatch(customerActions.update(data, 'update'));
  }else if(RequestData.method=="delete"){
    var Cust_ID=RequestData.email;
    store.dispatch(customerActions.Delete(Cust_ID, UID));        
  }
  
     
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    // TriggerCallBack("product-detail",clientJSON);
    // else
      postmessage(clientJSON) 
  }


  // var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
  // var _user = JSON.parse(localStorage.getItem("user"));
  // iframex.postMessage(JSON.stringify(clientJSON), '*');
}

export const  CustomerToSale = (RequestData,isbackgroudApp) => {  
  var clientJSON = ""   
  var validationResponse= validateRequest(RequestData) 
  if(validationResponse.isValidationSuccess==false){
    clientJSON=validationResponse.clientJSON;
  }
  else {
    
    var UID = get_UDid('UDID');
    var data={};
    if (RequestData.email) {        
      data['udid'] = UID
      data['WPId'] = ''
      // data['FirstName']= RequestData.data.first_name &&  RequestData.data.first_name
      // data['LastName']= RequestData.data.last_name && RequestData.data.last_name
      // data['Contact']=  RequestData.data.phone_number && RequestData.data.phone_number
      // data['startAmount']= 0
      data['Email']= RequestData.email
      // data['Pincode']= RequestData.data.postal_code && RequestData.data.postal_code
      // data['City']= RequestData.data.city && RequestData.data.city
      // data['Country']= RequestData.data.country && RequestData.data.country
      // data['State']= RequestData.data.state && RequestData.data.state     
      // data['StreetAddress'] =RequestData.data.address_line_one && RequestData.data.address_line_one
      // data['StreetAddress2'] = RequestData.data.address_line_two && RequestData.data.address_line_two
      // data['notes'] = RequestData.data.notes && RequestData.data.notes
    }
      if(RequestData.method=="post"){
        var url = '/checkout';
        sessionStorage.setItem("backurl", url);
        // window.location = '/customerview'
        sessionStorage.setItem("handleApps", true);
        store.dispatch(customerActions.save(data, 'create'));
      }

  }
  
}
export const retrieveCustomerInSale = (RequestData,isbackgroudApp) => {
  var checkoutList= localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));
     
  var clientJSON = ""
  var notFound = false;  
  //missing attributes
   if (checkoutList && (!checkoutList.customerDetail  || !checkoutList.customerDetail.content)){   // if Customer data not found
    clientJSON = {
      command: "CustomerInSale",
      version:"1.0",
      method: "get",
      status: 406,       
      error: 'No customer found in sale'    
    }

  }
  else {
    var customer=  checkoutList.customerDetail.content;
    var address= customer && customer.customerAddress && customer.customerAddress.find(i=>(i.TypeName== "billing"))
    //var address= customerAddress && customerAddress.length && customerAddress.length>0 && customerAddress[0]
    clientJSON = {
      command: "CustomerInSale",
      version:"1.0",
      method: "get",
      status: 200,
      data: {
        first_name:customer.FirstName,
        last_name: customer.LastName,
        email: customer.Email,
        address_line_one:address && address.Address1 ,
        address_line_two: address && address.Address2,
        country: address && address.Country,
        state: address && address.State,
        city: address && address.City,
        postal_code: address && address.PostCode,
        notes:customer. null
      },
      error: null
    }
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    // TriggerCallBack("product-detail",clientJSON);
    // else
      postmessage(clientJSON) 
  }


}
//** End Customer Handler */
  

// *** Product Detail ***************
export const  productDetail = (RequestData,isbackgroudApp) => {
  var clientJSON = ""
   
 var validationResponse= validateRequest(RequestData) 

 if(validationResponse.isValidationSuccess==false){
      clientJSON=validationResponse.clientJSON;
 }
  else {    
    var selectedProduct= JSON.parse(localStorage.getItem("productSelected"));
    if(selectedProduct)
    {
    var ProductMetaJson= ({"MetaData":JSON.parse(selectedProduct.ProductMetaJson),
                          "Price":selectedProduct.Price,
                          "addons_meta_data":selectedProduct.addons_meta_data?selectedProduct.addons_meta_data:""
                        });
                        //addons_meta_data : for sending wocommerce to show selected attribute when edit the product from cart
      
    console.log("ProductMetas",ProductMetaJson);
   clientJSON= {
    command: RequestData.command,
    version:"1.0",
    method: RequestData.method,
    status: 200,
    error: null,
    data:  ProductMetaJson
    }
     
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    // TriggerCallBack("product-detail",clientJSON);
    // else
      postmessage(clientJSON) 
   
  }
}
  
}
// *** Payment Detail ***************
export const  payfromApp = (RequestData,isbackgroudApp) => {
  var clientJSON = ""
   
 var validationResponse= validateRequest(RequestData) 

 if(validationResponse.isValidationSuccess==false){
      clientJSON=validationResponse.clientJSON;
       postmessage(clientJSON) 
 }  
  else{
    if(RequestData.method=='post')  //for payment through APP
     {
        return 'app_do_payment'   //on checkout we check this value and process according
     }
    else if(RequestData.method=='get'){     
      var UID = get_UDid('UDID');
      store.dispatch(activityActions.getDetail(RequestData.order_id, UID));     
      setTimeout(() => {
         const state = store.getState();
         console.log("state",state)
         if(state.single_Order_list &&  state.single_Order_list.items  && state.single_Order_list.items.content){
           var _order=state.single_Order_list && state.single_Order_list.items.content;
          clientJSON= {
            command: RequestData.command,
            version:"1.0",
            method: RequestData.method,
            status: 200,
            error: null,
            total_amount: _order.total_amount,
            //data: JSON.stringify(order_payments)
            payments: _order.order_payments ?_order.order_payments:[]
            }

            postmessage(clientJSON) ;
         }
      }, 1000);
     
    }
      
  } 
}

export const  rawProductData = (RequestData,isbackgroudApp) => {
  var clientJSON = ""
   
 var validationResponse= validateRequest(RequestData) 

 if(validationResponse.isValidationSuccess==false){
      clientJSON=validationResponse.clientJSON;
       postmessage(clientJSON) 
 }  
  else{
    var idbKeyval = FetchIndexDB.fetchIndexDb();
    idbKeyval.get('ProductList').then(val => {
        if (!val || val.length == 0 || val == null || val == "") {
          //do nothing
         
        }
        else {
           var item= val.find(item =>(item.WPID==RequestData.product_id)) 
           console.log("item",item)
           clientJSON= {
            command: RequestData.command,
            version:"1.0",
            method: RequestData.method,
           }
           if(!item ){
            clientJSON['status']= 406;
            clientJSON['error']= 'No data found'            
              
           }else{
              clientJSON['status'] =200;
              clientJSON['error']= null;          
              clientJSON['data']= JSON.stringify(item);            
           }
           postmessage(clientJSON) 

        }
    });
      
  } 
}

export const addCartDiscount=(RequestData,isbackgroudApp,whereToview)=>{
  if(whereToview !=='CheckoutView'){
    return;
  }
  var clientJSON = ""
  var validationResponse= validateRequest(RequestData) 

  if(validationResponse.isValidationSuccess==false){
        clientJSON=validationResponse.clientJSON;
     return   postmessage(clientJSON) 
  }  
 if(RequestData.method=='get'){
  
clientJSON= {
  command: RequestData.command,
  version:"1.0",
  method: RequestData.method,
  status_code: 200,
  error: null
 }
  const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';
 
    if (CartDiscountAmount  && CartDiscountAmount !=="") {
      clientJSON['discount_name']="";
      clientJSON['amount']=CartDiscountAmount.discount_amount;
      if (CartDiscountAmount.discountType.toLowerCase() == "number" || CartDiscountAmount.discountType.toLowerCase() == "$") {
        clientJSON['amount_type']="$";
        } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" || CartDiscountAmount.discountType.toLowerCase() == "%"){
          clientJSON['amount_type']="%";
        }
     
  } else{
    clientJSON['status_code'] = 406,
    clientJSON['error']= 'No discount applied'
  }
  postmessage(clientJSON)     
 }
else{
   try { 
    var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
    const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';
    var subTotal = checkList && checkList.subTotal;
    var previousCartDiscount = 0;
    var product_after_discount = 0;
    var totalPrice = 0;
    var discount_amount = 0;
    var status = false;
    var discount_type = RequestData && RequestData.amount_type  && RequestData.amount_type=='%'?'percent': RequestData.amount_type=='$'? 'number':'number';
            cartproductlist && cartproductlist.map((item, index) => {
                product_after_discount += parseFloat(item.product_discount_amount);
                if (item.product_id) {//donothing
                    totalPrice += item.Price
                }
            })

            if (CartDiscountAmount ) {
                if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "percent") {
                    previousCartDiscount = percentage(CartDiscountAmount.discount_amount, totalPrice - product_after_discount)
                } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" && discount_type == "number") {
                    previousCartDiscount = number(CartDiscountAmount.discount_amount, subTotal - product_after_discount)
                } else if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "number") {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                } else {
                    previousCartDiscount = CartDiscountAmount.discount_amount;
                }
            }
    discount_amount = RequestData && RequestData.amount ? parseFloat(RequestData.amount) + parseFloat(previousCartDiscount) : 0;
    if (discount_type == "percent") {
        if (discount_amount > 100) {
            status = true
            setTimeout(function () {
                showModal('no_discount');
            }, 100)
        }
    }
    if (discount_type == "number") {
        if (discount_amount > totalPrice) {
            status = true
            setTimeout(function () {
                showModal('no_discount');
            }, 100)
        }
    }
  
    if (status == false) {
      var cart = {
          type: 'card',
          discountType: RequestData && RequestData.amount_type ? RequestData.amount_type == "%" ? "Percentage" : "Number" : "Number",
          discount_amount: parseFloat(RequestData.amount) + parseFloat(previousCartDiscount),
          Tax_rate: 0
      }
      
        localStorage.setItem("CART", JSON.stringify(cart))
        store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
        setTimeout(() => {
          var _price = 0;
          var _tax = 0;
          var _discount = 0;
          var _incltax = 0;
          var _excltax = 0;
          var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
          checkList.ListItem=cartproductlist;
          checkList.ListItem.map(items => {
            if (items.Price) {
                _price += parseFloat(items.Price);
                _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                _discount += parseFloat(items.discount_amount);
                _incltax += parseFloat(items.incl_tax);
                _excltax += parseFloat(items.excl_tax)
            }
        })

        const CheckoutList = {
            ListItem: checkList.ListItem,
            customerDetail: checkList.customerDetail,
            totalPrice: (_price + _excltax) - _discount,
            discountCalculated: _discount,
            tax: _tax,
            subTotal: _price - _discount,
            TaxId: checkList.TaxId,
            order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
            showTaxStaus: checkList.showTaxStaus,
            _wc_points_redeemed: checkList._wc_points_redeemed,
            _wc_amount_redeemed: checkList._wc_amount_redeemed,
            _wc_points_logged_redemption: checkList._wc_points_logged_redemption
        }
          localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));       
          store.dispatch(checkoutActions.getAll(CheckoutList));            
            clientJSON= {
              command: RequestData.command,
              version:"1.0",
              method: RequestData.method,
              status_code: 200,
              error: null
             }
             postmessage(clientJSON) 
         
        }, 500);
       
          return "app-modificaiton-external"
       
        
    }
  } catch (error) {
    console.error('App Error : ', error);
  }
}
 
}

export const cartTaxes=(RequestData,isbackgroudApp)=>{
  var clientJSON = ""
  var validationResponse= validateRequest(RequestData) 

  if(validationResponse.isValidationSuccess==false){
        clientJSON=validationResponse.clientJSON;
     return   postmessage(clientJSON) 
  }  

   // $('div .dropup').addClass('open');
   // var taxRateList = this.state.taxRateList && this.state.taxRateList.length > 0 ? this.state.taxRateList : [];
   var taxRateList = localStorage.getItem('TAXT_RATE_LIST')? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')):[]
   var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
  
    var _newtaxRate={
      check_is: true,
      TaxRate: RequestData.amount,
      TaxName: RequestData.tax_name,
      TaxId: '',
      Country: '',
      State: '',
      TaxClass: ''
  }
    if (taxRateList.length == 0) {
        taxRateList.push(_newtaxRate)
    } else {
        var FindId = taxRateList.find(isName => isName.TaxName === RequestData.tax_name);
        if (FindId) {
            taxRateList.map(item => {
                if (item.TaxId == FindId.TaxId) {
                    item['check_is'] =true; //FindId.check_is == true ? false : true
                }
            })
        } else {
            taxRateList.push(_newtaxRate)
        }
     }
    
    var updateTaxCarproduct = changeTaxRate(taxRateList, 1);
   store.dispatch(cartProductActions.updateTaxRateList(taxRateList));
   store.dispatch(cartProductActions.addtoCartProduct(updateTaxCarproduct));
  console.log("TAXT_RATE_LIST", localStorage.getItem("TAXT_RATE_LIST"))
  setTimeout(() => {
          var _price = 0;
          var _tax = 0;
          var _discount = 0;
          var _incltax = 0;
          var _excltax = 0;
          //var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
          checkList.ListItem=updateTaxCarproduct;
          checkList.ListItem.map(items => {
            if (items.Price) {
                _price += parseFloat(items.Price);
                _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                _discount += parseFloat(items.discount_amount);
                _incltax += parseFloat(items.incl_tax);
                _excltax += parseFloat(items.excl_tax)
            }
        })
        const CheckoutList = {
          ListItem: checkList.ListItem,
          customerDetail: checkList.customerDetail,
          totalPrice: (_price + _excltax) - _discount,
          discountCalculated: _discount,
          tax: _tax,
          subTotal: _price - _discount,
          TaxId: checkList.TaxId,
          order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
          showTaxStaus: checkList.showTaxStaus,
          _wc_points_redeemed: checkList._wc_points_redeemed,
          _wc_amount_redeemed: checkList._wc_amount_redeemed,
          _wc_points_logged_redemption: checkList._wc_points_logged_redemption
        }
        localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));   
        store.dispatch(checkoutActions.getAll(CheckoutList));            
          clientJSON= {
            command: RequestData.command,
            version:"1.0",
            method: RequestData.method,
            status_code: 200,
            error: null
          }
          postmessage(clientJSON) 
                  
        }, 500);      
  return "app-modificaiton-external"  
}

export const addProductToCart=(RequestData,isbackgroudApp,whereToview)=>{

  if(whereToview !=='CheckoutView'){
    return;
  }
  var clientJSON = ""
  var validationResponse= validateRequest(RequestData) 

  if(validationResponse.isValidationSuccess==false){
        clientJSON=validationResponse.clientJSON;
     return   postmessage(clientJSON) 
  }  


  //check the requested product exist into the index DB 
  var item;
  
  var idbKeyval = FetchIndexDB.fetchIndexDb();

   idbKeyval.get('ProductList').then(val => {
   
    if (!val || val.length == 0 || val == null || val == "") {
      //do nothing
     
    }
    else {
         var itemarry= val.filter(item =>(item.WPID==RequestData.product_id)) 
         console.log("item",itemarry)
         if(itemarry && itemarry.length>0){
          itemarry=  getTaxAllProduct(itemarry);
          item=itemarry[0];
        }       
      }
    });  
   setTimeout(() => {     
           
   if(item){        
        const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];      
       //
        item["product_id"]=item.WPID
        item["quantity"]=RequestData.quantity;
        item["Price"]= item.Price * RequestData.quantity;
        cartproductlist.push(item)
    
        store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
    
        //checkList.ListItem= cartproductlist ;
      

        setTimeout(() => {
          var _price = 0;
          var _tax = 0;
          var _discount = 0;
          var _incltax = 0;
          var _excltax = 0;
          var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
          var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
          checkList.ListItem=cartproductlist;
          checkList.ListItem.map(items => {
            if (items.Price) {
                _price += parseFloat(items.Price);
                _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
                _discount += parseFloat(items.discount_amount);
                _incltax += parseFloat(items.incl_tax);
                _excltax += parseFloat(items.excl_tax)
            }
        })

        const CheckoutList = {
            ListItem: checkList.ListItem,
            customerDetail: checkList.customerDetail,
            totalPrice: (_price + _excltax) - _discount,
            discountCalculated: _discount,
            tax: _tax,
            subTotal: _price - _discount,
            TaxId: checkList.TaxId,
            order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
            showTaxStaus: checkList.showTaxStaus,
            _wc_points_redeemed: checkList._wc_points_redeemed,
            _wc_amount_redeemed: checkList._wc_amount_redeemed,
            _wc_points_logged_redemption: checkList._wc_points_logged_redemption
        }
        localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));   
        store.dispatch(checkoutActions.getAll(CheckoutList)); 
      }, 700);
       
            
              clientJSON= {
                command: RequestData.command,
                version:"1.0",
                method: RequestData.method,
                status_code: 200,
                error: null
              }
              postmessage(clientJSON) 
       
    }else{
      clientJSON= {
        command: RequestData.command,
        version:"1.0",
        method: RequestData.method,
        status_code: 406,
        error: 'Product not exist!'
      }
      postmessage(clientJSON) 
    }
  }, 100);

   
      return "app-modificaiton-external" 
}

export const Notes = (RequestData,isbackgroudApp,whereToview) => {
  var clientJSON = ""
  if(whereToview !=='CheckoutView'){
    return;
  }
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  } else if (RequestData.method == 'post') {
    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      note_id: RequestData.note_id
    }
   
    var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
    cartlist.push({ "Title": RequestData.title + (RequestData.description? ":"+RequestData.description:"") })

    store.dispatch(cartProductActions.addtoCartProduct(cartlist));
    var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
    if (list != null) {
      // const CheckoutList = {
      //   ListItem: cartlist,
      // }
      list.ListItem=cartlist
      localStorage.setItem('CHECKLIST', JSON.stringify(list))

      setTimeout(() => {
        store.dispatch(checkoutActions.getAll(list)); 
       
      }, 500)
    }
    postmessage(clientJSON)
    return "app-modificaiton-external"
  }  
}
export const Environment = (RequestData,isbackgroudApp,whereToview) => {
  var clientJSON = ""
 
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }else{ 
  
    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      error: null,
      note_id: RequestData.note_id
    }
    
    var registerId = localStorage.getItem('register') ? localStorage.getItem('register')  : null;
    var registerName = localStorage.getItem('registerName') ? localStorage.getItem('registerName')  : null;
    var locationId = localStorage.getItem('Location') ? localStorage.getItem('Location')  : null;
    var LocationName = localStorage.getItem('LocationName') ? localStorage.getItem('LocationName')  : null;
    
    var clientDetails = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : null;
    var pdf_format = localStorage.getItem("pdf_format") ? JSON.parse(localStorage.getItem("pdf_format")) : null;
    clientJSON['Print_size']= pdf_format && pdf_format.length>0 && pdf_format[0].recipt_format_value;
    clientJSON['register_id']=registerId;
    clientJSON['location_data']={location_id: locationId, outlet: LocationName }
  clientJSON['employee_data'] = {admin_id: clientDetails && clientDetails.user_id,
                                designation: clientDetails && clientDetails.user_role}
  }
    postmessage(clientJSON)
 
}
export const lockEnvironment = (RequestData,isbackgroudApp,whereToview) => {
  var clientJSON = ""
 
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }else{ 
  
    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      error: null   
    }
    
   
  }
    
    if(RequestData.method=='get'){
       return "app-get-lock-env" 
    }     
    else {
       postmessage(clientJSON);
        if(RequestData.state=='lock')
        return "app-modificaiton-lock-env" 
        else
        return "app-modificaiton-unlock-env"
       
    } 
}
export const productPriceUpdate = (RequestData,isbackgroudApp,whereToview) => {
  var clientJSON = ""
 
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
    if(RequestData.method=='post'){
       return "product_price_update" 
    }     
    
}
export const sendProductQuantity = (RequestData,isbackgroudApp,whereToview) => {
  var clientJSON = ""
 
  // var validationResponse = validateRequest(RequestData)
  // if (validationResponse.isValidationSuccess == false) {
  //   clientJSON = validationResponse.clientJSON;
  // }
    // if(RequestData.method=='post'){
    //    return "product_price_update" 
    // }     
    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      quantity: RequestData.quantity
    }
    postmessage(clientJSON);
}

 export const percentage=(num, per)=> {
  return (parseFloat(num) / 100) * parseFloat(per);
}

export const number=(num, per)=> {
  return parseFloat(num) * 100 / parseFloat(per);
}



export const postClientExtensionResponse=(method,isSuccess,message,command="Customers",data="")=>{
  var _method=command=="CustomerDetails"?'get':
              method=='save'?'post':
              method=='update'?'put':
              method=='delete'?'delete': 'get'

 var clientJSON = {
    command: command ,
    version:"1.0",
    method: _method,
    status: isSuccess==true? 200:406,      
    error: isSuccess==true? null:message    
  } 
  if(isSuccess==true && data !==""){
    clientJSON['data']=data
  }
  postmessage(clientJSON);
     
}
//export const checkStoreValue()

// Product Detail end****************
export const CloseExtension=()=>{
  hideModal('common_ext_popup');   
}