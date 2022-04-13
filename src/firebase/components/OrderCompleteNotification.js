import React from 'react';
import { connect } from 'react-redux';import Config from '../../Config'
import ActiveUser from "../../settings/ActiveUser"
import { idbProductActions } from '../../_actions/idbProduct.action';

export const updateOrderStatus = (notificationData)=>{
    var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
    var notificationLimit = Config.key.NOTIFICATION_LIMIT;
    if (TempOrders && TempOrders.length > 0) {
        if (TempOrders.length > notificationLimit) {
            TempOrders.splice(0, 1);
        }
        TempOrders.map(ele => {
            if (ele.TempOrderID == notificationData.oliver_receipt_id) {
                if (notificationData && notificationData.oliver_receipt_id) {

                    var placedOrderList = localStorage.getItem('placedOrderList') ? JSON.parse(localStorage.getItem('placedOrderList')) : "";
                    if (placedOrderList) {  
                        // for order complete then call api for pruduct quantity update
                        //localStorage.removeItem('placedOrderList')
                        // return dispatch => { dispatch(idbProductActions.updateOrderProductDB(placedOrderList))}
                        // ;
                        // setTimeout(function () {
                        //     dispatch(idbProductActions.updateConfirmProductDB(true));
                        //     //AllProduct.someMethod()
                        //     // history.push('/shopview')
                        //     // location.reload()
                        // }, 1000)
                    }
                    ele.Status = "true";
                    ele.OrderID = notificationData.order_id;
                    ele.Sync_Count = ele.Sync_Count + 1
                }
                else {
                    ele.Sync_Count = ele.Sync_Count + 1
                    if (ele.Sync_Count === Config.key.SYNC_COUNT_LIMIT)
                        ele.Status = "failed";
                    console.log("OrderStatusFailed", ele);
                    //  recheckTempOrderSync(udid,ele.TempOrderID)
                }
            }
        })
        localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders))
    }
}

export const  updateOrderStatusNotification = {
    updateOrderStatus 
}