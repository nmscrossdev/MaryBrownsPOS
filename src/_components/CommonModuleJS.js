import React from 'react';
import { Markup } from 'interweave';
import { isMobileOnly } from "react-device-detect";
import moment from 'moment';
import ActiveUser from '../settings/ActiveUser';

/**
    * Created By :Shakuntala Jatav
    * @param {*} Obj 
    * @param {*} productlist 
    * Description : Filter title name from product list array and call if productRetrunDiv else return blank array
    */
export const productxRender = (Obj, productlist, setPayment) => {
    var customProductxField = new Array();
    var findProductValue = [];
    var displayname = ''
    var displayVal = ''
    if (Obj.variation_id !== null && Obj.variation_id !== undefined && Obj.variation_id !== 0) {
        findProductValue = productlist && productlist.filter(_item => (_item.WPID == Obj.variation_id));
        if (findProductValue && findProductValue.length > 0) {
            customProductxField=getAddonsField(Obj);
            if(Obj.booking && Obj.booking !== []){
                customProductxField=getBookingField(Obj);
            }
            customProductxField.push(findProductValue[0].Title);
           
        }
    }
    else {
        Object.keys(Obj).map(i => {
            findProductValue = productlist && productlist.filter(_item => (((_item.WPID == Obj[i]))));
            if (findProductValue && findProductValue.length > 0) {
                // customProductxField.push(findProductValue[0].Title); // no need to display title in case of simple
                customProductxField=getAddonsField(Obj);
                if(Obj.booking && Obj.booking !== []){
                    customProductxField=getBookingField(Obj);
                }
               
            }
        })
    }
    if (customProductxField && customProductxField.length > 0 && setPayment !== "setPayment") {
        customProductxField = productRetrunDiv(customProductxField)
    }
    return customProductxField;
}

export const getAddonsField=(Obj)=>{
    var displayname=[];
    Obj.addons && Obj.addons.map((ad) => {
        var urlData="";
        if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(ad.value)) {
             urlData = (ad.value.substring(ad.value.lastIndexOf('/') + 1))// extract last index of url
        }

        // ***   check for booking data start and end date for activity print receipt   *** //
        if(ad.key == '_booking_start' || ad.key == '_booking_end'){
            var dateVal = parseFloat(ad.value)
            var bookingDate = new Date((dateVal))
            urlData = moment.unix(dateVal).format(`${ActiveUser.key.orderRecieptDateFormate}, ${ActiveUser.key.orderRecieptTimeFormate}`);
        }
        // ***  end booking *** //
        
        var displayVal = ad.display ? ad.display : urlData !=''?urlData : ad.value;
         
        var _price= (ad.field_type && ad.field_type != "custom_price") && ad.price ?
                                ad.price_type && ad.price_type=='percentage_based'?  "("+ad.price+"%)"  : "($"+ad.price+")"
                    :"";
         var _displayname = (ad.name ? ad.name: ad.label ? ad.label : ad.key?ad.key:'') +_price + ' - ' + displayVal
         displayname.push(_displayname);
    })
    if((!Obj.addons || Obj.addons.length==0) && Obj.pricing_item_meta_data &&  Obj.pricing_item_meta_data !=""){
       
        displayname.push({"key":"required","value": Obj.pricing_item_meta_data._measurement_needed+ ' '+ Obj.pricing_item_meta_data._measurement_needed_unit});
        displayname.push({"key":"price","value": Obj.pricing_item_meta_data._price});
        displayname.push({"key":"quantity" ,"value": Obj.pricing_item_meta_data._quantity});
    }
    return displayname;
}
export const getBookingField=(Obj)=>{
    var displayname=[];
    var bookingData = Obj && Obj.booking ?  Obj.booking : null
    if(bookingData && bookingData._start_date && bookingData._end_date && bookingData._booking_id){
        // var startDate = new Date((bookingData._start_date)*1000)
        // var endDate = new Date((bookingData._end_date)*1000)
        var startDate = moment.unix(bookingData._start_date).format(`${ActiveUser.key.orderRecieptDateFormate}, ${ActiveUser.key.orderRecieptTimeFormate}`);
        var endDate = moment.unix(bookingData._end_date).format(`${ActiveUser.key.orderRecieptDateFormate}, ${ActiveUser.key.orderRecieptTimeFormate}`);
        //var _displayname = `booking id:${bookingData._booking_id};start date : ${startDate};<br/> end date : ${endDate}`
        //displayname.push(_displayname);s
        displayname.push({"key":"booking id","value":bookingData._booking_id})
        displayname.push({"key":"start date" ,"value": startDate});
        displayname.push({"key":"end date" ,"value": endDate});
       
    }
    return displayname;
}
/**
    * Created By :Shakuntala Jatav
    * @param {*} subproductlist 
    * Description : return div component for mobile view and web view 
    */

