import React from 'react';
class MobileSettingView extends React.Component {
constructor(props) {
    super(props);
        }
        launch_oliver()
        {
            var urlParam = this.props.location.search;
            if(urlParam && typeof urlParam!="undefined")
            {
                var splParam = urlParam.replace("?", "");
                window.location = splParam;
            }
        }
    render(){   
    const { NavbarPage, CommonHeader } = this.props;
    return (
    <div>
        <CommonHeader {...this.props} />
        {localStorage.getItem('register')? <NavbarPage {...this.props} /> :null}
        <div className="appCapsule h-100 overflow-auto" /*style={"padding-bottom: 0px;"}*/>
        <div className="container-fluid p-0">
            <div className="row no-gutters">
                <div className="col-sm-12">
                    <ul className="list-group list-group-flush userList">
                        <li className="list-group-item pointer border-bottom">
                            <div className="loginuser3" onClick={this.props.showPrinterSetting}>
                                <div className="d-inline-flex align-items-center">
                                    <h6 >Printer Settings</h6>
                                </div>
                                <img src="/mobileAssets/img/next.svg" alt="" className="w-20"/>
                            </div>
                        </li>
                        {/* <li className={ "card-body-content mb-0"}>
                            <hr className='mt-0 mb-20'></hr>
                            <button type="button" className="btn btn-primary btn-block rounded-0 h-50-pxi shadow-none fz-20" onClick={() => this.launch_oliver()}>Continue</button>
                            </li> */}

                    </ul>
                    <div className={ "card-body-content mb-0"}>
                        <button type="button" className="btn btn-primary btn-block rounded-0 h-50-pxi shadow-none fz-20" onClick={() => this.launch_oliver()}>Continue</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    )
    }
}
export default MobileSettingView;

