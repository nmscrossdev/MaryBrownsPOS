import Config from '../Config'
import { openDb } from 'idb';
import { get_UDid } from '../ALL_localstorage'
import moment from 'moment';
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const idbProductService = {
  getAll,
 // createProductDB,
  updateProductDB,
  //createProductDBNew,
  refresh,
  updateOrderProductDB
};

const API_URL = Config.key.OP_API_URL
// function createProductDBNew(PageNumbner, PageSize) {

//   var decodedString = get_UDid('UDID');
//   if (decodedString) {
//     var udid = decodedString //decod;
//     return serverRequest.clientServiceRequest('GET', `/Products/Records?pageNumber=${PageNumbner}&pageSize=${PageSize}`, '')
//       .then(productlst => {
//         return productlst.content;
//       });
//   }
// }

function refresh() {
  // remove user from local storage to log user out
}

// function createProductDB() {
  
//   var decodedString = get_UDid('UDID');
//   if (decodedString) {
//     var udid = decodedString;
//     return serverRequest.clientServiceRequest('GET', `/ShopData/GetAllProductNew?Udid=${udid}`, '')
//       .then(productlst => {
//         var productlist = productlst.Content;
//         const dbPromise = openDb('ProductDB', 1, upgradeDB => {
//           // if (!upgradeDb.objectStoreNames.contains(udid, {autoIncrement: true})) {
//           upgradeDB.createObjectStore(udid);
//           // }
//         });
//         const idbKeyval = {
//           async get(key) {
//             const db = await dbPromise;
//             return db.transaction(udid).objectStore(udid).get(key);
//           },
//           async set(key, val) {
//             const db = await dbPromise;
//             const tx = db.transaction(udid, 'readwrite');
//             tx.objectStore(udid).put(val, key);
//             return tx.complete;
//           },

//         };
//         const arrayUniqueByKey = [...new Map(productlist.map(item =>
//           [item['WPID'], item])).values()];
//         idbKeyval.set('ProductList', arrayUniqueByKey);

//         return 'Success';
//       });
//   }
// }

/*
Updated By   :Aman Singhai
Updated Date :04-08-2020
Description : Cannot read property 'find' of undefined, bugsnag issue, defined productList at line no 143
*/
function updateProductDB() {

  var udid = get_UDid('UDID');
  //https://app.creativemaple.ca/api/ShopData/GetUpdatedInventory?udid=4040246278&LastOrderTime=2019-04-05 10:00:00
  var now = new Date();
  now.setHours(8);
  now.setMinutes(0);
  now.setMilliseconds(0);
  var UpdateDate = moment.utc(now).format('YYYY-MM-DD HH:mm:ss');
  if (localStorage.getItem("PRODUCT_REFRESH_DATE")) {
    UpdateDate = localStorage.getItem("PRODUCT_REFRESH_DATE").toString();
  }
  return serverRequest.clientServiceRequest('GET', `/Product/GetInventory?LastOrderTime=${UpdateDate}`, '')
    //.then(handleResponse)
    .then(qtyList => {
      localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      var quantityList = qtyList.content;
      var productList = [];
      const dbPromise = openDb('ProductDB', 1, upgradeDB => {
        // if (!upgradeDb.objectStoreNames.contains(udid, {autoIncrement: true})) {
        upgradeDB.createObjectStore(udid);
        // }
      });
      const idbKeyval = {
        async get(key) {
          const db = await dbPromise;
          return db.transaction(udid).objectStore(udid).get(key);
        },
        async set(key, val) {
          const db = await dbPromise;
          const tx = db.transaction(udid, 'readwrite');
          tx.objectStore(udid).put(val, key);
          return tx.complete;
        },
      };
      idbKeyval.get('ProductList').then(val => {
        productList = val;
        quantityList && quantityList.map(quanList => {
          var filteredProduct = productList && productList.find((value, index) => {
            if (value.WPID === quanList.WPID) {
              return value.WPID === quanList.WPID
            }
          })
          if (!filteredProduct) {
            localStorage.setItem('UPDATE_PRODUCT_LIST', true)
          }
          if (filteredProduct && filteredProduct !== null && filteredProduct != 'undefined') {
            filteredProduct['StockQuantity'] = quanList.Quantity;
            // filteredProduct['Price']=quanList.Price;   
          }

        });
        if (productList && productList.length > 0) {
          const arrayUniqueByKey = [...new Map(productList.map(item =>
            [item['WPID'], item])).values()];
          idbKeyval.set('ProductList', arrayUniqueByKey);
        }

       // return 'Success';
      });
      return quantityList;
    });
   
}

