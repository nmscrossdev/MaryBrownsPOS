import React from 'react';
import Footer from './m.Footer';
import { cartProductActions } from '../../_actions';
import Permissions from '../../settings/Permissions';
import { CommonModuleJS } from '../'
import LocalizedLanguage from '../../settings/LocalizedLanguage';
Permissions.updatePermissions();

const cardProductDiscount = (props) => {
    var ListItem = props.cartproductlist ? props.cartproductlist : [];
    if (ListItem.length !== 0) {
        //if (Permissions.key.allowDiscount == false) {
        if (CommonModuleJS.permissionsForDiscount() == false) {
            props.msg(LocalizedLanguage.discountPermissionerror);
            $('#common_msg_popup').addClass('show');
            $('#common_msg_popup').modal('show');
        } else {
            $("#popup_discount").find('#txtdis').val(0)
            var data = {
                card: 'card',
            }
            localStorage.removeItem("PRODUCT")
            localStorage.removeItem("SINGLE_PRODUCT")
            props.dispatch(cartProductActions.selectedProductDis(data))
            props.openModal("cart_discount")
        }
    } else {
        if (!props.type) {
            props.msg(props.LocalizedLanguage.messageCartNoProduct);
            $('#common_msg_popup').addClass('show');
            $('#common_msg_popup').modal('show');
        }
    }
}

const FeeAndDiscount = (props) => {
    // setTimeout(() => {

    //     var getWindowHeight = $(window).height() - 322
    //     $(".calculatorSetHeight").height(getWindowHeight / 5);
    // }, 100);
    var isDemoUser = localStorage.getItem('demoUser')
    const { selecteditem, calcInp, LocalizedLanguage, handleChange, handle, rmvInp, openModal, pinNumberList, amount, NumInput, AddFee, add_title, type, changeComponent } = props;
    return (
        <div>
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-9">
                            <div className="appToggle">
                                <a className="appHeaderBack" href="#" onClick={() => { type == "checkout" ? changeComponent("checkout_third") : openModal("view_cart") }}>
                                    <img src="../mobileAssets/img/menu.svg" className="w-30" alt="" />{LocalizedLanguage.addFee}{selecteditem ? selecteditem.card ? "" : selecteditem.item.Title ? "(" + selecteditem.item.Title + ")" : "" : ""}
                                </a>
                            </div>
                        </div>
                        <div className="col-3 text-right">
                            <a href="#">
                                <img onClick={() => { type == "checkout" ? changeComponent("checkout_first") : openModal(false) }} src="../mobileAssets/img/less.svg" className="w-40" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- App Content --> */}
            <div className={isDemoUser == true || isDemoUser == 'true' ? 'appCapsule h-100 appCapsuleBoardingCustomFee' : 'appCapsule h-100'} style={{ paddingBottom: 132 }}>
                <div className="container-fluid">
                    <div className="row align-items-center h-130 text-center">
                        <div className="col-sm-12">
                            <p className="fz-16 text-dark mb-2">
                                <input className="transparent border-0 color-4b no-outline add_fee_input text-center" name="add_title" value={add_title} placeholder={LocalizedLanguage.customFee} type="text" onChange={handleChange} />
                            </p>
                            <ul className="nav nav-tabs nav-pills nav-fill nav-tabs-switch" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a onClick={() => cardProductDiscount(props)} className="nav-link" id="discount-tab" data-toggle="tab" href="#" role="tab"
                                        aria-controls="discount" aria-selected="true">{LocalizedLanguage.discount}</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" id="addfee-tab" data-toggle="tab" href="#addfee" role="tab"
                                        aria-controls="addfee" aria-selected="false">{LocalizedLanguage.addFee}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="addfee" role="tabpanel" aria-labelledby="addfee-tab">
                        <table className="table table-layout-fixed fw700 mb-0 tbl-calculator">
                            <thead>
                                {/* <tr className="calculatorSetHeight" style={{ height: 70 }}>
                                    <th colSpan="3">
                                        <input  className="transparent border-0 color-4b no-outline add_fee_input text-center" name="add_title" value={add_title} placeholder='text here' type="text" onChange={handleChange} /></th>
                                 </tr> */}
                                <tr className="calculatorSetHeight"  >
                                    <th colSpan="2" className="text-right">
                                        <input style={{ border: 0 }} type="text" className="text-right border-0 w-100" id="txtdisAmount" onChange={handle} value={amount} placeholder="0.00" /></th>
                                    <th onClick={() => rmvInp()}><img src="../mobileAssets/img/backarrow.svg" alt="" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                <NumInput
                                    className1="calculatorSetHeight"
                                    onClick={calcInp}
                                    numbers={pinNumberList}
                                    colSpan="2"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <!-- App Footer --> */}
            <div className={isDemoUser == true || isDemoUser == 'true' ? 'appcheckBoardingFooter' : ''}>
                <div className="appBottomAbove">
                    <button onClick={type == "checkout" ? () => AddFee() : () => { AddFee(); openModal("view_cart") }} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase"> {LocalizedLanguage.submit}</button>
                </div>
                <Footer active="cartdiscount" {...props} />
            </div>
        </div>
    )
}

export default FeeAndDiscount;
