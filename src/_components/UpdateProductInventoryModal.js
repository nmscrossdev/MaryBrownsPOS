import React from 'react';
import { connect } from 'react-redux';
import { checkoutActions } from '../CheckoutPage/actions/checkout.action';
import LocalizedLanguage from '../settings/LocalizedLanguage';

class UpdateProductInventoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    closePopup() {
        this.props.dispatch(checkoutActions.checkItemList())
    }

    render() {
        const { checkout_list } = this.props;
        var cartProductList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : null;
        var blank_quntity = []
        var new_data = [];
        checkout_list && checkout_list.map(checkfalse => {
            if (checkfalse.success === false) {
                new_data.push(checkfalse)
            }
        })

        if (cartProductList && new_data) {
            new_data.map(isExsit => {
                cartProductList.map(idExsit => {
                    if (idExsit.variation_id == 0 ? idExsit.product_id === isExsit.ProductId : idExsit.variation_id === isExsit.ProductId) {
                        blank_quntity.push(idExsit.Title)
                    }
                })
            })
        }

        return (
            <div id="checkout1" className="modal modal-wide modal-wide1 fade">
                <div className="modal-dialog" id="dialog-midle-align">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button onClick={() => this.closePopup()} type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                <img src="../assets/img/Close.svg" />
                            </button>
                            <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                        </div>
                        <div className="modal-body p-0">
                            {blank_quntity.length > 0 ?
                                <div>
                                    <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.messageCartProductNotAvailable}</h3>

                                    <h5 id="epos_error_model_message" style={{ padding: 5 }} className="popup_payment_error_msg">
                                        {blank_quntity.map(name => {
                                            return (
                                                name + ", "
                                            )
                                        })}
                                    </h5>
                                </div>
                                :
                                <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.messageCartNoProduct}</h3>
                            }
                        </div>
                        <div className="modal-footer p-0">
                            <button onClick={() => this.closePopup()} type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { checkout_list } = state;
    return {
        checkout_list: checkout_list.items,
    };
}

const connectedUpdateProductInventoryModal = connect(mapStateToProps)(UpdateProductInventoryModal);
export { connectedUpdateProductInventoryModal as UpdateProductInventoryModal };