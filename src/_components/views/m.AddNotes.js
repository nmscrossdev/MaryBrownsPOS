import React from 'react';

const MobileAddNotes = (props) => {
    const { LocalizedLanguage, handleNote } = props;
    return (<div>
        <div className="appHeader">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-12">
                        <a className="appHeaderBack" href="javascript:void(0);" onClick={() => { props.type == "checkout" ? props.changeComponent("notes") : props.openModal("view_cart") }}>
                            <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="appCapsule h-100 overflow-hidden pb-0">
            <div className="container-fluid p-0 pt-3 addfeeForm">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="textareaFee">
                            <textarea id="txtNote" cols="30" rows="10" className="shadow-none form-control" placeholder={LocalizedLanguage.placeholderNote}></textarea>
                        </div>
                        <button onClick={() => handleNote("addbymobile")} className="btn btn-primary rounded-0 btn-block h-70-px shadow-none text-uppercase">{LocalizedLanguage.submit}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default MobileAddNotes;