export const productRetrunDiv = (subproductlist,isPrintReceipt=false) => {
    var sub_title = '';
    //var sub_title =subproductlist.join(";<br/>")
    subproductlist.map((item, index) => {
        sub_title = sub_title + (index !== 0 ? ";<br/>" : "") + (item.key? item.key+":"+item.value:  item.toString());
    })
   
    return (
        (isMobileOnly == true) ?
            <div className="font-italic">{sub_title}</div>
            :isPrintReceipt==true?
            sub_title.toString()
            :
            <span className="comman_subtitle"><Markup content={sub_title} /></span>
    )

}

/**
     * Created By :Shakuntala Jatav
     * @param {*} product_id 
     * @param {*} productlist 
     * Description : Get product id for match and call productxRender function   
     */

export const productxArray = (product_id, productlist, setPayment,productXjson="") => {
    var productxTagsField = localStorage.getItem('PRODUCTX_DATA') && JSON.parse(localStorage.getItem('PRODUCTX_DATA'));
    var obj = "";
    productxTagsField.map(prdx => {
        if (productlist !== null) {
            var _prodXJson=prdx;
             
            if (prdx.product_id == product_id && _prodXJson.strProductX== productXjson) {
                // *** check for productx addons, booking and measuremnt tye product *** //
                if ((prdx.variation && (prdx.Type == "variable" || prdx.Type == "simple" || prdx.variation_id !== 0 )|| ((prdx.addons && prdx.addons.length) || prdx.booking || prdx.pricing_item_meta_data))) {
                    obj = productxRender(prdx, productlist, setPayment);
                }
                else if (prdx.composite_data) {
                    obj = productxRender(prdx.composite_data, productlist, setPayment);
                }
                else if (prdx.stamp) {
                    obj = productxRender(prdx.stamp, productlist, setPayment);
                }
            }
        }
    })
    return obj;
}

/**
     * Created By :Shakuntala Jatav
     * @param {*} item 
     * Description : Retuen Tilte on print page if product is composite or not  
     */
export const showTitle = (item) => {
    var title = "";
    if (item.composite_product_key !== "" && item.composite_parent_key == "" && item.bundle_product_key == "" && item.bundled_parent_key == "") {
        title = item.name;
    } else if (item.composite_product_key == "" && item.composite_parent_key == "" && item.bundle_product_key == "" && item.bundled_parent_key == "") {
        title = item.name;
    } else if (item.composite_product_key == "" && item.composite_parent_key == "" && item.bundle_product_key !== "" && item.bundled_parent_key == "") {
        title = item.name;
    } else if ((typeof item.composite_product_key == 'object') && (typeof item.composite_parent_key == 'object') && (typeof item.bundle_product_key == 'object') && (typeof item.bundled_parent_key == 'object')) {
        title = item.name;
    } else {
        title = "";
    }
    return title;
}

/**
     * Created By :Shakuntala Jatav
     * @param {*} item 
     * Description : Retuen sub-tilte on print page if product is composite child or not  
     */
