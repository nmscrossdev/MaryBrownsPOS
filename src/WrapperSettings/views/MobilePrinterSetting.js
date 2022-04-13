import React from 'react';
import {removeActiveCss,showSelected} from '../CommonWork';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
class MobilePrinterSetting extends React.Component {
    constructor(props) {
        super(props);
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
            if(sps=="80mm")
            {
                sps="52-58mm";
            }
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
    launch_oliver()
    {
        var urlParam = this.props.location.search;
        if(urlParam && typeof urlParam!="undefined")
        {
            var splParam = urlParam.replace("?", "");
            //history.push(splParam);
            window.location = splParam;
        }
    }
    render()
   {
    const { NavbarPage, CommonHeader} = this.props;
   
    return (
        <div>
                <CommonHeader {...this.props} />
                <NavbarPage {...this.props} />
                <div className="appCapsule h-100 overflow-auto">
                    <div className="row no-gutters">
                        <div className="col-sm-12">
                            <div className="card-body-content mb-0">
                                <h6 className="card-title">Which printer do you want to use?</h6>
                                <div className="card-wrap d-flex flex-wrap">
                                        
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPrinter('none')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none select-printer rounded-8" data-value="none">
                                        <input type="radio" name="optprinter" /> None
                                    </label>
                                </div>
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPrinter('built-in-printer')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none select-printer rounded-8" data-value="built-in-printer">
                                        <input type="radio" name="optprinter" /> Built-in Printer
                                    </label>
                                </div>
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPrinter('cloud-printer')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none select-printer rounded-8" data-value="cloud-printer">
                                        <input type="radio" name="optprinter" /> Cloud Printer
                                    </label>
                                </div>
                                

                                </div>
                                <div className="card-wrap">
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" /*onClick={() => this.selectPrinter('air-printer')}*/>
                                    <label className="btn btn-outline-primary btn-sm shadow-none  rounded-8 no-cursor disabled" > 
                                        <input type="radio" name="optprinter" /> Air Print
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div className="card-body-content mb-0">
                                <h6 className="card-title">Which paper size?</h6>
                                <div className="card-wrap d-flex flex-wrap">
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('52-58mm')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none receipt-size rounded-8" data-value="52-58mm">
                                        <input type="radio" name="optreceiptsize" /> 52 - 58 mm
                                    </label>
                                </div>    
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('78-80mm')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none receipt-size rounded-8" data-value="78-80mm">
                                        <input type="radio" name="optreceiptsize" /> 78 - 80 mm
                                    </label>
                                </div>
                                {/* <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('78mm')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none receipt-size rounded-8" data-value="78mm">
                                        <input type="radio" name="optreceiptsize" /> 78 mm
                                    </label>
                                </div>
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectPaperSize('80mm')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none receipt-size rounded-8" data-value="80mm">
                                        <input type="radio" name="optreceiptsize" /> 80 mm
                                    </label>
                                </div> */}
                                </div>
                            </div>
                            <div className="card-body-content mb-0">
                                <h6 className="card-title">Auto print receipt after each sale?</h6>
                                <div className="card-wrap d-flex flex-wrap">
                                        
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectAutoPrint('yes')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none auto-print rounded-8" data-value="yes">
                                        <input type="radio" name="optautoprint" /> {LocalizedLanguage.yes}
                                    </label>
                                </div>
                                <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectAutoPrint('no')}>
                                    <label className="btn btn-outline-primary btn-sm shadow-none auto-print rounded-8" data-value="no">
                                        <input type="radio" name="optautoprint" /> {LocalizedLanguage.no}
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div className={ "card-body-content mb-0"}>
                            <hr className='mt-0 mb-20'></hr>
                            <button type="button" className="btn btn-primary btn-block rounded-0 h-50-pxi shadow-none fz-20" onClick={() => this.testPrinter()}>Test Printer</button>
                            </div>

                            <div className={ "card-body-content mb-0"}>
                            <hr className='mt-0 mb-20'></hr>
                            <button type="button" className="btn btn-primary btn-block rounded-0 h-50-pxi shadow-none fz-20" onClick={() => this.launch_oliver()}>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
    )
   }
}
export default MobilePrinterSetting;