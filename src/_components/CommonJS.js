import React from 'react';
import { isMobileOnly,isSafari,isMobileSafari, isAndroid } from "react-device-detect";
import { history, store } from '../_helpers'
import { log_out } from '../firebase/Notifications'
import Config from '../Config'
import ActiveUser from '../settings/ActiveUser';
import { checkoutActions, CheckoutViewFirst } from '../CheckoutPage';
import { get_UDid } from '../ALL_localstorage';
import { showSelectedProduct } from '../_reducers/cartProduct.reducer';

export const productxRender = (Obj, productlist) => {
    console.log("productxRender", Obj, productlist);
    var customProductxField = new Array();
    Object.keys(Obj).map(i => {
        var findProductValue = productlist.filter(_item => ((_item.WPID == Obj[i].product_id) && Obj[i].quantity > 0));
        if (findProductValue && findProductValue.length > 0) {
            customProductxField.push(findProductValue[0].Title);
        }
    })
    if (customProductxField && customProductxField.length > 0) {
        console.log("customProductxField", customProductxField);
        customProductxField = productRetrunDiv(customProductxField)
    }
    return customProductxField;

}

export const productRetrunDiv = (subproductlist) => {
    var sub_title = '';
    subproductlist.map((value, index) => {
        sub_title = sub_title + (index !== 0 ? ", " : "") + value;
    })
    return (
        (isMobileOnly == true) ?
            <div className="font-italic">{sub_title}</div>
            :
            <span className="comman_subtitle">{sub_title}</span>
    )

}

export const productxArray = (product_id, productlist) => {
    var productxTagsField = localStorage.getItem('PRODUCTX_DATA') && JSON.parse(localStorage.getItem('PRODUCTX_DATA'));
    var obj = "";
    console.log("productxTagsField", productxTagsField)
    productxTagsField.map(prdx => {
        if (prdx.product_id == product_id) {
            if (prdx.composite_data) {
                obj = productxRender(prdx.composite_data, productlist);
            }
            if (prdx.stamp) {
                console.log("prdx.stamp", prdx.stamp);
                obj = productxRender(prdx.stamp, productlist);
            }
        }
    })
    return obj;
}

export const showTitle = (item) => {
    if (item.bundle_product_key == "" && item.bundled_parent_key == "" && item.composite_product_key == "" && item.composite_parent_key == "") {
        // console.log("main", item.name);
        return item.name;
    }
    else if (item.bundle_product_key && item.bundled_parent_key == "" && item.composite_product_key == "" && item.composite_parent_key == "") {
        return item.name;
        // console.log("bundle_parent", item.name);
    }
    else if (item.composite_product_key && item.composite_parent_key == "" && item.bundle_product_key == "" && item.bundled_parent_key == "") {
        // console.log("composite_parent", item.name);
        return item.name;
    }
}

export const showSubTitle = (item) => {
    if (item.bundle_product_key && item.bundled_parent_key && item.composite_parent_key == "" && item.composite_product_key == "") {
        // console.log("bundle_child", item.name);
        return item.name;
    }
    else if (item.composite_product_key && item.composite_parent_key && item.bundle_product_key == "" && item.bundled_parent_key == "") {
        // console.log("composite_child", item.name);
        return item.name;
    }
}



export const permissionsForRefund = () => {
    var _allowRefund = false;
    var userLocal = localStorage.getItem("user");
    var userData = JSON.parse(userLocal);
    console.log("userData", userData)
    userData && userData.permissions && userData.permissions.map(perm => {
        if (perm.PermissionKey && perm.PermissionKey == 'IssueRefund' && perm.IsAllow) {
            _allowRefund = true;
        }
        console.log("_allowRefund", _allowRefund);

    })
    return _allowRefund;
}

// Redirect to the URL according to User type like : demoUser 
export const redirectToURL = () => {
    var isDemoUser = localStorage.getItem('demoUser')
    var clientDetail = localStorage.getItem('clientDetail')
    if (isDemoUser == 'true' || !clientDetail) {
        //history.push('/login');
        if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            Android.wrapperLogout();
        }
        else
        {
            history.push("/login");
        }
    } else {
        history.push('/loginpin')

    }

}
// get length of search input 
export const getSearchInputLength = (length) => {
    var val = false
    var productCount=localStorage.getItem("productcount");
    if(productCount && productCount<= Config.key.ALTERNATIVE_PRODUCT_SEARCH_START)
        return true;
    if (length) {
        if (length % 2 == 0) {
            val = true
        }
    }
    return val

}
export const onBackTOLoginBtnClick = () => {
    log_out()
    hideModal('firebaseRegisterAlreadyusedPopup')

}
export const checkForEnvirnmentAndDemoUser = () => {
    let isDemoUser = localStorage.getItem('demoUser')
    //  if ((Config.key.ENV == 'development' || Config.key.ENV == 'dev1') && (isDemoUser !== "true" && isDemoUser !== true)) { // call notification functionality only on dev1 and qa1 (development)
    
    if (isAndroid ==true || isMobileOnly == true){
        return false
    }
    else if ((isDemoUser !== "true" && isDemoUser !== true && (isSafari !== true && isMobileSafari !== true) )) { // call notification functionality only on dev1 and qa1 (development)
        return true
    } else {
        return false
    }
}

