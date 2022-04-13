
var windowCloseEv = null;
/**
     * Created By: Aatifa
     * Created Date : 30-09-2020
     * Description : get extensionReady event for hide header and footer through the post message 
     */
export const sendMessageToComposite = (_jsonMsg) => {
    var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    //this.setState({compositeProductActive:true})
    var clientJSON =
    {
        oliverpos:
        {
            event: "oliverHideContent"
        },
        data:
        {

        }
    };
    return iframex.postMessage(JSON.stringify(clientJSON), '*');
}
/**
* Created By: Aatifa
* Created Date : 30-09-2020
* Description : get eExtensionFinished event for close modal. 
*/
export const getCompositeExtensionFinished = (_jsonMsg) => {
    windowCloseEv.close();
    localStorage.removeItem("oliver_pos_productx_cart_session_data");
    localStorage.removeItem("oliver_pos_productx_id");
    return true;
}
/**
* Created By: Aatifa
* Created Date : 30-09-2020
* Description : get oliverAddedToCart event for the post message from woocommerce site.
*/
export const getCompositeAddedToCart = (_jsonMsg) => {
    var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    var clientJSON =
    {
        oliverpos:
        {
            event: "oliverGetProductxData"
        },
        data:
        {
        }
    };
    return iframex.postMessage(JSON.stringify(clientJSON), '*');
}
/**
* Created By: Aatifa
* Created Date : 30-09-2020
* Description : get oliverAddedToCart event for ready product to add  on cart.
*/
export const getCompositeSetProductxData = (_jsonMsg) => {
    console.log("_jsonMsg", _jsonMsg);
    if (_jsonMsg.data && _jsonMsg.data.status == true) {
        var productData = 0;
        var data = _jsonMsg.data.product[0]
        // var isQuantityUpdate = false
        var productXdata = {
            discount_amount: 0,
            discount_type: "",
            quantity: 0,
            strProductX:""
        }
        // localStorage.setItem("PRODUCTX_DATA",[])
        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                if (_jsonMsg.data.productxId == data[k].product_id) {
                    var qty= data[k].pricing_item_meta_data? data[k].pricing_item_meta_data._quantity:data[k].quantity;
                    productData =qty;
                    productXdata.discount_type = data[k].discount_type;
                    productXdata.discount_amount = data[k].discount_amount;
                    productXdata.quantity = qty;
                    productXdata.strProductX=data[k]
                    
                    
                    
                //     var cartPrice  = _jsonMsg.data.product.cart_sub_total_price // cart_total price for individual products
                //     var cartPriceStr = cartPrice ? cartPrice.includes(';') ? cartPrice.split(';')[1] : cartPrice  : 0 // remove string from ; semi Colomn (encoded currency sign) 
                //    var totalPrice = cartPriceStr ? cartPriceStr.replace(',', '') : data[k].line_subtotal // replace coma , from price 
                //     data[k].line_subtotal = parseFloat(totalPrice)
                //     data[k].line_subtotal_tax = _jsonMsg.data.product.cart_taxes_total ? parseFloat(_jsonMsg.data.product.cart_taxes_total) : data[k].line_subtotal_tax
                //     data[k].line_tax = _jsonMsg.data.product.cart_taxes_total ? parseFloat(_jsonMsg.data.product.cart_taxes_total) : data[k].line_tax

                    //localStorage.setItem("PRODUCTX_DATA", JSON.stringify(data[k]))
                    // set PRODUCTX_DATA in localStorage
                    if (localStorage.getItem("PRODUCTX_DATA")) {
                        var productX = JSON.parse(localStorage.getItem("PRODUCTX_DATA"));
                        productX && productX.map((itm,index)=>{
                            // if( itm.Title){
                            //     delete itm.Title;
                            //    }
                            if(itm.product_id == data[k].product_id && itm.strProductX==JSON.stringify(data[k])){
                           // if(itm.product_id == data[k].product_id){
                                // if(isQuantityUpdate == false){
                                //     isQuantityUpdate = true
                                //     data[k].quantity += itm.quantity
                                //     productXdata.quantity = data[k].quantity;
                                // }

                                productX.splice(index, 1);
                                localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
                            }
                        });
                        var _obj= { ...data[k] };
                        _obj['strProductX']= JSON.stringify(data[k]);
                        productX.push(_obj);
                        localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
                    } else {
                        var productX = new Array();
                        var _obj={ ...data[k] };
                        _obj['strProductX']= JSON.stringify(data[k]);
                        productX.push(_obj);
                        localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
                    }
                }
            }
        }
        return productXdata;
    } else {
        getCompositeAddedToCart()
    }
}

// const compositeSwitchCases = (jsonMsg) => {
//     console.log("compositeEvent", jsonMsg)

//     var compositeEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
//     if (compositeEvent && compositeEvent !== '') {
//         console.log("compositeEvent", compositeEvent)
//         switch (compositeEvent) {
//             case "extensionReady":
//                 sendMessageToComposite(jsonMsg);
//                 break;
//             //oliverAddedToCart
//             case "oliverAddedToCart":
//                 getCompositeAddedToCart(jsonMsg)
//                 break;
//             //oliverSetProductxData
//             case "oliverSetProductxData":
//                 getCompositeSetProductxData(jsonMsg)
//                 break;
//             // extensionFinished
//             case "extensionFinished":
//                 console.log("Finished");
//                 getCompositeExtensionFinished(jsonMsg)
//                 break;
//             default:
//                 break;
//         }
//     }
// }

export const callProductXWindow = (product) => {
    // var setheight= window.innerHeight;
    // var ScreenSize = $(window).width() - 200;
    // console.log("Screen width", $(window).width());
    // console.log("Screen height", $(window).height());
    // var child = window.open(product.ParamLink+"?wopen='childwindow'", "targetWindow", `toolbar=no,
    //         location=0,
    //         status=0,
    //         menubar=no,
    //         scrollbars=yes,
    //         width=1024,
    //         left=300,
    //         top=100,
    //         height=436`);    
    // var timer = setInterval(checkChild, 500);
    // function checkChild() {
    //     if (child.closed) {
    //         clearInterval(timer);
    //     }
    // }
    // function resizeWin() {
    //     child.resizeTo(ScreenSize, ScreenSize);                             // Resizes the new window
    //     child.focus();                                        // Sets focus to the new window
    // }
    // checkChild();
    // resizeWin();
    var defaultTaxRate = localStorage.getItem('APPLY_DEFAULT_TAX') ? localStorage.getItem('APPLY_DEFAULT_TAX') : ''
    var discountList = localStorage.getItem('discountlst') ? localStorage.getItem('discountlst') : ''
    windowCloseEv = window.open(product.ParamLink + "?wopen='childwindow&discountList=" + discountList + "'", "targetWindow", `toolbar=no,
          location=no,
        status=no,
        menubar=no,
        scrollbars=yes,
        resizable=yes,
        width=800,
        left=300,
        top=100,
        height=600`);
     windowCloseEv.discount_data = discountList;
    // windowCloseEv.defaultTaxRate=defaultTaxRate;
    return windowCloseEv;
}