function getAll() {
  var udid = get_UDid('UDID');
  const dbPromise = openDb('ProductDB', 1, upgradeDB => {
    upgradeDB.createObjectStore(udid);
  });
  dbPromise.then(function (db) {
    var tx = db.transaction(udid, 'readonly');
    var store = tx.objectStore(udid);
    return store.getAll();
  }).then(function (items) {
    return items;
  });
}

/*
Updated By   :Aman Singhai
Updated Date :04-08-2020
Description : Cannot read property 'find' of undefined, bugsnag issue, defined productList at line no 254
*/
function updateOrderProductDB(order, refundData = null) {
  var WarehouseId=localStorage.getItem("WarehouseId")? parseInt(localStorage.getItem("WarehouseId")):0
  var udid = get_UDid('UDID');
  var productIds = [];
  order && order.map(value => {
    var pid = value.variation_id == 0 ? value.product_id : value.variation_id ?  value.variation_id : value.WPID
        // productIds += productIds == "" ? pid : ',' + pid.toString()
    productIds.push(pid)
  })
  if (refundData != null) {
    refundData && refundData.line_items.map(value => {
      var pid = value.variation_id == 0 ? value.product_id : value.variation_id
      // productIds += productIds == "" ? pid : ',' + pid.toString()
       productIds.push(pid)
    })
  }
  return serverRequest.clientServiceRequest('POST', `/Product/Inventories`, { "wpids": productIds,"WarehouseId":WarehouseId})
  // return serverRequest.clientServiceRequest('GET', `/shopdata/GetInventory?Udid=${udid}&ids=${productIds}`, '')
    .then(qtyList => {
      var quantityList = qtyList.content;
      var productList = [];
      const dbPromise = openDb('ProductDB', 1, upgradeDB => {
        upgradeDB.createObjectStore(udid);
      });
      const idbKeyval = {
        async get(key) {
          const db = await dbPromise;
          return db.transaction(udid).objectStore(udid).get(key);
        },
        async set(key, val) {
          const db = await dbPromise;
          const tx = db.transaction(udid, 'readwrite');
          tx.objectStore(udid).put(val, key);
          return tx.complete;
        },
      };
      idbKeyval.get('ProductList').then(val => {
        productList = val;
        quantityList && quantityList.map(prodQty => {
          if (quantityList) {
            // var prodQty= quantityList.find(quanList=> {   
            //  var id=  value.variation_id==0?  value.product_id: value.variation_id;                  
            //   return(id === quanList.WPID)
            //     })
            var prodTobeUpdate = productList && productList.find(value => {
              if (value.WPID === prodQty.WPID) {
              value['StockQuantity'] = prodQty.Quantity;
                //value['Price']=prodQty.Price;  
                return true;
              }
            })
            // if(prodTobeUpdate)
            //   { prodTobeUpdate.StockQuantity = prodQty.StockQuantity;
            //   prodTobeUpdate.Price=prodQty.Price;                           
            // }
          }
        })
        if ( productList && productList.length > 0) {
          const arrayUniqueByKey = [...new Map(productList.map(item =>
            [item['WPID'], item])).values()];
          idbKeyval.set('ProductList', arrayUniqueByKey);
        }
        return 'Success';
      })
    });

}



