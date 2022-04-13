import React from 'react';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import Config from '../Config'

class CommonDemoShopButton extends React.Component {
    render() {
        const handleShopButtonClick = () => {
            // window.location.href = `https://oliverpos.com/getting-started/`,
            var VisiterClientConnected = localStorage.getItem('VisiterClientConnected')
            if (VisiterClientConnected == 'true') {
                showModal('LoadMyProduct')
            } else {
                // showModal('BRIDGENOTCONNECTED')
                // open getting-startted link in new tab
                window.open(
                Config.key.OLIVERPOS_GETTING_STARTED,
                '_blank'
            );
            }
        }
        return (
            <div className="checkfooter ifConnectButtonShow">
                <div className="footer footer-success text-center font-bold">
                    {LocalizedLanguage.Enjoyingthedemo}
                    <button
                        onClick={handleShopButtonClick}
                        className="btn btn-success btn-40 btn-break shadow-none btn-pills btn-border-white btn-connect">
                        {LocalizedLanguage.yes},
                         <span className="font-light"> {LocalizedLanguage.ImreadytoconnectmystoretoOliverPOS}</span>
                        <img src="../assets/img/images/chevron.svg" alt="" width="8" className="ml-3" />
                    </button>
                </div>
            </div>
        )
    }
}
export { CommonDemoShopButton };