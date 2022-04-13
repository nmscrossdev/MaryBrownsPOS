import React from 'react';

export const OliverVersionModal = (props) => {
    return (
        // style={{ marginTop: '10%' }}
        <div id="oliver_version" tabIndex="-1" className="modal modal-wide1 fade disabled_oliver_popup" style={{ marginTop: '10%' }}>
            <div className="modal-dialog" id="dialog-midle-align">
                <div className="modal-content">
                    <div className="modal-header">
                        <button onClick={() => props.closeModal()} type="button" className="close" data-dismiss="modal" aria-hidden="true">
                            <img src="../assets/img/letter-x.png" />
                        </button>
                        <h3 style={{ textAlign: 'center', fontSize: 22 }} className="error_model_title modal-title" id="epos_error_model_title">Hoot! Somethings not right!</h3>
                    </div>
                    <div className="modal-body p-0">
                        <h6 style={{ fontSize: 14 }} id="epos_error_model_message" className="popup_version_msg">It appears Plugins are running on your site that are not compatible with Oliver POS.<br /><p style={{ fontSize: 14, fontWeight: 'bold' }}>Please update these plugins:</p><br />- Oliver POS Plugin<br />- WooCommerce<br /><p style={{ fontSize: 14, fontWeight: 'bold' }}>These plugins are known to not play well with others</p><br />- Clear Cache(<a style={{ color: '#46A9D4' }}>Learn More</a>)<br />- Product Bundles(<a style={{ color: '#46A9D4' }}>Learn More</a>)
                        </h6>
                        {/* <p style={{ fontSize: 14 }}>- Oliver POS Plugin</p>
                        <p style={{ fontSize: 14 }}> - WooCommerce</p>
                        <p style={{ fontSize: 14, fontWeight: 'bold' }}>These plugins are known to not play well with others</p>
                        <p style={{ fontSize: 14 }}>- Clear Cache(<a style={{color:'#46A9D4'}}>Learn More</a>)</p>
                        <p style={{ fontSize: 14 }}> - Product Bundles(<a style={{color:'#46A9D4'}}>Learn More</a>)</p> */}
                    </div>
                    <div className="modal-footer p-0">
                        <div style={{ flexDirection: 'row', margin: 15, }}>
                            <button onClick={() => props.reportBug()} style={{ backgroundColor: '#fff', borderColor: '#000', color: '#000', padding: 10, textTransform: 'none', marginRight: "38%", }} type="button" className="btn btn-primary h66" data-dismiss="modal" aria-hidden="true">Report a bug</button>
                            <button style={{ backgroundColor: '#46A9D4', padding: 10, textTransform: 'none' }} type="button" className="btn btn-primary h66" data-dismiss="modal" aria-hidden="true">Done, Please let me in proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

