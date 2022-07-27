import { productModifierConstants } from '../_constants';
import { productModifier } from '../_services';
import { get_UDid } from '../ALL_localstorage';
import { openDb } from 'idb';
export const productModifierActions = {
    getAll,
};

function getAll() {
    return dispatch => {
        dispatch(request());
        var productlist = []
        dispatch(success(productlist))
        productModifier.getAll(100,1)
            .then(
                productlist => {
                    if(productlist && productlist.Records)
                    {
                        ModifierUpdateIndexDB(productlist.Records)
                    }
                    dispatch(success(productlist)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: productModifierConstants.MODIFIER_GETALL_REQUEST } }
    function success(productlist) { return { type: productModifierConstants.MODIFIER_GETALL_SUCCESS, productlist } }
    function failure(error) { return { type: productModifierConstants.MODIFIER_GETALL_FAILURE, error } }
}

async function ModifierUpdateIndexDB(data) {
    var udid=get_UDid();
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
    // for unique array----------------------

    idbKeyval.set('ModifierList', data);

    
}

