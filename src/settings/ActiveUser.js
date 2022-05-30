var _user= '';
var _tempOrder='';
var CurrentUserActive ='';
var currentTempOrderId='';
var cash_rounding= '';
var register_id = '';
var register_name = '';
var location_id = '';
var location_name='';
var orderRecieptFormate = '';
var firebaseStaffName = localStorage.getItem('firebaseStaffName') ? localStorage.getItem('firebaseStaffName') : 'Another User'

var _isSelfcheckout= localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem('selectedRegister')).IsSelfCheckout : null;

const pdfFormate = () => {
    var pdfFormateSize = '';
    var pdfFormnateName= localStorage.getItem('pdf_format') && JSON.parse(localStorage.getItem('pdf_format')) ? JSON.parse(localStorage.getItem('pdf_format'))[0]:'';
    if(pdfFormnateName){
    if(pdfFormnateName.recipt_format_code == 'letterhead'){
      pdfFormateSize = {
        width: '210mm', height:'297mm'
      }
    }
    
    if(pdfFormnateName.recipt_format_code == 'a4'){
      return pdfFormateSize = {
        width: '215mm', height:'280mm'
      }
    }
     if(pdfFormnateName.recipt_format_code == '80mm'){
        return  pdfFormateSize = {
          width:  pdfFormnateName.recipt_format_value, height:'0 auto'
        }
      }
    if(pdfFormnateName.recipt_format_code == '52mm' || pdfFormnateName.recipt_format_code == '58mm'){
       return pdfFormateSize = {
          width: pdfFormnateName.recipt_format_value, height:'0 auto'
        }
      }
      }else{
        return pdfFormateSize = {
          width: '800px', height:'0 auto'
        }
      }
      return pdfFormateSize;
  }

if(typeof window !== 'undefined')
{
     _user= localStorage.getItem('user')?localStorage.getItem('user'):null;
     _tempOrder=localStorage.getItem('tempOrder_Id');

        if( _user &&(typeof _user !=='undefined') && _user!==null && _user !==''  )
        {
            CurrentUserActive= JSON.parse(_user) ;    
        }
        if( _tempOrder && (typeof _tempOrder !=='undefined') && _tempOrder!==null && _tempOrder !=='')
        {
        currentTempOrderId= JSON.parse(_tempOrder) ; 
        }
        
         cash_rounding = localStorage.getItem('CASH_ROUNDING') ? localStorage.getItem('CASH_ROUNDING') : '';
         register_id = localStorage.getItem('register') ? localStorage.getItem('register') : '';
         register_name = localStorage.getItem('registerName') ? localStorage.getItem('registerName') : '';
         location_id = localStorage.getItem('Location') ? localStorage.getItem('Location') : '';
         location_name = localStorage.getItem('LocationName') ? localStorage.getItem('LocationName') : '';
         orderRecieptFormate = localStorage.getItem('orderreciept') 
                              && typeof(localStorage.getItem('orderreciept')) !=='undefined'
                              && localStorage.getItem('orderreciept') !=='undefined'? JSON.parse(localStorage.getItem('orderreciept')) : '';
}

const recieptDateFormate = () => {
  //console.log("orderRecieptFormate", orderRecieptFormate)
  var recieptDateFormate = orderRecieptFormate ? orderRecieptFormate.DateFormat : 'DD, MMMM YYYY';
  //04 Feb 2020
  if(recieptDateFormate == "dd MMM yyyy" || recieptDateFormate == "dd MMM YYYY"){
       return 'DD MMM YYYY'
  }
  //2020 Feb 04
  else
  if(recieptDateFormate == "yyyy MMM dd" || recieptDateFormate == "YYYY MMM dd"){
      return 'YYYY MMM DD'
  }
  //2020-02-04
  else
  if(recieptDateFormate == "yyyy-MM-dd" || recieptDateFormate == "YYYY-MM-dd"){
     return 'YYYY-MM-DD'
  }
  //02-04-2020
  else
  if(recieptDateFormate == "MM-dd-yyyy" || recieptDateFormate == "MM-dd-YYYY"){
    return 'MM-DD-YYYY'
  } 
  //2020/02/04
  else
  if(recieptDateFormate == "yyyy/MM/dd" || recieptDateFormate == "YYYY/MM/dd"){
    return 'YYYY/MM/DD'
  }
 
  //02/04/2020
  else
  if(recieptDateFormate == "MM/dd/yyyy" || recieptDateFormate == " "){
    return 'MM/DD/YYYY'
  }
  else
  {
    return 'DD, MMMM YYYY'
  }
}

const recieptTimeFormate = () => {
  var recieptDateFormate = orderRecieptFormate ? orderRecieptFormate.TimeFormat : 'h:mm a';
  //01:53:43 AM
  if(recieptDateFormate == "hh:mm:ss tt" || recieptDateFormate == "hh:mm:ss A") {
       return 'hh:mm:ss A'
  }
  //01:53:43
  else
  if(recieptDateFormate == "HH:mm:ss") {
      return 'HH:mm:ss'
  }
  //01:53 AM
  else
  if(recieptDateFormate == "hh:mm tt" || recieptDateFormate == "hh:mm A") {
     return 'hh:mm A'
  }
  //01:53
  else
  if(recieptDateFormate == "HH:mm") {
    return 'HH:mm'
  } 
  else
  {
    return 'h:mm a'
  }
}
const companyLogo = () => {
  var IMAGE_DOMAIN  ="https://"+ (process.env.ENVIRONMENT=='production'?'app.oliverpos.com' :process.env.ENVIRONMENT=='development'?'qa1.app.olivertest.com':'dev1.app.olivertest.com');
  var _logUrl =localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).shop_logo;
  var _companyLogo=_logUrl ? IMAGE_DOMAIN+ _logUrl : null;
  return _companyLogo
}

const firebasePopupDetails = {
  FIREBASE_POPUP_TITLE : 'Register Already In Use.',
  FIREBASE_POPUP_SUBTITLE : `${localStorage.getItem('firebaseStaffName')?localStorage.getItem('firebaseStaffName') :'Another User'} is now logged into this register.`,
  FIREBASE_POPUP_SUBTITLE_TWO: `To overtake this register, please login again.`,
  FIREBASE_BUTTON_TITLE : 'Back To login'
}

exports.key = {
    Email: CurrentUserActive && CurrentUserActive !== '' ? CurrentUserActive.user_email : '',
    NewTempOrderId: currentTempOrderId && currentTempOrderId !== '' ? currentTempOrderId : '',
    cash_rounding:  cash_rounding && cash_rounding !== '' ? cash_rounding : 0,
    RegisterId: register_id,
    ManagerId: CurrentUserActive && CurrentUserActive !== '' ? CurrentUserActive.user_id : '',
    ManagerName: CurrentUserActive && CurrentUserActive !== '' ? (CurrentUserActive.display_name !== " " && CurrentUserActive.display_name !== 'undefined') ? CurrentUserActive.display_name : CurrentUserActive.user_email : '',
    RegisterName: register_name && register_name !== '' ? register_name : '',
    LocationId: location_id && location_id !== '' ? location_id : '',
    LocationName: location_name && location_name !== '' ? location_name : '',
    pdfFormate:pdfFormate(),
    orderRecieptDateFormate : recieptDateFormate(),
    orderRecieptTimeFormate : recieptTimeFormate(),
    isSelfcheckout:_isSelfcheckout,
    companyLogo:companyLogo(),
    firebasePopupDetails : firebasePopupDetails
}   




