import React from 'react';
import { connect } from 'react-redux';
import { CommonHeader } from '../_components/CommonHeader';
import { NavbarPage } from '../_components/NavbarPage';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { get_UDid } from '../ALL_localstorage';
import { cashManagementAction } from './actions/cashManagement.action';
import moment from 'moment';
import Config from '../Config';
import { LoadingModal } from '../_components/LoadingModal';
import { default as NumberFormat } from 'react-number-format';
import { CashDrawerPaymentDetail } from './components/CashDrawerPaymentDetail'
import { history } from '../_helpers';
import { OpeningFloatPopup } from '../CashManagementPage/components/OpeningFloatPopup';
import { CloseRegisterPopupTwo } from '../CashManagementPage/components/CloseRegisterPopupTwo'

import { AddRemoveCashPopup } from './components/AddRemoveCashPopup'
import { refreshToggle } from '../_components/CommonFunction'
import $ from 'jquery';
import { CommonDemoShopButton } from '../_components/CommonDemoShopButton';
import { OnBoardingAllModal } from '../onboarding';
import { trackPage } from '../_components/SegmentAnalytic'

import ActiveUser from '../settings/ActiveUser';
import { onBackTOLoginBtnClick } from '../_components/CommonJS';
import { OnboardingShopViewPopup } from '../onboarding/components/OnboardingShopViewPopup';


class CashManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: history.location.state ? 0 : '',
            // cashSummery:null,
            cashDetail: null,
            isCashDrawerOpen: false,
        }
        //   //Geting cash Summary---------------------------------------   
        var registerId = localStorage.getItem('register');
        this.props.dispatch(cashManagementAction.cashRecords(registerId, 1000, 1));
        this.getCashDrawerPaymentDetail = this.getCashDrawerPaymentDetail.bind(this);
    }

    componentDidMount() {
        trackPage(history.location.pathname, "CashDrawer", "CashManagement", "CashManagement");
        refreshToggle();
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
            hideModal('CloseRegister');
        }, 1000);
        const { dispatch } = this.props;
        var udid = get_UDid('UDID');
        var registerId = localStorage.getItem('register');
        if (this.state.recordsFirstId) {
            this.getCashDrawerPaymentDetail(this.state.recordsFirstId);
            this.state.active = 0;
        }
        /**
         *  Created By:aman 
         * Created Date:22/07/2020
         * Description : for automatically show the toggle open, when clicking cross button of close register popup.   
         */
        $('#closeRegister').on('click', function () {
            $('.flat-toggle.cm-flat-toggle').addClass("on");
            $('.cm-user-switcher .flat-toggle').find("span").addClass('open');
            $('.cm-user-switcher .flat-toggle').find("span").removeClass('close');
        });
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp && nextProp.cashRecords && nextProp.cashRecords.cashRecord && nextProp.cashRecords.cashRecord.length > 0) {
            var _RecordArray = nextProp.cashRecords && nextProp.cashRecords.cashRecord ? nextProp.cashRecords.cashRecord : [];
            var firstRecordId = _RecordArray && _RecordArray.length > 0 ? _RecordArray[0].Id : '';
            this.setState({ cashAllRecords: _RecordArray })
            if (this.state.recordsFirstId !== firstRecordId) {
                this.state.recordsFirstId = firstRecordId;
                this.getCashDrawerPaymentDetail(this.state.recordsFirstId, 0);
            }
        }
        if (nextProp && nextProp.cashDetails && nextProp.cashDetails) {

            this.setState({ "cashDetail": nextProp.cashDetails })
            if (nextProp.cashDetails.cashDetail && nextProp.cashDetails.cashDetail.content) {
                this.state.isCashDrawerOpen = (nextProp.cashDetails.cashDetail.content.Status.toLowerCase() == 'open') ? true : false;
            }
        }
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 1000);
    }

    getCashDrawerPaymentDetail(Id, index) {
        Id && this.props.dispatch(cashManagementAction.getDetails(Id));
        // this.setState({activeCashItem : index});
        this.state.active = index;
    }

    /** 
     * Created By: Aman Singhai
     *  created Date: 08/07/2020
     *  Decription: For adding and removing cash
    */
    addRemoveCash = () => {
        showModal('AddRemoveCash');
    }

    render() {
        const { cashRecords, cashDrawerBalance, cashDetails } = this.props;
        var _RecordArray = cashRecords && cashRecords.cashRecord ? cashRecords.cashRecord : [];
        var _balance = 0;
        if (this.state.cashDetail && this.state.cashDetail.cashDetail && this.state.cashDetail.cashDetail.content) {
            if (this.state.cashDetail.cashDetail.content.Status == "Close")
                _balance = this.state.cashDetail.cashDetail.content.Actual;
            else
                _balance = this.state.cashDetail.cashDetail.content.Expected;
        }
        var openingBal = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.OpeningBalance : 0.00;
        var userName = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.SalePersonName : '';
        var openingNote = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.OpeningNotes : '';
        var openTime = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.OpenTime : '';
        var openDate = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.DateUtc : '';
        var openDateTime = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.UtcOpenDateTime : "";
        var _openDateTime = moment.utc(openDateTime).local().format(Config.key.TIMEDATE_FORMAT);
        
        var closeDateTime = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.UtcClosedDateTime : "";
        var _closeDateTime = moment.utc(closeDateTime).local().format(Config.key.TIMEDATE_FORMAT);
        var closingExpectedBal = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.Expected : 0.00;
        var closingActualBal = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.Actual : 0.00;
        var closingNote = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.ClosingNotes : '';
        var iscashDrawerClosed = cashDetails && cashDetails.cashDetail && cashDetails.cashDetail.content ? cashDetails.cashDetail.content.isClosed : false;
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        return (
            <div>
                <div className="wrapper">
                    <div className="overlay"></div>
                    <NavbarPage {...this.props} />
                    <div id="content">
                        <CommonHeader {...this.props} />
                        <div className="inner_content bg-light-white clearfix">
                            {_RecordArray == '' ? <LoadingModal /> :
                                <div className="content_wrapper">
                                    <div className="col-xs-5 col-sm-3 p-0">
                                        <div className="card card-custom">
                                            <div className={isDemoUser ? "card card-inner pg-cmanagement-list pg-cmanagement-list-if_footer" : "card card-inner pg-cmanagement-list"}>
                                                {/* <div className="card card-inner pg-cmanagement-list"> */}
                                                <div className="card-body no-padding overflowscroll" style={{ height: 250 }}>
                                                    <div className="Checkout_activity">
                                                        <div className="widget_day_record">
                                                            <table className="table table-customise table-day-record fixed-table-cell">
                                                                <tbody>
                                                                    {_RecordArray && _RecordArray.length > 0 ?
                                                                        _RecordArray.map((item, index) => {
                                                                            var current_date = moment().format(Config.key.DATE_FORMAT);
                                                                            var time = moment.utc(!item.ClosedTime?item.LogDate:item.ModifyDateTimeUtc).local().format(Config.key.DATE_FORMAT);
                                                                            var activeFirstRecord = this.state.active == index ? 'table-primary-label' : '';
                                                                            return (<tr key={index} className={"widget_day_record_text" + activeFirstRecord ? activeFirstRecord : ''} style={{ cursor: "pointer" }} onClick={() => this.getCashDrawerPaymentDetail(item.Id, index)}>
                                                                                <td>
                                                                                    <div className="widget_day_record_text">
                                                                                        <h6>{time == current_date ? "Today" : time}</h6>
                                                                                        <p className="text-truncate">{item.SalePersonName}</p>
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div className="widget_day_record_text text-right">
                                                                                        {!item.ClosedTime ? "OPEN" : "Closed " + item.ClosedTime}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            );
                                                                        })
                                                                        : <tr><td colSpan="2"><div className="widget_day_record_text">
                                                                            <h6></h6>
                                                                            <p className="text-truncate">{LocalizedLanguage.noRecord}</p>
                                                                        </div></td>
                                                                        </tr>
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-7 col-sm-9">
                                        <div className="padding-content">
                                            <div className="checkoutlistdetails">
                                                <div className="checkoutActivityDetails section-customer-tab">
                                                    <div className={isDemoUser ? "card cash_drawer_balance cash_drawer_balance-if_footer" : "card cash_drawer_balance"}>
                                                        {/* <div className="card cash_drawer_balance"> */}
                                                        <div className="card-header d-flex space-between align-items-center border-bottom-0">
                                                            <div className="widget_day_record">
                                                                <div className="widget_day_record_text">
                                                                    <h6>
                                                                        {LocalizedLanguage.Cashdrawerbalance}
                                                                    </h6>
                                                                    <p><NumberFormat value={_balance} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></p>
                                                                </div>
                                                            </div>
                                                            {
                                                                this.state.isCashDrawerOpen == true && <div className="radio--custom radio-default">
                                                                    <input type="radio" id="radio-12" name="radio-group" onClick={this.addRemoveCash} />
                                                                    <label htmlFor="radio-12" className="spacer-x-10">{LocalizedLanguage.addRemoveCash}</label>
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="card-body overflow-auto overflowscroll">
                                                            <div className="timeline timeline-3">
                                                                <div className="timeline-items">

                                                                    {/* show closing float */}
                                                                    {iscashDrawerClosed == true ? <div className="timeline-item timeline-item--clean" >
                                                                        <div className="timeline-media">
                                                                            <span className="kt-notes__circle"></span>
                                                                        </div>
                                                                        <div className="timeline-content pl-0 pt-0">
                                                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                                                <div className="mr-2">
                                                                                    <a href="#" className="text-dark-75 text-hover-primary ">
                                                                                        {'Closing Float'}
                                                                                    </a>
                                                                                    <span className="text-muted ml-2 pl-3">
                                                                                        {_closeDateTime}
                                                                                    </span>
                                                                                    <span className="label label-light-danger er label-inline ml-2">pending</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex space-between">
                                                                                <div>
                                                                                    <p className="p-0">
                                                                                        <span>{'Closing Balance'} :  
                                                                                        </span> 
                                                                                        <span> Actual: </span> <NumberFormat value={closingActualBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                        <span> Expected: </span> <NumberFormat value={closingExpectedBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                    </p>
                                                                                    <p className="p-0">
                                                                                        <span>{LocalizedLanguage.user} :</span>  {userName}
                                                                                    </p>

                                                                                    {/* Closing notes */}
                                                                                    {closingNote && closingNote !== "" ?
                                                                                        <p className="p-0">
                                                                                            <span>{LocalizedLanguage.note} :</span>  {closingNote}
                                                                                        </p>
                                                                                        : null}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                        : null}

                                                                    < CashDrawerPaymentDetail getCashDrawerPaymentDetail={this.state.cashDetail}
                                                                        {...this.props}
                                                                    />
                                                                    <div className="timeline-item timeline-item--clean" >
                                                                        <div className="timeline-media">
                                                                            <span className="kt-notes__circle"></span>
                                                                        </div>
                                                                        <div className="timeline-content pl-0 pt-0">
                                                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                                                <div className="mr-2">
                                                                                    <a href="#" className="text-dark-75 text-hover-primary ">
                                                                                        {LocalizedLanguage.initialfloat}
                                                                                    </a>
                                                                                    <span className="text-muted ml-2 pl-3">
                                                                                        {_openDateTime}
                                                                                    </span>
                                                                                    <span className="label label-light-danger er label-inline ml-2">pending</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex space-between">
                                                                                <div>
                                                                                    <p className="p-0">
                                                                                        <span>{LocalizedLanguage.openingBalacce} : </span> <NumberFormat value={openingBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                    </p>
                                                                                    <p className="p-0">
                                                                                        <span>{LocalizedLanguage.user} :</span>  {userName}
                                                                                    </p>
                                                                                    {/* opening notes */}
                                                                                    {openingNote && openingNote !== "" ?
                                                                                        <p className="p-0">
                                                                                            <span>{LocalizedLanguage.note} :</span>  {openingNote}
                                                                                        </p>
                                                                                        : null}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {/* add connect your shop button for guest user */}
                        {isDemoUser && (isDemoUser == 'true' || isDemoUser == true) &&
                            <CommonDemoShopButton />
                        }
                    </div>

                </div>

                <OpeningFloatPopup />
                <CloseRegisterPopupTwo />
                <OnBoardingAllModal />
                <OnboardingShopViewPopup
                    title={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_TITLE}
                    subTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE}
                    subTitle2={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE_TWO}
                    onClickContinue={onBackTOLoginBtnClick}
                    imageSrc={''}
                    btnTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_BUTTON_TITLE}
                    id={'firebaseRegisterAlreadyusedPopup'}
                />


                <AddRemoveCashPopup drawerBalance={_balance}
                    refreshDetail={this.getCashDrawerPaymentDetail}
                    activeIndex={this.state.active} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { cashRecords, cashDetails } = state;//cashDrawerBalance  ,cashSummery
    return {
        cashRecords: cashRecords,
        //  cashDrawerBalance: cashDrawerBalance,
        cashDetails: cashDetails
        // ,
        // cashSummery:cashSummery
    };
}
const connectedCashManagement = connect(mapStateToProps)(CashManagement);
export { connectedCashManagement as CashManagement };