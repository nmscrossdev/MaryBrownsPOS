import Iframe from 'react-iframe';
import { favouriteListConstants, favouriteListService } from '../';
import { alertActions } from '../../_actions';
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';

export const favouriteListActions = {
    getAll,
    getChildCategories,
    getSubAttributes,
    variationProdList,
    addToFavourite,
    favProductRemove,
    getTest,
    get_TickeraSetting,
    get_notification,
    userList
};

function getTest(UDID, Register_id) {
    return dispatch => {
        dispatch(request({ UDID, Register_id }));
        favouriteListService.getTest()
            .then(
                favouriteList => {
                    //dispatch(success(favouriteList));                  
                    // history.push('/site_link');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
    function request(UDID) { return { type: favouriteListConstants.FAVOURITE_LIST_REQUEST, UDID } }
    function success(favouriteList) { return { type: favouriteListConstants.FAVOURITE_LIST_SUCCESS, favouriteList } }
    function failure(error) { return { type: favouriteListConstants.FAVOURITE_LIST_FAILURE, error } }
}
/** 
 * Created By:priyanka
 * Created Date:13/06/2019
 * Description:using tickera for check default field
*/
function get_TickeraSetting() {
    return dispatch => {
        favouriteListService.GetTickeraSetting()
            .then(
                tick_setting => {
                    localStorage.setItem('TickeraSetting', JSON.stringify(tick_setting))
                    error => {
                    }
                }
            );
    };
}

function get_notification() {
    var notificationlist = [];
    var _order = {
        "time": "12:30",
        "title": "NEW ORDER CREATED IN WP",
        "description": "We Are Happy To Inform You That Oliver POS Has Just Created Order #434 For You.",
    }
    notificationlist.push(_order);
    return notificationlist;
}

function getAll(UDID, Register_id) {
    if (UDID && Register_id) {
        return dispatch => {
            dispatch(request());
            favouriteListService.getAll(UDID, Register_id)
                .then(
                    favouriteList => {
                        dispatch(success(favouriteList));
                        // history.push('/site_link');
                    },
                    error => {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                );
        };
    }
    function request(UDID) { return { type: favouriteListConstants.FAVOURITE_LIST_REQUEST, UDID } }
    function success(favouriteList) { return { type: favouriteListConstants.FAVOURITE_LIST_SUCCESS, favouriteList } }
    function failure(error) { return { type: favouriteListConstants.FAVOURITE_LIST_FAILURE, error } }
}

function getChildCategories(UDID, CatId) {
    return dispatch => {
        dispatch(request());
        favouriteListService.getChildCategory(UDID, CatId)
            .then(ChildCategoryList => {
                dispatch(success(ChildCategoryList))
            },
                error => dispatch(failure(error.toString()))
            );
    };
    function request(UDID) { return { type: favouriteListConstants.FAVOURITE_CHILD_CATEGORY_LIST_REQUEST, UDID } }
    function success(ChildCategoryList) { return { type: favouriteListConstants.FAVOURITE_CHILD_CATEGORY_LIST_SUCCESS, ChildCategoryList } }
    function failure(error) { return { type: favouriteListConstants.FAVOURITE_CHILD_CATEGORY_LIST_FAILURE, error } }
}

function getSubAttributes(UDID, Code) {
    return dispatch => {
        dispatch(request());
        var attribute_list = localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true ? JSON.parse(localStorage.getItem("attributelist")) : null;
        var sub_attribute;

        if(attribute_list && attribute_list !== undefined && attribute_list.length > 0){
            var found = attribute_list.find(function (element) {
                return element.Code.toLowerCase() == Code.toLowerCase()
            })
            if (found) {
                sub_attribute = found.SubAttributes;
                //  sub_attribute=  found.SubAttributes.find(function (element) {
                //      return element.Value.toLowerCase()==option.toLowerCase()         
                //  })
            }

        }
        dispatch(success(sub_attribute));
        // favouriteListService.getSubAttributesList( UDID,Slug )
        //   .then( SubAttributesList => {
        //       dispatch(success(SubAttributesList))},
        //         error => dispatch(failure(error.toString()))
        //     );
    };
    function request(UDID) { return { type: favouriteListConstants.FAVOURITE_GET_SUBATTRIBUTES_LIST_REQUEST, UDID } }
    function success(SubAttributesList) { return { type: favouriteListConstants.FAVOURITE_GET_SUBATTRIBUTES_LIST_SUCCESS, SubAttributesList } }
    function failure(error) { return { type: favouriteListConstants.FAVOURITE_GET_SUBATTRIBUTES_LIST_FAILURE, error } }
}

function addToFavourite(type, id, slug, order) {
    console.log("Add to Favourite");
    return dispatch => {
        dispatch(request());
        favouriteListService.addToFavourite(type, id, slug, order)
            .then(favouritesProductAdd => {
                if (favouritesProductAdd.message == "Success") {
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("ShopView: Add Tile to Favourite")
                    }
                    dispatch(success(favouritesProductAdd))
                    // window.location = '/shopview'
                    //history.push('/shopview');
                }
            }
                //,history.push("/shopview")
                ,
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: favouriteListConstants.SAVE_LIST_REQUEST } }
    function success(favouritesProductAdd) { return { type: favouriteListConstants.SAVE_LIST_SUCCESS, favouritesProductAdd } }
    function failure(error) { return { type: favouriteListConstants.SAVE_LIST_FAILURE, error } }
}

function variationProdList(item) {
    return dispatch => {
        dispatch(success(item))
    };
    function success(variationProdList) { return { type: favouriteListConstants.GET_VARIATION_PRODUCT_LIST_SUCCESS, variationProdList } }
}

function favProductRemove(udid, favid) {
    return dispatch => {
        dispatch(request());
        favouriteListService.favProductRemove(udid, favid)
            .then(
                favProduct => {
                    dispatch(success(favProduct))
                    // window.location = '/shopview';
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request(UDID) { return { type: favouriteListConstants.FAVOURITE_PRODUCT_DELETE_REQUEST, UDID } }
    function success(favProductDelete) { return { type: favouriteListConstants.FAVOURITE_PRODUCT_DELETE_SUCCESS, favProductDelete } }
    function failure(error) { return { type: favouriteListConstants.FAVOURITE_PRODUCT_DELETE_FAILURE, error } }
}
/**
 * Created By   : Priyanka
 * Created Date : 4-07-2019
 * Description   : get staff user list. 
*/
function userList() {
    return dispatch => {
        favouriteListService.getUserList()
            .then(
                userlist => {
                    localStorage.setItem('user_List', JSON.stringify(userlist))
                    error => {
                    }
                }
            );
    };
}
