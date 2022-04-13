/**
 * Created By   : Shakuntala Jatav
 * Created Date : on March
 * Description  : calculate which type of tax apply in product and cart and checkout section include exclusive and inclusive.
 * 
 * Updated By   : Shakuntala Jatav
 * Updated Date : 06-06-2019,13-06-2019,19-06-2019
 * Description : 1. when update tax rate(changeTaxRate). 
                 2. when tax satus is none so no one tax aaply. 
                 3. update multiple tax.
*/
// var RoundAmount = (val) => {
//     //return Math.round(val * 100) / 100;
//     var decimals = 2;
//     return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
// }

export const getInclusiveTax = (price, taxclass) => {
    //console.log("getInclusiveTax", price, taxclass)
    var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
    var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS').toString() : null;
    var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
    // var Price = RoundAmount(price);
    var Price = parseFloat(price);
    var tax_rate = 0;
    if (TaxRate && TaxRate.length > 0) {
        TaxRate.map(addTax => {
            if (addTax.check_is == true) {
                if (taxclass == addTax.TaxClass && apply_defult_tax == "true") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
                if (apply_defult_tax == "false") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
            }
        })
    }   
    //check the product having diffrent tax class which is not match with standered class  
    if(tax_rate==0 && apply_defult_tax=="true"){
        selected_tax  && Array.isArray(selected_tax)==true && selected_tax.map(addTax => {
                if (taxclass == addTax.TaxClass ) {
                    tax_rate += parseFloat(addTax.TaxRate);
                }               
        })
    }
    var actual_price = 0;
    var inclusiveTax = 0;
    actual_price = parseFloat(Price) / ((tax_rate / 100) + 1);
    inclusiveTax = (Price - actual_price)
    return inclusiveTax
}

export const getExclusiveTax = (price, taxclass) => {
    var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
    var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : null;
    var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
    var Price = RoundAmount(price);
    var tax_rate = 0;
    if (TaxRate && TaxRate.length > 0) {
        TaxRate.map(addTax => {
            if (addTax.check_is == true) {
                if (taxclass == addTax.TaxClass && apply_defult_tax == "true") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
                if (apply_defult_tax == "false") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
            }
        })
    }
      //check the product having diffrent tax class which is not match with standered class  
      if(tax_rate==0 && apply_defult_tax=="true"){
        selected_tax  && Array.isArray(selected_tax)==true && selected_tax.map(addTax => {
                if (taxclass == addTax.TaxClass ) {
                    tax_rate += parseFloat(addTax.TaxRate);
                }               
        })
    }
    var exclusiveTax = 0;
    exclusiveTax = parseFloat((Price * tax_rate) / 100);
    return exclusiveTax;
}

