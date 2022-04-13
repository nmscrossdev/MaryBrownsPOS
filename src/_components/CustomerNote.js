import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import MobileAddNotes from '../_components/views/m.AddNotes'

class CustomerNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleNote = this.handleNote.bind(this);
    }

    handleNote() {
        var txtNote = jQuery("#txtNote").val();
        if (txtNote != "") {
            const { dispatch } = this.props;
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
            cartlist = cartlist == null ? [] : cartlist;
            cartlist.push({ "Title": txtNote })
            dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                location.reload();
            }
            jQuery("#txtNote").val("");
            jQuery(".close").trigger("click");
        }
    }

    render() {
        return (
            (isMobileOnly == true) ?
                <MobileAddNotes
                    LocalizedLanguage={LocalizedLanguage}
                    handleNote={this.handleNote}
                    {...this.props}
                />
                :
                <div tabIndex="-1" className="modal fade in mt-5 modal-wide" id="addnotehere">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bb-0">
                                <button type="button" className="close opacity-1 mt-1" data-dismiss="modal" aria-hidden="true" >
                                    <img src="assets/img/Close.svg" />
                                </button>
                                <h1 className="modal-title">{LocalizedLanguage.addNote}</h1>
                            </div>
                            <div className="modal-body p-0">
                                <textarea id="txtNote" className="form-control modal-txtArea" placeholder={LocalizedLanguage.placeholderNote} ></textarea>
                            </div>
                            <div className="modal-footer p-0 b-0">
                                <button type="button" className="btn btn-primary btn-block btn-primary-cus pt-2 pb-2" onClick={this.handleNote} >{LocalizedLanguage.saveAndClose}</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}
const connectedCustomerNote = connect(mapStateToProps)(CustomerNote);
export { connectedCustomerNote as CustomerNote };