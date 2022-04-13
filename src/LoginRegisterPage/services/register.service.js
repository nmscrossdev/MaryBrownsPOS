import Config from '../../Config'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const registerService = {
  getAll,
  GetRegisterPermission
};

const API_URL = Config.key.OP_API_URL
function getAll() {
  //console.log(Config.key.AUTH_KEY);



  var decodedString = localStorage.getItem('UDID');
  var decod = window.atob(decodedString);
  var UDID = decod;
  try {
    // return serverRequest.clientServiceRequest('GET', `/registers/Get?Udid=` + UDID + '&LocId=' + localStorage.getItem('Location'), '')
   // return serverRequest.clientServiceRequest('GET', `/Registers/GetAll?Udid=` + UDID + '&LocId=' + localStorage.getItem('Location'), '')
   return serverRequest.clientServiceRequest('GET', `/Registers/GetForLocation?id=` + localStorage.getItem('Location'), '')   
      .then(registers => {
        var _registers = registers.content;
        return _registers;
      }).catch(error => {
        return error
      });
  }
  catch (error) {
    console.log(error);
    return error
  }
}

function GetRegisterPermission(registerId) {
  try {
    return serverRequest.clientServiceRequest('GET', `/RegisterPostMeta/GetPermissions?registerId=` + registerId, '')
      .then(registers => {
        var _registers = registers;
        return _registers;
      }).catch(error => console.log(error));
  }
  catch (error) {
    console.log(error);
  }
}