/**
 * Created By   : Shakuntala Jatav
 * Created Date : 17-06-2019
 * Description  : provide array of tax prodcut wise in inclusive case .
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export const getInclusiveTaxForTotal = (price, taxclass) => {
    //console.log("getInclusiveTaxForTotal")
    var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
    var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS').toString() : null;
    var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
    var tax_rate = 0;
    var actual_price = 0;
    var inclusiveTax = [];
    var TaxId = 0;
    var Price = parseFloat(price);
    var price_is = 0;
    if (TaxRate && TaxRate.length > 0) {
        TaxRate.map(addTax => {
            if (addTax.check_is == true) {
                if (taxclass == addTax.TaxClass && apply_defult_tax == "true") {
                    tax_rate = parseFloat(addTax.TaxRate);
                    TaxId = addTax.TaxId;
                    // console.log("actual_price", actual_price, tax_rate)
                    // actual_price = Price / ((tax_rate / 100) + 1);
                    // price_is = Price - actual_price;
                     price_is= (Price * tax_rate)/100;
                     inclusiveTax.push({ id: TaxId, price: price_is })
                }

                if (apply_defult_tax == "false") {
                    tax_rate = parseFloat(addTax.TaxRate);
                    TaxId = addTax.TaxId;
                    //  actual_price = Price / ((tax_rate / 100) + 1);
                    //  price_is = Price - actual_price;
                    price_is= (Price * tax_rate)/100;
                    inclusiveTax.push({ id: TaxId, price: price_is })
                }
            }
        })

        if(tax_rate==0 && apply_defult_tax=="true"){
            selected_tax  && Array.isArray(selected_tax)==true && selected_tax.map(addTax => {
                    if (taxclass == addTax.TaxClass ) {
                        tax_rate = parseFloat(addTax.TaxRate);
                        TaxId = addTax.TaxId;
                        // actual_price = Price / ((tax_rate / 100) + 1);
                        // price_is = Price - actual_price;
                        price_is= (Price * tax_rate)/100;
                        inclusiveTax.push({ id: TaxId, price: price_is })
                            // tax_rate = parseFloat(addTax.TaxRate);
                    }               
            })
        }
    }
    return inclusiveTax
}
/**
 * Created By   : Shakuntala Jatav
 * Created Date : 17-06-2019
 * Description  : provide array of tax prodcut wise in Exclusive case .
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export const getExclusiveTaxForTotal = (price, taxclass) => {
    //console.log("getExclusiveTaxForTotal", price)
    var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
    var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : null;
    var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
    var tax_rate = 0;
    var exclusiveTax = [];
    var Price = parseFloat(price);
    var TaxId = 0;
    var price_is = 0;
    if (TaxRate && TaxRate.length > 0) {
        TaxRate.map(addTax => {
            if (addTax.check_is == true) {
                if (taxclass == addTax.TaxClass && apply_defult_tax == "true") {
                    tax_rate = parseFloat(addTax.TaxRate);
                    TaxId = addTax.TaxId;
                    price_is = parseFloat((Price * tax_rate) / 100);
                    exclusiveTax.push({ id: TaxId, price: price_is })
                }
                if (apply_defult_tax == "false") {
                    tax_rate = parseFloat(addTax.TaxRate);
                    TaxId = addTax.TaxId;
                    price_is = parseFloat((Price * tax_rate) / 100);
                    exclusiveTax.push({ id: TaxId, price: price_is })
                }
            }
        })
    }
        ///--- for default tax and have other then standerd class
        if(tax_rate==0 && apply_defult_tax == "true"){
            if (selected_tax && Array.isArray(selected_tax)==true && selected_tax.length > 0) {
                selected_tax.map(addTax => {                 
                        if (taxclass == addTax.TaxClass) {
                            tax_rate = parseFloat(addTax.TaxRate);
                            TaxId = addTax.TaxId;    
                            price_is = parseFloat((Price * tax_rate) / 100);
                            exclusiveTax.push({ id: TaxId, price: price_is }) 
                    }
                })
               
        }
    }
    //--------------------------------------------------------
    return exclusiveTax
}

export const setListActivityToCheckout = (products) => {
    products.map(item => {
        var totalTaxArray = item.Taxes && JSON.parse(item.Taxes) && JSON.parse(item.Taxes).total;
        var subtotalTaxArray = item.Taxes && JSON.parse(item.Taxes) && JSON.parse(item.Taxes).subtotal;
        if(  item && (!item.subtotal)){
            var pArr=[];
            pArr.push(item);
            getCheckoutList(pArr);        }
        item['subtotal'] = item.subtotal
        item['total'] = item.total ? item.total: item.totalPrice ?item.totalPrice: 0;
        item['total_tax'] = item.total_tax?item.total_tax: totalTaxArray ? Object.entries(totalTaxArray).map(item => ({ [item[0]]: item[1] })) : item.totaltax
        item['subtotal_tax'] = item.subtotal_tax?item.subtotal_tax:subtotalTaxArray ? Object.entries(subtotalTaxArray).map(item => ({ [item[0]]: item[1] })) : item.subtotaltax
    })
}

export const getExtensionCheckoutList = (products) => {
    var TAX_CASE = getSettingCase()
    var price = 0;
    var tax = 0;
    products.map(item => {
        price = (item.discount_amount !== 0) ? (item.after_discount * item.quantity) - getInclusiveTax(item.after_discount, item.TaxClass) : (item.old_price - getInclusiveTax(item.old_price)) * item.quantity;
        var taxes = [];
        var update_discount_tax = null;
        var priceIs = price / item.quantity;
        var discountTaxes = [];
        var update_Ex_tax = null;
        if (item.TaxStatus !== 'none') {
            if (item.discount_amount !== 0) {
                if (TAX_CASE == 1 || TAX_CASE == 2 || TAX_CASE == 3 || TAX_CASE == 4) {
                    update_discount_tax = getInclusiveTaxForTotal(priceIs, item.TaxClass);
                } else {
                    update_discount_tax = getExclusiveTaxForTotal(priceIs, item.TaxClass);
                }
            }
            if (TAX_CASE == 1 || TAX_CASE == 2 || TAX_CASE == 3 || TAX_CASE == 4) {
                update_Ex_tax = getInclusiveTaxForTotal(item.old_price, item.TaxClass)
            } else {
                update_Ex_tax = getExclusiveTaxForTotal(item.old_price, item.TaxClass)
            }
            // console.log("update_Ex_tax", update_Ex_tax, "update_discount_tax", update_discount_tax)
            if (update_Ex_tax && update_Ex_tax.length > 0) {
                taxes.push({ [update_Ex_tax[0].id]: parseFloat(item.incl_tax) + parseFloat(item.excl_tax) })
            }
            if (update_discount_tax && update_discount_tax.length > 0) {
                discountTaxes.push({ [update_discount_tax[0].id]: parseFloat(item.incl_tax) + parseFloat(item.excl_tax) })
            }
        }
        //console.log("taxes", taxes, "discountTaxes", discountTaxes)
        tax = (item.discount_amount !== 0) ? discountTaxes : taxes
        item['subtotal'] = item.Price
        item['total'] = item.Price
        item['total_tax'] = tax
        item['subtotal_tax'] = taxes
    })
}
/**
 * Created By   : Shakuntala Jatav
 * Created Date : 17-06-2019
 * Description  : update checkout list for call function and update tax list use before call api.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export const getCheckoutList = (products) => {
    var TAX_CASE = getSettingCase();
//     console.log("TAX_CASE", TAX_CASE)
//    console.log("products", products)
    var all_products = [];
    var price = 0;
    var tax = 0;
    switch (TAX_CASE) {
        //  case 1  
        case 1:
            products.map(item => {
               // price = (item.discount_amount !== 0) ? (item.after_discount * item.quantity) - getInclusiveTax(item.after_discount, item.TaxClass) : (item.old_price - getInclusiveTax(item.old_price)) * item.quantity;
             
               var includesiveTax= item.incl_tax;//item.isTaxable==false?0: getInclusiveTax(item.old_price, item.TaxClass);
               // price = price-incl_tax;
                var afterDiscount=item.after_discount !==0?item.after_discount: item.product_after_discount* item.quantity;
               if (item.discount_type == 'Percentage') {
               //var productDiscount=percentWiseDiscount(item.old_price-includesiveTax, item.new_product_discount_amount);
                price =afterDiscount;
                     //price =  (item.old_price - includesiveTax) * item.quantity;
                }else{
               
                    price = (item.discount_amount !== 0) ? (afterDiscount)  : ((item.old_price*item.quantity) - includesiveTax) ;
               }
               //price = (item.discount_amount !== 0) ? item.after_discount : (item.old_price - getInclusiveTax(item.old_price)) * item.quantity;
                var taxes = [];
                var update_discount_tax = null;
                //var priceIs = price / item.quantity;
                var priceIs =  ((item.discount_amount !== 0) ? item.after_discount : item.old_price*item.quantity);
                var discountTaxes = [];
                var singleTaxAmount = item.incl_tax > 0 ? item.incl_tax : 0;
                if ( item.isTaxable==true && item.TaxStatus !== 'none') {
                    if (item.discount_amount !== 0) {
                        //update_discount_tax = singleTaxAmount;
                        update_discount_tax  = getInclusiveTaxForTotal(priceIs, item.TaxClass); //test
                        //getInclusiveTaxForTotal(priceIs-singleTaxAmount, item.TaxClass);
                    }
                    var update_Ex_tax = getInclusiveTaxForTotal((item.old_price*item.quantity)-includesiveTax, item.TaxClass);
                    update_Ex_tax.map(taxIs => {
                        taxes.push({ [taxIs.id]: taxIs.price }) //* item.quantity
                    })                   
                    update_discount_tax && update_discount_tax.length > 0 && update_discount_tax.map(taxDis => {
                        discountTaxes.push({ [taxDis.id]: taxDis.price })
                    })                   
                }
                tax = (item.discount_amount !== 0) ? discountTaxes : taxes;
               // tax =  taxes;
                //console.log("singleTaxAmount", singleTaxAmount)
                 var _total=0;    
                 //_total=price-incl_tax - productDiscount;          
                // if( item.discount_amount !== 0)   
                //     {_total=item.after_discount ;      
                //     //_total=(( item.old_price - includesiveTax) * item.quantity)-item.discount_amount;
                //     }
                //  else
                    _total=( (item.old_price* item.quantity) - includesiveTax  ) ;
               
               //var _total=(calculatedPrice - getInclusiveTax( calculatedPrice, item.TaxClass)) * item.quantity
                item['subtotal'] =_total;
                item['total'] =price  ; 
                item['total_tax'] = tax;
                item['subtotal_tax'] = tax;
            })
            all_products = products;
            break;
        // case 2
        case 2:
            products.map(item => {
                price = (item.discount_amount !== 0) ? item.after_discount : (item.old_price - getInclusiveTax(item.old_price, item.TaxClass)) * item.quantity;
                var taxes = [];
                var update_discount_tax = null;
                var priceIs =  ((item.discount_amount !== 0) ? item.after_discount : item.old_price*item.quantity);              
                var discountTaxes = [];
                var singleTaxAmount = item.excl_tax > 0 ? item.excl_tax : 0;
                if (item.TaxStatus !== 'none') {
                    if (item.discount_amount !== 0) {
                        update_discount_tax = getExclusiveTaxForTotal(priceIs, item.TaxClass);
                    }
                    var update_Ex_tax = getInclusiveTaxForTotal(item.old_price, item.TaxClass);
                    update_Ex_tax.map(taxIs => {
                        taxes.push({ [taxIs.id]: taxIs.price * item.quantity })
                    })
                    update_discount_tax && update_discount_tax.length > 0 && update_discount_tax.map(taxDis => {
                        discountTaxes.push({ [taxDis.id]: taxDis.price})
                    })
                }
                tax = (item.discount_amount !== 0) ? discountTaxes : taxes;
                //console.log("tax", tax)
                item['subtotal'] = (item.old_price - getInclusiveTax(item.old_price, item.TaxClass)) * item.quantity
                item['total'] = price;
                item['total_tax'] = tax;
                item['subtotal_tax'] = tax;

            })
            all_products = products;

            break;
        // case 3
        case 3:
            products.map(item => {
                price = (item.discount_amount !== 0) ? (item.after_discount * item.quantity) - getInclusiveTax(item.after_discount, item.TaxClass) : (item.old_price - getInclusiveTax(item.old_price, item.TaxClass)) * item.quantity;
                var taxes = [];
                var update_discount_tax = null;
                var priceIs =  ((item.discount_amount !== 0) ? item.after_discount : item.old_price*item.quantity);
                var discountTaxes = [];
                var singleTaxAmount = item.incl_tax > 0 ? item.incl_tax : 0;
                if (item.TaxStatus !== 'none') {
                    if (item.discount_amount !== 0) {
                        update_discount_tax = getInclusiveTaxForTotal(priceIs, item.TaxClass);
                    }
                    var update_Ex_tax = getInclusiveTaxForTotal(item.old_price, item.TaxClass);
                    update_Ex_tax.map(taxIs => {
                        taxes.push({ [taxIs.id]: taxIs.price * item.quantity })
                    })
                    update_discount_tax && update_discount_tax.length > 0 && update_discount_tax.map(taxDis => {
                        discountTaxes.push({ [taxDis.id]: taxDis.price})
                    })
                }
                tax = (item.discount_amount !== 0) ? discountTaxes : taxes
                item['subtotal'] = (item.old_price - getInclusiveTax(item.old_price, item.TaxClass)) * item.quantity
                item['total'] = price;
                item['total_tax'] = tax;
                item['subtotal_tax'] = tax;
            })
            all_products = products;
            break;
        // case 4
        case 4:
            products.map(item => {
                price = (item.discount_amount !== 0) ? item.after_discount : (item.old_price - getInclusiveTax(item.old_price, item.TaxClass)) * item.quantity;
                var taxes = [];
                var update_discount_tax = null;
                var priceIs =  ((item.discount_amount !== 0) ? item.after_discount : item.old_price*item.quantity);
                var discountTaxes = [];
                var singleTaxAmount = item.excl_tax > 0 ? item.excl_tax : 0;
                //console.log("price", price)
                // console.log("singleTaxAmount", singleTaxAmount);
                if (item.TaxStatus !== 'none') {
                    if (item.discount_amount !== 0) {
                        update_discount_tax = getExclusiveTaxForTotal(priceIs, item.TaxClass);
                    }
                    var update_Ex_tax = getInclusiveTaxForTotal(item.old_price, item.TaxClass);
                    update_Ex_tax.map(taxIs => {
                        taxes.push({ [taxIs.id]: taxIs.price * item.quantity })
                    })
                    update_discount_tax && update_discount_tax.length > 0 && update_discount_tax.map(taxDis => {
                        discountTaxes.push({ [taxDis.id]: taxDis.price })
                    })
                }
                tax = (item.discount_amount !== 0) ? discountTaxes : taxes;
                item['subtotal'] = (item.old_price - getInclusiveTax(item.old_price, item.TaxClass)) * item.quantity
                item['total'] = price
                item['total_tax'] = tax
                item['subtotal_tax'] = tax;
            })
            break;
        case 6: case 8:
            products.map(item => {
                price = (item.discount_amount !== 0) ? (item.old_price * item.quantity) - item.discount_amount : item.old_price * item.quantity;
                var taxes = [];
                var update_discount_tax = null;
                var priceIs =  ((item.discount_amount !== 0) ? item.after_discount : item.old_price*item.quantity);
                var discountTaxes = [];
                if (item.TaxStatus !== 'none') {
                    if (item.discount_amount !== 0 && item.incl_tax == 0) {
                        update_discount_tax = getExclusiveTaxForTotal(priceIs, item.TaxClass);
                    }
                    var update_Ex_tax = getExclusiveTaxForTotal(item.old_price, item.TaxClass);
                    update_Ex_tax.map(taxIs => {
                        taxes.push({ [taxIs.id]: taxIs.price * item.quantity })
                    })
                    update_discount_tax && update_discount_tax.length > 0 && update_discount_tax.map(taxDis => {
                        discountTaxes.push({ [taxDis.id]: taxDis.price })
                    })
                }
                tax = (item.discount_amount !== 0) ? (item.incl_tax !== 0) ? item.incl_tax : discountTaxes : taxes;
                item['subtotal'] = item.old_price * item.quantity
                item['total'] = price
                item['total_tax'] = tax
                item['subtotal_tax'] = tax;
            })
            break;
        default:
            products.map(item => {
                price = (item.discount_amount !== 0) ? (item.old_price * item.quantity) - exclusiveDiscount(item.after_discount, item.discount_amount, (item.old_price * item.quantity)) : item.old_price * item.quantity;
                var taxes = [];
                var update_discount_tax = null;
                var priceIs =  ((item.discount_amount !== 0) ? item.after_discount : item.old_price)*item.quantity;
                var discountTaxes = [];
                if (item.TaxStatus !== 'none') {
                    if (item.discount_amount !== 0 && item.incl_tax !== 0) {
                        update_discount_tax = getInclusiveTaxForTotal(priceIs, item.TaxClass);
                    }
                    var update_Ex_tax = getExclusiveTaxForTotal(item.old_price, item.TaxClass);
                    update_Ex_tax.map(taxIs => {
                        taxes.push({ [taxIs.id]: taxIs.price * item.quantity })
                    })
                    update_discount_tax && update_discount_tax.length > 0 && update_discount_tax.map(taxDis => {
                        discountTaxes.push({ [taxDis.id]: taxDis.price })
                    })
                }
                tax = (item.discount_amount !== 0) ? (item.incl_tax !== 0) ? discountTaxes : item.excl_tax : taxes;
                item['subtotal'] = item.old_price * item.quantity
                item['total'] = price
                item['total_tax'] = tax
                item['subtotal_tax'] = tax;
            })
            all_products = products;
            break;
    }    
    return all_products
}

export const productPriceWithTax = (price, condition, taxclass) => {
    var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
    var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : null;
    var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
    var tax_rate = 0;
    var actual_price = 0;
    if (TaxRate && TaxRate.length > 0) {
        TaxRate.map(addTax => {
            if (addTax.check_is == true) {
                if (taxclass == addTax.TaxClass && apply_defult_tax == "true") {
                    tax_rate += parseFloat(addTax.TaxRate)
                }
                if (apply_defult_tax == "false") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
            }
        })
    }
    if (condition == '3' || condition == '4')
        return actual_price = parseFloat(price) / ((tax_rate / 100) + 1);
    else
        return actual_price = parseFloat((parseFloat(price) * tax_rate) / 100) + parseFloat(price);
}

export const typeOfTax = () => {
    var TAX_CASE = getSettingCase();
    var TAX_IS = "Tax";
    switch (TAX_CASE) {
        case 1: case 3: case 5: case 7:
            TAX_IS = "incl";
            break;
        default:
            TAX_IS = "Tax";
            break;
    }
    return TAX_IS
}
// Apply tax when show product list on shop 
export const getTaxAllProduct = (products) => {
    var all_products = [];
    var price = 0;
    var TAX_CASE = getSettingCase();
    //console.log("TAX_CASE", TAX_CASE)
    switch (TAX_CASE) {
        //  case 1  
        case 1: case 2: case 7: case 8:
            if(products && products !== null && products !== undefined){
                products.map(item => {
                    item['old_price'] = item.Price
                })
            }
            all_products = products;
            break;
        case 3: case 4: case 5: case 6:
            products &&  products.map(item => {
                item['old_price'] = item.Price;
                if (item.TaxStatus !== "none") {
                    price = productPriceWithTax(item.Price, TAX_CASE, item.TaxClass)
                    item['Price'] = parseFloat(price)
                }
            })
            all_products = products;
            break;
        default:
            products && products.map(item => {
                item['old_price'] = item.Price
            })
            all_products = products;
            break;
    }

    return all_products
}

export const cartPriceWithTax = (price, condition, taxclass) => {
    //console.log("cartPriceWithTax", price, condition)
    var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
    var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
    var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : null;
    var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
    var tax_rate = 0;
    var actual_price = 0;
    if (TaxRate && TaxRate.length > 0) {
        TaxRate.map(addTax => {
            if (addTax.check_is == true) {
                if (taxclass == addTax.TaxClass && apply_defult_tax == "true") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
                if (apply_defult_tax == "false") {
                    tax_rate += parseFloat(addTax.TaxRate);
                }
            }
        })
    }
    if (condition == '7')
        return actual_price = parseFloat((parseFloat(price) * tax_rate) / 100) + parseFloat(price);
    else if (condition == '2' || condition == '4')
        return actual_price = parseFloat(price) / ((tax_rate / 100) + 1);
    else
        return actual_price = parseFloat(price) - parseFloat((parseFloat(price) * tax_rate) / 100);
}
// Apply tax when product add on cart
// updated by: Nagendra
// udated Date: 19 May 2020
// Description: Remove the prodcut id to get tax  due to custome fee may be taxable and custome fee donot have product id.........
export const getTaxCartProduct = (products) => {
    //console.log("getTaxCartProduct",products)
    var TAX_CASE = getSettingCase();
    //console.log("TAX_CASE", TAX_CASE)
    var all_products = [];
    var price = 0;
    var incl_tax = 0;
    var excl_tax = 0;
    switch (TAX_CASE) {
        // case 1
        case 1:
            products.map(item => {
                if ( item.TaxStatus !== "none") {//item.product_id &&
                    incl_tax = getInclusiveTax(item.after_discount && item.after_discount>0?item.after_discount : item.old_price, item.TaxClass)
                    item['incl_tax'] = incl_tax //* item.quantity
                }
            })
            all_products = products;
            break;
        // case 2
        case 2:
            products.map(item => {
                if (item.TaxStatus !== "none") {//item.product_id && 
                    excl_tax = getInclusiveTax(item.old_price, item.TaxClass)
                    price = cartPriceWithTax(item.old_price, 2, item.TaxClass)
                    item['Price'] = price * item.quantity
                    item['excl_tax'] = excl_tax * item.quantity
                }
            })
            all_products = products;
            break;
        // case 3
        case 3:
            products && products.map(item => {
                if (item.TaxStatus !== "none") { //item.product_id && 
                    incl_tax = getInclusiveTax(item.old_price, item.TaxClass)
                    item['Price'] = item.old_price * item.quantity
                    item['incl_tax'] = incl_tax * item.quantity
                }
            })
            all_products = products;
            break;
        // case 4
        case 4:
            products && products.map(item => {
                if (item.TaxStatus !== "none") { //item.product_id && 
                    excl_tax = getInclusiveTax(item.old_price, item.TaxClass)
                    price = cartPriceWithTax(item.old_price, 4, item.TaxClass);
                    item['Price'] = price * item.quantity
                    item['excl_tax'] = excl_tax * item.quantity
                }
            })
            all_products = products;
            break;
        // case 5
        case 5:
            products.map(item => {
                if ( item.TaxStatus !== "none") { //item.product_id &&
                    incl_tax = getExclusiveTax(item.old_price, item.TaxClass)
                    item['Price'] = item.Price
                    item['incl_tax'] = incl_tax * item.quantity
                }
            })
            all_products = products;
            break;
        // case 6
        case 6:
            products && products.map(item => {
                if (item.TaxStatus !== "none") { //item.product_id && 
                    excl_tax = getExclusiveTax(item.old_price, item.TaxClass)
                    item['Price'] = item.old_price * item.quantity
                    item['excl_tax'] = excl_tax * item.quantity
                }
            })
            all_products = products;
            break;
        // case 7
        case 7:
            products && products.map(item => {
                if ( item.TaxStatus !== "none") {//item.product_id &&
                    price = cartPriceWithTax(item.old_price, 7, item.TaxClass)
                    incl_tax = getExclusiveTax(item.old_price, item.TaxClass)
                    item['Price'] = price * item.quantity
                    item['incl_tax'] = incl_tax * item.quantity
                }
            })
            all_products = products;
            break;
        // case 8
        default:
            products && products.map(item => {                
                //item.product_id &&
                if ( item.TaxStatus !== "none") {
                    excl_tax = getExclusiveTax(item.old_price, item.TaxClass)
                    item['excl_tax'] = excl_tax * item.quantity;
                }
            })
            all_products = products;
            break;
    }
    return all_products
}

export const inclusiveDiscount = (after_discount, discount_amount, old_price,TaxClass) => {
    var subtotal = old_price - getInclusiveTax(old_price,TaxClass);
    var price = after_discount + discount_amount;
    var discount = (discount_amount * 100.00) / price;
    var get_discount = (subtotal * discount) / 100.00;
    return get_discount;
}

export const exclusiveDiscount = (after_discount, discount_amount, old_price) => {
    var subtotal = old_price
    var price = after_discount + discount_amount;
    var discount = (discount_amount * 100.00) / price;
    var get_discount = (subtotal * discount) / 100.00;
    return get_discount;
}
// apply discount when finaly payment save
export const getDiscountAmount = (products) => {
    var TAX_CASE = getSettingCase()
    var discountIs = 0;
    var after_discount = 0;
    var discount_amount = 0;
    var old_price = 0;
    var TaxClass="";
    switch (TAX_CASE) {
        //  case 1  
        case 1: case 2: case 3: case 4:
            products.map(item => {
                if (item.discount_amount !== 0){
                   var afterDiscount=item.after_discount !==0?item.after_discount: item.product_after_discount* item.quantity;
                    after_discount += afterDiscount;
                }
                else {
                    after_discount += item.Price;
                }
                if(item.discount_type=='Percentage'){
                        var inclTax=getInclusiveTax(item.old_price,item.TaxClass);
                        discount_amount +=percentWiseDiscount(item.old_price-inclTax, item.new_product_discount_amount) * item.quantity;
                        discountIs =discount_amount;
                    }else if(item.discount_type=='Number'){
                        discount_amount += item.discount_amount;
                        discountIs = inclusiveDiscount(after_discount, discount_amount, old_price, TaxClass);
                }
                old_price += item.old_price * item.quantity;
                TaxClass=item.TaxClass;
            })
           
            break;
        // case 5
        case 6: case 8:
            products.map(item => {
                discountIs += item.discount_amount;
            })
            break;

        default:
            products.map(item => {
                if (item.discount_amount !== 0)
                    after_discount += item.after_discount;
                else {
                    after_discount += item.Price;
                }
                discount_amount += item.discount_amount;
                old_price += item.old_price * item.quantity;
            })
            discountIs = exclusiveDiscount(after_discount, discount_amount, old_price)
            break;
    }

    return discountIs
}
// case for all type of shop tax setting
export const getSettingCase = () => {
    var TaxSetting = localStorage.getItem("TAX_SETTING") ? JSON.parse(localStorage.getItem("TAX_SETTING")) : null;
    var all_products = [];
    var prices_include_tax = TaxSetting ? TaxSetting.pos_prices_include_tax : 'no';
    var tax_display_shop = TaxSetting ? TaxSetting.pos_tax_display_shop : 'excl';
    var tax_display_cart = TaxSetting ? TaxSetting.pos_tax_display_cart : 'excl';
    var tax_round_at_subtotal = TaxSetting ? TaxSetting.pos_tax_round_at_subtotal : 'no';
    var tax_case = 0;

    switch (true) {
        //  case 1  
        case (prices_include_tax == "yes" && tax_display_shop == "incl" && tax_display_cart == "incl"):
            tax_case = 1;
            break;
        // case 2
        case (prices_include_tax == "yes" && tax_display_shop == "incl" && tax_display_cart == "excl"):
            tax_case = 2;
            break;
        // case 3
        case (prices_include_tax == "yes" && tax_display_shop == "excl" && tax_display_cart == "incl"):
            tax_case = 3;
            break;
        // case 4
        case (prices_include_tax == "yes" && tax_display_shop == "excl" && tax_display_cart == "excl"):
            tax_case = 4;
            break;
        // case 5
        case (prices_include_tax == "no" && tax_display_shop == "incl" && tax_display_cart == "incl"):
            tax_case = 5;
            break;
        // case 6
        case (prices_include_tax == "no" && tax_display_shop == "incl" && tax_display_cart == "excl"):
            tax_case = 6;
            break;
        // case 7
        case (prices_include_tax == "no" && tax_display_shop == "excl" && tax_display_cart == "incl"):
            tax_case = 7;
            break;
        // case 8
        default:
            tax_case = 8;
            break;
    }
    return tax_case
}

export const changeTaxRate = (item, status) => {
    var array_of_tax = [];
    if (item) {

        item && item.map(items => {
            if (items.check_is == true) {
                array_of_tax.push(items);
            }

        })
        if (array_of_tax && array_of_tax.length > 0) {
            localStorage.setItem('DEFAULT_TAX_STATUS', false)
        }
        localStorage.setItem("TAXT_RATE_LIST", JSON.stringify(array_of_tax));
    }
    var products = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    var updateTax = getTaxCartProduct(products);
    return updateTax;
}

export const RoundAmount = (val) => {
    //return Math.round(val * 100) / 100;
    var decimals = 2;
    return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}

/**
 * Created BY : Shakuntala Jatav
 * Created Date : 28-Feb-2020
 * @param {*} productx get product-x data
 * @param {*} product_list get product list array
 * Description : Apply taxes on chlid product of productx data
 */
