/** 
 * Created By   : Priyanka
 * Created Date : 26-06-2019
 * Description : display notification list. 
*/
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { history } from '../_helpers';
import { checkoutActions } from '../CheckoutPage/actions/checkout.action';
import ActiveUser from '../settings/ActiveUser';
import { get_UDid } from '../ALL_localstorage';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { saveCustomerInOrderAction } from '../_actions';
import { isMobileOnly } from "react-device-detect";
import NotificationList from "./views/m.NotificationList";
const today_Date = moment().format('DD/MM/YY');

class NotificationComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update_NotificationList: localStorage.getItem('notifyList') ? JSON.parse(localStorage.getItem('notifyList')) : [],
            status: true
        }

        this.reSyncOrder = this.reSyncOrder.bind(this);
        this.ActivityPage = this.ActivityPage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        var sortArr = nextProps.list.sort(function (obj1, obj2) {
            return obj2.Index - obj1.Index;
        })

        this.setState({ update_NotificationList: sortArr })
    }

    reSyncOrder(tempOrderId) {
        //console.log("ResyncStart", tempOrderId);
        const { Email } = ActiveUser.key;
        var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
            TempOrders = TempOrders.filter(item => item.TempOrderID == tempOrderId);
            if (TempOrders && TempOrders.length > 0) {
                var syncOrderID = TempOrders[0].TempOrderID;
                var udid = get_UDid('UDID');
                if (syncOrderID && syncOrderID !== '') {
                    //add customer to order and sending email to customer
                    if (TempOrders[0].Sync_Count <= 1 && TempOrders[0].new_customer_email !== "" && TempOrders[0].isCustomerEmail_send == false) {
                        this.props.dispatch(saveCustomerInOrderAction.saveCustomerToTempOrder(udid, syncOrderID, TempOrders[0].new_customer_email))
                    }
                    // console.log("syncOrderID",syncOrderID);
                    this.props.dispatch(checkoutActions.recheckTempOrderSync(udid, syncOrderID));
                }
            }
        }
    }

    ActivityPage(id) {
        localStorage.removeItem("CUSTOMER_TO_ACTVITY")
        localStorage.setItem("selected_row", 'customerview');
        localStorage.setItem('CUSTOMER_TO_OrderId', id);
        if(isMobileOnly == true){
            history.push('/activity');
        }
        else
        {
            window.location = '/activity';
        }
    }

    //  shouldComponentUpdate(nextProps,   nextState){  
    //  if(this.state.update_NotificationList && this.state.update_NotificationList.length > 0 && nextState.update_NotificationList && nextState.update_NotificationList.length > 0){    
    //  if (this.state.update_NotificationList[0].OrderID === nextState.update_NotificationList[0].OrderID) {
    //     return false
    //   }}

    //   return true

    //  }

    render() {
        return (
            (isMobileOnly == true) ?
                <NotificationList
                    LocalizedLanguage={LocalizedLanguage}
                     {...this.state}
                    ActivityPage={this.ActivityPage}
                    reSyncOrder={this.reSyncOrder}
                    openModal={this.props.openModal}
                    openModalActive={this.props.openModalActive}
                    today_Date={today_Date}
                />
                :
                <div id="id_notifications" className="tab-pane fade">
                    <div className="col-lg-9 col-sm-8 col-xs-8 p-0">
                        <div className="quick_menu_body closeTabPane"></div>
                    </div>
                    <div className="col-lg-3 col-sm-4 col-xs-4 pr-0  plr-8">
                        <div className="quick_menu_panel quick-notification-design">
                            <div className="pl-3 pr-3 center-center space-between ">
                                <h2>{LocalizedLanguage.notification}</h2>
                                <div className="center-center">
                                    {/* Focused */}

                                    {/* <div className="flat-toggle pull-right ml-2">
                                <span></span>
                            </div> */}
                                </div>
                            </div>
                            <div className="quick_menu_body pl-3 pr-3 pt-0 overflowscroll">
                                <div className="mb-4">
                                    {this.state.update_NotificationList.map((noti_list, index) => {
                                        var notifi_date = noti_list.time ? noti_list.time.split(',')[0] : ''
                                        // console.log("new_customer_email", noti_list.status);
                                        // console.log("isCustomerEmail_send", noti_list.isCustomerEmail_send);
                                        // console.log("Result",noti_list.status == 'true' && noti_list.new_customer_email !=="" && noti_list.isCustomerEmail_send == false);
                                        return (
                                            <div key={index} className={
                                                noti_list.Sync_Count > 1 && noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === false ? 'd-flex box-flex notify-alert  notify-alert-danger'
                                                    : noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === true ? 'd-flex box-flex notify-alert'
                                                        : noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === false ? 'd-flex box-flex notify-alert  notify-alert-email'
                                                            : noti_list.status == 'failed' && noti_list.new_customer_email == "" ? 'd-flex box-flex notify-alert  notify-alert-danger'
                                                                : noti_list.status == 'true' && noti_list.new_customer_email == "" ? 'd-flex box-flex notify-alert notify-alert-success '
                                                                    : ' d-flex box-flex notify-alert '}  >
                                                <div className="box-flex-text-heading w-100">
                                                    <h3 notify-time={today_Date == notifi_date ? noti_list.time ? noti_list.time.split(',')[1] : '' : noti_list.time ? noti_list.time : ''}>{noti_list.title}</h3>
                                                    <div className="notify-description">
                                                        <div className="d-flex">
                                                            {noti_list.status == 'failed' && noti_list.new_customer_email == "" ?
                                                                <div className="img-circle notify-image mx-width-unset">
                                                                    <span className="fs29"><i className="icon icon-fill-close icon-css-override text-danger pointer push-top-3"></i></span>
                                                              </div>
                                                                :
                                                                noti_list.status !== 'true' && noti_list.new_customer_email == "" ?
                                                                    <div className="img-circle notify-image mx-width-unset">
                                                                        {/* <div className="c100 p50 small"><span>50%</span><div className="slice"><div className="bar"></div><div className="fill"></div></div></div> */}
                                                                        {parseInt(noti_list.Sync_Count) <= 1 ? <div className="pie-chart position-relative">30%</div> 
                                                                        : parseInt(noti_list.Sync_Count) <= 2 ? <div className="pie-chart position-relative">60%</div>
                                                                        : <div className="pie-chart position-relative">90%</div>
                                                                        }
                                                                    </div>

                                                                    : noti_list.Sync_Count > 1 && noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === false ?
                                                                        <div className="img-circle notify-image mx-width-unset">
                                                                            <span className="fs29"><i className="icon icon-fill-close icon-css-override text-danger pointer push-top-3"></i></span>

                                                                        </div>
                                                                        : noti_list.new_customer_email !== "" ? ""
                                                                            :
                                                                            <img src={noti_list.status == 'true' && noti_list.new_customer_email == "" ? 'assets/img/accepted_40.png' : ''} className={noti_list.status == 'true' ? 'img-circle notify-image' : ''} />
                                                            }

                                                            <p className={noti_list.status == 'true' ? "pointer" : ''} onClick={() => { noti_list.status == 'true' ? this.ActivityPage(noti_list.OrderID) : '' }} >{noti_list.description}.</p>
                                                            {noti_list.status == 'failed' && noti_list.new_customer_email == "" ?
                                                                <div className="button_with_checkbox pb-0 notify-retry-button" onClick={() => this.reSyncOrder(noti_list.TempOrderID)}>
                                                                    <input type="radio" id="test2" name="radio-group" />
                                                                    <label htmlFor="test2" className="label_select_button">{LocalizedLanguage.retry}</label>
                                                                </div> : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                            <div className="quick_menu_footer">
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
const connectedNotificationComponents = connect(mapStateToProps)(NotificationComponents);
export { connectedNotificationComponents as NotificationComponents };