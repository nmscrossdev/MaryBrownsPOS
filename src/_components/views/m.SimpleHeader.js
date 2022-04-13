import React from 'react';
import { history } from '../../_helpers';
import { RoundAmount } from "../TaxSetting";
import ActiveUser from '../../settings/ActiveUser';

const productCount = (cartproductlist) => {
    var countlist = []
    cartproductlist.map(item => {
        if (item.product_id) {
            countlist.push(item.product_id)
        }
    })
    return countlist.length
}

const cartListTotalAmount = (cartproductlist) => {
    var _subtotalPrice = 0.0, _exclTax = 0.0, _inclTax = 0.0, _subtotalDiscount = 0.0, _subtotal = 0.0, _taxAmount = 0.0, _total = 0.0;
    cartproductlist && cartproductlist.map(item => {
        if (item.Price) {
            _subtotalPrice += item.Price
            _subtotalDiscount += parseFloat(item.discount_amount)
            if (item.product_id) {//donothing
                _exclTax += item.excl_tax ? item.excl_tax : 0,
                    _inclTax += item.incl_tax ? item.incl_tax : 0
            }
        }
    })
    _subtotalDiscount = RoundAmount(_subtotalDiscount);
    _exclTax = RoundAmount(_exclTax);
    _inclTax = RoundAmount(_inclTax);
    _subtotal = _subtotalPrice - _subtotalDiscount;
    _taxAmount = parseFloat(_exclTax) + parseFloat(_inclTax);
    _total = parseFloat(_subtotal) + parseFloat(_taxAmount);
    return parseFloat(_total).toFixed(2);
}
const navigateToPage = (url) => {
    history.push(url);
}
const voidSale = (VOID_SALE, props) => {
    var voidSale = false;
    if ((typeof VOID_SALE !== 'undefined') && VOID_SALE !== null) {
        voidSale = true;
    }
    if (voidSale == true) {
        props.extraPayAmount(props.LocalizedLanguage.voidSaleMsg)
    } else {
        localStorage.removeItem('extensionUpdateCart');
        history.push("/shopview")
    }
}
const backToSetting=(props)=>
{
    //props.hidePrinterSetting()
}
const getRemainingPrice = (checkList) => {
    var totalPrice = checkList && checkList.totalPrice ? parseFloat(checkList.totalPrice) : 0
    var paid_amount = 0;
    if (localStorage.oliver_order_payments) {
        JSON.parse(localStorage.getItem("oliver_order_payments")).forEach(paid_payments => {
            paid_amount += parseFloat(paid_payments.payment_amount);
        })
    }
    return parseFloat(totalPrice - paid_amount).toFixed(2);
}

