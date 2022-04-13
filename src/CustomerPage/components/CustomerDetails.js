import React from 'react';
import { CustomerViewTable } from '..';
import Language from '../../_components/Language';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { AppMenuList } from '../../_components/AppmenuList';
import { CheckoutCustomer } from './CheckoutCustomer';
import moment from 'moment';
import { default as NumberFormat } from 'react-number-format';
import Config from '../../Config';
import { history } from '../../_helpers';
import { trackPage } from '../../_components/SegmentAnalytic'
import { AndroidAndIOSLoader, LoadingModal } from '../../_components';
import { isMobileOnly } from 'react-device-detect';
import { discountService } from '../../_services';
import { ExtensionList } from '../../_components/ExtensionList';
function handleChange(e) { }

function handleChangeEdit(props) {
    props.popup_status(true)
    console.log("props", props)
}

function ActivityPage(id) {
    localStorage.removeItem("CUSTOMER_TO_ACTVITY")
    localStorage.setItem("selected_row", 'customerview');
    localStorage.setItem('CUSTOMER_TO_OrderId', id);
    history.push('/activity');
}

///Apps ----------------------------
// var _displayApp=KeyApppsDisplay.appskey;
//     Object.keys(_displayApp).map((item, index) => {           
//            _displayApp[item].disabled=true;         
//     });    
///Apps ----------------------------


