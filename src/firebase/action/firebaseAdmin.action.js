import { firebaseAdminConstants, firebaseAdminService } from '../';

import { history } from "../../_helpers";
import moment from 'moment';
import { serverRequest } from '../../CommonServiceRequest/serverRequest';
import { allProductConstants } from '../../_constants';
import { customerConstants, customerService } from '../../CustomerPage';


export const firebaseAdminActions = {
  sendToken,
   removeSubscription,
   registerAccessed,
   getRegisters,
   updateOrderProductDB,
   getUpdatedCustomerDetail,
   pingRegister
   
};

function sendToken(token,clientID) {
  return dispatch => {
   // dispatch(request());       
    firebaseAdminService
      .sendToken(token,clientID)
      .then(
        notificationRes => {
          if (notificationRes == true) {
        
            dispatch(success(notificationRes));
          
          } else {
            dispatch(failure(notificationRes.toString()));
           
          }
        },
        error => {
          dispatch(failure(error.toString()));          
        }
      );
  }

  function request() { return { type: firebaseAdminConstants.FIREBASE_ADMIN_REQUEST }; }
  function success(notificationRes) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_SUCCESS, notificationRes }; }
  function failure(error) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_FAILURE, error }; }
}

function removeSubscription(token) {
  return dispatch => {
   // dispatch(request());       
    firebaseAdminService
      .removeSubscription(token)
      .then(
        user => {
          if (user == true) {
        
            dispatch(success(user));
          
          } else {
            dispatch(failure(user.toString()));
           
          }
        },
        error => {
          dispatch(failure(error.toString()));          
        }
      );
  }

  function request() { return { type: firebaseAdminConstants.FIREBASE_ADMIN_REQUEST }; }
  function success(detail) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_SUCCESS, detail }; }
  function failure(error) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_FAILURE, error }; }
}
function registerAccessed(parameters) {
  return dispatch => {
   // dispatch(request());       
    firebaseAdminService
      .registerAccessed(parameters)
      .then(
        user => {
          if (user == true) {
        
            dispatch(success(user));
          
          } else {
            dispatch(failure(user.toString()));
           
          }
        },
        error => {
          dispatch(failure(error.toString()));          
        }
      );
  }

  function request() { return { type: firebaseAdminConstants.FIREBASE_ADMIN_REQUEST }; }
  function success(detail) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_SUCCESS, detail }; }
  function failure(error) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_FAILURE, error }; }
}
function getRegisters(clientID) {
  return dispatch => {
    dispatch(request());       
    firebaseAdminService
      .getRegisters(clientID)
      .then(
        registers => {
          if (registers) {
        
            dispatch(success(registers));
          
          } else {
            dispatch(failure(registers.toString()));
           
          }
        },
        error => {
          dispatch(failure(error.toString()));          
        }
      );
  }

  function request() { return { type: firebaseAdminConstants.FIREBASE_ADMIN_REGISTER_REQUEST }; }
  function success(registers) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_REGISTER_SUCCESS, registers }; }
  function failure(error) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_REGISTER_FAILURE, error }; }
}

function updateOrderProductDB(product) {
  return dispatch => {
    dispatch(request());
    dispatch(success(firebaseAdminService.updateOrderProductDB(product)));

  };
  function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
  function success(response) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, response } }
  function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
}


function getUpdatedCustomerDetail(ID, UID) {
  return dispatch => {
      dispatch(request());
      customerService.getDetail(ID, UID)
          .then(
              single_cutomer_list => {  
                if (localStorage.getItem('AdCusDetail')) {
                  var AdCusDetail = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : '';
                  // if (notificationData && notificationData.customer_id) {
                      if (AdCusDetail.content && AdCusDetail.content.WPId == single_cutomer_list.content.customerDetails.WPId) {
                          
                        var selected_customer_list = single_cutomer_list && single_cutomer_list.content;
                    var customerDetail = selected_customer_list && selected_customer_list.customerDetails;
                    var customerAddress = customerDetail && customerDetail.customerAddress.find(Items => Items.TypeName == "billing");
                    var customerObj = {}
                     customerObj['content'] = {...customerDetail, ...customerAddress} 
                        localStorage.setItem('AdCusDetail', JSON.stringify(customerObj))
                      }
                  // }
              }


                  dispatch(success(single_cutomer_list))
              },
              error => dispatch(failure(error.toString()))
          );
  };
  function request() { return { type: customerConstants.GET_DETAIL_REQUEST } }
  function success(single_cutomer_list) { return { type: customerConstants.GET_DETAIL_SUCCESS, single_cutomer_list } }
  function failure(error) { return { type: customerConstants.GET_DETAIL_FAILURE, error } }
}
function pingRegister(parameters) {
  return dispatch => {
   // dispatch(request());       
    firebaseAdminService
      .pingRegister(parameters)
      .then(
        user => {
          if (user == true) {
        
            dispatch(success(user));
          
          } else {
            dispatch(failure(user.toString()));
           
          }
        },
        error => {
          dispatch(failure(error.toString()));          
        }
      );
  }

  function request() { return { type: firebaseAdminConstants.FIREBASE_ADMIN_PING_REGISTER_REQUEST }; }
  function success(detail) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_PING_REGISTER_SUCCESS, detail }; }
  function failure(error) { return { type: firebaseAdminConstants.FIREBASE_ADMIN_PING_REGISTER_FAILURE, error }; }
}