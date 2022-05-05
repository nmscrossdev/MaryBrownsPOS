import paymentsType from './PaymentsType'
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

export function initSlider()
{
   var timer = getTitle(_key.TRANSITION_TIME_BETWEEN_IMAGES_DEFAULT_IS_8_SECONDS);
   if(timer && typeof timer!="undefined")
   {
       timer =parseInt(timer)*1000;
   }
    //TRANSITION_TIME_BETWEEN_IMAGES_DEFAULT_IS_8_SECONDS
// Slider
    let sliderToggles = document.querySelector(".slider-container > .slider-toggles");
    if(sliderToggles && sliderToggles.hasChildNodes()==false)
    {
        let sliderImages = document.querySelectorAll(".slider-container > .slider > img");
        let sliderImageWidth = sliderImages[0].offsetWidth;
        for (let i = 0; i < sliderImages.length; i++) {
            sliderImages[i].style.left = `${i * -sliderImageWidth}px`;
            let toggle = document.createElement("div");
            toggle.setAttribute("class", "toggle");
            if (i == 0) {
                toggle.classList.add("selected");
            }
            sliderToggles.appendChild(toggle);
        }

        // let sliderTimer = setTimeout(slide, 5000);
        let sliderTimer = setTimeout(slide, timer);

        document
            .querySelectorAll(".slider-container > .slider-toggles > .toggle")
            .forEach((toggle) => {
                toggle.addEventListener("click", changeSlide);
            });

        function changeSlide(e) {
            clearTimeout(sliderTimer);
            let children = Array.from(e.target.parentNode.children);
            let index = children.indexOf(e.target);
            children.forEach((child) => {
                child.classList.remove("selected");
            });
            children[index].classList.add("selected");
            if (index < sliderImages.length - 1) {
                for (let i = 0; i < sliderImages.length; i++) {
                    sliderImages[i].style.left = `${(index - i) * sliderImageWidth}px`;
                }
            } else {
                for (let i = 0; i < sliderImages.length; i++) {
                    if (i < sliderImages.length - 1) {
                        sliderImages[i].style.left = `-${(i + 1) * sliderImageWidth}px`;
                    } else {
                        sliderImages[i].style.left = `0px`;
                    }
                }
            }
            sliderTimer = setTimeout(slide, 5000);
        }

        function slide() {
            let toggles = document.querySelectorAll(
                ".slider-container > .slider-toggles > .toggle"
            );
            for (let i = 0; i < sliderImages.length; i++) {
                let currentLeft = parseInt(
                    window
                        .getComputedStyle(sliderImages[i])
                        .getPropertyValue("left")
                        .replace("px", "")
                );
                if (currentLeft == 0) {
                    toggles[i].classList.remove("selected");
                } else if (currentLeft == -sliderImageWidth) {
                    toggles[i].classList.add("selected");
                }
                if (currentLeft > 0) {
                    sliderImages[i].style.left = `-${
                        sliderImageWidth * (sliderImages.length - 2)
                    }px`;
                } else {
                    sliderImages[i].style.left = `${currentLeft + sliderImageWidth}px`;
                }
            }
            sliderTimer = setTimeout(slide, 5000);
        }
    }
}

export function initScreenSaver()
{
   var _timer = getTitle(_key.TIMEOUT_WAIT_TIME);
   if(_timer && typeof _timer!="undefined")
   {
    _timer =parseInt(_timer)*1000;
   } 
    //toggleScroll();

    var timer = setTimeout(setScreensaver, _timer);
    clearTimeout(timer);

    var cycle = setTimeout(cycleScreensaver, 10000);

    document.body.addEventListener("click", function () {
        clearTimeout(cycle);
        clearTimeout(timer);
        let screensaver = document.getElementById("screensaver");
        if (!screensaver.classList.contains("hide")) {
            screensaver.classList.add("hide");
        }
        timer = setTimeout(setScreensaver, _timer);
        //toggleScroll(false);
    });

    function setScreensaver() {
        //toggleScroll();
        clearTimeout(timer);
        document.getElementById("screensaver").classList.remove("hide");
        cycle = setTimeout(cycleScreensaver, 10000);
    }

    function cycleScreensaver() {
        let images = document.querySelectorAll(".screensaver > div");
        for (let i = 0; i < images.length; i++) {
            if (images[i].classList.contains("front")) {
                images[i].classList.remove("front");
                images[i + 1 == images.length ? 0 : i + 1].classList.add("front");
                cycle = setTimeout(cycleScreensaver, 10000);
                return;
            }
        }
    }
}

export function getExtPaymentMethods()
{
    var ext_Payment_Fields = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
    //var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
    //var register_content = Register_Permissions ? Register_Permissions.content : '';
    
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
    if(settings&& settings.length>0)
    {
        var foundExtPaymentType = settings.filter(function (indx) {
            return indx.Section=="checkout-payments" && indx.SubSection ==  "paymet-extention-option";
        });
    }

    var extension_views_field = [];
    var ext_payments=[];
    if (ext_Payment_Fields && ext_Payment_Fields !== []) {
        extension_views_field = ext_Payment_Fields.filter(item => item.PluginId > 0 &&  extension_views_field.removed_from_origin !==true)
        var new_extension_views_field = extension_views_field.filter((ext, index) => {
            return ext.viewManagement.find((type=>type && type.ViewSlug == 'Payment Types'));
        });
        const extNames = foundExtPaymentType && foundExtPaymentType.map(ext => ext.PaymentType.DisplayName);  
        ext_payments=new_extension_views_field;
        // ext_payments = new_extension_views_field.filter(item =>{
        //     return extNames.includes(item.ViewSlug)
        // })
    }
    //console.log("------ext_payments-----"+JSON.stringify(ext_payments))
    return ext_payments;
}

export function getPaymentMethods()
{
    var paymentTypeName= (typeof localStorage.getItem('PAYMENT_TYPE_NAME') !== 'undefined') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : null;
    let settings= localStorage.getItem("selfcheckout_setting")?JSON.parse( localStorage.getItem("selfcheckout_setting")):[]
    if(settings&& settings.length>0)
    {
        var foundPaymentType = settings.filter(function (indx) {
            return indx.Section=="checkout-payments" && indx.SubSection ==  "paymet-type-option";
        });
    }
    var pt_payments_options=[];
    if((typeof paymentTypeName !== 'undefined') && paymentTypeName !== null)
    {
        var pt_payments=[];
        pt_payments= paymentTypeName.filter(item => item.Code !== paymentsType.typeName.cashPayment);
        // .map((pay_name, index) => {
        //     return (
        //         register_content.filter(item => item.subSection == "PaymentType").map((itm, index) => {
        //             if (itm.slug == pay_name.Code && itm.value == "true") {
        //                 return pay_name;                                                              
        //             }
        //         })
        //     )
        // });
        const ptNames = foundPaymentType && foundPaymentType.map(ext => ext.PaymentType.DisplayName);
        pt_payments_options = pt_payments.filter(item =>{
            return ptNames.includes(item.Name)
        })
        //console.log("------pt_payments_options-----"+JSON.stringify(pt_payments_options))
    }
    return pt_payments_options;
}