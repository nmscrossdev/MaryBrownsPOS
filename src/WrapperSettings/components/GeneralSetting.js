import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {removeActiveCss,showSelected} from '../CommonWork';
class GeneralSetting extends React.Component {
   
    componentDidMount() {
       
        // let sns=localStorage.getItem('selected_notify_sound');
        // let sra=localStorage.getItem('selected_register_animation');
        // if(sns)
        // {
        //     showSelected('notify-sound',sns)
        // }
        // if(sra)
        // {
        //     showSelected('register-animation',sra)
        // }
        
    }
   clearCache()
    {
        localStorage.removeItem("isFirstLogin");
        if(typeof Android !== "undefined" && Android !== null) {    
            Android.clearCache();
        }
    }
    selectNotifySound(val)
    {
       localStorage.setItem('selected_notify_sound',val);
       removeActiveCss('notify-sound')
    }
    selectRAnimation(val)
    {
        localStorage.setItem('selected_register_animation',val);
       removeActiveCss('register-animation')
    }
  
    render() {
        return (
            <div id="general-setting" className="tab-pane fade in active">
                <div className="panel panel-custmer">
                    <div className="panel-default pt-2">
                        <div className="panel-body customer_history p-0">
                            <form className="clearfix form_editinfo connection-setting">
                            <div className="card-body no-padding overflowscroll pgsectionfilter">
                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">Version</h6>
                                    <div className="card-wrap">
                                   {(typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?
                                        Android.getBuildVersion():null}
                                    </div>
                                </div>

                                {/* <div className="card-body-content mb-0">
                                    <h6 className="card-title">New Online Order Notification Sound</h6>
                                    <div className="card-wrap">
                                            
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectNotifySound('on')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none notify-sound pl-3 pr-3" data-value="on">
                                            <input type="radio" name="optreceiptsize" /> On
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectNotifySound('off')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none notify-sound pl-3 pr-3" data-value="off">
                                            <input type="radio" name="optreceiptsize" /> Off
                                        </label>
                                    </div>
                                    </div>
                                </div> */}

                                {/* <div className="card-body-content mb-0">
                                    <h6 className="card-title">Register Animations</h6>
                                    <div className="card-wrap">
                                            
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectRAnimation('on')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none register-animation pl-3 pr-3" data-value="on">
                                            <input type="radio" name="optautoprint" /> On
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectRAnimation('off')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none register-animation pl-3 pr-3" data-value="off">
                                            <input type="radio" name="optautoprint" /> Off
                                        </label>
                                    </div>
                                    </div>
                                </div> */}
                                <div className="card-body-content mb-0">
                                <div className='hr-w300'><hr></hr></div>
                                <div className="createnewcustomer">
                                    <button type="button" className="btn btn-primary total_checkout btn-wd pt-3 pb-3" onClick={() => this.clearCache()}>Clear Cache</button>
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
    return {};
}
const connectedGeneralSetting = connect(mapStateToProps)(GeneralSetting);
export { connectedGeneralSetting as GeneralSetting };
