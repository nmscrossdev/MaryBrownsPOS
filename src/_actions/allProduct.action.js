import { allProductConstants } from '../_constants';
import { allProductService } from '../_services';
import { get_UDid } from '../ALL_localstorage'

export const allProductActions = {
    getAll,
    refresh,
    filteredProduct,
    ticketFormList,
    productWarehouseQuantity,
};

function getAll() {
    return dispatch => {
        dispatch(request());
        var productlist = []
        dispatch(success(productlist))
        allProductService.getAll()
            .then(
                productlist => {
                    dispatch(success(productlist)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
    function success(productlist) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, productlist } }
    function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
}

function ticketFormList(frmid) {
    localStorage.removeItem('ticket_list');
    var udid = get_UDid('UDID');
    return dispatch => {
        dispatch(request());
        allProductService.ticket_FormL_ist(udid, frmid)
            .then(
                ticketfield => {
                    localStorage.setItem('ticket_list', JSON.stringify(ticketfield));
                    dispatch(success(ticketfield))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: allProductConstants.TICKET_FIELD_GETALL_REQUEST } }
    function success(ticketfield) { return { type: allProductConstants.TICKET_FIELD_GETALL_SUCCESS, ticketfield } }
    function failure(error) { return { type: allProductConstants.TICKET_FIELD_GETALL_FAILURE, error } }
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
function productWarehouseQuantity(productId) {
    return dispatch => {
        dispatch(request());
        allProductService.productWarehouseQuantity(productId)
            .then(
                productDetail => {                  
                    dispatch(success(productDetail))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: allProductConstants.PRODUCT_QTY_REQUEST } }
    function success(productDetail) { return { type: allProductConstants.PRODUCT_QTY_SUCCESS, productDetail } }
    function failure(error) { return { type: allProductConstants.PRODUCT_QTY_FAILURE, error } }
}