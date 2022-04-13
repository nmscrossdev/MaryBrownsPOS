import React from 'react';
import Footer from './m.Footer';

const CartDiscountModal = (props) => {
    setTimeout(() => {
        var getWindowHeight = $(window).height() - (322 + $(".appBottomOnboarding").height());
        $(".calculatorSetHeight").height(getWindowHeight / 5);
    }, 30);
    var isDemoUser = localStorage.getItem('demoUser')
    const { handleClose, LocalizedLanguage, applyfixDiscount, handleDiscountCancle, handleDiscount, handle, calcInp, openModal, selecteditem, minplus, is_checked_clr, discountAmount } = props;
    //console.log("%cselecteditem", 'color:purple', props);
    return (
        <div>
            {/* <!-- App Header --> */}
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-9">
                            <div className="appToggle">
                                <a className="appHeaderBack" href="#" onClick={() => openModal("view_cart")}>
                                    <img src="../mobileAssets/img/menu.svg" className="w-30" alt="" />{LocalizedLanguage.addDiscount}{selecteditem ? selecteditem.card ? "" : selecteditem.item.Title ? "(" + selecteditem.item.Title + ")" : "" : ""}
                                </a>
                            </div>
                        </div>
                        <div className="col-3 text-right">
                            <div className="percentageButton">
                                <div className="btn-group-toggle btn-toggle-percentage" data-toggle="buttons" id='calculate010' onClick={() => minplus()}>
                                    <label className="btn">
                                        <input type="checkbox" />
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- App Content --> */}
            <div className={isDemoUser == true || isDemoUser == 'true' ? 'appCapsule h-100 appCapsuleBoarding' : 'appCapsule h-100'} style={{ paddingBottom: 132 }}>
                <div className="container-fluid"> 
                    <div className="row align-items-center h-130 text-center">
                        <div className="col-sm-12">
                            <ul className="nav nav-tabs nav-pills nav-fill nav-tabs-switch" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="discount-tab" data-toggle="tab" href="#discount" role="tab"
                                        aria-controls="discount" aria-selected="true">{LocalizedLanguage.discount}</a>
                                </li>
                                <li className="nav-item">
                                    <a onClick={() => openModal("cart_discount_fee")} className="nav-link" id="addfee-tab" data-toggle="tab" href="#" role="tab"
                                        aria-controls="addfee" aria-selected="false">{LocalizedLanguage.addFee}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="discount" role="tabpanel" aria-labelledby="discount-tab">
                        <table className="table table-layout-fixed fw700 mb-0 tbl-calculator">
                            <thead>
                                <tr className="calculatorSetHeight" style={{ height: 70 }}>
                                    <th colSpan="2" className="text-right">
                                        <div className="d-flex align-items-center justify-content-end">
                                            {/* <div className="d-flex align-items-center justify-content-center"> */}
                                            <input type="text" id="txtdis" className="text-right border-0 pr-2 discount_inpt" placeholder="0.00" aria-describedby="basic-addon1" onChange={handle} /> <span id="spnCalcType" name="spnCalcType">$</span>
                                            {/* {discountAmount} */}
                                        </div>
                                    </th>
                                    <th id='calculate012' onClick={() => calcInp('c')}><img src="../mobileAssets/img/backarrow.svg" alt="" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="calculatorSetHeight" >
                                    {/* style={{height:70}} */}
                                    <td id='calculate01' onClick={() => calcInp(1)}>1</td>
                                    <td id='calculate02' onClick={() => calcInp(2)}>2</td>
                                    <td id='calculate03' onClick={() => calcInp(3)}>3</td>
                                </tr>
                                <tr className="calculatorSetHeight" >
                                    <td id='calculate04' onClick={() => calcInp(4)}>4</td>
                                    <td id='calculate05' onClick={() => calcInp(5)}>5</td>
                                    <td id='calculate06' onClick={() => calcInp(6)}>6</td>
                                </tr>
                                <tr className="calculatorSetHeight" >
                                    <td id='calculate07' onClick={() => calcInp(7)}>7</td>
                                    <td id='calculate08' onClick={() => calcInp(8)}>8</td>
                                    <td id='calculate09' onClick={() => calcInp(9)}>9</td>
                                </tr>
                                <tr className="calculatorSetHeight" >
                                    <td onClick={() => { handleDiscountCancle(!is_checked_clr); }}>C</td>
                                    <td id='calculate011' onClick={() => calcInp('.')}>.</td>
                                    <td id='calculate00' onClick={() => calcInp(0)}>0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <!-- App Footer --> */}
            <div className={isDemoUser == true || isDemoUser == 'true' ? 'appcheckBoardingFooter' : ''}>
                <div className="appBottomAbove" onClick={() => { handleDiscount(); openModal("view_cart") }}>
                    <button className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.addDiscount}</button>
                </div>
                <Footer active="cartdiscount" {...props} />
            </div>
        </div >
    )
}

export default CartDiscountModal;
