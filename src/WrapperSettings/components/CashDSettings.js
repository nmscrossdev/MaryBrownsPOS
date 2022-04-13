import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {removeActiveCss,showSelected} from '../CommonWork';
class CashDSettings extends React.Component {
    openCashDrawer()
    {
        if(typeof Android !== "undefined" && Android !== null) {    
            Android.openCahsDrawer()
        }
    }
    componentDidMount() {
       
        let sd=localStorage.getItem('selected_drawer');
        if(sd)
        {
            showSelected('select-drawer',sd)
        }
       
    }
    selectOpenCashDrawer(val)
    {
        localStorage.setItem('selected_drawer',val);
        removeActiveCss('select-drawer')
    }
    render() {
        return (
            <div id="cdrawer-setting" className="tab-pane fade in active">
                <div className="panel panel-custmer">
                    <div className="panel-default pt-2">
                        <div className="panel-body customer_history p-0">
                            <form className="clearfix form_editinfo connection-setting">
                                

                            <div className="card-body no-padding overflowscroll pgsectionfilter">
                                <div className="card-body-content mb-0">
                                    <h6 className="card-title">Cash Drawer Open settings</h6>
                                    <div className="card-wrap">
                                            
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.selectOpenCashDrawer('every-sale')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none select-drawer pl-3 pr-3" data-value="every-sale">
                                            <input type="radio" name="optcashdrawer"/>Every sale
                                        </label>
                                    </div>
                                    <div  className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() =>  this.selectOpenCashDrawer('cash-only')}>
                                        <label className="btn ol-outline-primary btn-sm shadow-none select-drawer pl-3 pr-3" data-value="cash-only">
                                            <input type="radio" name="optcashdrawer" /> Cash Only
                                        </label>
                                    </div>
                                    </div>
                                </div>
                                <div className={ "card-body-content mb-0"}>
                                <div className='hr-w300'><hr></hr></div>
                                <div className="createnewcustomer">
                                    <button type="button" className="btn btn-primary total_checkout btn-wd pt-3 pb-3" onClick={() => this.openCashDrawer()}>{LocalizedLanguage.opencashdrawer}</button>
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
const connectedSettingGeneral = connect(mapStateToProps)(CashDSettings);
export { connectedSettingGeneral as CashDSettings };
