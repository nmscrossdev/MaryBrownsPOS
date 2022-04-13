import { registerConstants, registerService, registerPermissionConstants } from "../";
import { history } from '../../_helpers/history';
import { get_UDid } from '../../ALL_localstorage'
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import { redirectToURL } from "../../_components/CommonJS";

export const registerActions = {
  getAll,
  GetRegisterPermission
}

function getAll() {
  return dispatch => {
    //  dispatch(request());
    registerService
      .getAll()
      .then(
        registers => {
          var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                // if(demoUser){                   
                //      GTM_OliverDemoUser("Register: Get register list")
                // }
          dispatch(success(registers))
          // if only one resister is avilable the no need to select register by user---------------

          if (registers && registers.length === 1 && history.location.state === undefined) {
          // if (registers && registers.length >= 1 && history.location.state === undefined) {
            localStorage.setItem('pdf_format', JSON.stringify(registers))
            localStorage.setItem('register', registers[0].id);
            localStorage.setItem('registerName', registers[0].name);
            var getudid = get_UDid('UDID');
            localStorage.setItem(`last_login_register_id_${getudid}`, registers[0].id);
            localStorage.setItem(`last_login_register_name_${getudid}`, registers[0].name);
            localStorage.setItem('selectedRegister',JSON.stringify(registers[0]))
            redirectToURL()
            // history.push('/loginpin');
          }
          //---------------------------------------------------------------------------------------
        },
        error => dispatch(failure(error.toString()))
      );
  };
  function request() { return { type: registerConstants.GETALL_REQUEST }; }
  function success(registers) { return { type: registerConstants.GETALL_SUCCESS, registers }; }
  function failure(error) { return { type: registerConstants.GETALL_FAILURE, error }; }
}

function GetRegisterPermission(registerId) {
  return dispatch => {
    registerService.GetRegisterPermission(registerId)
      .then(
        registers => {
          var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                // if(demoUser){                   
                //      GTM_OliverDemoUser("Register: Get Regoster permission")
                // }
          dispatch(success(registers))
          // if only one resister is avilable the no need to select register by user---------------

          if (registers) {
            localStorage.setItem('RegisterPermissions', JSON.stringify(registers))
          }
        },
        error => dispatch(failure(error.toString()))
      );
  };
  function request() { return { type: registerConstants.PERMISSION_REQUEST }; }
  function success(registerPermission) { return { type: registerConstants.PERMISSION_SUCCESS, registerPermission }; }
  function failure(error) { return { type: registerConstants.PERMISSION_FAILURE, error }; }
}