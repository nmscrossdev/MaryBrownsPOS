import React from 'react';
import { history } from '../../_helpers'
import { refresh } from './m.commonjs'
import ActiveUser from '../../settings/ActiveUser';
import { RoundAmount } from "../TaxSetting";

function redirectPage(url) {
    refresh();
    history.push(url)
}

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

const MobileNavbar = (props) => {
    refresh();
    // console.log("%cmobile view props", 'color:#E16B6B', props);
    const { user, registerName, Env, LocalizedLanguage, logout, supportPopup,
        cartproductlist, Language, shop_name, match, viewOrderEvent, onCancelOrderHandler,
        onEventHandling, SignInPopup } = props;

    return (
        (ActiveUser.key.isSelfcheckout == true) ?
            <div>
                <div className="appSlider appSliderSC appSliderSC-index" id="slide-out">
                    <nav className="sidebar">
                        <div className="appSliderSCheader">
                            <div className="col-4">
                                {/* <div className="appToggle">
                                    <a className="d-flex align-items-center text-muted" data-target="slide-out" href="#">
                                        <img src="./mobileAssets/img/menu-fill.svg" className="w-30" alt="" />
                                    </a>
                                </div> */}
                            </div>
                            <div className="col-4">
                                <div className="appTitle pointer">
                                    <h3>Cart ({cartproductlist && productCount(cartproductlist)})</h3>
                                    {cartproductlist ? cartListTotalAmount(cartproductlist) : '0.00'}
                                </div>
                            </div>
                            <div className="col-4">
                                <button className="btn btn-outline-primary fz-14 shadow-none" style={{ display: 'none' }} data-toggle="modal" data-target="#SignInMenu" onClick={() => SignInPopup()}>Sign In</button>
                            </div>
                        </div>
                        <div className="appSlideScContent scrollbar">
                            <div className="h-100 d-flex align-items-stretch flex-column">
                            {/* <div className="radio--custom radio--primary radio-size-14">
                                <input type="radio" id="#IDA" name="radio-group"/>
                                <label for="#IDA" className="fw-300">Add Discount</label>
                            </div> */}
                                <div className='px-3 py-4'>
                                    <div className="radio--custom radio--primary radio-size-14">
                                        <input type="radio" id="#IDB" name="radio-group" />
                                        <label htmlFor="#IDB" className="fw-300">Get Help</label>
                                    </div>
                                    <div className="radio--custom radio--primary radio-size-14">
                                        <input type="radio" id="#IDC" name="radio-group" />
                                        <label htmlFor="#IDC" className="fw-300">Park Order</label>
                                    </div>
                                </div>
                                <div className="flex-fill pb-4">
                                <a className="text-muted" data-target="slide-out" href="#">
                                        <button className="btn btn-light btn-block fz-14 text-dark h-100">
                                            Add More Products
                                        </button>
                                    </a>
                                </div>
                                <div className="space-15"></div>
                            </div>
                        </div>
                        <div className="appSlideSCfoot">
                            <button className="btn btn-danger btn-block shadow-none p-10" data-toggle="modal" onClick={() => onCancelOrderHandler()}>Cancel Order</button>
                            <button className="btn btn-primary btn-block shadow-none p-10" onClick={() => viewOrderEvent()}>Checkout {cartproductlist ? cartListTotalAmount(cartproductlist) : '0.00'}</button>
                        </div>
                    </nav>
                </div>
                <div className="sidenav-overlay appSliderSC-overlay" data-target="slide-out"></div>
            </div>
            :
            <div>
                <div className="appSlider" id="slide-out">
                    <nav className="sidebar">
                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-white">
                            <div className="text-left">
                                <span className="text-info">{shop_name ? shop_name : Language.key.OLIVER_POS}</span>
                                <br /> <small>{registerName}/{user && user.display_name != "" && user.display_name != " " ? user.display_name : user ? user.user_email : ""}</small>
                            </div>
                            <a className="d-flex align-items-center text-muted" data-target="slide-out">
                                <img src="./mobileAssets/img/close.svg" alt="" />
                            </a>
                        </h6>
                        <div className="sidebar-sticky appLinks overflow-auto">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => { redirectPage('/shopview') }}>
                                        {LocalizedLanguage.register}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => { redirectPage('/activity') }}>
                                        {LocalizedLanguage.activityView}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => { redirectPage('/customerview') }}>
                                        {LocalizedLanguage.customerView}
                                    </a>
                                </li>
                                {/* <li className="nav-item">
                                    <a className="nav-link" href="/shopview?goto=setting">
                                        {LocalizedLanguage.settings}
                                    </a>
                                </li> */}

                                <li className="nav-item">
                                {/* <a className="nav-link" href="/wsetting?shopview">
                                        {LocalizedLanguage.settings}
                                        </a> */}
                                    {
                                        (typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?
                                        <a className="nav-link" href="/wsetting?shopview">
                                        {LocalizedLanguage.settings}
                                        </a>
                                        :
                                        <a className="nav-link" href="/shopview?goto=setting">
                                        {LocalizedLanguage.settings}
                                        </a>
                                    }
                                </li>

                                <li className="nav-item" onClick={() => logout()}>
                                    <a className="nav-link" href="javascript:void(0)">
                                        {LocalizedLanguage.logout}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="AppIcon">
                            {/* <img src="./mobileAssets/img/owlSidebar.svg" alt="" /> */}
                        </div>
                    </nav>
                </div>
                <div className="sidenav-overlay" data-target="slide-out"></div>
            </div>
    )
}

export default MobileNavbar;