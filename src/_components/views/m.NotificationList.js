import React from 'react';
import { CommonHeaderTwo } from "../CommonHeaderTwo";

const NotificationList = (props) => {
    // console.log("%cNotification", 'color:#ffc107', props)
    const { LocalizedLanguage, update_NotificationList, ActivityPage, reSyncOrder, openModal, openModalActive, today_Date } = props;
    //console.log("update_NotificationList",update_NotificationList);
    update_NotificationList.sort(function (obj1, obj2) {
        return obj2.Index - obj1.Index;
    })

    return (
        <div>
            <CommonHeaderTwo
                openModalActive={openModalActive}
                openModal={openModal}
            />
            <div className="appCapsule vh-100 overflow-auto" style={{ padding: 20, paddingBottom: 80 }}>
                <div className="notifications">
                    {update_NotificationList && update_NotificationList.map((noti_list, index) => {
                        var notifi_date = noti_list.time ? noti_list.time.split(',')[0] : '';
                        return (
                            <div key={index} className={
                                noti_list.Sync_Count > 1 && noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === false ? 'notify-wrap notify-warning'
                                    : noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === true ? 'notify-wrap notify-success'
                                        : noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === false ? 'notify-wrap notify-danger '
                                            : noti_list.status == 'failed' && noti_list.new_customer_email == "" ? 'notify-wrap notify-danger'
                                                : noti_list.status == 'true' && noti_list.new_customer_email == "" ? 'notify-wrap notify-success '
                                                    : 'notify-wrap notify-info'}>
                                <h6 notify-time={today_Date == notifi_date ? noti_list.time ? noti_list.time.split(',')[1] : '' : noti_list.time ? noti_list.time : ''}>{noti_list.title}</h6>

                                <div className="notify-msg" onClick={() => { noti_list.status == 'true' ? ActivityPage(noti_list.OrderID) : '' }}>
                                    {noti_list.status == 'failed' && noti_list.new_customer_email == "" ?
                                        <div className="notify-hint">
                                            <div className="notify-hint">
                                                <img src="mobileAssets/img/close-fill.svg" alt="" className="w-30" />
                                            </div>
                                        </div>
                                        :
                                        noti_list.status !== 'true' && noti_list.new_customer_email == "" ?
                                            <div className="notify-hint">50%</div>
                                            :
                                            noti_list.Sync_Count > 1 && noti_list.new_customer_email !== "" && noti_list.isCustomerEmail_send === false ?
                                                <div className="notify-hint"></div>
                                                :
                                                noti_list.new_customer_email !== "" ? ""
                                                    :
                                                    <div className="notify-hint">
                                                        <img src="mobileAssets/img/RadioISSelect.svg" alt="" className="w-30" />
                                                    </div>
                                    }
                                    {noti_list.description}
                                </div>
                                {noti_list.status == 'failed' && noti_list.new_customer_email == "" ?
                                    <div className="mx-auto text-center mt-2" onClick={() => reSyncOrder(noti_list.TempOrderID)}>
                                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                            <label className="btn btn-style-03">
                                                <input type="radio" name="options" id="red" /> {LocalizedLanguage.retry}
                                            </label>
                                        </div>
                                    </div>
                                    : ''}
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default NotificationList;