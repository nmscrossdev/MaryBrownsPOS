import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { default as NumberFormat } from 'react-number-format';
import { LoadingModal } from '../../_components';
import { cashManagementAction } from '../actions/cashManagement.action';
import moment from 'moment';
import Config from '../../Config';
class CashDrawerPaymentDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        // console.log('this.props.recordFirstId', this.props.recordFirstId)
        // this.props.dispatch(cashManagementAction.getDrawerPaymentDetail(this.props.recordFirstId));
    }

    render() {
        const { getCashDrawerPaymentDetail, recordArrayFirstId, cashRecords } = this.props;
        // console.log("this.props", this.props)
        //&& _details.CashRegisterlog.length>0
        var _paymentList = getCashDrawerPaymentDetail && getCashDrawerPaymentDetail.cashDetail && getCashDrawerPaymentDetail.cashDetail.content ? getCashDrawerPaymentDetail.cashDetail.content.CashRegisterlog: [];
        var manualTransaction= getCashDrawerPaymentDetail && getCashDrawerPaymentDetail.cashDetail && getCashDrawerPaymentDetail.cashDetail.content ? getCashDrawerPaymentDetail.cashDetail.content : 0; 
        var paymentList=[];
         if(_paymentList && _paymentList.length>0)
            { 
                paymentList=_paymentList;
                paymentList.reverse();
            }

        return (
            <div className = 'timeline-last-child'>
               {
                     paymentList.filter(i=>i.Description.toLowerCase()=="cash").map((item, index) => {
                        //var current_date = moment().format(Config.key.DATE_FORMAT);
                       
                        return (
                            // item.Name == 'card' ?
                            <div className="timeline-item" key={index}>
                                {paymentList == '' ? <LoadingModal /> : ''}
                                <div className="timeline-media">
                                { item.IsManual==true? <img src="../assets/img/customer/Note.svg" />   //Manual cash Transaction
                                        : item.IsManual==false && item.Expected < 0 ? <img src="../assets/img/customer/Transaction.svg"/> :<img src="../assets/img/customer/purchase.svg"/>}
                                    
                                  
                                </div>
                                <div className="timeline-content" key={index}>
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div className="mr-2">
                                            <a className="text-dark-75 text-hover-primary ">
                                                {item.IsManual==true? LocalizedLanguage.manualtransaction: item.IsManual==false && item.Expected < 0 ? LocalizedLanguage.refundissued :  LocalizedLanguage.cash}
                                            </a>
                                            <span className="text-muted ml-2">
                                            {moment.utc(item.TransactionDateOffset).local().format(Config.key.TIMEDATE_FORMAT)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="d-flex space-between">
                                        <div>
                                            <p className="p-0">
                                                <span>{LocalizedLanguage.remainingbalance} : </span><NumberFormat value={item.RemainingBalance} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                            </p>
                                            <p className="p-0">
                                                <span>{LocalizedLanguage.user} : </span>  {item.SalePersonName}
                                            </p>
                                           {item.Notes && item.Notes !=="" && <p className="p-0">
                                                <span>{LocalizedLanguage.notes} : </span>   {item.Notes}
                                            </p>
                                            }
                                        </div>
                                        <div className="text-right">
                                            <p className="p-0">
                                                {LocalizedLanguage.amount}
                                            </p>
                                            <p className="p-0 font-sm text-dark">
                                            {item.Expected>0 && "+" }<NumberFormat value={item.Expected} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                           
                        )                     
                    })
                } 
               
                   {/* { paymentList && paymentList.length == 0 && <div className="d-flex space-between" > No Record Found</div>
                
                } */}

               
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {

    }
}
const connectedCashDrawerPaymentDetail = connect(mapStateToProps)(CashDrawerPaymentDetail);
export { connectedCashDrawerPaymentDetail as CashDrawerPaymentDetail };