import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../_helpers/history';
import { pinLoginActions } from '../../PinPage';
import { encode_UDid, get_UDid } from '../../ALL_localstorage';
import WebSiteLinkViewFirst from '../views/wSubSiteLink';
import MobileSiteLinkViewFirst from '../views/mSubSiteLink';
import compareVersions from 'compare-versions';

import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";

class SiteLinkViewFirst extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            hardBlockerOliverVersion: '',
            isOldVersion: false
        }
        this.handleBack = this.handleBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.props.dispatch(pinLoginActions.getBlockerInfo())

    }

    componentWillMount() {
        if (localStorage.getItem('sitelist') == null || localStorage.getItem('sitelist') == 'undefined') {
            history.push('/login');
        }
    }

    componentDidMount() {
        this.applySettings();
    }
    applySettings()
    {
        let sffd=localStorage.getItem('selected_ffdisplay');
        let swtd=localStorage.getItem('selected_wtdisplay');
        let isShowFF=sffd=="yes"?true:false;
        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true) && isShowFF==true)
        {
            if(swtd=="nview")
            {
                Android.DualscreenShow(true);
            }
            else if(swtd=="r-main-screen")
            {
                Android.doReplicate();
            }
        }
        else if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true) && isShowFF==false)
        {
            Android.DualscreenShow(false);
        }
    }
    componentWillReceiveProps(nextProps) {
        var UserLocations = this.props.locations ? this.props.locations : localStorage.getItem('UserLocations');
        var Sitelist = localStorage.getItem('sitelist') ? (localStorage.getItem('sitelist')) : this.props.sitelist;
        if (Sitelist && Sitelist != null) {
            setTimeout(function () {
                $(".chooseregisterLinksScroll").niceScroll({ styler: "fb", cursorcolor: "#2BB6E2", cursorwidth: '3', cursorborderradius: '10px', background: '#d5d5d5', spacebarenabled: false, cursorborder: '', scrollspeed: 60, cursorfixedheight: 70 });
                $(".chooseregisterLinksScroll").getNiceScroll().resize();
            }, 500)
        }
        // check for hardBlockerVersion
        if (nextProps.getversioninfo) {
            if (nextProps.getversioninfo.HardBlockerVersion && nextProps.getversioninfo.HardBlockerVersion[0]) {
                if (nextProps.getversioninfo.HardBlockerVersion && nextProps.getversioninfo.HardBlockerVersion.length > 0) {
                    var hardBlockerVersion = nextProps.getversioninfo.HardBlockerVersion.find(Items => (Items.Code == "Hard_Oliver_Version"))
                    this.setState({ hardBlockerOliverVersion: hardBlockerVersion.Value })
                }


            }
        }
        // this.checkShopStatus(UDID);
    }

    checkShopStatus(UDID) {
        if (localStorage.getItem("shopstatus") && localStorage.getItem("shopstatus") !== null) {
            var sopstatus = JSON.parse(localStorage.getItem("shopstatus") ? localStorage.getItem("shopstatus") : "");
            if (sopstatus !== "") {
                $('#PopupShopStatus').modal('show');
            }
        }
    }

    checkVersionIsAvailable(BridgeVersion) {
        const { hardBlockerOliverVersion } = this.state
        if (BridgeVersion && hardBlockerOliverVersion) {
            BridgeVersion = BridgeVersion.replace(/['"]+/g, '')
            var versionCompare = compareVersions.compare(`${BridgeVersion}`, `${hardBlockerOliverVersion}`, '<') == true
            console.log('versionCompare----', versionCompare);
            if (versionCompare == false) {
                history.push('/login_location');
            }
            this.props.onVersionStateChange(versionCompare);

            this.setState({ isOldVersion: versionCompare })
        }
    }



    handleSubmit(site) {

        // var decodedString = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : this.props.sitelist
        // var decod = decodedString && window.atob(decodedString);
        // var Sitelist = decod && JSON.parse(decod);
        var Sitelist =localStorage.getItem('sitelist') ? JSON.parse(localStorage.getItem('sitelist')) :JSON.parse( this.props.sitelist);
        
        encode_UDid(site.subscription_detail.udid);
        var getudid = get_UDid('UDID');
        this.setState({
            loading: true
        });
        localStorage.setItem("showExtention", site.subscription_permission.show_extension);
        //this.props.dispatch(pinLoginActions.checkSubcription());
        var UserLocations = this.props.locations ? this.props.locations : localStorage.getItem('UserLocations');
        if (UserLocations != null) {
            //     if (localStorage.getItem(`last_login_location_name_${getudid}`) && localStorage.getItem(`last_login_location_id_${getudid}`)
            //         && localStorage.getItem(`last_login_register_id_${getudid}`) && localStorage.getItem(`last_login_register_name_${getudid}`)) {
            //         history.push('/loginpin')
            //     } else {
            //         {
            this.setState({
                loading: false
            });
            // history.push('/login_location');
            //     }
            // }

            // var decodedString = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : this.props.sitelist
            // var decod = decodedString && window.atob(decodedString);
            // var Sitelist = decod && JSON.parse(decod);

            // check oliver version  if more than one site
            if (site && Sitelist.length > 1) {
                if (site && site.BridgeVersion) {
                    this.checkVersionIsAvailable(site.BridgeVersion)
                }
            } else {
                history.push('/login_location');
            }
        }
    }

    handleBack(e) {
        if (e.keyCode == 86 && e.ctrlKey) {
            $('#siteLinBackButton').focus();
        }
    }

    render() {
        var Sitelist = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : this.props.sitelist
      
        // var decodedString = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : this.props.sitelist
        // var decod = decodedString && window.atob(decodedString);
        // var Sitelist = decod && JSON.parse(decod);
        var Sitelist = Sitelist && JSON.parse(Sitelist);
        if ( !Sitelist || ! Sitelist.subscriptions || !(Array.isArray(Sitelist.subscriptions))) { Sitelist = null; }
        var IsActiveExist = false;
       // console.log("Sitelist",Sitelist)
        Sitelist && Sitelist.subscriptions.map((link, index) => {
            if (link.Activated == "True") {
                IsActiveExist = true;
            }
        });

        return (
            // isMobileOnly == true ? //|| isIOS == true
            //     // <MobileSiteLinkViewFirst
            //     //     Sitelist={Sitelist}
            //     //     handleSubmit={this.handleSubmit}
            //     //     handleBack={this.handleBack}
            //     // />
            //     <WebSiteLinkViewFirst
            //         Sitelist={Sitelist}
            //         handleSubmit={this.handleSubmit}
            //         handleBack={this.handleBack}
            //         isOldVersion={this.state.isOldVersion}
            //     />
            //     :
                <WebSiteLinkViewFirst
                    Sitelist={Sitelist}
                    handleSubmit={this.handleSubmit}
                    handleBack={this.handleBack}
                    isOldVersion={this.state.isOldVersion}
                />

        )
    }
}

function mapStateToProps(state) {
    const { authentication, locations, getversioninfo } = state;
    return {
        sitelist: authentication.user,
        locations: locations,
        getversioninfo: getversioninfo.items,

    };
}
const connectedSiteLinkViewFirst = connect(mapStateToProps)(SiteLinkViewFirst);
export { connectedSiteLinkViewFirst as SiteLinkViewFirst };