export const getProductxChlidProductTax = (productx, product_list) => {
    productx.map(prdx => {
        if (prdx.composite_data) {
            var productXArray = setProductxTax(prdx.composite_data, product_list);
            prdx['composite_data'] = productXArray;
        }
        if (prdx.stamp) {
            var productXArray = setProductxTax(prdx.stamp, product_list);
            prdx['stamp'] = productXArray;
        }
    })
    return productx;
}

/**
 * Created BY : Shakuntala Jatav
 * Created Date : 02-03-2020
 * @param {*} productx 
 * @param {*} product_list 
 * Description : Prepair taxes on chlid product of productx data
 */
export const setProductxTax = (productx, product_list) => {
    Object.keys(productx).map(i => {
        var findProductValue = product_list.filter(_item => (productx[i].variation_id ? (_item.WPID == productx[i].variation_id && _item.ParentId == productx[i].product_id && productx[i].quantity > 0) : (_item.WPID == productx[i].product_id) && productx[i].quantity > 0));
        if (findProductValue && findProductValue.length > 0) {
            findProductValue[0]['quantity'] = productx[i].quantity;
            findProductValue[0]['product_id'] = productx[i].product_id;
            findProductValue[0]['variation_id'] = productx[i].variation_id ? productx[i].variation_id : 0;
            findProductValue[0]['discount_amount'] = productx[i].discount ? productx[i].discount : 0;
            findProductValue[0]['after_discount'] = productx[i].discount ? parseFloat(findProductValue[0].Price * Number(productx[i].quantity)) - parseFloat(productx[i].discount) : 0;

            var setProducts = getTaxAllProduct(findProductValue);
            var products = getTaxCartProduct(setProducts);
            var taxWithProductx = getCheckoutList(products);
            if (products && products.length > 0) {
                productx[i]['line_subtotal'] = products[0].subtotal;
                productx[i]['line_total'] = products[0].total;
                productx[i]['line_tax'] = products[0].total_tax;
                productx[i]['line_subtotal_tax'] = products[0].subtotal_tax;
            }
        }
    })
    //console.log("productx updated tax", productx);
    return productx;
}
/**
 * Created By : Shakuntala Jatav
 * Creatted Date : 13-03-2020
 * @param {*} type 
 * Description : Showing Tax Rate with name
 */

