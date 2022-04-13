import React from 'react';
import { history } from '../../_helpers';
import moment from 'moment';
import Pagination from './Pagination';
import Config from '../../Config';
import { default as NumberFormat } from 'react-number-format';
import Language from '../../_components/Language';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
/** 
 * Updated By:priyanka
 * Created Date:19/6/2019
 * Description:set order id to display selected order  
 **/
function ActivityPage(props, id, uid) {
    localStorage.removeItem("CUSTOMER_TO_ACTVITY")
    localStorage.setItem("selected_row", 'customerview');
    localStorage.setItem('CUSTOMER_TO_OrderId', id);
    history.push('/activity');
}

export const CustomerViewTable = (props) => {
    return (
        <div className="pt-4">
            <table className="table table-customer-view table-no-margin">
                <thead>
                    <tr>
                        <th width="20%">{LocalizedLanguage.date}</th>
                        <th width="20%">{LocalizedLanguage.status}</th>
                        <th className='location'>{LocalizedLanguage.locationTax}</th>
                        <th width="15%">{LocalizedLanguage.amount}</th>
                        <th> &nbsp;</th>
                    </tr>
                </thead>
            </table>
            <div className="overflowscroll" style={{ height: "250px" }} >
                <table className="table table-customer-view table-no-margin">
                    <tbody>
                        {
                            // (typeof props.details !== "undefined" && props.details.length > 0) ? (
                            props.details && props.details.length > 0 && props.pageOfItems && props.pageOfItems.map((item, index) => {
                                return (<tr key={index} onClick={() => ActivityPage(props.Props, item.Id, props.UDID)}>
                                    <td width="20%">{item.OrderTime ? moment.utc(item.OrderTime).local().format(Config.key.DATE_FORMAT) : ""}</td>
                                    <td width="20%">{item.Status}</td>
                                    <td className='location'>{item.Location}</td>
                                    <td width="15%"><NumberFormat value={parseFloat(item.Amount ? item.Amount : 0)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                    <td className="action action-short action-pointer"><i className="icons8-login"></i></td>
                                </tr>)
                            })
                            // ) 
                            // : (
                            //         <tr>
                            //             <td style={{ borderBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingBottom: 0, paddingRight: 0, textAlign: 'unset' }} >
                            //                 <p className="alert text-white" style={{ textAlign: "center" }}>{LocalizedLanguage.notFound}</p>
                            //             </td>
                            //         </tr>
                            //     )
                        }
                        {
                            (typeof props.details !== "undefined" && props.details.length > 0) ? (
                                <tr>
                                    <th colSpan="5" className="bgcolor1 p-0">
                                        <Pagination items={props.details} onChangePage={props.onChangePage} />
                                    </th>
                                </tr>
                            ) : <tr><td colSpan="5"> {LocalizedLanguage.noFound}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
