import React from 'react';
import Footer from '../../_components/views/m.Footer';
import ActiveUser from '../../settings/ActiveUser';
import { AndroidAndIOSLoader } from '../../_components';

const MobileShopView = (props) => {
    //console.log("%cmobile view props", 'color:#6610f2', props);
    const { NavbarPage, authentication, favourites, loading, AllProductList,
        FavouriteList, AllProduct, productData, onRef, simpleProductData,
        cartproductlist, msg, openModalActive, openModal, CommonHeaderTwo,
        onCancelOrderHandler, viewOrderEvent, onEventHandling, onSinginselfcheckout, showPopuponcartlistView, userProfilePopup } = props;
    sessionStorage.removeItem("OrderDetail");
    var isDemoUser = localStorage.getItem('demoUser')

    return (
        <div>
            {loading == false ? !authentication && !authentication.user && authentication.loggedIn !== true
                && !AllProductList || !favourites || favourites != "undefined" ? <AndroidAndIOSLoader /> : '' : ''}
            {(ActiveUser.key.isSelfcheckout == true) ?
                <div>
                    <CommonHeaderTwo {...props} onSinginselfcheckout={onSinginselfcheckout} />
                    <NavbarPage {...props} viewOrderEvent={viewOrderEvent} onCancelOrderHandler={onCancelOrderHandler} onEventHandling={onEventHandling} SignInPopup={onSinginselfcheckout} />
                    <div className="appCapsule">
                        <FavouriteList {...props} />
                        <AllProduct productData={productData} onRef={onRef} simpleProductData={simpleProductData} msg={msg} openModal={openModal} showPopuponcartlistView={showPopuponcartlistView} />
                    </div>
                    <Footer {...props} viewOrderEvent={viewOrderEvent} onCancelOrderHandler={onCancelOrderHandler} active="shopview" />
                </div>
                :
                <div>
                    <CommonHeaderTwo {...props} />
                    <NavbarPage {...props} />
                    <div className={isDemoUser == true || isDemoUser == 'true' ? "appCapsule appCapsuleBoarding" : 'appCapsule'}>
                        <FavouriteList {...props} />
                        <AllProduct productData={productData} onRef={onRef} simpleProductData={simpleProductData} msg={msg} openModal={openModal} showPopuponcartlistView={showPopuponcartlistView}/>
                    </div>
                    <Footer {...props} active="shopview" />
                </div>
            }
        </div>
    )
}
export default MobileShopView;