import { openDb } from 'idb';
import { get_UDid } from '../../ALL_localstorage';
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const firebaseAdminService = {
    sendToken,removeSubscription, registerAccessed,getRegisters,updateOrderProductDB,pingRegister
};

function sendToken(token,clientID) {
    try {
      console.log("call service");
     var postParameter={"ClientId": clientID ,"FirbaseDeviceToken": token};
        return serverRequest.clientServiceRequest('POST', '/Firebase/Subscribe', postParameter)
            .then(response => {
             
                if (response.is_success == true) {                
                   
                    return response.is_success;
                } else {
                    return response.message;
                }
            })
            // .catch(function (error) {
            //     return 'failed';
            // })
    }
    catch (error) {
        console.log(error);
    }
}
function removeSubscription(token) {
    try {
      console.log("call service Unsubscribe");
  
        return serverRequest.clientServiceRequest('GET', `/Firebase/Unsubscribe?token=${token}`, '')
            .then(response => {
             
                if (response.is_success == true) {                
                   
                    return response.is_success;
                } else {
                    return response.message;
                }
            })
            // .catch(function (error) {
            //     return 'failed';
            // })
    }
    catch (error) {
        console.log(error);
    }
}
function registerAccessed(parameters) {
    try {
      console.log("call service");
   
        return serverRequest.clientServiceRequest('POST', `/Firebase/RegisterAccessed`, parameters)
            .then(response => {
             
                if (response.is_success == true) {                
                   
                    return response.is_success;
                } else {
                    return response.message;
                }
            })
            // .catch(function (error) {
            //     return 'failed';
            // })
    }
    catch (error) {
        console.log(error);
    }
}
function getRegisters(clientID) {
    try {
      console.log("call service");
   
        return serverRequest.clientServiceRequest('GET', `/Firebase/GetRegisters`,'')
            .then(response => {
             
                if (response.is_success == true) {            
                   
                    return response.content;
                } else {
                    return response.message;
                }
            }).catch(function (error) {
                return 'failed';
            })
    }
    catch (error) {
        console.log(error);
    }
}

function updateOrderProductDB(productId, refundData = null) {
  
    var udid = get_UDid('UDID');
    var productIds = [];
    productIds.push(productId)
    var WarehouseId=localStorage.getItem("WarehouseId")? parseInt(localStorage.getItem("WarehouseId")):0
    // order && order.map(value => {
    //   var pid = value.variation_id == 0 ? value.product_id : value.variation_id
    //   productIds += productIds == "" ? pid : ',' + pid.toString()
    // })
    // if (refundData != null) {
    //   refundData && refundData.line_items.map(value => {
    //     var pid = value.variation_id == 0 ? value.product_id : value.variation_id
    //     productIds += productIds == "" ? pid : ',' + pid.toString()
    //   })
    // }

    // return serverRequest.clientServiceRequest('GET', `/shopdata/GetInventory?Udid=${udid}&ids=${productIds}`, '')
    return serverRequest.clientServiceRequest('POST', `/Product/Inventories`, { "wpids": productIds,"WarehouseId":WarehouseId})
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
  
function pingRegister(parameters) {
  try {
    console.log("call service");
 
      return serverRequest.clientServiceRequest('POST', `/Firebase/Ping`, parameters)
          .then(response => {
           
              if (response.is_success == true) {                
                 
                  return response.is_success;
              } else {
                  return response.message;
              }
          })
          // .catch(function (error) {
          //     return 'failed';
          // })
  }
  catch (error) {
      console.log(error);
  }
}