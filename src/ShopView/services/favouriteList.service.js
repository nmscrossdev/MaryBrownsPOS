import Config from '../../Config'
import { get_UDid } from '../../ALL_localstorage';
import { serverRequest } from "../../CommonServiceRequest/serverRequest";
export const favouriteListService = {
    getAll,
    getChildCategory,
    getSubAttributesList,
    addToFavourite,
    favProductRemove,
    getTest,
    GetTickeraSetting,
    getUserList
};

const API_URL = Config.key.OP_API_URL;

function setFavList(favouriteList) {
    var favArrayList = [];
    var FavSubCategory = [];
    const favouritesItemsAttribute = favouriteList && favouriteList.FavAttribute ? favouriteList.FavAttribute : [];
    const favouritesItemsCategory = favouriteList && favouriteList.FavCategory ? favouriteList.FavCategory : [];
    const favouritesItemsSubCategory = favouriteList && favouriteList.FavSubCategory ? favouriteList.FavSubCategory : [];
    const favouritesItemsSubAttribute = favouriteList && favouriteList.FavSubAttribute ? favouriteList.FavSubAttribute : [];
    const favouritesItemsProduct = favouriteList && favouriteList.FavProduct ? favouriteList.FavProduct : [];
    favouritesItemsSubCategory && favouritesItemsSubCategory.length > 0 && favouritesItemsSubCategory.map(item => {
        item['sub_category_type'] = "sub-category"
        FavSubCategory.push(item)
    })
    favArrayList = [...favouritesItemsAttribute, ...favouritesItemsCategory, ...FavSubCategory, ...favouritesItemsSubAttribute, ...favouritesItemsProduct] //arr3 ==> [1,2,3,4,5,6]
    const arrayUniqueByKey = [...new Map(favArrayList.map(item =>
        [item['Order'], item])).values()];

    //    prepare list for android and ios fav list-------------------
    var arrayUniqueByKeyIn24 = [];
    var arrayNumList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    if (arrayUniqueByKey && arrayUniqueByKey.length > 0) {
        arrayNumList.map(order_Number => {
            var findSameOrderNum = arrayUniqueByKey.find(itm => itm.Order === order_Number);
            if (findSameOrderNum) {
                arrayUniqueByKeyIn24.push(findSameOrderNum);
            }
        })
    }
    if (arrayUniqueByKeyIn24 && arrayUniqueByKeyIn24.length > 0) {
        arrayUniqueByKeyIn24.map(items => {
            for (var i = arrayNumList.length - 1; i--;) {
                if (arrayNumList[i] === items.Order) arrayNumList.splice(i, 1);
            }
        })
    } else if (arrayUniqueByKeyIn24 && arrayUniqueByKeyIn24.length == 0) {
        arrayUniqueByKeyIn24.push(1)
    }
    arrayUniqueByKeyIn24.push(arrayNumList[0]);
    // console.log("arrayUniqueByKeyIn24", JSON.stringify(arrayUniqueByKeyIn24))

   // setTimeout(function () {
        localStorage.setItem("FAV_LIST_ARRAY", JSON.stringify(arrayUniqueByKeyIn24))
        localStorage.setItem("FAVROUTE_LIST_ARRAY", JSON.stringify(favouriteList))
    //}, 1000)
}

function getTest() {
    // var name = "posk_3dd80552ca15f4fe59bd42875d618e3ccf560bd6";
    // var password = "poss_5a3f7d8d34dc3605ea5796eda8d6dfcf6cf82254!";
    // var authString = name + ":" + password;
    return serverRequest.clientServiceRequest('GET', `/testauth/value`, '')
        .then(response => {
            return response;
        });
}

function getAll(UDID, Register_id) {
    return serverRequest.clientServiceRequest('GET', '/Favorites/Get?Registerid=' + Register_id, '')
        .then(favouriteListRes => {
            var favouriteList = favouriteListRes.content;
            //if (isMobile == true) {
            setFavList(favouriteList)
            // }
            return favouriteList;
        });
}

function getChildCategory(UDID, catId) {
    // return serverRequest.clientServiceRequest('GET', `/ShopSetting/GetChildCategories?udid=${UDID}&CateId=${catId}`, '')
    return serverRequest.clientServiceRequest('GET', `/Category/Child/?ParentId=${catId}`, '')
        .then(favouriteChildCatlist => {
            var favouriteChildCatlist = favouriteChildCatlist.content;
            return favouriteChildCatlist;
        });
}

function getSubAttributesList(UDID, slug) {

    return serverRequest.clientServiceRequest('GET', `/Attributes/SubAttributes/?AttributeSlug=${slug}`, '')
        .then(subAttributelist => {
            var subAttributelist = subAttributelist.content;
            return subAttributelist;
        });


}

function GetTickeraSetting() {
    var udid = get_UDid('UDID');

    try {
        return serverRequest.clientServiceRequest('GET', `/Tickera/GetTikeraSetting?udid=${udid}`, '')
            .then(setting => {
                var ticket_setting = setting.content
                return ticket_setting;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}


function addToFavourite(ItemType, ItemId, ItemSlug, order) {
    var udid = get_UDid("UDID");
    var User = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
    var UserID = User && User.user_id;
    var RegisterId = localStorage.getItem('register');

    return serverRequest.clientServiceRequest('POST', `/Favorites/Save`, { UserID, RegisterId, udid, ItemId, ItemType, ItemSlug, order })
        .then(response => {
            return response;
        });
}

function favProductRemove(UDID, favid) {
    return serverRequest.clientServiceRequest('GET', `/Favorites/Delete?Id=${favid}`, '')
        .then(favProductdelete => {
            var favProductdelete = favProductdelete;
            return favProductdelete;
        });
}

/**
 * Created By   : Priyanka
 * Created Date : 4-07-2019
 * Description   : get staff user list. 
*/
function getUserList() {
    var udid = get_UDid('UDID');
    
    try {
        return serverRequest.clientServiceRequest('GET', `/users/GetUsers`, '')
            .then(user => {
                var userData = user.content;
                return userData;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}



