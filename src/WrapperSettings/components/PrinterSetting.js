import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {removeActiveCss,showSelected} from '../CommonWork';
// import $ from 'jquery';
class PrinterSetting extends React.Component {
    openCashDrawer()
    {
        if(typeof Android !== "undefined" && Android !== null) {    
            Android.openCahsDrawer()
        }
    }
    componentDidMount() {
       
        let sp=localStorage.getItem('selected_printer');
        let sps=localStorage.getItem('selected_papersize');
        let iar=localStorage.getItem('is_autoprint_receipt');

        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            Android.setStoreDataPref("receipt_size",sps)
        }

        if(sp)
        {
            showSelected('select-printer',sp)
        }
        if(sps)
        {
            showSelected('receipt-size',sps)
        }
        if(iar)
        {
            showSelected('auto-print',iar)
        }
    }
    selectPrinter(val)
    {
        localStorage.setItem('selected_printer',val);
       removeActiveCss('select-printer')
    }
    selectPaperSize(val)
    {
        localStorage.setItem('selected_papersize',val);
       removeActiveCss('receipt-size')
    }
    selectAutoPrint(val)
    {
       localStorage.setItem('is_autoprint_receipt',val);
       removeActiveCss('auto-print')

       if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
       {
            Android.setStoreDataPref("receipt_size",val)
       }
       
    }
    testPrinter()
    {
        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            var PrintAndroidReceiptData={};
            var PrintAndroidData=[];
            PrintAndroidData.push({ "rn": 1,"cms": 1,"c1": "Testing Printer:" + "\n" + "Printer is Connected!!!" + "\n" + "Now you can start Printing Reciepts","c2": "","c3": "", "bold": "0,0,0","fs": "24","alg": "0"}); 
            PrintAndroidReceiptData["data"]=PrintAndroidData;
            if(typeof Android !== "undefined" && Android !== null) {
                Android.generateReceipt('',JSON.stringify(PrintAndroidReceiptData));
            }
        }
    }
    render() {
        return (
            <div id="printer-setting" className="tab-pane fade in active">
                <div className="panel panel-custmer">
                    <div className="panel-default pt-2">
                        <div className="panel-body customer_history p-0">
                            <form className="clearfix form_editinfo connection-setting">
                            <div className="card-body no-padding overflowscroll pgsectionfilter">
                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">Which printer do you want to use?</h6>
                                    <div className="card-wrap">
                                            
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPrinter('none')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none select-printer pl-3 pr-3" data-value="none">
                                            <input type="radio" name="optprinter" /> None
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPrinter('built-in-printer')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none select-printer pl-3 pr-3" data-value="built-in-printer">
                                            <input type="radio" name="optprinter" /> Built-in Printer
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPrinter('cloud-printer')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none select-printer pl-3 pr-3" data-value="cloud-printer">
                                            <input type="radio" name="optprinter" /> Cloud Printer
                                        </label>
                                    </div>
                                  

                                    </div>
                                    <div className="card-wrap">
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" /*onClick={() => this.selectPrinter('air-printer')}*/>
                                        <label className="btn ol-outline-primary btn-sm shadow-none  pl-3 pr-3 no-cursor disabled" > 
                                            <input type="radio" name="optprinter" /> Air Print
                                        </label>
                                    </div>
                                    </div>
                                </div>

                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">Which paper size?</h6>
                                    <div className="card-wrap">
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('52mm')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none receipt-size pl-3 pr-3" data-value="52mm">
                                            <input type="radio" name="optreceiptsize" /> 52 mm
                                        </label>
                                    </div>    
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('58mm')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none receipt-size pl-3 pr-3" data-value="58mm">
                                            <input type="radio" name="optreceiptsize" /> 58 mm
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('78mm')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none receipt-size pl-3 pr-3" data-value="78mm">
                                            <input type="radio" name="optreceiptsize" /> 78 mm
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('80mm')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none receipt-size pl-3 pr-3" data-value="80mm">
                                            <input type="radio" name="optreceiptsize" /> 80 mm
                                        </label>
                                    </div>
                                    </div>
                                </div>

                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">Auto print receipt after each sale?</h6>
                                    <div className="card-wrap">
                                            
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectAutoPrint('yes')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none auto-print pl-3 pr-3" data-value="yes">
                                            <input type="radio" name="optautoprint" /> {LocalizedLanguage.yes}
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectAutoPrint('no')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none auto-print pl-3 pr-3" data-value="no">
                                            <input type="radio" name="optautoprint" /> {LocalizedLanguage.no}
                                        </label>
                                    </div>
                                    </div>
                                </div>
                                <div className={ "card-body-content mb-0"}>
                                <div className='hr-w300'><hr></hr></div>
                                <div className="createnewcustomer">
                                    <button type="button" className="btn btn-primary total_checkout btn-wd pt-3 pb-3" onClick={() => this.testPrinter()}>Test Printer</button>
                                </div>
                            </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
                

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedSettingGeneral = connect(mapStateToProps)(PrinterSetting);
export { connectedSettingGeneral as PrinterSetting };