export const getTotalTaxByName = (type, productx_line_items) => {
    var placedOrderList = (type == 'completecheckout') ? localStorage.getItem('placedOrderList') ? JSON.parse(localStorage.getItem('placedOrderList')) : null : type;
    //var selected_taxrate_list = localStproductx_line_itemsorage.getItem('SELECTED_TAX') ? JSON.parse(localStorage.getItem('SELECTED_TAX')) : null;
    //SHOP_TAXRATE_LIST
    var selected_taxrate_list = localStorage.getItem('SHOP_TAXRATE_LIST') ? JSON.parse(localStorage.getItem('SHOP_TAXRATE_LIST')) : null;
    var total_taxrate_name = [];
    var total_taxrate_ids = [];
    if (productx_line_items && productx_line_items.length > 0) {
        productx_line_items.map(itemx => {
            if (itemx.line_total_taxes && itemx.line_total_taxes.length > 0) {
                itemx.line_total_taxes.map(subitemx => {
                    total_taxrate_ids.push(subitemx)
                })
            }
        })
    }
    if (placedOrderList && placedOrderList.length > 0) {
        placedOrderList.map(item => {
            if (item.total_taxes && item.total_taxes.length > 0) {
                item.total_taxes.map(subitem => {
                    total_taxrate_ids.push(subitem)
                })
            }
            if (type !== "completecheckout") {
                var Taxes = item.Taxes.replace(/^\/?|\/?$/, "");
                const object1 = JSON.parse(Taxes);
                if (object1) {
                    for (var [key, value] of Object.entries(object1.total)) {
                        total_taxrate_ids.push({ [key]: value })
                    }
                }
            }
        })
    }
    if (total_taxrate_ids && total_taxrate_ids.length > 0) {
        for (var i = 0; i < total_taxrate_ids.length; i++) {
            for (var key in total_taxrate_ids[i]) {
                var filterSelectedTaxRateList = selected_taxrate_list && selected_taxrate_list.filter(match => (match.TaxId == key));
                if (filterSelectedTaxRateList && filterSelectedTaxRateList.length > 0) {
                    var tax_id = filterSelectedTaxRateList[0].TaxId;
                    var tax_name = filterSelectedTaxRateList[0].TaxName;
                    var tax_TaxRate = filterSelectedTaxRateList[0].TaxRate;
                    var tax_amount = parseFloat(total_taxrate_ids[i][key]);
                    var filterValue = total_taxrate_name && total_taxrate_name.find(_match => (_match.tax_id == tax_id));
                    if (filterValue) {
                        total_taxrate_name.map(item => {
                            if (item.tax_id == tax_id) {
                                item['tax_amount'] += tax_amount;
                                
                            }
                        })
                    }
                    if (!filterValue) {
                        total_taxrate_name.push({ 'tax_id': tax_id, 'tax_name': tax_name, 'tax_amount': tax_amount,'TaxRate':tax_TaxRate })
                    }
                }
            }
        }
        //console.log("total_taxrate_name", total_taxrate_name);
    }
    return total_taxrate_name;
}

