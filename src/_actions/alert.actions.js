import { alertConstants } from '../_constants';

export const alertActions = {
    success,
    error,
    clear
};


function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {   
        // if(message =='Internal Server Error' || message == 'TypeError: Failed to fetch'){
        //     window.location = '/Error'
        // }
      return { type: alertConstants.ERROR, message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}