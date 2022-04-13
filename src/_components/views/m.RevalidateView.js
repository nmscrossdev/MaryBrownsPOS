import React from 'react';

const RevalidateView = (props) => {
    const { log_out, } = props;
    return (
        <div className="background-image-1">
            <div className="overlay2 tiled_owl background-image-2"></div>
            <div className="container-fluid">
                <div className="row vh-100 align-items-center">
                    <div className="col-auto mx-auto text-center text-white">
                        <div className="page-title mb-20 mx-width-410 mx-auto">
                            <h1 className="h1 fz-20">Subscription Message</h1>
                            <button style={{ width: '100%', backgroundColor: "#AAD47D", borderRadius: 8, color: '#fff', marginTop: '10%', height: 65 }} onClick={() => handleSubmit()} className="btn btn-links  text-white p-0  fz-25">Revalidate</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tagOwls" style={{ flexDirection: 'column' }}>
                <img onClick={() => log_out()} src="../assets/img/logout-btn_wht.png" />
                <p>Powered by Oliver POS</p>
            </div>
        </div>
    )
}

export default RevalidateView;