function percentWiseDiscount(price, discount) {
    var discountAmount = (price * discount) / 100.00;
    return discountAmount;
}
/**
 * Created By : Shakuntala jatav
 * Created Date : 06-04-2020
 * @param {*} item 
 * @param {*} qty 
 * Description : 1. for caculate tax varition poup modal
                 2. Apply tax when product add on cart
 */

export const getVariatioModalProduct = (item, qty) => {
    //console.log("getVariatioModalProduct", item, qty)
    var TAX_CASE = getSettingCase();
    //console.log("TAX_CASE", TAX_CASE)
    var all_products = [];
    var price = 0;
    var incl_tax = 0;
    var excl_tax = 0;
    var discount_amount = item.product_discount_amount ? parseFloat(item.product_discount_amount) : 0;
    var after_discount_price = 0;
    switch (TAX_CASE) {
        // case 1
        case 1:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                incl_tax = getInclusiveTax(item.old_price, item.TaxClass)               
                if(item.discount_type == "Percentage") {
                  var  productDiscount=percentWiseDiscount(item.old_price-incl_tax, item.new_product_discount_amount);
                  after_discount_price =  (item.old_price-incl_tax) - productDiscount
                }  else{
                    after_discount_price =  ((item.old_price-incl_tax) * qty) - discount_amount;
                }
                if(item.discount_type == "Percentage" ){
                    incl_tax = getInclusiveTax(item.old_price-discount_amount, item.TaxClass)
                }else{
                    incl_tax = getInclusiveTax((item.old_price * qty )-discount_amount, item.TaxClass)
                }

                //incl_tax = getInclusiveTax(after_discount_price, item.TaxClass)
                //item['Price'] = after_discount_price * qty
                item['incl_tax'] = item.discount_type == "Percentage" ? incl_tax * qty : incl_tax;
                // ******** comented below line  to solve qty * issue on after discount *****//
                // **tst** item['after_discount'] = item.discount_type == "Percentage" ? after_discount_price * qty : after_discount_price;

                //**tst** remove qty multiplication from after discount
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 2
        case 2:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                excl_tax = getInclusiveTax(after_discount_price, item.TaxClass)
                price = cartPriceWithTax(after_discount_price, 2, item.TaxClass)
                //item['Price'] = price * qty
                item['excl_tax'] = item.discount_type == "Percentage" ? excl_tax * qty : excl_tax;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 3
        case 3:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                incl_tax = getInclusiveTax(after_discount_price, item.TaxClass)
                //item['Price'] = after_discount_price * qty
                item['incl_tax'] = item.discount_type == "Percentage" ? incl_tax * qty : incl_tax;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 4
        case 4:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                excl_tax = getInclusiveTax(after_discount_price, item.TaxClass)
                price = cartPriceWithTax(after_discount_price, 4, item.TaxClass);
                //item['Price'] = price * qty
                item['excl_tax'] = item.discount_type == "Percentage" ? excl_tax * qty : excl_tax;;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 5
        case 5:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                incl_tax = getExclusiveTax(after_discount_price, item.TaxClass)
                //item['Price'] = item.Price * qty
                item['incl_tax'] = item.discount_type == "Percentage" ? incl_tax * qty : incl_tax;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 6
        case 6:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                excl_tax = getExclusiveTax(after_discount_price, item.TaxClass)
                //item['Price'] = after_discount_price * old_price
                item['excl_tax'] = item.discount_type == "Percentage" ? excl_tax * qty : excl_tax;;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 7
        case 7:
            if (item.WPID && item.TaxStatus !== "none") {
                //after_discount_price = item.old_price - discount_amount;
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                price = cartPriceWithTax(after_discount_price, 7, item.TaxClass)
                incl_tax = getExclusiveTax(after_discount_price, item.TaxClass)
                //item['Price'] = price * qty
                item['incl_tax'] = item.discount_type == "Percentage" ? incl_tax * qty : incl_tax;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
        // case 8
        default:
            if (item.WPID && item.TaxStatus !== "none") {
                after_discount_price = item.discount_type == "Percentage" ? item.old_price - discount_amount : (item.old_price * qty) - discount_amount;
                excl_tax = getExclusiveTax(after_discount_price, item.TaxClass)
                //item['Price'] = after_discount_price * qty
                item['excl_tax'] = item.discount_type == "Percentage" ? excl_tax * qty : excl_tax;
                item['after_discount'] = after_discount_price;
            }
            all_products = item;
            break;
    }
    return all_products
}

export const TaxSetting = {
    getTaxAllProduct, productPriceWithTax, getTaxCartProduct, cartPriceWithTax, getInclusiveTax, getExclusiveTax, getCheckoutList, getDiscountAmount, getSettingCase, typeOfTax, changeTaxRate, getExtensionCheckoutList, setListActivityToCheckout, RoundAmount,
    getProductxChlidProductTax, getTotalTaxByName
}
export default TaxSetting;