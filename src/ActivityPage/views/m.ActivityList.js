import React from 'react';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import { default as NumberFormat } from 'react-number-format';
import MobileActivityOrderDetail from './m.ActivityOrderDetail'
const MobileActivityList = (props) => {
    const { orders, ordersDate, current_date, activityTableFilter, windowLocation1, activities, config, LocalizedLanguage, load, clearInput, activeFilter} = props;
    //console.log("data", props)
    return (
        props.single_Order_list && sessionStorage.getItem("OrderDetail") && sessionStorage.getItem("OrderDetail") !== "" ?
            <MobileActivityOrderDetail windowLocation1={windowLocation1} {...props} />
            :
            // <div>Actvity order list</div> searchbar-search-icon
            <div className="appCapsule h-100 pb-0">
                <div className="bg-light py-2">
                    <div className="toggleSearchboxFull fadeIn my-0">
                        <div className="searchbar-input-container searchbar-input-container">
                            <input className="searchbar-input searchbar-input" id="search-orders" placeholder="Search by Name, Email or Phone"
                                type="search" autoComplete="off" autoCorrect="off" spellCheck="false" onChange={activityTableFilter} />
                            <button onClick={() => clearInput()} className="searchbar-clear-icon shadow-none">
                                    <img src="../mobileAssets/img/close.svg" className="w-20" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="content_scroll_to_search_nofooter scrollbar">
                    <table className="table table-striped mb-0 table-borderless tbl-activity CurrentActivityTable">
                        { activeFilter && activeFilter==true && (  (!ordersDate)|| ordersDate.length ==0) ?                          
                            <table className="table table-day-record" id="tableid">
                                <tbody>
                                    <tr>
                                        <td> <i className="fa fa-spinner fa-spin" >{LocalizedLanguage.noRecordFound}</i></td>
                                    </tr>
                                </tbody>
                            </table>
                            :null
                        }
                        {
                            ordersDate && ordersDate.map((getDate, index) => {
                                return (
                                    <tbody key={`order_date_${index}`}>
                                        <tr className="caption activity-order" >
                                            <th colSpan="2">
                                                {current_date == getDate ? 'Today' : getDate}
                                            </th>
                                        </tr>
                                        {
                                            orders[getDate] && orders[getDate].map((order, index) => {
                                                //   update date and time according to timeZone;
                                                var time = FormateDateAndTime.formatDateWithTime(order.date_time, order.time_zone);
                                                return (
                                                    <tr id={`activity-order-${order.order_id}`} className={`activity-order`} key={index} onClick={() => props.click(order, order.order_id, true)}>
                                                        <td>{order.order_status.replace(/_/g, '\u00a0')}
                                                            <div>{
                                                                (order.refunded_amount > 0) ?
                                                                    <div>{<NumberFormat value={parseFloat(order.total - order.refunded_amount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}{"  "}
                                                                        <del>{<NumberFormat value={parseFloat(order.total)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</del> </div>
                                                                    : <NumberFormat value={parseFloat(order.total)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                            }
                                                            </div>
                                                        </td>
                                                        <td style={{ display: "none" }}>{order.CustEmail}</td>
                                                        <td style={{ display: "none" }}>{order.CustFullName}</td>
                                                        <td style={{ display: "none" }}>{order.CustPhone}</td>
                                                        <td align="right" scope="1">
                                                            {time.replace(/ /g, '\u00a0')}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                )
                            })
                        }
                        {activities.activities && !activities.activities.length == 0 && activities.activities.length >= config.key.ACTIVITY_PAGE_SIZE ?
                            <tbody>
                                <tr className=" appBottomCustomerButton" onClick={() => load()}>
                                    <td className="p-0 border-0" colSpan="2" ><button id='hideButton' className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                                    </td>
                                </tr>
                            </tbody>
                            :
                            null
                        }
                    </table>
                </div>
                <div className="div">
                </div>
            </div>
    )
}
export default MobileActivityList;