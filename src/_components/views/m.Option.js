import React from 'react';
import { NotesListComponents } from '../../_components/NotesListComponents';
import { cartProductActions } from '../../_actions';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import ActiveUser from '../../settings/ActiveUser';

const removeCheckOutList = (props) => {
    const { dispatch } = props;
    var status = 'null'
    var item = []
    localStorage.removeItem('CHECKLIST');
    localStorage.removeItem('oliver_order_payments');
    localStorage.removeItem('AdCusDetail');
    localStorage.removeItem('TIKERA_SELECTED_SEATS')
    localStorage.removeItem("CART");
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem("PRODUCT");
    localStorage.removeItem("SINGLE_PRODUCT");
    localStorage.removeItem("PRODUCTX_DATA");
    props.ticketDetail(status, item)
    dispatch(cartProductActions.addtoCartProduct(null));
    location.reload();
}

const MobileOption = (props) => {
    const { Footer, openModal, openModalActive, deleteAddCust, addCustomer, Addcust, type, changeComponent } = props;
    return (
        (ActiveUser.key.isSelfcheckout == true)?
            <div>
                <div className="appHeader">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <div className="col-12">
                                    <a className="appHeaderBack" href="index.html">
                                        <img src="img/back.svg" className="w-30" alt=""/> Go Back
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="appCapsule h-100" style="padding-bottom: 180px">
            <div className="sc-cartContent p-15 overflow-auto scrollbar">
                <div className="sc-cart-list">
                    <table className="table table-91 table-verticle-middle table-borderd fw700"> 
                        <tbody>
                            <tr>
                                <td className="w-30">1</td>
                                <td>
                                    Oliver Hoodie                                
                                </td>
                                <td>189.00</td>
                                <td className="w-30">
                                    <img src="img/trash.svg" className="w-30" alt="" className="pointer"/>
                                </td>
                            </tr>
                            <tr>
                                <td className="w-30">2</td>
                                <td>
                                    Oliver Hoodie
                                    <div className="fw300">Blue, With Leather Strap</div>
                                </td>
                                <td>189.00
                                    <div className="fw300"><del>349.00</del></div>
                                </td>
                                <td className="w-30">
                                    <img src="img/trash.svg" className="w-30" className="pointer" alt=""/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="sc-calculation p-15">
                        <div className="row">
                            <div className="col-6">
                                Tax:<strong className="ml-5-px fw700">50.80</strong>
                            </div>
                            <div className="col-6 text-right">
                                Total:<strong className="ml-5-px fw700">450.80</strong>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-light btn-block fz-14 text-dark h-101" onclick="pageRedirect('sc-tile-view.html')">
                        Add More Products
                    </button>
                    <div className="spacer-20"></div>
                </div>
                
            </div>
            <div className="sc-cartFooter">
                {/* <!-- <div className="p-15">
                    <button className="btn btn-light btn-block fz-14 text-dark h-130">
                        Add More Products
                    </button>
                </div> --> */}
                <div className="divider"></div>
                <div className="p-15">
                    <button className="btn btn-danger btn-block shadow-none p-10" data-toggle="modal"
                    data-target="#cancle">Cancel Order</button>
                    <button className="btn btn-primary btn-block shadow-none p-10" onclick="pageRedirect('sc-checkout.html')">Checkout 450.80</button>
                </div>
            </div>
        </div>
            </div>
        :
        openModalActive == "show_notes_popup" ?
            <NotesListComponents {...props} />
            :
            <div> <div className="appHeader">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-center">
                        {LocalizedLanguage.option}
                            <a className="icon-less-right" href="javascript:void(0);" onClick={() => { type == "checkout" ? changeComponent("checkout_first") : openModal("view_cart") }}>
                                <img src="../mobileAssets/img/less.svg" className="w-40" alt="" />
                            </a>
                    </div>
                </div>
            </div>
                <div className="appCapsule h-100 overflow-auto">
                    <div className="container-fluid pt-3">
                        <div className="row">
                            <div className="col-sm-12 pl-20 pr-20">
                                <div className="button-style-01">
                                    {Addcust && Addcust.content != null ?
                                        <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" onClick={() => deleteAddCust()}>{LocalizedLanguage.customerDelete}</button>
                                        :
                                        <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" onClick={() => addCustomer()}>{LocalizedLanguage.addCustomerTitle}</button>
                                    }
                                    <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" onClick={() => { type == "checkout" ? changeComponent("add_note") : openModal("show_notes_popup") }}>{LocalizedLanguage.addNote}</button>
                                    {type !== "checkout" &&
                                        <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" onClick={() => openModal("show_user_list")}>{LocalizedLanguage.switchUserList}</button>
                                    }
                                    {type !== "checkout" &&
                                        <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" onClick={() => { removeCheckOutList(props); openModal(false) }}>{LocalizedLanguage.clrItems}</button>
                                    }

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <Footer {...props} active={type == "checkout" ? "checkout" : "shopview"} />
            </div>
    )
}

export default MobileOption;