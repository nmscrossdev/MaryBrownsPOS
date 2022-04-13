
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const tipsService = {
    getAll,
};


function getAll() {

    try {
        return serverRequest.clientServiceRequest('GET', `/Tips/Get`, '')
            .then(tiplst => {     
                if(tiplst.is_success==true && tiplst.content)  {   
                    localStorage.setItem('tipsInfo', JSON.stringify(tiplst.content))       
                    return tiplst.content;
                }
                 else
                    return null;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}
