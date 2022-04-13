import { allProductConstants } from '../_constants';
import { idbProductService } from '../_services';
import { openDb } from 'idb';
import { get_UDid } from '../ALL_localstorage'
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';

export const idbProductActions = {
  getAll,
  refresh,
  //createProductDB,
  updateProductDB,
 // createProductDBNew,
  filteredProduct,
  updateOrderProductDB,
  updateConfirmProductDB
};

// function createProductDBNew() {
//   return dispatch => {
//     dispatch(request());
//     var productlist = [];
//     var pageSize = 100;
//     var pageNumber = 1;
//     var totalRecord = 0
//     var ProductResponse;
//     setTimeout(function () {
//       ProductResponse = idbProductService.createProductDBNew(pageNumber, pageSize)

//       if (ProductResponse && ProductResponse.is_success === true) {
//         productlist = productlist.concat(ProductResponse.content.Records);

//         totalRecord = ProductResponse.Content.TotalRecords.lenght();
//         pageNumber++;
//       }
//     }, 1000)
//   };
//   function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
//   function success(productlist) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, productlist } }
//   function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
// }

// function createProductDB() {
//   return dispatch => {
//     dispatch(request());
//     var productlist = []
//     //  dispatch(success(productlist))
//     idbProductService.createProductDB()

//   };
//   function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
//   function success(productlist) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, productlist } }
//   function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
// }

function updateProductDB() {
  return dispatch => {
    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    // if(demoUser){                   
    //       GTM_OliverDemoUser("ShopView: Update product to DB")
    // }
    dispatch(request());
    dispatch(success(idbProductService.updateProductDB()));
  };
  function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
  function success(response) { return { type: allProductConstants.PRODUCT_UPDATE_IN_DB_SUCCESS, response } }
  function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
}

function getAll() {
  return dispatch => {
    // idbProductService.getAll() 
    dispatch(request());
    var udid = get_UDid('UDID');
    const dbPromise = openDb('ProductDB', 1, upgradeDB => {
      upgradeDB.createObjectStore(udid);

    });
    dbPromise.then(function (db) {
      var tx = db.transaction(udid, 'readonly');
      var store = tx.objectStore(udid);
      return store.getAll();
    }).then(function (items) {
      // return dispatch => {
      dispatch(success(items[0]))
      // };
      // return items;
    });
  };
  function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
  function success(productlist) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, productlist } }
  function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
}

function refresh() {
  return { type: allProductConstants.PRODUCT_GETALL_REFRESH };
}

function filteredProduct(filteredProduct = []) {
  return dispatch => {
    dispatch(success(filteredProduct))
  };
  function success(filteredProduct) { return { type: allProductConstants.FILTERED_ALL_PRODUCTS_SUCCESS, filteredProduct } }
}


function updateOrderProductDB(order) {
  return dispatch => {
    dispatch(request());
    dispatch(success(idbProductService.updateOrderProductDB(order)));

  };
  function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
  function success(response) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, response } }
  function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
}

function updateConfirmProductDB(status) {
  return dispatch => {
    dispatch(success(status));
  };
  function success(update_product_DB) { return { type: allProductConstants.PRODUCT_UPDATE_IN_DB_SUCCESS, update_product_DB } }
}
