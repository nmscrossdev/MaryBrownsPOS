import { cartProductConstants } from '../_constants';
import { get_UDid } from '../ALL_localstorage';
import { getTaxCartProduct, getExclusiveTax, getInclusiveTax, typeOfTax } from '../_components';
import { inventoryService, taxRateService } from '../_services';
import { idbProductActions } from './';
import { androidDisplayScreen } from '../settings/AndroidIOSConnect';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';
import CommonJs from '../_components/CommonJS';

export const cartProductActions = {
    refresh,
    addtoCartProduct,
    selectedProductDis,
    singleProductDiscount,
    addInventoryQuantity,
    showSelectedProduct,
    updateVariationStock,
    updateTaxOfCart,
    getTaxRateList,
    updateTaxRateList,
    getTicketSeatForm,
    getReservedTikeraChartSeat,
    bookedSeats

};

function refresh() {
    return { type: cartProductConstants.PRODUCT_GETALL_REFRESH };
}

function bookedSeats(booked_seats) {
    return dispatch => {
        dispatch(request());
        dispatch(success(booked_seats))
    };
    function request() { return { type: cartProductConstants.BOOKED_SEATS_REQUEST } }
    function success(booked_seats) { return { type: cartProductConstants.BOOKED_SEATS_SUCCESS, booked_seats } }
}

function selectedProductDis(selecteditem) {
    return dispatch => {
        dispatch(request());
        dispatch(success(selecteditem))
    };
    function request() { return { type: cartProductConstants.SELECTED_PRODUCT_DISCOUNT_REQUEST } }
    function success(selecteditem) { return { type: cartProductConstants.SELECTED_PRODUCT_DISCOUNT_SUCCESS, selecteditem } }
}

function showSelectedProduct(showSelectedProduct) {
    return dispatch => {
        dispatch(request());
        dispatch(success(showSelectedProduct))
    };
    function request() { return { type: cartProductConstants.SHOW_SELECTED_PRODUCT_REQUEST } }
    function success(showSelectedProduct) { return { type: cartProductConstants.SHOW_SELECTED_PRODUCT_SUCCESS, showSelectedProduct } }

}

function percentWiseDiscount(price, discount) {
    var discountAmount = (price * discount) / 100.00;
    return discountAmount;
}

function NumberWiseDiscount(price, discount) {
    var discountAmount = (discount * 100.00) / price;
    return discountAmount;
}

