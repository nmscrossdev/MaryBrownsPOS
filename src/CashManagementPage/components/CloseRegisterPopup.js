import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { userActions } from '../../_actions/user.actions';
import { cashManagementAction } from '../actions/cashManagement.action';
import { setAndroidKeyboard } from "../../settings/AndroidIOSConnect";
import { default as NumberFormat } from 'react-number-format';
import Config from '../../Config';
import { history } from '../../_helpers';
import moment from 'moment';
import ActiveUser from '../../settings/ActiveUser';
import { redirectToURL } from '../../_components/CommonJS';
import { showAndroidReceipt } from '../../settings/AndroidIOSConnect';
class CloseRegisterPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { enterNote: "", }



        this.CloseRegister = this.CloseRegister.bind(this);
        this.PrintDiv = this.PrintDiv.bind(this);
        this.printHtml = this.printHtml.bind(this);

        //    //Geting cash Summary---------------------------------------   
        //          var registerId = localStorage.getItem('register');     
        //         var CashManagementId= localStorage.getItem('Cash_Management_ID');
        //         var user = JSON.parse(localStorage.getItem("user"));
        //         var LoggenInUserId =user && user.user_id ? user.user_id : '';
        //         if (CashManagementId && CashManagementId !==null && registerId && registerId > 0 ){
        //             console.log("CashManagementId",CashManagementId)
        //         this.props.dispatch(cashManagementAction.getSummery(CashManagementId,registerId,LoggenInUserId));
        //         }
        //     //     /// ------------------------------------------------------
    }
    componentWillReceiveProps(nextProp) {
        // if (nextProp && nextProp.cashSummery && nextProp.cashSummery) {

        //     this.setState({ "cashSummery": nextProp.cashSummery })
        // console.log("cashSummery" ,this.state.cashSummery)
        // }
        //   if (nextProp && nextProp.closeRegister && nextProp.closeRegister) {

        //     console.log("closeRegister" ,nextProp.closeRegister)
        //     this.printHtml(nextProp.closeRegister)
        // }
    }

    // componentDidMount() {
    //     var cashManagementId = localStorage.getItem('Cash_Management_ID');
    //     this.props.dispatch(cashManagementAction.getDetails(cashManagementId));
    // }

    printHtml(_closeRegister) {
        var PrintAndroidReceiptData={};
        var PrintAndroidData=[];
        var rowNumber=0;
        var _taxDetail=[];

        console.log('_closeRegister', _closeRegister)
        console.log(' this.state.enterNote', this.state.enterNote)
        const pageSize = ActiveUser.key.pdfFormate;
        console.log("==-------pageSize----", pageSize)
       
        var _totalDiff = _closeRegister && _closeRegister.Actual - _closeRegister.Expected;
        var _totalActual = _closeRegister && _closeRegister.Actual;
        var _totalExpected = _closeRegister && _closeRegister.Expected;
        var closePersonName  = _closeRegister && _closeRegister.ClosingByName && _closeRegister.ClosingByName.trim() !==''? _closeRegister.ClosingByName :_closeRegister.ClosingByEmail;
        var SalePersonName = _closeRegister && _closeRegister.SalePersonName && _closeRegister.SalePersonName.trim() !==''? _closeRegister.SalePersonName:_closeRegister.SalePersonEmail;
        var otherPayments = ''
        var finaltotal = _closeRegister.Expected;
        var finalactual = _closeRegister.Actual;
      
       var _otherPayments=[];
        _closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map(item => {
            _totalDiff = _totalDiff + (item.Actual - item.Expected);
            _totalActual = _totalActual + item.Actual;
            _totalExpected = _totalExpected + item.Expected;
          
            finaltotal +=item.Expected
            finalactual +=item.Actual
            _otherPayments.push({"rn": rowNumber++,"cms":3,"c1":parseFloat(item.Expected).toFixed(2),"c2":parseFloat(item.Actual).toFixed(2),"c3":parseFloat(item.Actual - item.Expected).toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"});
            
            otherPayments = otherPayments +
            `<tr>
                                    <td class="font-bold" colspan="2">${item.Name}</td>
                                </tr>
                                <tr>
                                <td>Expected </td>
                                <td>Actual </td>
                                <td style="text-align: right;">Difference </td>
                                </tr>
            <tr>
                                            <td>${parseFloat(item.Expected).toFixed(2)}</td>
                                            <td>${parseFloat(item.Actual).toFixed(2)}</td>
                                            <td style="text-align: right;">  ${parseFloat(item.Actual - item.Expected).toFixed(2) <0?"":"+"}${parseFloat(item.Actual - item.Expected).toFixed(2)}</td>
                                        </tr>`;
        })
        var locationName = localStorage.getItem('LocationName');
        var registerName = localStorage.getItem('registerName');
        var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
        var shopName = user && user.shop_name ? user.shop_name : '';
        var shopWebsite = user && user.website ? user.website : '';
        var shopaddress = user && user.shop_address1 ? user.shop_address1 : '';
       
        
        var manualTransac = ''
     let initialValue = 0;
    let staffTotal =  _closeRegister.CashRegisterlog.reduce((totalvalue,currentValue)=>{
          return totalvalue + currentValue.Expected
      },0)
      var _manualTransac=[];
        _closeRegister && _closeRegister.CashRegisterlog && _closeRegister.CashRegisterlog.map(item => {
        //   if(item.IsManual==true)
        //   {
        //     _manualTransac.push({"rn": rowNumber++,"cms":1,"c1":parseFloat(item.Expected).toFixed(2),"c2":parseFloat(item.Actual).toFixed(2),"c3":parseFloat(item.Actual - item.Expected).toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"})
        //   }
            return (
                item.IsManual == true ?
                    manualTransac = manualTransac + `<tr>
                                                    <th>Manual Transactions</th>
                                                    <th></th>
                                                    <th>${item.Expected}</th>
                                                    <th>N/A</th>
                                                </tr> `
                    : ''
            )
        })
        var  totalTax=0.0;
        var  taxDetail='';
        var  orderTaxes=[];   
        var totalTaxRatePerc=0; 
        var taxGrossAmount=0.0;
        var taxNetAmount=0;
        var totalRefund=0.0;
       
        var totallDiscount=0.0;
        var totalCanceled=0; 
        var totalCanceledCount=0;
        var totalTransaction=0;
 
        _closeRegister && _closeRegister.orders && _closeRegister.orders.map(item => {          
                var arrItem= orderTaxes[item.order_taxes.RateId]
                var existInArry=false;
                // var isCash=false;

                // item.order_payments.forEach( function (ordPay) { 
                //     if(ordPay.type=="cash"){
                //         isCash=true;
                //     }               
                // })
                //if( isCash==true){
                        item.order_taxes.forEach( function (ordtax) { 
                            orderTaxes.forEach( function (arrItem) { 
                                if(arrItem.RateId==ordtax.RateId ){
                                    arrItem["Total"]=parseFloat(arrItem.Total)+ parseFloat(ordtax.Total)                                    
                                    existInArry=true;
                                    arrItem["OrderAmount"]= parseFloat(arrItem.OrderAmount)+ parseFloat(item.total_amount)
                                }
                            });                                

                            if(existInArry==false){
                                ordtax["OrderAmount"]= parseFloat(item.total_amount)
                                orderTaxes.push(ordtax);
                               
                            }
                        
                        });   
                        if(item.refunded_amount){
                            totalRefund += parseFloat(item.refunded_amount)
                        }
                        if(item.order_status=="Cancelled" ){
                            totalCanceled +=item.total_amount;
                            totalCanceledCount +=1;
                        }
                        if(item.discount ){
                            totallDiscount +=parseFloat(item.discount);
                        }      
                        if(item.order_taxes && item.order_taxes.length>0){
                         
                           // taxGrossAmount += parseFloat(item.total_amount);
                           // taxNetAmount += parseFloat(item.total_amount)- parseFloat(item.total_tax);  
                            totalTax +=parseFloat(item.total_tax);                 
                        }
            //}
        })
      console.log("totalTransaction",totalTransaction)  
       var  ratelist=  localStorage.getItem('SHOP_TAXRATE_LIST') && JSON.parse(localStorage.getItem('SHOP_TAXRATE_LIST'));
      
       orderTaxes.forEach( function (arrItem) {
            var ratePerc=""
            ratelist && ratelist.map(item=>{
                if(item.TaxId==arrItem.RateId){
                ratePerc=item.TaxRate
                totalTaxRatePerc +=parseFloat(item.TaxRate.replace('%',''))
                }
            })
            taxGrossAmount += parseFloat(arrItem.OrderAmount);
            taxNetAmount += parseFloat(arrItem.OrderAmount)- parseFloat(arrItem.Total)
            //totalTax +=arrItem.Total;
            _taxDetail.push({"rn": rowNumber++,"cms":1,"c1":arrItem.Title+"("+ratePerc+")","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"});
            _taxDetail.push({"rn": rowNumber++,"cms":3,"c1":"Gross","c2":"Net","c3":"Tax","bold":"0,0,0","fs":"24","alg":"0,1,2"});
            _taxDetail.push({"rn": rowNumber++,"cms":3,"c1":arrItem.OrderAmount.toFixed(2),"c2":(arrItem.OrderAmount- parseFloat(arrItem.Total)).toFixed(2),"c3":parseFloat(arrItem.Total).toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"});


            taxDetail +=`<tr><td class="font-bold" colspan="3"> ${arrItem.Title} (${ratePerc}) </td></tr>`
            taxDetail +=`<tr><td>Gross </td><td>Net </td><td style="text-align: right;">Tax </td></tr>`
            taxDetail +=`<tr><td>${arrItem.OrderAmount.toFixed(2)} </td><td>${(arrItem.OrderAmount- parseFloat(arrItem.Total)).toFixed(2)}</td><td style="text-align: right;">${parseFloat(arrItem.Total).toFixed(2)}</td></tr>`
         });
         

        console.log("orderTaxes",orderTaxes)
        var openingDate = _closeRegister && _closeRegister.UtcOpenDateTime ? _closeRegister.UtcOpenDateTime : ''
        var openingDateTime = moment.utc(openingDate).local().format(Config.key.DATETIME_FORMAT);
        
        var closingDate = _closeRegister && _closeRegister.UtcClosedDateTime ? _closeRegister.UtcClosedDateTime : ''
        var closingDateTime = moment.utc(closingDate).local().format(Config.key.DATETIME_FORMAT);
        const orderReceipt = localStorage.getItem('orderreciept') ? JSON.parse(localStorage.getItem('orderreciept')) : '';
        var now =  moment.utc(_closeRegister.UtcClosedDateTime); //todays date
        var end =  moment.utc(_closeRegister.UtcOpenDateTime); // another date
        var duration = moment.duration(now.diff(end));
        console.log(now.diff(end, 'hours')) // 745
        // var duration = moment.duration(closingDateTime.diff(closingDate));
         var hours = duration.asHours().toFixed(2);
        //var hours=0
        var _tip;
        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"End of Day / Z report","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":shopaddress,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"End of Day Z Report #","c2":_closeRegister && _closeRegister.CashManagementId,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
            
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Report From:" +openingDateTime,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Opened by:" +SalePersonName,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Report Until:" +closingDateTime,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Closed by:" +closePersonName,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Duration:" +hours +" hr","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Register:" +registerName,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 

            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 

            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Cash Report","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 

            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Expected","c2":"Actual","c3":"Difference","bold":"0,0,0","fs":"24","alg":"0,1,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":_closeRegister && parseFloat(_closeRegister.Expected).toFixed(2),"c2":_closeRegister && parseFloat(_closeRegister.Actual).toFixed(2),"c3":parseFloat(_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)).toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"});  

            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Card","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Expected","c2":"Actual","c3":"Difference","bold":"0,0,0","fs":"24","alg":"0,1,2"});
            
            _otherPayments && _otherPayments.length>0 &&  _otherPayments.map(item => {
                PrintAndroidData.push(item);  
            });
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 

            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Total","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Expected","c2":"Actual","c3":"Difference","bold":"0,0,0","fs":"24","alg":"0,1,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":finaltotal.toFixed(2),"c2":finalactual.toFixed(2),"c3":parseFloat(_totalActual- _totalExpected).toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"});  

            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Notes","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Description:","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":this.state.enterNote,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"});

            //Revenue
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Revenue:","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Total","c2":_closeRegister.Actual,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 

            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Excluding Expenses","c2":"0.00","c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Tip","c2":"0.00","c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            //Staff
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Staff:","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Name","c2":closePersonName,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Amount","c2":_closeRegister && _closeRegister.Expected,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            //Tax
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Tax:","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            
            _taxDetail && _taxDetail.length>0 &&  _taxDetail.map(item => {
                PrintAndroidData.push(item);  
            });
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Total","c2":_closeRegister.Actual,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":taxGrossAmount.toFixed(2),"c2":taxNetAmount.toFixed(2),"c3":totalTax.toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"});
            
            //Voided/Cancelled/Refunded
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Voided/Cancelled/Refunded","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Reason","c2":"Num.","c3":"Amount","bold":"0,0,0","fs":"24","alg":"0,1,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Voided","c2":"0.00","c3":totalCanceled,"bold":"0,0,0","fs":"24","alg":"0,1,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Refunded","c2":totalCanceledCount,"c3":totalRefund.toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Total","c2":totalCanceledCount,"c3":totalRefund.toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"}); 
        
            //Discount
            PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Discount","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":3,"c1":"Reason","c2":"Num.","c3":"Amount","bold":"0,0,0","fs":"24","alg":"0,1,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Discount","c2":totallDiscount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Total","c2":totallDiscount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            
            //Total # of Transactions
            
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Total # of Transactions","c2":_closeRegister.Actual,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Total","c2":_closeRegister.CashRegisterlog.length,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            PrintAndroidReceiptData["data"]=PrintAndroidData;
        }
         {/* <tr>
            <td colspan="2">Total # of Transactions: ${ _closeRegister.CashRegisterlog.length}</td>
        </tr> */}
        var html = (`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>End of Day / Z report</title>
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            body {
                font-family: 'Poppins', sans-serif;
                font-size: 14px;
                line-height: 19px;
            }
            body, h1,h2,h3,h4,h5,h6 {
                margin: 0;
                padding: 0;
            }
            .table-common {
                margin-bottom: 30px;
            }
            .table-common td {
                padding-top: 5px;
                padding-bottom: 5px;
            }
            .table-common tr:first-child td {
                padding-top: 6px;
            }
            .table-common thead th{
                border-bottom: 1px solid #050505;
                padding-bottom: 10px;
            }
            .table-common tr:last-child td {
                padding-bottom: 8px;
                border-bottom: 1px solid #050505;
            }
            .font-bold {
                font-weight: 600;
            }
            
            .section-heading{
                font-weight: 500;
                border-bottom: 1px solid #050505;
                padding-bottom: 10px;
                font-size: 14px;
            }
            /* .table-common2 thead tr:first-child th{
                font-weight: 500;
                border-bottom: 1px solid #050505;
                padding-bottom: 10px;
                font-size: 14px;
            } */
            .category-list tfoot tr:last-child td {
                border-bottom: 0;
            }
            .pagesize{
                width:${pageSize.width}; overflow:hidden;
                  margin: 0 auto;
              }
            </style>
        </head>
<body>
<div style='padding:${pageSize.width=='80mm'?"20px" :(pageSize.width=='52mm' || pageSize.width=='58mm')? "10px" :"40px"};'   class='pagesize'>
<div style="text-align: center; padding-bottom: 30px;">
    <h4 style="margin-bottom: 8px;">End of Day / Z report</h4>
    <address>
        ${shopaddress}
       
    </address>
</div>
<table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
    <thead>
        <th>End of Day Z Report #</th>
        <th style="text-align: right;">${_closeRegister && _closeRegister.CashManagementId}</th>
    </thead>
    <tbody>
        <tr>
            <td colspan="2">Report From: ${openingDateTime} </td>
        </tr>
        <tr>
            <td colspan="2">Opened by: ${SalePersonName} </td>
        </tr>
        <tr>
            <td colspan="2">Report Until:  ${closingDateTime}</td>
        </tr>
        <tr>
            <td colspan="2">Closed by: ${closePersonName} </td>
        </tr>
        <tr>
            <td colspan="2">Duration: ${hours} hr</td>
        </tr>
        <tr>
            <td colspan="2">Register: ${registerName} </td>
        </tr>        
        
    </tbody>
</table>
<div>
    <h1 class="section-heading">
        Tender summary
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>
                <tr>
                    <td class="font-bold" colspan="2">Cash In Til</td>
                </tr>
                <tr>
                    <td>Expected </td>
                    <td>Actual </td>
                    <td style="text-align: right;">Difference </td>
                </tr>

                <tr>
                <td>${ _closeRegister && parseFloat(_closeRegister.Expected).toFixed(2)}</td>
                <td>${ _closeRegister && parseFloat(_closeRegister.Actual).toFixed(2)}</td>
                <td style="text-align: right;"> ${parseFloat(_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)).toFixed(2) <0?"":"+"}${parseFloat(_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)).toFixed(2)}</td>
                </tr>
                
                ${otherPayments}
               
              
            </tbody>
            <tfoot>
                <tr>
                    <td class="font-bold" colspan="2">Total</td>
                </tr>
                <tr>
                    <td> Expected </td>
                    <td> Actual  </td>
                    <td style="text-align: right;"> Difference</td>
                <tr>
                    <td>${finaltotal.toFixed(2)} </td>
                    <td>${finalactual.toFixed(2)} </td>
                    <td style="text-align: right;">${parseFloat(_totalActual- _totalExpected).toFixed(2)} </td>
                </tr>
            </tfoot>
        </table>
       
    </div>
</div>

<div>
    <h1 class="section-heading">
        Notes
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>
                <tr>
                    <td colspan="2"><br> ${this.state.enterNote} </br> </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<div>
    <h1 class="section-heading">
        Revenue
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>
                <tr>
                    <td>Total</td>
                    <td style="text-align: right;">  ${_closeRegister.Actual } </td>
                </tr>
                <tr>
                    <td>Excluding Expenses</td>
                    <td style="text-align: right;">0.00</td>
                </tr>
               ${ _tip? `<tr>
                    <td>Tips</td>
                    <td style="text-align: right;">0.00</td>
                </tr>`:''}
            </tbody>
        </table>
    </div>
</div>

<div>
    <h1 class="section-heading">
        Staff
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>
            <tr>
            <td>Name</td>
            <td  style="text-align: right;">Amount</td>
          </tr>
          <tr>
            <td>${closePersonName}</td>
            <td  style="text-align: right;">${ _closeRegister && _closeRegister.Expected}</td>
          </tr>
            
            </tbody>
        </table>
    </div>
</div>


<div>
    <h1 class="section-heading">
        Tax
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>                
                ${taxDetail}
            </tbody>
            <tfoot>
                <tr>
                    <td class="font-bold" colspan="3">Total</td>
                </tr>
                <tr>
                    <td>Gross </td>
                    <td>Net </td>
                    <td style="text-align: right;">Tax </td>
                </tr>
                    <td>${taxGrossAmount.toFixed(2)} </td>
                    <td>${taxNetAmount.toFixed(2)}</td>
                    <td style="text-align: right;">${totalTax.toFixed(2)}</td>
                </tr> 
            </tfoot>
        </table>
       
    </div>
</div>


<div>
    <h1 class="section-heading">
    Voided/Cancelled/Refunded
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>               
                <tr>
                    <td>Reason </td>
                    <td>Num </td>
                    <td style="text-align: right;">Amount </td>
                </tr>
                <tr>
                    <td>Voided</td>
                    <td>0</td>
                    <td style="text-align: right;">${totalCanceled}</td>
                </tr>
                <tr>
                <td>Refunded</td>
                <td>${totalCanceledCount}</td>
                <td style="text-align: right;">${totalRefund.toFixed(2)}</td>
            </tr>
            </tbody>
            <tfoot>
                 <tr>
                    <td class="font-bold">Total</td>
                    <td>${totalCanceledCount}</td>
                    <td style="text-align: right;">${ totalRefund.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
       
    </div>
</div>
<div>
    <h1 class="section-heading">
        Discount
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tbody>
                <tr>
                    <td>Reason</td>
                    <td>Num</td>
                    <td style="text-align: right;">Amount</td>
                </tr>
                <tr>
                    <td> Discount</td>
                    <td></td>
                    <td style="text-align: right;">${totallDiscount.toFixed(2)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>Total</td>
                    <td></td>
                    <td style="text-align: right;">${totallDiscount.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
<div>
    <h1 class="section-heading">
        Total # of Transactions
    </h1>
    <div class="category-list">
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
            <tfoot>
                <tr>
                    <td>Total</td>
                    <td style="text-align: right;">${ _closeRegister.CashRegisterlog.length}</td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>

</div>`
        );
        // <td class="align-right">
        //     Print Date: <span class="font-italic">${closingDateTime}</span>
        // </td> 
        html += '</body ></html>'
        console.log(html)
        console.log("----PrintAndroidReceiptData--->"+JSON.stringify(PrintAndroidReceiptData))
        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            showAndroidReceipt( "",PrintAndroidReceiptData) 
        }
        else
        {
            var a = window.open('#', '', 'width=400', 'A2');
            a && a.document && a.document.write(html);
            a && a.print();
            a && a.close();
            return true;
        }
    }

    CloseRegister() {
        var cashManagementID = localStorage.getItem('Cash_Management_ID');

        var saveCountParm = { "CashManagementId": cashManagementID, "Note": this.state.enterNote }
        // console.log("saveCountParm", saveCountParm)
        this.props.dispatch(cashManagementAction.SaveClosingNote(saveCountParm))
        setTimeout(() => {
            localStorage.removeItem("CUSTOMER_TO_OrderId")
            localStorage.removeItem('CASH_ROUNDING');
            localStorage.setItem("IsCashDrawerOpen", "false");
            localStorage.removeItem('Cash_Management_ID');
            //Webview Android keyboard setting.................... 
            localStorage.setItem('logoutclick', "true");
            setAndroidKeyboard('logout');
            //--------------------------------------------------------

            //this.props.dispatch(userActions.logout())
            redirectToURL()
            // history.push('/loginpin');

        }, 500);

    }
    enterNote(e) {
        const { value } = e.target;
        this.state.enterNote = value;
    }

    PrintDiv(_closeRegister) {
        // console.log('_closeRegister', _closeRegister)
        var _html = this.printHtml(_closeRegister);
        // console.log("_html",_html)
        //    var divContents = document.getElementById("dvPrint").innerHTML;  //'width=400', 'A2'
        // var a = window.open('#', '', 'height=500, width=500'); //window.open('', '', 'height=500, width=500');      

        // a.document.write(_html); 

        // a.document.close(); 
        // a.print(); 
        // var a = window.open('#', '', 'width=400', 'A2');
        // a.document.write(_html);
        // if(a){
        //     // a.print();
        //     // a.close();
        //     a.document.close();
        //     // a.focus();
        //     a.print();
        // }

    }

    render() {
        const { cashDetails } = this.props;
        var closeRegister = this.props.closeRegister;
        var _closeRegister = null;
        if (closeRegister && closeRegister.closeRegister && closeRegister.closeRegister.content && closeRegister.closeRegister.content)
            _closeRegister = closeRegister.closeRegister.content;
        //   var _totalDiff=_closeRegister && _closeRegister.ActualClosingBalance-_closeRegister.ExpectedClosingBalance;
        //   _closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map(item=>{
        //     _totalDiff= _totalDiff+(item.ActualClosingBalance-item.ExpectedClosingBalance);
        // })
        // var totalDiff = _closeRegister && _closeRegister.Diffrence;
        var _totalDiff = _closeRegister && _closeRegister.Actual - _closeRegister.Expected
        _closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map(item => {
            // _totalDiff = _totalDiff + (item.DiffrenceAmount);
            _totalDiff = _totalDiff + (item.Actual - item.Expected);
            // console.log("_totalDiff",_totalDiff)
        })
        var cashRegisterLog = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.CashRegisterlog : [];
        // console.log("cashRegisterLog", cashRegisterLog);

        return (
            <div className="modal fade popUpMid" id="CloseRegister" role="dialog" data-backdrop="false">
                <div className="modal-dialog modal-center-block">

                    <div className="modal-content">
                        <div className="modal-header header-modal">
                            <h1>{LocalizedLanguage.closeRegister}</h1>
                        </div>
                        <div className="modal-body spacer-x-25 overflow-auto">
                            <table className="table table-condensed table-close-register" >
                                <thead>
                                    <tr key="323232">
                                        <th>{LocalizedLanguage.description}</th>
                                        <th>{LocalizedLanguage.expected}</th>
                                        <th>{LocalizedLanguage.actual}</th>
                                        <th>{LocalizedLanguage.Difference}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key="454545">
                                        <td>{LocalizedLanguage.cashInTill}</td>
                                        <td>{_closeRegister && _closeRegister.Expected}</td>
                                        <td>{_closeRegister && _closeRegister.Actual}</td>
                                        <td><NumberFormat value={_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                    </tr>
                                    {_closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map((item, index) => {
                                        return (<tr key={index}>
                                            <td>{item.Name}</td>
                                            <td>{item.Expected}</td>
                                            <td>{item.Actual}</td>
                                            <td><NumberFormat value={item.Actual - item.Expected} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                        </tr>);
                                    })
                                    }

                                </tbody>
                                <tfoot>
                                    <tr key="676767">
                                        <th colSpan="2">{LocalizedLanguage.totalDifference}</th>
                                        <th colSpan="2"><NumberFormat value={_totalDiff} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></th>
                                    </tr>
                                    {
                                        cashRegisterLog && cashRegisterLog.map((item, index) => {
                                            return (
                                                item.IsManual == true ?
                                                    <tr key={"cashlog" + index}>
                                                        <td colSpan="2">{LocalizedLanguage.manualTransactions}</td>
                                                        <td>{item.Expected}</td>
                                                        <td>N/A</td>
                                                    </tr>
                                                    : null
                                            )
                                        })
                                    }
                                </tfoot>
                            </table>
                            <form className="form-addon">
                                <div className="form-group">
                                    <div className="form-group">
                                        <div className="input-group-reverse">
                                            <div className="input-group-addon">{LocalizedLanguage.addNote}</div>
                                            <textarea type="text" className="form-control" id="_txtNote" placeholder={LocalizedLanguage.Pleaseaddnotehere} onChange={(e) => this.enterNote(e)} style={{ "height": "115px" }}></textarea>
                                        </div>
                                    </div>
                                    {/* <div className="input-group-reverse">
                                        <div className="input-group-addon">{LocalizedLanguage.addNote}</div>
                                        
                                        <textarea type="text" className="form-control" id="" placeholder={LocalizedLanguage.Pleaseaddnotehere} style="height: 115px"></textarea>
                                    </div> */}
                                </div>
                                <div className="text-center">
                                    <div className="radio--custom radio-default radio--inline" onClick={() => this.printHtml(_closeRegister)}>
                                        <input type="radio" id="radio-1" name="radio-group" />
                                        <label htmlFor="radio-1">{LocalizedLanguage.printReport}</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer no-padding bt-0" onClick={() => this.CloseRegister()}>
                            <button className="btn btn-primary btn-block h-70 btn-capitalize" data-dismiss="modal">
                                {LocalizedLanguage.closeRegister}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
function mapStateToProps(state) {
    const { open_register, cashSummery, cashDetails } = state;
    return {
        open_register: open_register.items,
        cashSummery: cashSummery,
        cashDetails: cashDetails
    };
}

const connectedCloseRegisterPopup = connect(mapStateToProps)(CloseRegisterPopup);
export { connectedCloseRegisterPopup as CloseRegisterPopup };