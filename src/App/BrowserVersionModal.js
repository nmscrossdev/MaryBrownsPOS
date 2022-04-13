import React from 'react';

export const BrowserVersionModal = (props) => {
    return (
        // style={{marginTop:'10%'}}
        <div id="browser_version" tabIndex="-1" className="modal modal-wide1 fade disabled_browser_popup" style={{ marginTop: '10%' }} >
            <div className="modal-dialog" id="dialog-midle-align">
                <div className="modal-content">
                    <div className="modal-header">
                        {/* <button onClick={()=>props.closeModal()} type="button" className="close" data-dismiss="modal" aria-hidden="true">
                            <img src="../assets/img/ic_circle_delete.svg" />
                        </button> */}
                        <h3 style={{ textAlign: 'center', fontSize: 22 }} className="error_model_title modal-title" id="epos_error_model_title">Hoot! Your browser is out of date!</h3>
                    </div>
                    <div className="modal-body p-0">
                        <h6 style={{ fontSize: 14 }} id="epos_error_model_message" className="popup_payment_error_msg">It appears your browser version is too outdated to be supported by Oliver POS.  Update your browser version to continue using Oliver POS. Find out what browser versions Oliver POS supports here.</h6>
                    </div>
                    <div className="modal-footer p-0">
                        <div style={{ flexDirection: 'row', margin: 15, }}>
                            <button onClick={() => props.reportBug()} style={{ backgroundColor: '#fff', borderColor: '#000', color: '#000', padding: 10, textTransform: 'none', marginRight: "48%", }} type="button" className="btn btn-primary h66" data-dismiss="modal" aria-hidden="true">Report a bug</button>
                            <button onClick={() => props.closeModal()} style={{ backgroundColor: '#46A9D4', padding: 10, textTransform: 'none' }} type="button" className="btn btn-primary h66" data-dismiss="modal" aria-hidden="true">See Support Browsers</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

