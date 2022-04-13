/**
 * Created By:priyanka
 * Created Date:14/6/2019
 * Description:quantity msg poppup 
 */

import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { Markup } from 'interweave';

export const CloudPrinterListPopup = (props) => {
    // var printersList = JSON.parse(localStorage.getItem('FAV_LIST_ARRAY'))
    var printersList = props.cloudPrintersData && props.cloudPrintersData.content ? props.cloudPrintersData.content : []

    // uncheck other checkbox if local selected and vice versa
    setTimeout(() => {
        $('.checkBoxClass').change(function () {
            var cloudPrinterName = $(this).prop('name')
            cloudPrinterName == 'setLocalPrinter' ? $(`input[name=setCloudPrinter]:checked`).click() : ''
            cloudPrinterName == 'setCloudPrinter' ? $('input[name=setLocalPrinter]:checked').click() : ''
        });
    }, 1000);
    return (

        <div id="cloudPrinterListPopup" data-backdrop="static" tabIndex="-1" className="modal modal-wide modal-wide1 fade modal-wide-sm">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close fs36 mt-0" aria-hidden="true" data-dismiss="modal" onClick={props.closeCloudPopup}>
                            <img src="assets/img/Close.svg" />
                            {/* <i className="icon icon-fill-close icon-css-override text-danger pointer push-top-3"></i> */}
                        </button>
                        <h4 className="modal-title">Send Receipt to Printer</h4>
                    </div>
                    <div className="modal-body pl-0 pr-0 pt-0">
                        <div className="all_product">
                            <div className="overflowscroll" id="scroll_mdl_body">
                                <div>
                                    {/* <div className="clearfix">
                                        <div className="searchDiv relDiv">
                                            <input className="form-control nameSearch bb-0 backbutton" id="tileback" value="Back" readOnly={true} data-toggle="modal" />
                                        </div>
                                    </div> */}

                                    <table className="table ShopProductTable">
                                        <tbody>
                                            {/* default printer */}
                                            <tr key={100} >
                                                <td style={{ width: "56px" }} className="pointer">
                                                    <div className="custom_checkbox3 custom_checkbox_set">
                                                        <input type="checkbox" name="setLocalPrinter" id={`id_${100}`} value={'localPrinter'} className='checkBoxClass' />
                                                        <label htmlFor={`id_${100}`} className="pl-3" onClick={() => props.handlePrinterIdClick('localPrinter')}>&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td align="left" className="pl-2">
                                                    {'Local printer'}
                                                </td>
                                                <td className="text-right" ></td>
                                            </tr>
                                            {
                                                // cloud printer list
                                                printersList && printersList.map((item, index) => {
                                                    return (
                                                        <tr key={index} >
                                                            <td style={{ width: "56px" }} className="pointer">
                                                                <div className="custom_checkbox3 custom_checkbox_set" >
                                                                    {/* <input type="checkbox" name="setFavorite" id={`id_${item.PrinterId}`} value={item.PrinterId} data-type="product" data-slug={item.Name} data-id={`id_${item.PrinterId}`} /> */}
                                                                    <input type="checkbox" name={`setCloudPrinter`} id={`id_${item.Id}`} value={item.Id} className='checkBoxClass' />
                                                                    <label htmlFor={`id_${item.Id}`} className="pl-3" onClick={() => props.handlePrinterIdClick(item.Id)}>&nbsp;</label>
                                                                </div>
                                                            </td>
                                                            <td align="left" className="pl-2">
                                                                {item.Name}
                                                            </td>
                                                            <td className="text-right" ></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                    <p style={{ color: 'red', textAlign: 'center' }}> {props.cloudPrinterErr ? props.cloudPrinterErr : ''}</p>
                    <div className="modal-footer p-0">
                        <button type="button" className="btn btn-primary btn-block h66" onClick={() => props.handleCloudPrinterClick()}>Print</button>
                    </div>
                </div>
            </div>
        </div>


        //  <div id="cloudPrinterListPopup" className="modal modal-wide modal-wide1 fade modal-wide-sm" data-backdrop="static">
        //      <div className="modal-dialog" id="dialog-midle-align">
        //          <div className="modal-content">
        //              <div className="modal-header">
        //                  <button onClick={props.closeCloudPopup} type="button" className="close" data-dismiss="modal" aria-hidden="true">
        //                      <img src="../assets/img/Close.svg" />
        //                  </button>
        //              </div>
        //              <div className="modal-body p-0">
        //                  <div className='popup_payment_error_msg'>
        //                      <ul>
        //                          <li style={{ cursor: 'pointer' }} onClick={() => props.handleCloudPrinterClick('localPrinter')} >
        //                              local printer
        //                         </li>
        //                         <li style={{ cursor: 'pointer' }} onClick={() => props.handleCloudPrinterClick(26)} >
        //                              cloud printer
        //                         </li>
        //                      </ul>
        //                  </div>
        //              </div>
        //          </div>
        //      </div>
        //  </div>
    );
}