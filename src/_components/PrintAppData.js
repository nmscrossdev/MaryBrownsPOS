import Config from '../Config';
import moment from 'moment';
import { get_UDid } from '../ALL_localstorage';
import { FormateDateAndTime } from '../settings/FormateDateAndTime';
import ActiveUser from '../settings/ActiveUser';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { getAddonsField, getBookingField,productRetrunDiv,getInclusiveTaxType } from './CommonModuleJS';
import { productxArray, showSubTitle, showTitle } from '.';
import { showAndroidToast } from '../settings/AndroidIOSConnect';
import { history } from '../_helpers';
import {showAndroidReceipt } from '../settings/AndroidIOSConnect';

const pageSize = ActiveUser.key.pdfFormate;


export const PrintAppData = {
  Print
};
var downloadedImg;
// function imageReceived() {
//   let canvas = document.createElement("canvas");
//   let context = canvas.getContext("2d");

//   canvas.width = downloadedImg.width;
//   canvas.height = downloadedImg.height;

//   context.drawImage(downloadedImg, 0, 0);
//   //imageBox.appendChild(canvas);

//   try {
//     localStorage.setItem("saved-image-example", canvas.toDataURL("image/png"));
//   }
//   catch(err) {
//     console.log("Error: " + err);
//   }
// }
var currentWidth = screen.width;
function Print(data) 
{
    //console.log("prinData",JSON.stringify(data));

    if(typeof Android !== "undefined" && Android !== null && Android.getDatafromDevice("isWrapper")==true){
      if(!data || !data.url || data.url == ""){}
      else
      {
        var PrintAndroidReceiptData={};
        var PrintAndroidData=[];
        PrintAndroidData.push({"rn": 1,"cms":1,"c1":"d_img","c2":data.url,"c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
        PrintAndroidReceiptData["data"]=PrintAndroidData;
        //console.log("PrintAndroidReceiptData-->",JSON.stringify(PrintAndroidReceiptData));
        showAndroidReceipt("",PrintAndroidReceiptData) 
      }
    }
    else
    {
  //   let imageURL = "https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189";

  //   downloadedImg = new Image;
  //   downloadedImg.crossOrigin = "Anonymous";
  //   downloadedImg.addEventListener("load", imageReceived(), false);
  //   downloadedImg.src = imageURL;
  // //console.log("Data", data);
  // var realWidth = 250;
  // if (currentWidth < 250) { realWidth = "90%"; }
  // else { realWidth = "250px"; }
  
  var topLogo = '';  
  if(pageSize.width == "80mm" || pageSize.width == "52mm") {
          topLogo = (!data || !data.url || data.url == "") ?``
                      :
                      `<tr class="item-row">
                      <td class="item-logo" colspan="2" align="center">
                          <div class="pic">  <img class="pic" src=${data.url}  />  </div>
                        
                      </td>
                      </tr>`
        }
     else{ 
        topLogo =   `<td class="item-logo" colspan="2" align='center'>
            <div class="pic"><img src=${data.url}  class="pic" /></div>
            </td>`
      }
console.log("topLogo",topLogo)
  var htmlbody = (`<html><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title  align="left"></title>
  
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
  <style>
  * {
    margin: 0;
    padding: 0
}
@page {
  margin-top:0mm;
  margin-bottom:0mm;
  margin-left: 1mm;
  margin-right: 1mm;
  /*size: landscape;*/
  }
body {
    font: 14px/1.4 Georgia, serif;
    /*color: #000000;*/
    color:black;
    margin-left:1;
    margin-right:1;
}

#page-wrap {
  width:${pageSize.width}; overflow:hidden;
    margin: 0 auto;
}

table {
    border-collapse: collapse    
  font-size: 14px;
}
table td,
table th {
    /*border: 1px solid #000000;*/
    padding: 10px 0px;
}
table.total_calculation th,
table.total_calculation td {
    padding: 7px 0px !important
}
.border-bottom {
    border-bottom: 1px solid #000000;
}
#items td.total-line {
  line-height: 18px;
}
.invoice-generated {
  line-height: 18px;
}
.address {
    width: 150px;
}

#customer {
    overflow: hidden
}

#items {
    clear: both;
    width: 100%;
    margin: 2px 0 0;
}

#items th {
    background: #eee
}
#items tr.item-row td {
    border: 0;
    vertical-align: top
}

#items td.description {
    width: 300px
}

#items td.item-name {
    width: 175px
}
#items td.item-logo {
    width: 175px
}

#items td.quantity{
  width:20px;
  padding-right : 10px;
} 
#items td.total-line {
    border: 0;
}

#items td.total-value {
    border: 0;
    padding: 10px 0px;
    text-align: right;
    line-height: normal;
}

.border-top {
    border-top: 1px solid #000000 !important;
}

.total_calculation {
    border-spacing: 0px;
    margin-bottom: 10px;
}
.d-inline-block {
    display: inline-block;
    width:100%;
}
#items td.blank {
    border: 0
}

#terms {
    text-align: center;
    margin: 20px 0 0
}
#terms h5 {
    text-transform: uppercase;
    font: 13px Helvetica, Sans-Serif;
    letter-spacing: 10px;
    border-bottom: 1px solid #000000;
    padding: 0 0 8px;
    margin: 0 0 8px
}
.receipt-logo {
    border-radius: 4px;
    height: 98px;
    justify-content: center;
    align-items: center;
    text-align: center;
    display: flex;
    overflow: hidden;
    ${(pageSize.width !== "80mm" && pageSize.width !== "52mm") ? 'width: 60%' : 'width: 98%'};
}
.receipt-logo img {
     width: 100%; 
     height:100%;
}
.shopUrl {
    font-weight: bold;
    text-align: center;
    padding: 15px 0px;
}
.printTopSection {
  /* min-height: calc(100vh - 240px); */
}
.header, .header-space,
.footer, .footer-space {
 width:98%;
}
.header {
  position: fixed;
  top: 0;
}
.footer {
  /* position: fixed;
  bottom: 0;*/
  width:${pageSize.width};
  min-height: 115px !important;
  overflow: hidden;
  margin: auto;
  left: 0;
  right: 0;
  background-color: #ffffffeb;
  padding: 1px 0px 0px 0px;
}
.sub-title {
  color:#808080;
  font-size:15px;
}
.container{
  position: relative;
  /*width: 423px;*/
  height: 99px;
  margin-top: 2px;
  background: transparent;
}
.pic{
    max-width: 100%;
    width: auto;
    max-height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

</style></title>
   </head><body style="${currentWidth > 400 ? 'margin-left:10px !important;margin-right:10px !important' : ''}">
   <table style="margin-top: 0px; border: 0; width: 100%;">
  <thead><tr><td>
    <!-- <div class="header-space">&nbsp;</div> -->
  </td></tr></thead>
  <tbody><tr><td>
    <div class="content">
      <!-- open bracket -->
        <div id="page-wrap">
        <div class="printTopSection">
                        <table id="items">
                            <tbody>                        
                                ${topLogo}                                      
                            </tbody>
                        </table>
       
            </div>
            <div style="clear:both"></div>   
          </div> 
            </td>
            </tr></tbody>
          </table>
         
      </div>
    <!-- close bracket -->     
          `
  );
  htmlbody += '</body ></html>'
  //console.log(htmlbody);
  var env = localStorage.getItem("env_type");
 
  var mywindow = window.open('#', 'my div', "width='400', 'A2'");
  mywindow && mywindow.document && mywindow.document.write(htmlbody);
  // document.write(htmlbody);
  console.log("htmlbody",htmlbody)
  if (mywindow) {
    setTimeout(() => {
      mywindow.print();
      mywindow.close();
    }, 400);
  }
  // }
  
}
return true;
}