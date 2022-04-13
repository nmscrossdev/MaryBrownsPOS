import firebase from './firebase';
import { firebaseAdminActions } from './action/firebaseAdmin.action'
import { history, store } from '../_helpers';
import { showProductxModal } from '../_components';
import ActiveUser from "../settings/ActiveUser";
import Config from '../Config'
import { updateOrderStatusNotification } from './components/OrderCompleteNotification'
import { updatQuantityOnIndexDB } from './components/UpdateProductQuantity'
import { updateNewCustomerList } from './components/CustomerAddedNotification';
import { openDb } from 'idb';
import { get_UDid } from '../ALL_localstorage';
import { attributesActions } from '../_actions';

// get device token via firebase and sent to the firebase server to get notification
export const getFirebaseNotification = () => {
    const messaging = firebase.messaging()
    var firebaseRegisters = []
    messaging.requestPermission().then(() => {
        return messaging.getToken();
    }).then((token) => {
        //console.log('---token---------------------', token);
        // var requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         "access-control-allow-origin": "*",
        //         "access-control-allow-credentials": "true",
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     }
        //     , mode: 'cors',
        //     body: JSON.stringify({ token: token })

        // };
        messaging.onMessage((payload) => {
            // alert(payload.notification.title)
           // console.log('Message received. ', payload);
            if (payload) {
                var _data = payload.data;

                // set localstoareg on order complete
                var orderNotify = {
                    'event_name': _data.event_name,
                    'oliver_receipt_id': _data.oliver_receipt_id,
                    'order_id': _data.order_id,
                }
                if (_data && _data.oliver_receipt_id && _data.event_name == "order") {
                    updateOrderStatusNotification.updateOrderStatus(_data)
                }
                if (_data && _data.event_name == "product") { // notification when quantity update
                    updatQuantityOnIndexDB.updateQuantity(_data.product_id)
                }

                if (_data && _data.event_name == "customer") { // notification when new customer added
                    updateNewCustomerList.getAllCustomer(_data)
                    //  customer_id: "39"
                    // event_name: "customer"
                    // event_title: "Customer Update"
                }
                if (_data && _data.event_name == "attribute") { // notification when new "attribute" updated
                    store.dispatch(attributesActions.getAll())
                }

                // if plan changed from hub Plan-Changed event call 
                if (_data && _data.event_name == "Plan-Changed") { // notification when plan updated
                    // store.dispatch(attributesActions.getAll())
                    showModal('commonFirebaseNotificationPopup')
                }
                var _staffName=_data.staff_name && _data.staff_name !=='undefined' ?_data.staff_name:'Another User';
                localStorage.setItem('firebaseStaffName', _staffName)
                const firebasePopupDetails = {
                    FIREBASE_POPUP_TITLE: 'Register Already In Use.',
                    FIREBASE_POPUP_SUBTITLE: `${_staffName} is now logged into this register.`,
                    FIREBASE_POPUP_SUBTITLE_TWO: `To overtake this register, please login again.`,
                    FIREBASE_BUTTON_TITLE: 'Back To login'
                }
                ActiveUser.key.firebasePopupDetails = firebasePopupDetails;

                firebaseRegisters.push(_data)
                localStorage.setItem('firebaseSelectedRegisters', JSON.stringify(firebaseRegisters))

                var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem('selectedRegister')) : ''


                if (_data && _data.token && selectedRegister.id == _data.registerId) {
                    if (token !== _data.token) {
                        setTimeout(() => {
                            showModal('firebaseRegisterAlreadyusedPopup')
                        }, 500);
                        // log_out();                  
                    }
                }
            }
        });
        // return fetch("http://localhost:5000/message", requestOptions)
        //     .then((res) => {
        //         console.log('----- ----------success----', res);

        //     }).catch((err) => {
        //         console.log('---------------err----', err);
        //     })
    }).catch((err) => {
        console.log('error---', err);
    })
}

