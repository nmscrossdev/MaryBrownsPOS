
export const _key = {      
    TITLE_FOR_CATEGORY_SECTION:"title-for-category-section",
    TITLE_FOR_PRODUCT_SECTION:"title-for-product-section",
    THEME_PRIMARY_COLOR:"primary-color",
    THEME_SECONDARY_COLOR:"secondary-color",

    DISPLAY_SEARCH_BAR:"display-search-bar",
    LABEL_FOR_SEARCH_INPUT_FIELD:"label-for-search-input-field",

    DISPLAY_ORDER_NOTES:"display-order-notes",
    DISPLAY_PRODUCT_PAGE:"product-page",
    DISPLAY_CART_PAGE:"cart-page",

    DISPLAY_PAYMENT_PAGE_CUSTOM_LOGO:"display-custom-logo",
    PAYMENT_PAGE_CUSTOM_LOGO:"custom-logo",
    
    DISPLAY_CUSTOM_HOMEPAGE_BANNER:"custom-homepage-banner",
    CUSTOM_BANNER:"custom-banner",

    TRANSITION_TIME_BETWEEN_IMAGES_DEFAULT_IS_8000_MILLISECONDS:"transition-time-between-images-default-is-8000-milliseconds",
    DISPLAY_CATEGORY_TILES:"display-category-tiles",
    CATEGORIES:"categories",

    DISPLAY_APPS:"display-apps",
    HOME_PAGE_APPS:"home-page",
    PRODUCT_PAGE_APPS:"product-page",
    CHECKOUT_PAGE_APPS:"checkout-page",
    RECEIPT_PAGE_APPS:"receipt-page",

    DISPLAY_PRODUCT_RECOMMENDATIONS_ON_PRODUCT_PAGE:"show-product-recommendations-on-product-pag",
    DISPLAY_PRODUCT_RECOMMENDATIONS_ON_CART_PAGE:"show-product-recommendations-on-cart-page",
    PRODUCT_RECOMMENDATIONS:"ProductRecommendations",
    CART_PAGE_PRODUCT_RECOMMENDATIONS:"cart-page-options",

    ALLOW_PARK_SALE:"allow-park-sale",
    PAYMENT_BUTTON_LABEL:"payment-button-label",

    TIMEOUT_WAIT_TIME:"timeout-wait-time",
    TRANSITION_TIME_BETWEEN_IMAGES_DEFAULT_IS_8_SECONDS:"transition-time-between-images-default-is-8-seconds",
    CHECKOUT_PAYMENTS:"checkout-payments",
    PAYMET_TYPE_OPTION:"paymet-type-option",
    PAYMET_EXTENTION_OPTION:"paymet-extention-option",


    //section name
    HOME_PAGE: "home-page",
    PRODUCT_PAGE:"product-page",
    RECEIPT_PAGE:"receipt-page",
}

export function getTitle(key) {
     let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
     if(settings && settings.length>0)
     {
        var found = settings.find(function (indx) {
            return indx.LabelSlug ==  key;
        });
        return found?found.Value:'';
     }
     return null;
}
export function isDisplay(key) {
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
    if(settings && settings.length>0)
    {
       var found = settings.find(function (indx) {
           return indx.LabelSlug ==  key;
       });
       return found?found.Value:null;
    }
    return null;
   
}
export  function getSettingByKey(key) {
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
     if(settings && settings.length>0)
     {
       var found = settings.find(function (indx) {
           return indx.LabelSlug ==  key;
       });
       return found?found.Value:'';
    }
    return null;
}
export function getRecommendedProducts(key,page) {
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
    //var productlist=[];
    // var idbKeyval = FetchIndexDB.fetchIndexDb();
    //     idbKeyval.get('ProductList').then(val => {
    //         if (!val || val.length == 0 || val == null || val == "") {
    //         } 
    //         else
    //         {
    //             var _productwithTax = getTaxAllProduct(val)
    //             productlist = _productwithTax;
                if(settings && settings.length>0)
                    {
                    var subsection= (page=="cart" ? "cart-page-options" :"");
                    var found = settings.filter(function (indx) {
                        return indx.InputType=="Select" && indx.Section ==  key && indx.SubSection== subsection;
                    });
                    const ids = found && found.map(rp => rp.Value);

                    // const filter_products = productlist && productlist.filter(item =>{
                    //     return ids.includes(`${item.WPID}`)
                    // })
                    // console.log("---getRecommendedProducts-"+JSON.stringify(filter_products))
                    //return filter_products?filter_products:[];
                    return ids;
                }
            
        //});
    
    
    return [];
}
export function getBanners(key) {
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
    if(settings&& settings.length>0)
    {
       var found = settings.find(function (indx) {
           return indx.LabelSlug ===  key;
       });
       
       if(found && found.Value=="true")
       {
        var banners = settings.find(function (indx) {
            return indx.LabelSlug ===  _key.CUSTOM_BANNER && indx.SubSection=="upload-your-images";
        });
        return banners;
       }
       return null;
    }
}

export function getCategories(key) {
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
    if(settings&& settings.length>0)
    {
       var found = settings.find(function (indx) {
           return indx.LabelSlug ===  key && indx.Section=="Categories";
       });
       if(found && found.Value=="true")
       {   
        var categories = settings.find(function (indx) {
            return indx.LabelSlug ===  _key.CATEGORIES && indx.Section=="Categories";
        }); 
       if(categories && categories.Categories)
       {
        const ids = categories.Categories.map(cat => cat.CategoryId);  

        var categorieslist= localStorage.getItem("categorieslist")?JSON.parse( localStorage.getItem("categorieslist")):[]
      
        const filter_categories = categorieslist.filter(item =>{
            return ids.includes(item.id)
        })

        // var _categories = settings.find(function (indx) {
        //     return indx.LabelSlug ===  _key.CUSTOM_BANNER && indx.SubSection=="upload-your-images";
        // });
        return filter_categories?filter_categories:[];
       }
       
       }
       return null;
    }
   
}