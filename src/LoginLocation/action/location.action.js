import { locationConstants, locationService } from '../';
import { history } from '../../_helpers/history';
import { get_UDid } from '../../ALL_localstorage'

export const locationActions = {
  getAll,
};

function getAll(UDID, userId) {
   return dispatch => {
    dispatch(request());
    locationService
      .getAll(UDID, userId)
      .then(
        locations => {
          var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                // if(demoUser){                   
                //      GTM_OliverDemoUser("Location: Get location list")
                // }
          dispatch(success(locations))
          //If only one location is avilable then no need to select ------------------------------------------            
          if (locations) {
            if (locations.length === 1) {
              localStorage.setItem('Location', locations[0].id);
              localStorage.setItem('LocationName', locations[0].name);
              var getudid = get_UDid('UDID');
              localStorage.setItem(`last_login_location_id_${getudid}`, locations[0].id);
              localStorage.setItem(`last_login_location_name_${getudid}`, locations[0].name);
              localStorage.setItem('WarehouseId', locations[0].warehouse_id);
              history.push('/choose_registration');
            }
          } else {
            history.push('/login');
          }
          //--------------------------------------------------------------------------------------------------------
        },
        error => {
          dispatch(failure(error.toString()));
          history.push('/login');
        }
      );
  };
  function request() { return { type: locationConstants.GETALL_REQUEST }; }
  function success(locations) { return { type: locationConstants.GETALL_SUCCESS, locations }; }
  function failure(error) { return { type: locationConstants.GETALL_FAILURE, error }; }
}