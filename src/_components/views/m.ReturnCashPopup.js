import React from 'react';


const ReturnCashPopup = (props) => {
    const { closeModal, RoundAmount, NumberFormat, finalAdd, LocalizedLanguage, cash_payment, change_amount, total_price, checkList, cash_round, after_payment_is, type, refundTotalAmount, CashRound } = props;
    var returnCashInCheckout = (type == "refund") ? refundTotalAmount : total_price == 0 ? checkList && parseFloat(RoundAmount(checkList.totalPrice + cash_round)) - after_payment_is : total_price - after_payment_is;
    var voidButtonStyle = {
        width: '100%'
    }
    if (type == 'refund') {
        voidButtonStyle = {
            width: '100%',
            backgroundColor: '#e16b6b',
            border: '#e16b6b'
        }
    }
    return (
        <div style={{ backgroundColor: '#808080b0' }} className="modal fade" id="popup_cash_rounding" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div className="modal-content" style={{ border: "#e16b6b" }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">{(type == "refund") ? LocalizedLanguage.refundTitle : LocalizedLanguage.cash}</h5>
                        <button onClick={() => closeModal()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <table className="table table-layout-fixed fw700 mb-0">
                            <tbody>
                                <tr>
                                    <td>{LocalizedLanguage.total}</td>
                                    <td>:</td>
                                    <td><NumberFormat value={returnCashInCheckout} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                </tr>
                                <tr>
                                    <td>{LocalizedLanguage.paymentCash}</td>
                                    <td>:</td>
                                    <td>{(type == "refund") ? cash_payment : RoundAmount(cash_payment)}</td>
                                </tr>
                                <tr>
                                    <td>{(type == "refund") ? LocalizedLanguage.changeTitle : LocalizedLanguage.change}</td>
                                    <td>:</td>
                                    <td><NumberFormat value={(type == "refund") ? change_amount : RoundAmount(change_amount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                </tr>
                                <tr>
                                    <td>{LocalizedLanguage.balance}</td>
                                    <td>:</td>
                                    <td>0.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button onClick={() => { type == "refund" ? finalAdd(CashRound) : finalAdd() }} style={voidButtonStyle} type="button" className="btn btn-primary">{LocalizedLanguage.addPayment}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReturnCashPopup;