export const sendFireBaseTokenToAdmin = (dispatch) => {
    const messaging = firebase.messaging()
    messaging.requestPermission().then(() => {
        return messaging.getToken();
    }).then((token) => {

        console.log('---Admin token-----', token);
        var ClientGuid = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "";
        if (ClientGuid !== "") {
            dispatch(firebaseAdminActions.sendToken(token, ClientGuid));
        }

    }).catch((err) => {
        console.log('error---', err);
    })
}
export const removeFirebaseSubscription = (dispatch) => {
    const messaging = firebase.messaging()
    messaging.requestPermission().then(() => {
        return messaging.getToken();
    }).then((token) => {
        dispatch(firebaseAdminActions.removeSubscription(token));

    })
}

export const SendRegisterAccessed = (dispatch) => {
    const messaging = firebase.messaging()
    messaging.requestPermission().then(() => {
        return messaging.getToken();
    }).then((token) => {
        console.log('---Admin token-----', token);

        var staff = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";

        var parameters = {
            ClientId: localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "",
            FirbaseDeviceToken: token,
            RegisterId: localStorage.getItem("register") ? localStorage.getItem("register") : null,
            //AccessTime:""	,
            StaffName: staff && staff !== "" ? staff.display_name : "",
            StaffId: staff && staff !== "" ? staff.user_id : "",
        }

        dispatch(firebaseAdminActions.registerAccessed(parameters));

    })
}
export const GetUsedRegisters = (dispatch) => {

    var ClientId = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "";
    if (ClientId !== "") {
        dispatch(firebaseAdminActions.getRegisters(ClientId));
    }
}
export const log_out = () => {
    localStorage.removeItem("CUSTOMER_TO_OrderId");
    localStorage.removeItem("LANG");
    localStorage.removeItem("firebaseStaffName");
    var decodedString = localStorage.getItem('UDID');
    var decod = decodedString ? window.atob(decodedString) : "";
    var getudid = decod;
    if (getudid && getudid != "") {
        localStorage.removeItem(`last_login_location_name_${getudid}`);
        localStorage.removeItem(`last_login_location_id_${getudid}`);
        localStorage.removeItem(`last_login_register_id_${getudid}`);
        localStorage.removeItem(`last_login_register_name_${getudid}`);
        localStorage.removeItem(`registerName`);
        localStorage.removeItem('register');
        localStorage.removeItem('UserLocations');
        localStorage.removeItem('firebaseStaffName');
        localStorage.removeItem('firebaseSelectedRegisters');

    }
    localStorage.removeItem("SHOP_TAXRATE_LIST");
    // localStorage.removeItem("sitelist")
    sessionStorage.removeItem('CUSTOMER_ID');
    localStorage.removeItem('CHECKLIST');
    localStorage.removeItem('AdCusDetail');
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem('SELECTED_TAX');
    localStorage.removeItem('TAXT_RATE_LIST');
    localStorage.removeItem('DEFAULT_TAX_STATUS');
    localStorage.removeItem('APPLY_DEFAULT_TAX');
    localStorage.removeItem('CART');
    localStorage.removeItem("Productlist" + localStorage.getItem('UDID'));
    localStorage.removeItem('CASH_ROUNDING');
    localStorage.removeItem('discountlst');
    //localStorage.removeItem('userId');   this is client Id, Do not remove on it
    localStorage.removeItem('orderreciept');
    var _env = localStorage.getItem('env_type');
    setTimeout(function () {
        var url = _env && (_env == 'ios' || _env == 'android' || _env == 'Android') ? "/login" : "/login";
        if (_env && (_env == 'ios' || _env == 'android' || _env == 'Android')) {
            url = url + "?goto=logout";
            window.location = url;
        }
        else
            history.push(url);

    }.bind(this), 100)
}

export const pingRegister = (dispatch) => {
    const messaging = firebase.messaging()
    messaging.requestPermission().then(() => {
        return messaging.getToken();
    }).then((token) => {
        console.log('---Admin token-----', token);

        var staff = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";

        var parameters = {
            ClientId: localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "",
            FirbaseDeviceToken: token,
            RegisterId: localStorage.getItem("register") ? localStorage.getItem("register") : null,
            //AccessTime:""	,
            StaffName: staff && staff !== "" ? staff.display_name : "",
            StaffId: staff && staff !== "" ? staff.user_id : "",
        }

        dispatch(firebaseAdminActions.pingRegister (parameters));

    })
}