function addtoCartProduct(cartproductlist) {

    var TAX_CASE = typeOfTax();
    var udid = get_UDid('UDID')
    var updateProductList = null;
    //-----update quantity and price for multiple product ----------------------------------------
    var newCartList = []
    cartproductlist && cartproductlist.map((item, index) => {
        var isProdAddonsType = CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products
        var _discount_amount = 0.00;
        if (typeof item.product_id == 'undefined') {
            newCartList.push(item);
        }
        const countTypes = cartproductlist.filter(prd => prd.product_id === item.product_id && prd.variation_id == item.variation_id && prd.Title == item.Title
                && ( prd.strProductX ==undefined || prd.strProductX==item.strProductX)
        );
        var _price = 0.0;
        var _qty = 0;
        var _afterDiscount = 0;
        var new_incl_tax = 0;
         countTypes.map(nitem => {
             _price = _price + nitem.Price;
             _qty = _qty + nitem.quantity;
            // ** get new inclusive tax in case of discount number, when we add number discont on same item that added on cart already...*/
            new_incl_tax = getInclusiveTax( nitem.discount_amount >0? nitem.after_discount: (nitem.old_price*_qty) , nitem.TaxClass)
            // new_incl_tax = getInclusiveTax((nitem.old_price*_qty)-( nitem.discount_type == "Number" ? nitem.product_discount_amount : nitem.product_discount_amount*_qty ) , nitem.TaxClass)
            
            /// ** minus total price with new total inclusive tax, and discount amount to get final after discount.. */
            _afterDiscount= nitem.discount_type == "Number" && nitem.incl_tax && nitem.after_discount ?
            ((nitem.old_price ) *_qty)- nitem.product_discount_amount  - new_incl_tax
              : nitem.discount_amount>0? nitem.after_discount: (nitem.old_price *_qty) - (nitem.discount_amount *(nitem.discount_type == "Percentage" ? _qty : 1)) 

            //  _afterDiscount= nitem.discount_type == "Number" && nitem.incl_tax && nitem.after_discount ?
            //   ((nitem.old_price ) *_qty)- nitem.product_discount_amount  - new_incl_tax
            //     : (nitem.old_price *_qty) - (nitem.product_discount_amount *(nitem.discount_type == "Percentage" ? _qty : 1))  - (nitem.incl_tax ? new_incl_tax : 0)
              

         })

        if ((item.discount_type == 'Percentage' || !item.discount_type) && item.discount_amount && item.discount_amount !== 0) {
            _discount_amount = item.product_discount_amount * _qty; 
            if(isProdAddonsType && isProdAddonsType== true){
                _discount_amount = item.product_discount_amount; // don not multiply by quantity for addons
            }
        } else if (item.discount_type == 'Number' && item.product_discount_amount !== 0) {
            _discount_amount = item.product_discount_amount;
        }



        var _newITem = {
            Price: _price,
            Sku: item.Sku,
            Title: item.Title,
            isTaxable: item.isTaxable,
            line_item_id: item.line_item_id,
            product_id: item.product_id,
            quantity: _qty,
            after_discount: _afterDiscount, //item.after_discount ? item.after_discount : 0, //
            discount_amount: _discount_amount,
            variation_id: item.variation_id,
            cart_after_discount: item.cart_after_discount ? item.cart_after_discount : 0,
            cart_discount_amount: item.cart_discount_amount ? item.cart_discount_amount : 0,
            product_after_discount: item.product_after_discount ? item.product_after_discount : 0,
            product_discount_amount: item.product_discount_amount ? item.product_discount_amount : 0,
            old_price: item.old_price ? item.old_price : 0,
            incl_tax: item.incl_tax ? item.incl_tax : 0,
            excl_tax: item.excl_tax ? item.excl_tax : 0,
            ticket_status: item.ticket_status,/////ticket
            tick_event_id: item.tick_event_id,
            ticket_info: item.ticket_info ? item.ticket_info : [], /////ticket
            product_ticket: item.product_ticket ? item.product_ticket : '',
            discount_type: item.discount_type ? item.discount_type : "",
            new_product_discount_amount: item ? item.new_product_discount_amount : 0,
            TaxStatus: item ? item.TaxStatus : '',// updateby shakuntala jatav, date:03-06-2019 , description: tax is applicable for per items is yes or not.
            //   ticket_cart_display_status:item.ticket_cart_display_status?item.ticket_cart_display_status:''
            tcForSeating: item.tcForSeating ? item.tcForSeating : "",
            TaxClass: item ? item.TaxClass : '',
            Type: item && item.Type ? item.Type : '', // added product Type in checklist
           strProductX:item.strProductX? item.strProductX:undefined,
           addons_meta_data:item.addons_meta_data?item.addons_meta_data:"",
           psummary:item.psummary?item.psummary:''
        }

        // set Price for productX from productX localstorage.
        var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0
        // cartproductlist && cartproductlist.map(pro => {
        var incr = 1
        var productXSingleData = prodXData && prodXData.map(prodX => {
            if (prodX.product_id == _newITem.product_id && incr && prodX.strProductX==_newITem.strProductX) {
                incr = 0
                var productXItemPrice = prodX && prodX.line_subtotal ? prodX.line_subtotal : 0
                var productXItemTax = prodX && prodX.line_tax ? prodX.line_tax : 0
                // _newITem.Price = productXItemPrice;
                _newITem.old_price = TAX_CASE == 'incl' ? (productXItemPrice + productXItemTax) / prodX.quantity : productXItemPrice / prodX.quantity

                var cartData = localStorage.getItem('CARD_PRODUCT_LIST') && JSON.parse(localStorage.getItem('CARD_PRODUCT_LIST'))
                cartData && cartData.map(itm => {
                    if (itm.product_id == _newITem.product_id && countTypes.length > 1) {
                        _newITem.Price = TAX_CASE == 'incl' ? itm.Price + productXItemPrice + productXItemTax : itm.Price + productXItemPrice;
                    }
                })
            }
        })
        // })
        // end
        _discount_amount = 0;
        var _newItemExist = newCartList && newCartList.filter(prd => prd.product_id === item.product_id && prd.variation_id == item.variation_id && prd.Title == item.Title
        && ( prd.strProductX== undefined || item.strProductX==undefined || prd.strProductX==item.strProductX));
        if ((_newItemExist) && _newItemExist.length == 0) {
            newCartList.push(_newITem);
        } else {
            _newItemExist = _newITem
            newCartList.map(newItem => {
                if (newItem.product_id === _newITem.product_id && newItem.variation_id == _newITem.variation_id && newItem.Title == _newITem.Title && ( newItem.strProductX==_newITem.strProductX)) {
                    newItem.discount_amount = _newITem.discount_amount;
                    newItem.cart_after_discount = _newITem.cart_after_discount;
                    newItem.cart_discount_amount = _newITem.cart_discount_amount;
                    newItem.product_after_discount = _newITem.product_after_discount;
                    newItem.product_discount_amount = _newITem.product_discount_amount;
                    newItem.old_price = _newITem.old_price ? _newITem.old_price : 0;
                    newItem.incl_tax = _newITem.incl_tax ? _newITem.incl_tax : 0;
                    newItem.excl_tax = _newITem.excl_tax ? _newITem.excl_tax : 0;
                    newItem.discount_type = _newITem.discount_type;
                    newItem.after_discount = _newITem.after_discount
                    newItem.new_product_discount_amount = _newITem.new_product_discount_amount ? _newITem.new_product_discount_amount : 0;                  
                }
            })
        }
    })
    cartproductlist = getTaxCartProduct(newCartList);
    
    var totalPrice = 0;
    var customefee = 0; //should not include into discount
    var totalCartProductDiscount=0;
    cartproductlist && cartproductlist.map((item, index) => {
        var product_after_discount = 0;
        var isProdAddonsType = CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products

        if (item.product_id) {//donothing
            totalPrice += item.Price;
            totalCartProductDiscount +=item.product_discount_amount;
            product_after_discount += parseFloat(item.product_discount_amount * item.quantity); 
            if(isProdAddonsType && isProdAddonsType== true){
                product_after_discount = 0
                product_after_discount += parseFloat(item.product_discount_amount); // quantity comment for addons
            }
        } else {
            customefee += item.Price;
        }
        if (item.product_discount_amount !== 0 && item.TaxStatus !== 'none') {
            if (TAX_CASE == "incl") {
                var incl_tax = 0;
                if (item.discount_type == "Percentage") {
                    //incl_tax = getInclusiveTax(item.Price - (product_after_discount > 0 ? (product_after_discount) : item.discount_amount), item.TaxClass)
                    //Now calculating the tax on Price with inclusive tax... 
                    incl_tax = getInclusiveTax((product_after_discount > 0 ? item.Price- product_after_discount :item.Price ), item.TaxClass)
                } else {
                    incl_tax = getInclusiveTax(item.Price - (item.discount_amount ? item.discount_amount : 0), item.TaxClass)
                }
                item["incl_tax"] = incl_tax
            } else {
                var excl_tax = 0;
                if (item.discount_type == "Percentage") {
                    excl_tax = getExclusiveTax(item.after_discount, item.TaxClass)//
                   //excl_tax = getExclusiveTax(item.after_discount * item.quantity, item.TaxClass)// 
                    if(isProdAddonsType && isProdAddonsType== true){
                        excl_tax = getExclusiveTax(item.after_discount, item.TaxClass)// quantity comment for addons
                    }
                } else {
                    excl_tax = getExclusiveTax(item.Price - (item.discount_amount ? item.discount_amount : 0), item.TaxClass)
                }
                item["excl_tax"] = excl_tax
            }
        }
    })
    var cart = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : null
    
    var incl_tax = 0;
    var excl_tax = 0;
    if (cart !== null) {
        cartproductlist && cartproductlist.map(item => {
            var product_after_discount = 0;
            var isProdAddonsType = CommonJs.checkForProductXAddons(item.product_id);
            // product_after_discount += parseFloat(item.product_discount_amount);
            // var product_discount_amount = item.product_discount_amount; // remove quantity for test 

            //  multiply by quantity in percentage discount case only...
            var product_discount_amount = item.discount_type == "Percentage" ? item.product_discount_amount * item.quantity : item.product_discount_amount; // test 
            var discount_amount = item.discount_amount ? item.discount_amount * item.quantity : 0;
            var price = item.Price;
            var discount = parseFloat(cart.discount_amount)
            var Tax = parseFloat(cart.Tax_rate);
            var discount_amount_is = 0;
            var afterDiscount = 0;
            var new_price = 0.00;
            var cart_after_discount = 0;
            var cart_discount_amount = 0;
            if (item.product_id) {
                price = parseFloat(price - parseFloat(product_discount_amount));
                product_after_discount += parseFloat(item.product_discount_amount * item.quantity); 
                if(isProdAddonsType && isProdAddonsType== true){
                    product_after_discount = 0
                    product_after_discount += parseFloat(item.product_discount_amount); // quantity comment for addons
                }
                if (price == 0) {
                    cart_after_discount = 0.00;
                    cart_discount_amount = 0.00;
                    new_price = 0.00;
                } else {
                    if (cart.discountType == 'Percentage') {
                        if (discount > 100) {
                            localStorage.removeItem("CART")
                            $('#no_discount').modal('show')
                        } else {
                            var incl_tax=0
                            discount_amount_is = percentWiseDiscount(price, discount);
                            if ( item.TaxStatus !== 'none') { 
                                if (TAX_CASE == 'incl') {
                                    incl_tax = getInclusiveTax(price, item.TaxClass)
                                    //item["incl_tax"] = incl_tax

                                    //discount_amount_is = percentWiseDiscount(price - incl_tax, discount);
                                    discount_amount_is = percentWiseDiscount(price , discount);
    
                                } 
                          }
                            // afterDiscount = price - incl_tax - discount_amount_is;
                            afterDiscount = price - discount_amount_is;
                            cart_after_discount = afterDiscount;
                            cart_discount_amount = discount_amount_is;
                            new_price = price - parseFloat(cart_discount_amount);
                            var total_tax = afterDiscount + (afterDiscount * Tax / 100.00);
                            if (new_price == price) {
                                new_price = 0.00;
                            }
                        }
                    } else {
                        var new_discount = NumberWiseDiscount((totalPrice-totalCartProductDiscount), discount);
                        if (new_discount > 100) {
                            localStorage.removeItem("CART")
                            $('#no_discount').modal('show')
                        } else {
                            discount_amount_is = percentWiseDiscount(price, new_discount);
                            afterDiscount = price - discount_amount_is;
                            cart_after_discount = afterDiscount;
                            cart_discount_amount = parseFloat(discount_amount_is);
                            new_price = price - parseFloat(cart_discount_amount);
                            if (new_price == price) {
                                new_price = 0.00;
                            }
                        }
                    }
                }
                item["Sku"] = item.Sku;
                item["cart_after_discount"] = parseFloat(cart_after_discount);
                item["cart_discount_amount"] = parseFloat(cart_discount_amount);
                // item["after_discount"] = new_price
                item["discount_amount"] = parseFloat(cart_discount_amount) + parseFloat(product_discount_amount);
                if (item.discount_amount && item.discount_amount !== 0 && item.TaxStatus !== 'none') {
                    if (TAX_CASE == 'incl') {
                        incl_tax = getInclusiveTax((item.discount_amount > 0 ? cart_after_discount : item.Price), item.TaxClass)
                        // incl_tax = getInclusiveTax(item.Price - (product_discount_amount > 0 ? product_discount_amount : item.discount_amount), item.TaxClass)
                        //incl_tax = getInclusiveTax(item.Price- item.discount_amount, item.TaxClass)
                        item["incl_tax"] = incl_tax
                    } else {
                        excl_tax = getExclusiveTax(item.Price - item.discount_amount, item.TaxClass);
                        item["excl_tax"] = excl_tax
                    }
                } else {
                    if (item.TaxStatus !== 'none') {
                        if (TAX_CASE == 'incl') {
                            incl_tax = getInclusiveTax(item.Price, item.TaxClass)
                            item["incl_tax"] = incl_tax
                        } else {
                            excl_tax = getExclusiveTax(item.Price, item.TaxClass);
                            item["excl_tax"] = excl_tax
                        }
                    }
                }
                // updated after discount 
                item["after_discount"] =
                    item ?
                        ((item.old_price) * item.quantity) - (item.cart_discount_amount + product_discount_amount) - item.incl_tax
                        : new_price
            }
        })
    }
    localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartproductlist));

    return dispatch => {
        dispatch(request());
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        if (demoUser) {
            GTM_OliverDemoUser("ShopView: Add Product to Cart")
        }
        dispatch(success(JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST"))));
        //Android Call----------------------------

        setTimeout(() => {
            var totalPrice = 0.0;
            cartproductlist && cartproductlist.map(item => {
                totalPrice += item.Price;
            })
            androidDisplayScreen('', 0.00, totalPrice, "cart");
        }, 200);

        //-----------------------------------------
    };
    function request() { return { type: cartProductConstants.PRODUCT_ADD_REQUEST } }
    function success(cartproductlist) { return { type: cartProductConstants.PRODUCT_ADD_SUCCESS, cartproductlist } }
}

function singleProductDiscount(isProductX = false,productxQty=null) {
    var qty = $('#qualityUpdater').val() || 1;
    if(isProductX && isProductX==true && productxQty){
        qty =productxQty;
    }
    var product = localStorage.getItem("PRODUCT") ? JSON.parse(localStorage.getItem("PRODUCT")) : null
    var product_list = localStorage.getItem("SINGLE_PRODUCT") ? JSON.parse(localStorage.getItem("SINGLE_PRODUCT")) : null
    var product_after_discount = 0;
    var single_product = null;
    if (product !== null && product_list !== null) {
        var product_id = 0;
        var cart_after_discount = 0;
        
        var cart_discount_amount = product_list.cart_discount_amount ? parseFloat(product_list.cart_discount_amount) : 0;
        var price = 0;
        var discount = parseFloat(product.discount_amount)
        var Tax = parseFloat(product.Tax_rate);
        var product_after_discount = 0;
        var product_discount_amount = 0;
        var discount_amount_is = 0;
        var afterDiscount = 0;
        var new_price = 0.00;
        if (product_list.Type !== "variable") {
            product_id = product.Id;
            single_product = product_list;
        } else {
            if (isProductX == false) {
                var new_single_product = product_list.Variations && product_list.Variations.filter(item => item.WPID === product.Id);
                single_product = new_single_product && new_single_product[0];
                product_id = product.Id;
            } else {
                single_product = product_list && product_list;
                product_id = product.Id;
            }

        }
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCT")
        price = single_product && typeof (single_product) !== undefined && single_product.Price ? single_product.Price : 0;
        var TAX_CASE = typeOfTax();
        if (product_id) {
            price = parseFloat(price);
            var isProdAddonsType = CommonJs.checkForProductXAddons(product_id);// check for productX is Addons type products
            if (price == 0) {
                product_after_discount = 0;
                product_discount_amount = 0;
                new_price = 0.00;
            } else {
                if (product.discountType == 'Percentage') {
                    if (discount > 100) {
                        localStorage.removeItem("PRODUCT")
                        localStorage.removeItem("SINGLE_PRODUCT")
                        $('#no_discount').modal('show')
                    } else {

                        // var TAX_CASE = typeOfTax();
                        var incl_tax = 0;
                        var productDiscount = 0;
                        productDiscount = percentWiseDiscount(price, discount);
                        if ( single_product.TaxStatus !== 'none') { //single_product.discount_amount !== 0 &&
                            if (TAX_CASE == 'incl') {
                                incl_tax = getInclusiveTax(single_product.Price, single_product.TaxClass)
                                //item["incl_tax"] = incl_tax
                               // productDiscount = percentWiseDiscount(price - incl_tax, discount);
                                productDiscount = percentWiseDiscount(price, discount);

                            } else{
                                productDiscount = percentWiseDiscount(price, discount);
                            }
                      }

                       // afterDiscount = (price - incl_tax - productDiscount) * (isProductX && isProductX==true ? qty:1);
                       afterDiscount = (price - productDiscount) * (isProductX && isProductX==true ? qty:1);
                       discount_amount_is = productDiscount;
                        //var _disc = percentWiseDiscount(price, discount);
                       // product_after_discount = price - _disc;
                       // product_discount_amount = _disc;
                        product_after_discount = afterDiscount;
                        product_discount_amount = discount_amount_is;
                    }
                } else {

                     TAX_CASE = typeOfTax();
                        var incl_tax_num = 0;
                        var productDiscount = 0;
                        if (single_product.discount_amount !== 0 && single_product.TaxStatus !== 'none') {
                            if (TAX_CASE == 'incl') {
                                incl_tax_num = getInclusiveTax(single_product.Price - discount, single_product.TaxClass)
                                // productDiscount = percentWiseDiscount(price - incl_tax_num, discount);
                            }
                        }

                    var discount_percent = NumberWiseDiscount(price * qty, discount)                   
                    if (discount_percent > 100) {
                        localStorage.removeItem("PRODUCT")
                        localStorage.removeItem("SINGLE_PRODUCT")
                        $('#no_discount').modal('show')
                    } else {
                        discount_amount_is = percentWiseDiscount(price * qty, discount_percent)
                        afterDiscount = price * qty - discount_amount_is;
                        if(isProdAddonsType && isProdAddonsType == true){
                            afterDiscount = price - incl_tax_num - discount_amount_is; // minus incl_tax_num for addons in case of number discount
                        }
                        product_after_discount = afterDiscount;
                        product_discount_amount = parseFloat(discount_amount_is);
                        var total_tax = afterDiscount + (afterDiscount * Tax / 100.00);
                    }
                }
            }
            if (single_product && single_product !== null) {
                single_product["product_after_discount"] = parseFloat(product_after_discount)
                single_product["product_discount_amount"] = parseFloat(product_discount_amount)
                single_product["after_discount"] = afterDiscount
                single_product["discount_amount"] = parseFloat(cart_discount_amount) + parseFloat(product_discount_amount);
                single_product["discount_type"] = product.discountType ? product.discountType : 'Number'
                single_product["new_product_discount_amount"] = discount
            }
        }
    }
    return dispatch => {
        dispatch(request());
        dispatch(success(single_product));
    };
    function request() { return { type: cartProductConstants.PRODUCT_SINGLE_ADD_REQUEST } }
    function success(single_product) { return { type: cartProductConstants.PRODUCT_SINGLE_ADD_SUCCESS, single_product } }
}

function addInventoryQuantity(data, inventoryData) {
    if(data){    
        var inventory_quantitiy = null;
        return dispatch => {
            $('#txtInv').val('0')
            dispatch(request());
            //dispatch(success(data))
            var WarehouseId =localStorage.getItem("WarehouseId") && localStorage.getItem("WarehouseId") !==null? parseInt(localStorage.getItem("WarehouseId")):0;
            data['WarehouseId']=WarehouseId;
            if (data) {
                inventoryService.addInventoryQuantity(data)
                    .then(
                        inventory_quantitiy => {
                            if (inventory_quantitiy.is_success == true) {
                                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                                if (demoUser) {
                                    GTM_OliverDemoUser("ShopView: Update Quntity")
                                }
                                dispatch(success(data));
                                dispatch(idbProductActions.updateOrderProductDB(inventoryData));
                            } else {
                                dispatch(success(data));
                            }
                            error => dispatch(failure(error.toString()))
                        }
                    );
            } else {
                return inventory_quantitiy
            }
        };
        function request() { return { type: cartProductConstants.GET_SINGAL_INVENTORY_REQUEST } }
        function success(inventory_quantitiy) { return { type: cartProductConstants.GET_SINGAL_INVENTORY_SUCCESS, inventory_quantitiy } }
        function failure(error) { return { type: cartProductConstants.GET_SINGAL_INVENTORY_FAILURE, error } }
        
   }
}

function updateVariationStock(product) {
    if (product.Type == 'variable' && product.ManagingStock == true) {
        product.Variations.map(filterStock => {
            if (filterStock.ManagingStock === false) {
                filterStock.StockQuantity = product.StockQuantity
            }
        })
    }
}

function updateTaxOfCart(cartproductlist) {
    localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartproductlist));
    return dispatch => {
        dispatch(request());
        dispatch(success(JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST"))));
    };
    function request() { return { type: cartProductConstants.PRODUCT_ADD_REQUEST } }
    function success(cartproductlist) { return { type: cartProductConstants.PRODUCT_ADD_SUCCESS, cartproductlist } }
}

/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : for get local tax  rate  list .
 * 
 * Updated By   : Aman
 * Updated Date : 31/07/2020
 * Description :  Bugsnag issue 'Message' of undefined on line number 421
*/
function getTaxRateList() {
    var udid = get_UDid('UDID')
    return dispatch => {
        dispatch(request());
        taxRateService.getTaxRateList(udid)
            .then(
                tax_list => {
                    if (tax_list && tax_list !== null && tax_list !== "undefined" && tax_list !== 'undefined' && tax_list.message == 'Success') {
                        localStorage.setItem("SHOP_TAXRATE_LIST", JSON.stringify(tax_list.content))
                        dispatch(success(tax_list.content));
                    }
                }
            );
    };
    function request() { return { type: cartProductConstants.TAXLIST_GET_REQUEST } }
    function success(taxlist) { return { type: cartProductConstants.TAXLIST_GET_SUCCESS, taxlist } }
}

/** *
 * Created By   : Shakuntala Jatav
 * Created Date : 16-06-2019
 * Description  :call update taxrate list .
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function updateTaxRateList(updatetaxlist) {
    return dispatch => {
        dispatch(request());
        dispatch(success(updatetaxlist))
    };
    function request() { return { type: cartProductConstants.UPDATE_TAX_RATE_LIST_REQUEST } }
    function success(updatetaxlist) { return { type: cartProductConstants.UPDATE_TAX_RATE_LIST_SUCCESS, updatetaxlist } }
}

/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 20-06-2019
 * Description  : check form is avialable  for tiket seating.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getTicketSeatForm(event_id, product_id) {
    var udid = get_UDid('UDID')
    //let form_ticket_seating = `<div class=\"tc-pan-wrapper\" style=\"transform: scale(1); transform-origin: 0px 0px; top: 10px; left: 10px; position: absolute;\"><div class=\"tc-group-wrap tc-group-seats ui-draggable\" style=\"width: 210px; position: absolute; top: 97.5px; left: 334.5px; z-index: 1; right: auto; height: 386px; bottom: auto;\" data-init-width=\"210\"><div class=\"tc-seat-group tc-group-background\"><div class=\"tc-heading ui-draggable-handle\"><h3>Auto Draft Seating Group</h3></div><div class=\"tc-group-content ui-selectable\"><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_1\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>1</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_2\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>2</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_3\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>3</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_4\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>4</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_5\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>5</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_6\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>6</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_7\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>7</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_8\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>8</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_9\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>9</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_10\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>10</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_11\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>11</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_12\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>12</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_13\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>13</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_14\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>14</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_15\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>15</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_16\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>16</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_17\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>17</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_18\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>18</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_19\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>19</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_20\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>20</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_21\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>21</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_22\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>22</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_23\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>23</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_24\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>24</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_25\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>25</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_26\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>26</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_27\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>27</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_28\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>28</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_29\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>29</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_30\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>30</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_31\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>31</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_32\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>32</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_33\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>33</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_34\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>34</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_35\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>35</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_36\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>36</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_37\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>37</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_38\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>38</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_39\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>39</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_40\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>40</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_41\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>41</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_42\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>42</p></span></span></div><div class=\"tc-seat-row selectable_row\" style=\"position: relative;\"><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_43\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>43</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_44\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>44</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_45\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>45</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_46\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>46</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_47\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>47</p></span></span><span class=\"tc_seat_unit ui-selectee\" id=\"tc_seat_1_48\" style=\"\"><span><div class=\"tc-arrow-up\"></div><p>48</p></span></span></div></div></div><div class=\"tc-clear\"></div></div></div>`
    return dispatch => {
        dispatch(request());
        if (event_id !== false) {
            inventoryService.getTicketSeatForm(event_id, product_id, udid)
                .then(
                    form_ticket_seating => {
                        if (form_ticket_seating.is_success == true) {
                            var content = form_ticket_seating.content;
                            content = form_ticket_seating.content && form_ticket_seating.content;
                            dispatch(success(content));
                        }
                        error => dispatch(failure(error.toString()))
                    }
                );
        } else {
            dispatch(success());
        }
    };
    function request() { return { type: cartProductConstants.GET_TICKET_SEATING_FORM_REQUEST } }
    function success(form_ticket_seating) { return { type: cartProductConstants.GET_TICKET_SEATING_FORM_SUCCESS, form_ticket_seating } }
    function failure(error) { return { type: cartProductConstants.GET_TICKET_SEATING_FORM_FAILURE, error } }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 09-06-2019
 * Description  : get update list of tickera reserved seat .
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getReservedTikeraChartSeat(chart_id, type) {
    var udid = get_UDid('UDID');
    var reservedData = localStorage.getItem('RESERVED_SEATS') ? JSON.parse(localStorage.getItem('RESERVED_SEATS')) : [];
    return dispatch => {
        dispatch(request());
        if (chart_id !== 0) {
            inventoryService.getReservedTikeraChartSeat(udid, chart_id)
                .then(
                    reserved_tikera_seat => {
                        if (reserved_tikera_seat.message == 'Success')
                            if (type == 1) {
                                var data = {
                                    reserve_seat: reserved_tikera_seat.content,
                                    chart_id: chart_id
                                }
                                reservedData.push(data);
                                localStorage.setItem('RESERVED_SEATS', JSON.stringify(reservedData))
                                dispatch(success(reservedData));
                            } else {
                                dispatch(success(reserved_tikera_seat.content));
                            }
                        error => dispatch(failure(error.toString()))
                    }
                );
        } else {
            dispatch(success());
        }
    };
    function request() { return { type: cartProductConstants.RESERVED_TIKERA_SEAT_REQUEST } }
    function success(reserved_tikera_seat) { return { type: cartProductConstants.RESERVED_TIKERA_SEAT_SUCCESS, reserved_tikera_seat } }
    function failure(error) { return { type: cartProductConstants.RESERVED_TIKERA_SEAT_FAILURE, error } }
}







