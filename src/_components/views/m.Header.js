import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

const deleteCustomerPopup = () => {
     //$('delete_information').addClass('show');
    //$('delete_information').modal('show');
    showModal('delete_information');
}
const Header = (props) => {
    //console.log("%cheader view", "color:pink", props)
    const { addNewCustomter, activeCreateEditDiv } = props;
    var backUrl = props.backUrl && props.backUrl ? props.backUrl : null;
    return (
        <div className="appHeader">
            <div className="container-fluid">
                {activeCreateEditDiv == "create" ?
                    <div className="row align-items-center">
                        <div className="col-12">
                            <a className="appHeaderBack" href="/customerview">
                                <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.cancel}
                            </a>
                        </div>
                    </div>
                    :
                    activeCreateEditDiv == "edit" ?
                        <div className="row align-items-center">
                            <div className="col-4">
                                <a className="appHeaderBack" href="/customerview" >
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.cancel}
                                </a>
                            </div>
                            <div className="col-8 text-right">
                                <button onClick={() => deleteCustomerPopup()} className="btn btn-link appHeaderPgbutton text-danger">
                                    Delete
                       </button>
                            </div>
                        </div>
                        :
                        <div className="row align-items-center">
                            <div className="col-12">
                                <a className="appHeaderBack" href={backUrl && backUrl != null ? backUrl : "javascript:void(0)"}>
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />{LocalizedLanguage.cancel}
                                </a>
                            </div>
                        </div>
                }
            </div>
        </div>

    )
}

export default Header; 
