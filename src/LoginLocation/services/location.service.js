import Config from '../../Config'
import { serverRequest } from "../../CommonServiceRequest/serverRequest";
export const locationService = {
  getAll,
};

const API_URL = Config.key.OP_API_URL;
function getAll(UDID, userId) {
  return serverRequest.clientServiceRequest('GET', `/Locations/GetAll?udid=${UDID}&userId=${userId}`, '')
    .then(locationsRes => {     
      //localStorage.setItem('user', JSON.stringify(locationsRes.content));
      localStorage.setItem('UserLocations', JSON.stringify(locationsRes.content));
      var locations = locationsRes.content;
      return locations;
    });
}