export const checkOrderStatus = async (saleOrderId = 0) => {
    var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
    if (TempOrders && TempOrders.length > 0) {
        TempOrders = TempOrders.filter(item => item.new_customer_email === "" && (item.OrderID == 0 || item.Status.toString() == "false" || item.Status.toString() == "failed") && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
        if (TempOrders && TempOrders.length > 0) {
            var sortArr = TempOrders.sort(function (obj1, obj2) {
                return obj1.Index - obj2.Index;
            })
            var _OrderID = sortArr[0].OrderID;
            var syncTempOrderID = sortArr[0].TempOrderID;
            var udid = get_UDid('UDID');

            if (_OrderID == 0 && syncTempOrderID && syncTempOrderID !== '' && syncTempOrderID !== '0') {
                // console.log("checkOrderStatus", syncTempOrderID)
                // this.setState({ isSyncStart: true })
                var orderIdToSync = saleOrderId !== 0 ? saleOrderId : syncTempOrderID
                store.dispatch(checkoutActions.checkTempOrderStatus(udid, orderIdToSync))

            }
        }
    }
}

export const checkForProductXAddons = (productId)=>{
    var productX_data = localStorage.getItem('PRODUCTX_DATA') && JSON.parse(localStorage.getItem('PRODUCTX_DATA'))
    var isAddonsExist = false
        if (productX_data && productId) {
            var data = productX_data && productX_data.find(item => item.product_id == productId)
             isAddonsExist = data && data.addons && data.addons.length > 0  ? true: false
        }
        return isAddonsExist
}

export const getHostURLsBySelectedExt = (ext_id)=>{
    var ext_Payment_Fields = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
        var extension_views_field = ext_Payment_Fields && ext_Payment_Fields.length > 0 && ext_Payment_Fields.filter(item => item.Id == ext_id)
        var ext_host_url = extension_views_field && extension_views_field[0] ? extension_views_field[0].HostUrl : ''
        var ext_page_url = extension_views_field && extension_views_field[0] ? extension_views_field[0].PageUrl : ''
        var ext_name = extension_views_field && extension_views_field[0] ? extension_views_field[0].Name : ''
        var ext_logo = extension_views_field && extension_views_field[0] ? extension_views_field[0].logo : ''
        var data = {
            ext_page_url,
            ext_host_url,
            ext_name,
            ext_logo
        }
        return data
}

export const sendRegisterDetails = (isCheckoutIframe = false)=>{
    var selectedRegister = localStorage.getItem('selectedRegister') ?
     JSON.parse(localStorage.getItem('selectedRegister'))  : 0 
    var registerName = selectedRegister ? selectedRegister.name : ''
    var registerId = selectedRegister ? selectedRegister.id : ''
    var clientJSON =
    {
        oliverpos:
        {
            event: "registerInfo"
        },
        data:
        {
            id: registerId,
            name: registerName
        }
    };

    if (isCheckoutIframe == true) {
        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    } else {

        var iframex = document.getElementById("commoniframe").contentWindow;
    }
    iframex.postMessage(JSON.stringify(clientJSON), '*');
}

export const sendClientsDetails = (isCheckoutIframe = false)=>{
    var clientDetails = localStorage.getItem('clientDetail') ?
     JSON.parse(localStorage.getItem('clientDetail'))  : 0 
    var client_guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : ''
    var clientJSON =
    {
        oliverpos:
        {
            event: "clientInfo"
        },
        data:
        {
            clientGUID: client_guid
        }
    };
    if (isCheckoutIframe == true) {
        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    } else {

        var iframex = document.getElementById("commoniframe").contentWindow;
    }
    iframex.postMessage(JSON.stringify(clientJSON), '*');
}

export const sendTipInfoDetails = (isCheckoutIframe = false)=>{
    var tipData = localStorage.getItem('tipsInfo') ?
     JSON.parse(localStorage.getItem('tipsInfo'))  : []
    var clientJSON =
    {
        oliverpos:
        {
            event: "tipInfo"
        },
        data:
        {
            ...tipData
        }
    };
    if (isCheckoutIframe == true) {
        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    } else {

        var iframex = document.getElementById("commoniframe").contentWindow;
    }
    iframex.postMessage(JSON.stringify(clientJSON), '*');
}
function showAddons(type,addons) {
    var addonsSubTitle = ''
    addons && addons.length>0  && addons.map((itm,index)=>{
    var  json= (type == 'activity'?itm :JSON.parse(itm));
  var ad=json;
    var displayname = [];
    var sub_title='';
    var displayVal =  ad.value;
    var _price= ad.price ? "("+ad.price+"%)"  : "";
    var _displayname = (ad.name ? ad.name: ad.label ? ad.label : ad.key?ad.key:'') +_price + ' - ' + displayVal
    displayname.push(_displayname);
  
    displayname.map((item, index) => {
        sub_title = sub_title + (index !== 0 ? "<br/>" : "") + (item.key? item.key+":"+item.value:  item.toString());
    })
   addonsSubTitle += (isMobileOnly == true) ?
            <div className="font-italic">{sub_title}</div>
            :  sub_title.toString()
    
    addonsSubTitle+="<br/>"
 
  })
  return addonsSubTitle
}

export const CommonJs = {
    productxArray,
    productxRender,
    showTitle,
    showSubTitle,
    permissionsForRefund,
    getSearchInputLength,
    onBackTOLoginBtnClick,
    checkForEnvirnmentAndDemoUser,
    checkOrderStatus,
    checkForProductXAddons,
    getHostURLsBySelectedExt,
    sendClientsDetails,
    sendRegisterDetails,
    showAddons
}

export default CommonJs