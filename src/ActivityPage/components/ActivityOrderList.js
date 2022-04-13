import React from 'react';
import moment from 'moment';
import { default as NumberFormat } from 'react-number-format';
import Config from '../../Config';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import MobileActivityList from '../views/m.ActivityList';
import { isMobileOnly, isIOS } from "react-device-detect";
import {LoadingSmallModal} from '../../_components/LoadingSmallModal'

function html_value(elmnt) {
    var element = document.getElementById('tableid');
    var headerOffset = 25;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset;
    setTimeout(function () {
        elmnt.scrollIntoView({
            top: offsetPosition,
            block: "start",
            behavior: "smooth"
        });
    }, 1500)
}

export const ActivityOrderList = (props) => {
    const { ActivitySecondView, windowLocation1, activeFilter, clearInput } = props;
    var current_date = moment().format(Config.key.DATE_FORMAT);
    var customer_to_OrderId = (typeof localStorage.getItem("CUSTOMER_TO_OrderId") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_OrderId") !== null) ? localStorage.getItem("CUSTOMER_TO_OrderId") : '';
    var id = `activity-order-${customer_to_OrderId}`
    var elmnt = document.getElementById(`${id}`);
    // if(elmnt){
    //    html_value(elmnt)
    // }    
    var ordersDate = new Array();
    var orders = props.orders;
    var custId = localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : ""
    var ids = `activity-order-${custId}`
    var elmnts = document.getElementById(`${ids}`);
    // if(elmnts){
    //     html_value(elmnts)
    // }
    if (typeof props.orders !== 'undefined') {
        for (const key in orders) {
            if (orders.hasOwnProperty(key)) {
                ordersDate.push(key)
            }
        }
        if(ordersDate.length>0){
            ordersDate.sort(function(a, b) {
                var keyA = new Date(a),
                  keyB = new Date(b);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
              ordersDate.reverse();
        }
    }
    var items = ''
    if (typeof props.loader.items !== 'undefined') {
        items = props.loader.items
    }

    return (
        (isMobileOnly == true) ?
            <MobileActivityList {...props} ordersDate={ordersDate} orders={props.orders} loader={props.loader} current_date={current_date} windowLocation1={windowLocation1} clearInput={clearInput}/>
            :
            <div className="Checkout_activity">
           
                {/* <colgroup>
                    <col width="*" />
                    <col width="40" />
                </colgroup> */}
                {(props.loader.isLoading && !items) ?
                <div className="no-product-find AppModal w-100" style={{height: "70vh"}}>
                     {/* <table className="table  table-day-record" id="tableid">
                        <tbody>
                            <tr>
                            <td> */}
                                 <LoadingSmallModal /> 
                               {/*  </td>
                                
                             </tr>
                         </tbody>
                        </table>*/}
                    </div>
                   :
                    activeFilter && activeFilter==true && (  (!ordersDate)|| ordersDate.length ==0) ?
                    <div className="widget_day_record">
                    <table className="table table-day-record" id="tableid">
                       <tbody>
                           <tr>
                               <td> <i className="fa fa-spinner fa-spin" >{LocalizedLanguage.noRecordFound}</i></td>
                           </tr>
                       </tbody>
                       </table>
                   </div>
                   : orders && ordersDate && ordersDate.map((getDate, index) => {                     
                        return (
                            <div className="widget_day_record" key={"orderDatedv"+index}>
                            <table className="table table-customise table-day-record" >
                                    <thead>
                                        <tr>
                                            <th key={"date" + index} colSpan="2" className="text-center text-dark font-light">
                                                {current_date == getDate ? 'Today' : getDate}
                                            </th>
                                        </tr>
                                    </thead>
                             <tbody key={`order_date_${index}`}>   
                                {
                                 getDate &&  orders && orders[getDate] && orders[getDate].map((order, index) => {
                                    
                                        //   update date and time according to timeZone;
                                        var time = FormateDateAndTime.formatDateWithTime(order.date_time, order.time_zone);
                                      var _className='activity-order ' +typeof localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null && localStorage.getItem("CUSTOMER_TO_ACTVITY") == order.order_id ?  'table-primary-label' :
                                      typeof localStorage.getItem("CUSTOMER_TO_OrderId") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_OrderId") !== null && localStorage.getItem("CUSTOMER_TO_OrderId") == order.order_id ?  'table-primary-label' : '';
                                      
                                      _className =_className==''?'activity-order ':_className;
                                   
                                      var _customerName=order.CustFullName && order.CustFullName.trim()!==''?order.CustFullName:order.CustEmail?order.CustEmail:'';   
                                      var _orderStaus=order.order_status;
                                      if (_customerName !=='')  
                                        _orderStaus=order.order_status+" - " + _customerName;     

                                      if(_orderStaus !=="" && _orderStaus.length>=20){
                                        _orderStaus =_orderStaus.substring(0,17)+'...'
                                        }
                                    // for group Sale
                                    var _groupSaleName=""
                                    //console.log("order",order)
                                    if(order.groupName && order.groupLabel){
                                        _groupSaleName=order.groupName +" "+ order.groupLabel; 
                                       // console.log("selectedorder",order)
                                    }                                   
                                    
                                      return (
                                            <tr className={_className} key={`customer_order_${order.order_id}`} id={`activity-order-${order.order_id}`} style={{ cursor: "pointer" }} onClick={() => props.click(order, order.order_id)}>
                                                    <td >
                                                    <div className="widget_day_record_text ">
    
               
                                                    {
                                                        (order.refunded_amount > 0) ?
                                                        <h6> <NumberFormat value={parseFloat(order.total - order.refunded_amount) } displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                         &nbsp;<del>{<NumberFormat value={parseFloat(order.total)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</del> 
                                                         </h6>
                                                         : 
                                                         <h6> <NumberFormat value={parseFloat(order.total)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </h6>
                                                    }
                                                   <p className="text-truncate" >{_orderStaus.replace(/_/g, '\u00a0')} </p>
                                                    {/* <p className="text-truncate" >{order.order_status.replace(/_/g, '\u00a0')} {_customerName && _customerName !== " " ? " - " + _customerName: ''}</p> */}
                                                    {/* <div className="w-100 text-truncate"></div> */}
                                                    </div>
                                                </td>
                                                <td style={{ display: "none" }}>{order.CustEmail}</td>
                                                <td style={{ display: "none" }}>{order.CustFullName}</td>
                                                <td style={{ display: "none" }}>{order.CustPhone}</td>
                                                <td className="text-right">
                                                        <div className="widget_day_record_text text-right">
                                                        {time.replace(/ /g, '\u00a0')}
                                                        <p className="text-truncate" >{_groupSaleName.replace(/_/g, '\u00a0')} </p>
                                                            </div>
                                                   
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            </table>
                         </div>
                        )
                    })
                }
            </div>
    );
}
