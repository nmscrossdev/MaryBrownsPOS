import { openDb } from 'idb';
import { get_UDid } from '../ALL_localstorage'


const fetchIndexDb = () => {
var udid= get_UDid('UDID');
const dbPromise = openDb('ProductDB', 1, upgradeDB => {
     upgradeDB.createObjectStore(udid);
 });

 const idbKeyval = {
     async get(key) {
     const db = await dbPromise;
     return db.transaction(udid).objectStore(udid).get(key);
     },                
 };
   return idbKeyval;
}


export const FetchIndexDB = {
    fetchIndexDb
}

export default FetchIndexDB;

var udid = get_UDid('UDID');
const dbPromise = openDb('ProductDB', 1, upgradeDB => {
    upgradeDB.createObjectStore(udid);
});

// const idbKeyval = {
//     async get(key) {
//         const db = await dbPromise;
//         return db.transaction(udid).objectStore(udid).get(key);
//     },
//     async set(key, val) {
//         const db = await dbPromise;
//         const tx = db.transaction(udid, 'readwrite');
//         tx.objectStore(udid).put(val, key);
//         return tx.complete;
//     },
//     async delete(key) {
//         const db = await dbPromise;
//         const tx = db.transaction(udid, 'readwrite');
//         tx.objectStore(udid).delete(key);
//         return tx.complete;
//     },
//     async clear() {
//         const db = await dbPromise;
//         const tx = db.transaction(udid, 'readwrite');
//         tx.objectStore(udid).clear();
//         return tx.complete;
//     },
//     async keys() {
//         const db = await dbPromise;
//         return db.transaction(udid).objectStore(udid).getAllKeys(key);
//     },
// };