const noCallAnyFunction = () => {
    //  prevents for warning error
}
const logOut=()=>
{
    if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
    {
        Android.wrapperLogout();
    }
    else
    {
        history.push("/login")
    }
}
const MobileSimpleHeader = (props) => {
    const { productList, match, LocalizedLanguage, addNewCustomter, openModalActive, cartproductlist, openModal, activeComponent, windowLocation1, sale_to_void_status, onSinginselfcheckout } = props;
    var OrderDetail = (typeof sessionStorage.getItem("OrderDetail") !== 'undefined') && sessionStorage.getItem("OrderDetail") ? JSON.parse(sessionStorage.getItem("OrderDetail")) : null;
    var CHECKLIST = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
    var VOID_SALE = localStorage.getItem("VOID_SALE");
    var activityNavigatonUrl = '/MobileActivityOptions';
    if ((typeof sale_to_void_status !== 'undefined') && sale_to_void_status !== null) {
        VOID_SALE = "void_sale";
    }
     return (
        (ActiveUser.key.isSelfcheckout == true)?
        <div>           
           <div className="appHeader">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-4">
                            {/* <div className="appToggle">
                                <button data-target="slide-out" className="sidenav-trigger btn btn-link fz-30">
                                    <img src="./mobileAssets/img/menu.svg" className="w-30" alt=""/>
                                </button>
                            </div> */}
                        </div>
                        <div className="col-4">
                            <div className="appTitle pointer">
                                <h3>Cart ({cartproductlist && productCount(cartproductlist)})</h3>
                                {cartproductlist ? cartListTotalAmount(cartproductlist) : '0.00'}
                            </div>
                        </div>
                        <div className="col-4 text-right">
                            <button className="btn btn-outline-primary fz-14 shadow-none" data-toggle="modal" data-target="#SignInMenu" onClick={ onSinginselfcheckout}>Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sidenav-overlay" data-target="slide-out"></div>
        </div>
        :
        <div className="appHeader">
            <div className="container-fluid">
                <div className="row align-items-center">
                    {match.path == '/checkout' ?
                        <div className={activeComponent == "checkout_second" ? "col-5" : "col-4"}>
                            <div className="appToggle">
                                {activeComponent == "checkout_second" ?
                                    <a className="appHeaderBack" href="javascript:void(0);" onClick={() => props.changeComponent("checkout_third")} >
                                        <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                                    </a>
                                    :
                                    <a className="appHeaderBack" href="javascript:void(0)" onClick={() => voidSale(VOID_SALE, props)}>
                                        <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {((typeof VOID_SALE !== 'undefined') && VOID_SALE !== null) ? LocalizedLanguage.voidSale : ''}
                                    </a>
                                }
                            </div>
                        </div>
                        :
                        match.path == '/activity' ?   //Activity Detail
                            <div className="col-3" >
                                <div className="appToggle">
                                    <a className="appHeaderBack" onClick={() => OrderDetail !== null ? window.location = '/activity' : navigateToPage('/shopview')} >
                                        <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                                    </a>
                                    {/* <button data-target="slide-out" className="sidenav-trigger btn btn-link fz-30">
                                    <img src="../mobileAssets/img/menu.svg" className="w-30" alt="" />
                                </button> */}
                                </div>
                            </div>
                            :
                            ((typeof VOID_SALE !== 'undefined') && VOID_SALE !== null) ?
                                <div className="col-4"></div>
                                :
                                match.path == '/wsetting' && (typeof localStorage.getItem('showPrinterSetting')!="undefined" && localStorage.getItem('showPrinterSetting')=='true')?
                                <div className={"col-3"}>
                                    <div className="" onClick={props.hidePrinterSetting}>
                                    <a href='javascript:void(0)' className="appHeaderBack" ><img src="../mobileAssets/img/back.svg" className="w-30" alt=""/></a>
                                    </div>
                                </div>
                                :
                                localStorage.getItem('register')?
                                <div className={!OrderDetail || OrderDetail == null ? "col-4" : "col-3"}>
                                    <div className="appToggle">
                                        <button data-target="slide-out" className="sidenav-trigger btn btn-link fz-30">
                                            <img src="../mobileAssets/img/menu.svg" className="w-30" alt="" />
                                        </button>
                                    </div>
                                </div>:
                                <div className={!OrderDetail || OrderDetail == null ? "col-4" : "col-3"}>
                                    <div className="appToggle">
                                        <div className="sidenav-trigger btn btn-link fz-30">
                                        </div>
                                    </div>
                                </div>
                    }
                    {match.path == '/shopview' ?
                        <div className="col-4">
                            <div className="appTitle" onClick={() => openModal("view_cart")}>
                                <h3>{LocalizedLanguage.sale} ({cartproductlist && productCount(cartproductlist)})</h3>
                                {cartproductlist && cartproductlist.length > 0 && cartListTotalAmount(cartproductlist)}
                            </div>
                        </div>
                    : null}
                    {match.path == '/activity' && OrderDetail == null ?   //Activity
                        <div className="col-6">
                            <div className="appTitle">
                                <h3>{LocalizedLanguage.activityView}</h3>
                            </div>
                        </div>
                        : null}
                    {match.path == '/activity' && OrderDetail !== null ? //Activity Detail
                        <div className="col-6">
                            <div className="appTitle pointer" >
                                {/* onClick={()=>{history.push("/customerview")}} */}
                                <h3 className="text-truncate">{OrderDetail.CustFullName}</h3>
                                <p className="text-dark mb-0">{OrderDetail.order_status}</p>
                            </div>
                        </div>
                        : null}
                    {match.path == '/customerview' ?
                        <div className="col-4">
                            <div className="appTitle">
                                {/* <h3>{LocalizedLanguage.customerView}</h3> */}
                                <h6 className="text-truncate wb-0" style={{ fontSize: 16 }}>{props.FirstName ? props.FirstName : props.Email}{" "}{props.LastName ? props.LastName : ""}</h6>
                            </div>
                        </div>
                        : null}
                    {match.path == '/setting' ?
                        <div className="col-4">
                            <div className="appTitle">
                                <h3>{LocalizedLanguage.general}</h3>
                            </div>
                        </div>
                        : null}
                        {match.path == '/wsetting' ?
                        (typeof localStorage.getItem('showPrinterSetting')!="undefined" && localStorage.getItem('showPrinterSetting')=='true')
                        ?
                        <div className="col-8">
                            <div className="appTitle text-left">
                                <h3 className='fz-16 mb-0'>Printer Settings</h3>
                            </div>
                        </div>
                        :
                        <div className="col-4">
                            <div className="appTitle">
                                <h3 className='fz-16 mb-0'>{LocalizedLanguage.settings} </h3>
                            </div>
                        </div>
                    : null}
                    {match.path == '/checkout' ?
                        activeComponent == "checkout_second" ?
                            null
                            :
                            <div className="col-4">
                                <div className="appTitle" onClick={() => activeComponent == "checkout_second" ? noCallAnyFunction() : openModal("checkout_first")}>
                                    {/* <h3>Current Sale ({CHECKLIST && productCount(CHECKLIST.ListItem)})</h3> */}
                                    <h3>{CHECKLIST && CHECKLIST.totalPrice > 0 ? parseFloat(CHECKLIST.totalPrice).toFixed(2) : 0.00}({CHECKLIST && productCount(CHECKLIST.ListItem)})</h3>
                                    {props.paidAmount > 0 ? props.paidAmount : getRemainingPrice(CHECKLIST)}
                                </div>
                            </div>
                        : null}
                    {match.path == '/customerview' ?
                        <div className="col-4 text-right">
                            <a className="appHeaderRight" href="javascript:void(0);" onClick={() => addNewCustomter('create')}>
                                <img src="../mobileAssets/img/plus.svg" className="w-30" alt="" />
                            </a>
                        </div> :
                        match.path == '/checkout' ?
                            activeComponent == "checkout_second" ?
                                <div className="col-7 text-right text-uppercase text-dark fz-16">
                                    {(props.active_true_diamond == "extension_view") && <i onClick={() => props.resyncIframeUrl()} style={{ fontSize: 40 }} className="icons8-restart"></i>}
                                    {(props.activeContactDetail == true || props.active_true_diamond == "extension_view") && <i onClick={() => props.backActiveExtensionList()} style={{ fontSize: 40 }} className="icons8-extensions"></i>}
                                </div>
                                :
                                <div onClick={() => props.parkOrder("park_sale")} className="col-4 text-right text-uppercase text-dark fz-16">{LocalizedLanguage.park}</div>

                            :
                            match.path == '/activity' && !OrderDetail ?  //For Activity
                                <div className="col-3 text-right">
                                    {/* <a className="appHeaderRight" href="/MobileActivityOptions">
                                    <img src="../mobileAssets/img/more.svg" className="w-30" alt="" />
                                </a> */}
                                </div>
                                :
                                match.path == '/activity' && OrderDetail ?  //For Activity Detail
                                    <div className="col-3 text-right">
                                        <a className="appHeaderRight" onClick={() =>
                                            OrderDetail.order_status == "pending" || OrderDetail.order_status == "lay_away" || OrderDetail.order_status == "on-hold" || OrderDetail.order_status == "park_sale" || OrderDetail.order_status == "init sale" || OrderDetail.order_status == "processing" ?
                                                //OrderDetail.order_status !== 'completed' && OrderDetail.order_status !== "void_sale" ?
                                                windowLocation1('statuspending', OrderDetail.order_id, productList) :  //for redirect to checkout
                                                navigateToPage(activityNavigatonUrl)} >
                                            <img src="../mobileAssets/img/more.svg" className="w-30" alt="" />
                                        </a>
                                    </div>
                                    :
                                    match.path == '/activity' && OrderDetail ?  //For Activity Detail
                                        <div className="col-3 text-right">
                                            <a className="appHeaderRight" href="/MobileActivityOptions">
                                                <img src="mobileAssets/img/more.svg" className="w-30" alt="" />
                                            </a>
                                        </div>
                                        :
                                        // onClick={openModalActive == false ? () => props.openModal("notes") : null}
                                        match.path == '/wsetting' ?
                                            (typeof localStorage.getItem('showPrinterSetting')!="undefined" && localStorage.getItem('showPrinterSetting')=='true')?
                                            null
                                            :
                                            <div className="col-4 appHeaderRight text-right">
                                                <a href="javascript:void(0)" onClick={logOut} className='text-danger'> Sign Out</a>
                                        
                                            </div>
                                        : <div className="col-4 text-right">
                                            <div className="appHeaderRight" style={{ marginRight: 10 }} onClick={() => openModal("notification_view")}>
                                                <img src="mobileAssets//img/notification.svg" className="w-30" alt="" />
                                                {/* <img src="mobileAssets/img/bell-blue-icon.png" className="w-30" alt="" /> */}
                                            </div>
                                            <div className="appHeaderRight">
                                                <img onClick={() => openModal("view_cart")} src="mobileAssets/img/more.svg" className="w-30" alt="" />
                                            </div>
                                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default MobileSimpleHeader;