//----------------------------------
export const CustomerViewSecond = (props) => {
    const { newCustomer, adjustCreditpoup, addcustomernotes, customer_events, customerEvents } = props;
    var full_address = props && props.Props && props.Props.single_cutomer_list ? props.Props.single_cutomer_list.content : '';
    var stateName = props.StateName ? props.StateName.replace(/[^a-zA-Z]/g, ' ') : '';
    var countryName = props.selectedCountryName ? props.selectedCountryName.replace(/[^a-zA-Z]/g, ' ') : '';
    // console.log("CustomerViewSecond",props);
    // console.log("order",props.Details );
    var eventCollection = [];
    // console.log("customerEvents",customer_events);
    //trackPage(history.location.pathname,"Customers","CustomerView","CustomerDetails");
    var _collectionItem = {
        eventtype: '', Id: '', amount: '', oliverPOSReciptId: '', time: '', status: '',
        Description: '', ShortDescription: '', location: ''
    }

    props.Details && props.Details.map((order, index) => {
        var collectionItem = {
            eventtype: '', Id: '', amount: '', oliverPOSReciptId: '', time: '', status: '',
            Description: '', ShortDescription: ''
        };
        collectionItem['eventtype'] = 'order';
        collectionItem['Id'] = order.Id;
        collectionItem['amount'] = order.Amount;
        collectionItem['oliverPOSReciptId'] = order.OliverPOSReciptId;
        collectionItem['datetime'] = moment.utc(order.OrderTime).local().format(Config.key.TIMEDATE_FORMAT);
        collectionItem['status'] = order.Status;
        collectionItem['Description'] = '';
        collectionItem['ShortDescription'] = '';
        collectionItem['location'] = order.Location;


        eventCollection.push(collectionItem)
    })

    if (customer_events && customer_events.events && customer_events.events.content  && customer_events.events.content.length > 0) {
        customer_events.events.content.map((event, index) => {
            var collectionItem = {
                eventtype: '', Id: '', amount: '', oliverPOSReciptId: '', time: '', status: '',
                Description: '', ShortDescription: '', location: ''
            };
            var jsonData = event.JsonData && JSON.parse(event.JsonData)
            collectionItem['eventtype'] = event.EventName;
            collectionItem['Id'] = event.Id;
            collectionItem['amount'] = jsonData && jsonData.AddPoint ? jsonData.AddPoint : event.Amount;
            collectionItem['DeductPoint'] = jsonData && jsonData.DeductPoint ? jsonData.DeductPoint : event.Amount;
            collectionItem['oliverPOSReciptId'] = '';
            collectionItem['datetime'] = moment.utc(event.CreateDateUtc).local().format(Config.key.TIMEDATE_FORMAT);//event.CreateDateUtc;
            collectionItem['status'] = event ? event.Status : '';
            collectionItem['Description'] = jsonData ? jsonData.Notes : event.Description;
            collectionItem['ShortDescription'] = event.ShortDescription;
            collectionItem['location'] = event ? event.Location : '';
            eventCollection.push(collectionItem)
        })
    }

    // if (customerEvents && customerEvents.length) {
    //     var storeCreditInfo = {
    //         storeCreditAmount: '', notes: ''
    //     };
    //     customerEvents && customerEvents.map((event, index) => {

    //             var jsonData = event.JsonData && JSON.parse(event.JsonData)

    //             storeCreditInfo['storeCreditAmount'] = jsonData.AddPoint;
    //             storeCreditInfo['notes'] = jsonData.Notes;

    //             eventCollection.push(storeCreditInfo)
    //     })
    // }

    // console.log("eventCollection",eventCollection);
    var eventCollection = eventCollection.sort(function (obj1, obj2) {
        // new Date(b.date) - new Date(a.date);
        return new Date(obj2.datetime) - new Date(obj1.datetime);
    })
    // console.log("sortArr",eventCollection);
    return (
        <div className="col-xs-7 col-sm-9">
            <div className="padding-content">
                <div className="d-flex space-between align-items-center">
                    {/* <div className="w-100"> */}
                    {props.tabLoading == true && isMobileOnly == true ? <AndroidAndIOSLoader /> : props.tabLoading == true ? <LoadingModal /> : ''}
                        <div className="product-list pl-move horizontalScroll">
                            <AppMenuList adjuctcreditpopup={adjustCreditpoup} addcustomernotes={addcustomernotes} isdisabled={false} />

                            {/* ***  customer extension buttons to show ext iframe*** */}
                            <ExtensionList type={'Customer View'} showExtensionIframe={props.showExtensionIframe} />
                            {/* ***  customer extension buttons end *** */}
                        </div>

                    {/* </div> */}
                    <div className="product-list customer-add-box">
                        <div className="bl-1 saparation"></div>
                        <div className="product-tile pointer mr-0">
                            <input type="radio" className="card-checked" name="ActivityApps" data-toggle="modal" onClick={() => newCustomer()} />
                            <div className="card card-active">
                                <div className="card-body padding-6">
                                    <div className="card-image">
                                        <img src="../assets/img/Customers.svg" alt="" />
                                    </div>
                                </div>
                                <div className="card-footer padding-6">
                                    <div className="card-text text-truncate text-center">
                                        {LocalizedLanguage.newCustomer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               
               
                </div>

                <div className="checkoutlistdetails">
                    <div className="checkoutActivityDetails section-customer-tab">
                        {/* <div className="card customer-tab-section" style={{ height: props.isDemoUser ? 'calc(90vh - 190px)' : '' }}>  */}
                        <div className={props.isDemoUser ? 'card customer-tab-section customer-tab-section-if_footer' : 'card customer-tab-section'}>
                            <div className="card-header d-flex space-between align-items-center">
                                <ul className="nav nav-pills">
                                <li className="active">
                                        <a data-toggle="pill" href="#menuCustomer" onClick={() => props.customerDeleteButton('customer')}>
                                            <i className="icons8-add-user-male"></i>
                                            {LocalizedLanguage.CustomerDetails}
                                        </a>
                                    </li>

                                    <li >
                                        <a data-toggle="pill" href="#menuActivity" onClick={() => props.customerDeleteButton('activity')}>
                                            <i className="icons8-time-machine"></i>
                                            {LocalizedLanguage.activity}
                                        </a>
                                    </li>
                                   
                                </ul>
                                {props.customerDeleteActive == false ?
                                    <div className = 'd-flex'>
                                        <div className="radio--custom radio-default radio-size-14" onClick={props.onclick}>
                                            <input type="radio" id="radio-1" name="radio-group" onChange={handleChange.bind(this)} />
                                            <label htmlFor="radio-1">{LocalizedLanguage.toSale}</label>
                                         </div>

                                        <div className="radio--custom radio-danger radio-size-14 ml-3"  >
                                            <input type="radio" id="radio-2" name="radio-group" data-toggle="modal" href="#delete-information" onClick={() => handleChangeEdit(props)} />
                                            <label htmlFor="radio-1" className="danger">{LocalizedLanguage.customerDelete.toUpperCase()}</label>
                                        </div>
                                    </div>
                                    :
                                    <div className="radio--custom radio-default radio-size-14" onClick={props.onclick}>
                                        <input type="radio" id="radio-1" name="radio-group" onChange={handleChange.bind(this)} />
                                        <label htmlFor="radio-1">{LocalizedLanguage.toSale}</label>
                                    </div>
                                }
                            </div>
                            <div className="card-body p-0">
                                <div className="tab-content h-100">
                                    {/* <div className="tab-content h-100"> */}
                                    <div id="menuActivity" className="tab-pane fade h-100">
                                        <div className="card no-border card-activity-timeline h-100">
                                            <div className="card-body overflow-auto" style={{height: 350}}>
                                                <div className="timeline timeline-3">
                                                    <div className="timeline-items">
                                                        {
                                                            eventCollection && eventCollection.length > 0 ? eventCollection.map((item, index) => {

                                                                return (
                                                                    // key={index} onClick={() => ActivityPage(props.Props, item.Id, props.UDID)}
                                                                    // <td className="action action-short action-pointer"><i className="icons8-login"></i></td>
                                                                    item.eventtype.toLowerCase() == 'new order' ?
                                                                        <div className="timeline-item" key={index}>
                                                                            <div className="timeline-media">
                                                                                {item.status == 'refunded' ?
                                                                                    <img src="../assets/img/customer/Transaction.svg" />
                                                                                    :
                                                                                    <img src="../assets/img/customer/purchase.svg" />
                                                                                }

                                                                            </div>
                                                                            <div className="timeline-content" key={index}>
                                                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                                                    <div className="mr-2">
                                                                                        <a className="text-dark-75 text-hover-primary font-weight-bold">
                                                                                            {item.status == 'refunded' ? LocalizedLanguage.refundissued
                                                                                                : LocalizedLanguage.newOrder
                                                                                            }
                                                                                        </a>
                                                                                        <span className="text-muted ml-2">
                                                                                            {/* {item.OrderTime ? moment.utc(item.OrderTime).local().format(Config.key.DATE_FORMAT) : ""} */}
                                                                                            {item.datetime ? item.datetime : ''}
                                                                                        </span>
                                                                                        <span className="label label-light-danger font-weight-bolder label-inline ml-2">{item.status}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="d-flex space-between">
                                                                                    <div>
                                                                                        <p className="p-0">
                                                                                            <span>{LocalizedLanguage.totalOrderAmount}</span> <NumberFormat value={parseFloat(item.amount ? item.amount : 0)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                        </p>
                                                                                        <p className="p-0">
                                                                                            <span>{LocalizedLanguage.orderStatus}</span> {item.status}
                                                                                        </p>
                                                                                        <p className="p-0">
                                                                                            <span>{LocalizedLanguage.location + ':'}</span> {item.location !== '' ? 'L' : ''}{item.location}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="center-center pointer" onClick={() => ActivityPage(item.Id)}>
                                                                                        OPEN <i className="icons8-login ml-2" style={{ fontSize: '30px' }}></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        : item.eventtype.toLowerCase() == 'add new note' ?

                                                                            <div className="timeline-item" key={index}>
                                                                                <div className="timeline-media">
                                                                                    <img src="../assets/img/customer/Note.svg" />
                                                                                </div>
                                                                                <div className="timeline-content">
                                                                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                                                                        <div className="mr-2">
                                                                                            <a className="text-dark-75 text-hover-primary font-weight-bold">
                                                                                                {LocalizedLanguage.newnotes}
                                                                                        </a>
                                                                                            <span className="text-muted ml-2">
                                                                                                {item.datetime ? item.datetime : ''}
                                                                                            </span>
                                                                                            <span className="label label-light-danger font-weight-bolder label-inline ml-2">pending</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className="p-0">
                                                                                        {item.Description}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className="timeline-item" key={index}>
                                                                                <div className="timeline-media">
                                                                                    {item.eventtype.toLowerCase() == "update customer" || item.eventtype.toLowerCase() == "save new customer"?
                                                                                        <img src="../assets/img/customer/Registration.svg" />
                                                                                        :
                                                                                        <img src="../assets/img/customer/Transaction.svg" />
                                                                                    }
                                                                                </div>
                                                                                <div className="timeline-content">
                                                                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                                                                        <div className="mr-2">
                                                                                            <a className="text-dark-75 text-hover-primary font-weight-bold">
                                                                                                {LocalizedLanguage.updatecustomer}
                                                                                            </a>
                                                                                            <span className="text-muted ml-2">
                                                                                                {item.datetime ? item.datetime : ''}
                                                                                            </span>
                                                                                            <span className="label label-light-danger font-weight-bolder label-inline ml-2">pending</span>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="d-flex space-between">
                                                                                        <div>
                                                                                            {item.amount ?
                                                                                                <p className="p-0">
                                                                                                    <span>{LocalizedLanguage.addCredit} : </span>
                                                                                                    <NumberFormat value={parseFloat(item.amount ? item.amount : 0)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                                </p>:''
                                                                                            }
                                                                                            {item.DeductPoint ?
                                                                                                <p className="p-0">
                                                                                                    <span>{LocalizedLanguage.deductCredit}: </span>
                                                                                                    <NumberFormat value={parseFloat(item.DeductPoint ? item.DeductPoint : 0)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                                </p>:''
                                                                                            }
                                                                                            {item.Description ?
                                                                                                <p className="p-0">
                                                                                                    <span>{LocalizedLanguage.notes} : </span> {item.Description}
                                                                                                </p> : ''}
                                                                                            {/* <p className="p-0">
                                                                                                <span>{LocalizedLanguage.location + ':'}</span> {item.datetime}
                                                                                            </p> */}
                                                                                        </div>
                                                                                        {/* <div className="center-center pointer" onClick={() => ActivityPage(item.Id)}>
                                                                                        OPEN <i className="icons8-login ml-2" style={{ fontSize: '30px' }}></i>
                                                                                    </div> */}
                                                                                    </div>

                                                                                    {/* <p className="p-0">
                                                                                        {item.Description}
                                                                                    </p> */}
                                                                                </div>
                                                                            </div>
                                                                )
                                                            })
                                                            :<div>No record found</div>
                                                        }





                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="menuCustomer" className="tab-pane fade in active h-100">
                                        <CheckoutCustomer
                                            onChange={props.onChange}
                                            onClick={() => props.onClick()}
                                            Street_Address={props.Address ? props.Address : ""}
                                            city={props.city ? props.city : ''}
                                            PhoneNumber={props.PhoneNumber ? props.PhoneNumber : ""}
                                            FirstName={props.FirstName ? props.FirstName : ''}
                                            LastName={props.LastName ? props.LastName : ''}
                                            Email={props.Email ? props.Email : ''}
                                            Notes={props.Notes ? props.Notes : ''}
                                            Pincode={props.Pincode ? props.Pincode : ''}
                                            submitted={props.submitted}
                                            loading={props.loading}
                                            getCountryList={props.getCountryList ? props.getCountryList : ''}
                                            getState={props.getState ? props.getState : ''}
                                            Street_Address2={props.Street_Address ? props.Street_Address : ""}
                                            country_name={props.country_name ? props.country_name : ''}
                                            state_name={props.state_name ? props.state_name : ''}
                                            onChangeList={props.onChangeList}
                                            onChangeStateList={props.onChangeStateList}
                                            emailValid={props.emailValid}
                                            nameValid={props.nameValid}
                                            lastValid={props.lastValid}
                                            Cust_ID={props.Cust_ID}
                                            custmerPin={props.custmerPin}
                                        // onClick1={props.onClick1}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