export const showSubTitle = (item) => {
    var subTitle = "";
    if (item.composite_product_key !== "" && item.composite_parent_key !== "" && item.bundle_product_key == "" && item.bundled_parent_key == "") {
        subTitle = item.name;
    } else if (item.composite_product_key == "" && item.composite_parent_key == "" && item.bundle_product_key !== "" && item.bundled_parent_key !== "") {
        subTitle = item.name;
    }
    // else if (item && item.meta && item.meta !== "[]") {
    //     var prodXMeta = item.meta && item.meta !== '[]' && item.meta !== [] ? JSON.parse(item.meta) : ''
    //     var addonsMeta = ''
    //     // get meta values from meta field for addons and measurment types
    //     var metaValues = prodXMeta && prodXMeta !== '' ? prodXMeta.map(function (el) {
    //         // check if value contains url and get last index of url
    //         if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(el.value)) {
    //             var urlData = (el.value.substring(el.value.lastIndexOf('/') + 1))// extract last index of url
    //             return ` ${el.key} - ${urlData} `
    //         }
    //         return ` ${el.key} - ${el.value} ` // return key and value of meta data

    //     }) : '';

    //     addonsMeta = metaValues !== '' ? metaValues.toString() : addonsMeta

    // }
    else {
        subTitle = "";
    }
    return subTitle;
}

/**
 * Created By :Shakuntala Jatav
 * Created Date: 26-feb-2020
 * Description: Return boolen for allow permission for discount is or not!
 */
export const permissionsForDiscount = () => {
    var allowDiscount = false;
    var userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '';
    var userData = userLocal && userLocal.permissions;
    var _allowDiscount = userData && userData.filter(perm => (perm.PermissionKey && perm.PermissionKey == 'GiveDiscount' && perm.IsAllow));
    if (_allowDiscount && _allowDiscount.length > 0) {
        return allowDiscount = (_allowDiscount[0].PermissionKey == 'GiveDiscount' && _allowDiscount[0].IsAllow == true) ? true : false;
    }
    return allowDiscount;
}

/**
 * Created By :Shakuntala Jatav
 * Created Date: 26-feb-2020
 * Description: Return boolen for allow permission for refund is or not!
 */
export const permissionsForRefund = () => {
    var allowRefund = false;
    var userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '';
    var userData = userLocal && userLocal.permissions;
    var _allowRefund = userData && userData.filter(perm => (perm.PermissionKey && perm.PermissionKey == 'IssueRefund' && perm.IsAllow));
    if (_allowRefund && _allowRefund.length > 0) {
        return allowRefund = (_allowRefund[0].PermissionKey == 'IssueRefund' && _allowRefund[0].IsAllow == true) ? true : false;
    }
    return allowRefund;
}

export const showProductxModal = () => {
    var productxPermission = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')).subscription_permission.product_x : false;
    return productxPermission;
}
export const getInclusiveTaxType=(meta_datas)=>{
    var taxInclusiveName="";
    meta_datas && meta_datas.map((meta)=>{  
      
        var _metaData;  
        if (meta._order_oliverpos_product_discount_amount) {
            _metaData = meta._order_oliverpos_product_discount_amount 
        }        
        if(meta.ItemName=='_order_oliverpos_product_discount_amount'){
            _metaData=meta.ItemValue && meta.ItemValue !="" && JSON.parse(meta.ItemValue);
        }
        _metaData && _metaData.map((item, index)=> {                        
                if (item.taxType && item.taxType !== null ) {
                    taxInclusiveName = item.taxType.toLowerCase() =='incl'?"(Incl)" :"";        
                    }
        });
           
    })
    return  taxInclusiveName;
    }

export const CommonModuleJS = {
    productxArray, productxRender, showTitle, showSubTitle, permissionsForDiscount, permissionsForRefund, showProductxModal,
    getInclusiveTaxType
}

export default CommonModuleJS;