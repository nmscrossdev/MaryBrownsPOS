import React from 'react';
import { cartProductActions } from '../../_actions'
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import ActiveUser from '../../settings/ActiveUser';

const nothingCall = () => {

}
const navigateURL = (url) => {
    history.push(url);
}
const handleConnectAndSellBtnClick = () => {
    console.log('-------------');
    history.push('/connect_demo_user')
}

const Footer = (props) => {
    const { active, changeComponent, openModal, type, onCancelOrderHandler, viewOrderEvent } = props;
    var CHECKLIST = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
    var CARD_PRODUCT_LIST = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : null;
    var VOID_SALE = localStorage.getItem("VOID_SALE");
    var isDemoUser = localStorage.getItem('demoUser')
    //console.log("history",history);
    const displayMsg = () => {
        if ((!CARD_PRODUCT_LIST) || CARD_PRODUCT_LIST.length == 0) {
            props.msg(LocalizedLanguage.messageCartNoProduct);
            $('#common_msg_popup').addClass('show');
            $('#common_msg_popup').modal('show');
        }
        else {
            if (active == 'customerview') {
                navigateURL("/shopview");
            } else {
                openModal('view_cart');
            }
        }
    }
    return (
        (ActiveUser.key.isSelfcheckout == true) ?
            <div>
                <div className="appBottomMenu h-auto">
                    <div className="w-100 p-15">
                        <button className="btn btn-danger btn-block shadow-none p-10" onClick={() => onCancelOrderHandler()}>{LocalizedLanguage.cancelOrder}</button>
                        <button className="btn btn-primary btn-block shadow-none p-10" onClick={() => viewOrderEvent()}>{LocalizedLanguage.viewOrder}</button>
                    </div>
                </div>
            </div>
            :
            // <div className={isDemoUser == true || isDemoUser == 'true'? "appcheckBoardingFooter" : ''}>
            <div className={isDemoUser == true || isDemoUser == 'true'? "appcheckBoardingFooter" : ''}>
                <div className="appBottomMenu">
                    <div className={`item ${active == 'shopview' ? 'active' : ''}`}>
                        {/* <a href={(active == 'checkout' || active == 'extansion' || active == "refund") ? "javascript:void(0);":"/shopview"}> */}
                        <a onClick={() => (active == 'checkout' || active == 'extansion' || active == "refund") ? (type == 'checkout' && !VOID_SALE) ? navigateURL("/shopview") : (!VOID_SALE) ? navigateURL("/shopview") : nothingCall() : nothingCall()}>
                            <p>
                                <img src="../mobileAssets/img/Blue/Browse.svg" alt="" onClick={() => (active == 'cartdiscount')  && openModal? openModal("view_cart") : (!VOID_SALE && active == 'customerview') ? navigateURL("/shopview") : nothingCall()} />
                                <span>{LocalizedLanguage.browse}</span>
                            </p>
                        </a>
                    </div>
                    <div className={`item ${active == 'cartdiscount' ? 'active' : ''}`}>
                        <a href="javascript:void(0)" onClick={() => { active == 'shopview' ? openModal("cart_discount_fee") : active == 'checkout' ? changeComponent("add_fee") : nothingCall() }}>
                            <p>
                                <img src="../mobileAssets/img/Blue/math.svg" alt="" />
                                <span>{LocalizedLanguage.customFee}</span>
                            </p>
                        </a>
                    </div>
                    <div className={`item ${active == 'checkout' ? 'active' : ''}`}>
                        {/* <a href={(CHECKLIST && active !== "refund")?"/checkout":"javascript:void(0)"}> */}
                        <a onClick={() => (CHECKLIST && active !== "refund" && changeComponent) ? changeComponent('checkout_third') : (type == 'checkout' || active == 'extansion') ? changeComponent('checkout_third') : displayMsg()}>
                            {/* nothingCall() */}
                            <p>
                                <img src="../mobileAssets/img/Blue/cash-in-hand.svg" alt="" />
                                <span>{LocalizedLanguage.checkout}</span>
                            </p>
                        </a>
                    </div>
                    <div className={`item ${active == 'customerview' ? 'active' : ''}`}>
                        {/* <a href={(active == 'checkout' || active == 'extansion' || active == "refund") ? "javascript:void(0);":"/customerview"}> */}
                        <a onClick={() => { (active == 'checkout' || active == 'extansion' || active == "refund" || type == 'checkout') ? nothingCall() : navigateURL("/customerview") }}>
                            <p>
                                <img src="../mobileAssets/img/Blue/contacts.svg" alt="" />
                                <span>{LocalizedLanguage.customer}</span>
                            </p>
                        </a>
                    </div>
                    <div className={`item ${active == 'extansion' ? 'active' : ''}`}>
                        <a href="javascript:void(0)" onClick={() => changeComponent && changeComponent('checkout_second', '')} className="icon toggleSidebar">
                            <p>
                                <img src="../mobileAssets/img/Blue/Puzzle.svg" alt="" />
                                <span>{LocalizedLanguage.extensions}</span>
                            </p>
                        </a>
                    </div>
                </div>
                {isDemoUser == true || isDemoUser == 'true' ? <div className="appBottomOnboarding" onClick={handleConnectAndSellBtnClick}>
                    I’m ready to connect my store
                    <button className="btn btn-link shadow-none btn-squar">
                        <img src="../assets/img/onboarding/arrow-up.svg" alt="" />
                    </button>
                </div> : ''}

            </div>
    )
}
export default Footer;