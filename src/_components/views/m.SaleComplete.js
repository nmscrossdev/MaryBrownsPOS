import React,{useState} from 'react';
import { AndroidAndIOSLoader } from '../../_components/AndroidAndIOSLoader'

// const onLaunchClicked =(event)=> {
//    if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
//     {
//         event.preventDefault();
//         setIsButtonDisabled(true);
//         setTimeout(() => setIsButtonDisabled(false), 5000);
//     }
//      props.printReceipt();
// }
const MobileSaleComplete = (props) => { 
    //const [value, setValue] = useState(0);
//     onLaunchClicked =()=> {
//    //if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
//     {
//         //event.preventDefault();
//         setValue(1);
//         setTimeout(() => setValue(0), 5000);
//     }
     //props.printReceipt();
//}
    const { checkList, tempOrderId, LocalizedLanguage, handleInputChange, sendMail, clear, printReceipt } = props;
    const { type, goToShopview, CancelSale, customer_email, CancelOrder, loader } = props;
    sessionStorage.removeItem("OrderDetail");
    const salestyle = {height: "calc(100vh - 85px)"};
    const refundstyle = {height: "calc(100vh - 150px)"};

    return (
        <div>
        {CancelOrder == true || loader == true? <AndroidAndIOSLoader /> : null}
            <div className="background background-selfcheckout">
                <div className="container-fluid vh-100">
                    <div className="row align-items-center mx-width-410 mx-auto"  style={ type == "refund" ? refundstyle : salestyle}>
                        <div className="col text-center text-dark">
                            <div className="page-title mb-20">
                                <img src="../mobileAssets/img/salecomplete.svg" alt="" className="w-60" />
                                <h1 className="h1 fz-28 mb-2 fw300 mt-1">{type == 'refund' ? LocalizedLanguage.refundComplete : LocalizedLanguage.completeSale}</h1>
                            </div>
                            <form className="form-addon-medium" autoComplete="on">
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0" id="addon-wrapping">{LocalizedLanguage.emailReceipt}</span>
                                    </div>
                                    {type == "refund" ? "" :
                                        <input type="hidden" id="order-id" defaultValue={(typeof tempOrderId !== "undefined") ? tempOrderId : 0} />}
                                    {type == "refund" ?
                                        <input type="text" defaultValue={(customer_email) ? customer_email : ""} id="customer-email" className="form-control border-radius-lg shadow-none" placeholder={LocalizedLanguage.placeholderCustomerEmail} aria-label="Username" aria-describedby="addon-wrapping" />
                                        :
                                        <input type="text" defaultValue={( checkList && checkList.customerDetail && checkList.customerDetail !== null && checkList.customerDetail.content && checkList.customerDetail.content !== null &&
                                            typeof checkList.customerDetail.content.Email !== undefined) ? checkList.customerDetail.content.Email : null} id="customer-email" className="form-control border-radius-lg shadow-none" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
                                    }
                                </div>
                                <div className="input-group flex-nowrap  mb-3 custom-checkbox-override">
                                    <div className="form-control shadow-none">
                                        <div className="custom-control custom-checkbox text-left">
                                            <input type="checkbox" className="checkmark custom-control-input shadow-none isCheck" id="isCheck" name="example1" defaultChecked />
                                            <label className="custom-control-label shadow-none" htmlFor="isCheck" onClick={() => handleInputChange()}>{LocalizedLanguage.rememberCustomer}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className ='mb-3'>
                                    <a className="btn btn-info btn-md btn-block text-white rounded-8 shadow-none" href="javascript:void(0);" onClick={() => sendMail()} >{LocalizedLanguage.sendEmail}</a>                                    
                                </div>
                                <div>
                                    <button className="btn btn-info btn-md btn-block text-white rounded-8 shadow-none" /*href="javascript:void(0);"*/ onClick={() => printReceipt()} >{LocalizedLanguage.print}</button>                               
                                </div>
                            </form>
                            <span className="suctext" style={{ display: "none", color : `${props.IsEmailExist == false || props.valiedEmail == false ? 'red' : 'black'}` }}>
                                {props.IsEmailExist == false ? LocalizedLanguage.enterEmail :
                                    props.valiedEmail == false ? LocalizedLanguage.invalidEmail :
                                        props.mailsucces == null ? LocalizedLanguage.pleaseWait :
                                            props.mailsucces && props.mailsucces == true ? LocalizedLanguage.successSendEmail
                                                : props.mailsucces == false ? LocalizedLanguage.failedSendEmail : ""
                                }
                            </span>
                        </div>
                    </div>
                    {/* <div className="row text-center mx-width-410 mt-10 mx-auto">
                        <div className="col text-center mb-20"> */}
                        <div className="position-absoulte fixed-bottom text-center">
                            <div className="form-addon-medium">
                            {/* text-success-focus */}
                                <a className="btn btn-primary text-white btn-md btn-block rounded-0 shadow-none" href="javascript:void(0);" onClick={() => { type == "refund" ? goToShopview() : clear() }}>{LocalizedLanguage.newSale}</a>
                                {type == "refund" &&
                                    <a className="btn btn-primary text-white btn-md btn-block rounded-0 shadow-none" href="javascript:void(0);" onClick={() => CancelSale()}>{LocalizedLanguage.cancelSale}</a>}
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MobileSaleComplete;