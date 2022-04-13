import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {removeActiveCss,showSelected} from '../CommonWork';
class FFDisplaySettings extends React.Component {

    componentDidMount() {
       
        let sffd=localStorage.getItem('selected_ffdisplay');
        let swtd=localStorage.getItem('selected_wtdisplay');
        if(sffd)
        {
            showSelected('ff-display',sffd);
        }
        if(swtd)
        {
            showSelected('what-to-display',swtd)
        }
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
    selectFFDisplay(val)
    {
        localStorage.setItem('selected_ffdisplay',val);
        removeActiveCss('ff-display');
    }
    selectWhatToDisplay(val)
    {
        localStorage.setItem('selected_wtdisplay',val);
        removeActiveCss('what-to-display');
    }
    render() {
        return (
            <div id="ff-display-settings" className="tab-pane fade">
                <div className="panel panel-custmer">
                    <div className="panel-default pt-2">
                        <div className="panel-body customer_history p-0">
                            <form className="clearfix form_editinfo connection-setting">
                            <div className="card-body no-padding overflowscroll pgsectionfilter">
                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">Display On</h6>
                                    <div className="card-wrap">
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectFFDisplay('yes')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none ff-display pl-3 pr-3" data-value="yes">
                                            <input type="radio" name="optonoff" /> {LocalizedLanguage.yes}
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectFFDisplay('no')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none ff-display pl-3 pr-3" data-value="no">
                                            <input type="radio" name="optonoff" /> {LocalizedLanguage.no}
                                        </label>
                                    </div>
                                    </div>
                                </div>
                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">What do you want to display?</h6>
                                    <div className="card-wrap">
                                            
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectWhatToDisplay('nview')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none what-to-display pl-3 pr-3" data-value="nview">
                                            <input type="radio" name="optview" /> Normal View
                                        </label>
                                    </div>
                                    {/* <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectWhatToDisplay('app')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none what-to-display pl-3 pr-3" data-value="app">
                                            <input type="radio" name="optview" /> App
                                        </label>
                                    </div> */}
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectWhatToDisplay('r-main-screen')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none what-to-display pl-3 pr-3" data-value="r-main-screen">
                                            <input type="radio" name="optview" /> Replicate Main Screen
                                        </label>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="card-body-content mb-0">
                                    <h6 className="card-title">Which App do you want to show?</h6>
                                    <div className="card-wrap">
                                    </div>
                                </div> */}
                                <div className={ "card-body-content mb-0"}>
                                <div className='hr-w300'><hr></hr></div>
                                <div className="createnewcustomer">
                                    <button type="button" className="btn btn-primary total_checkout btn-wd pt-3 pb-3" onClick={() => this.applySettings()}>Apply Settings</button>
                                </div>
                            </div>
                            </div>
                         
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { };
}
const connectedSettingPrinter = connect(mapStateToProps)(FFDisplaySettings);
export { connectedSettingPrinter as FFDisplaySettings };
