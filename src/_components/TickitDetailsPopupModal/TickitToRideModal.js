/*
    Created By   : Shakuntala Jatav
    Created Date : 10-06-2019
    Description  : show book ticket is available when offer for user.
    
    Updated By   :
    Updated Date :
    Description :    
    */

import React from 'react';
import { connect } from 'react-redux';
import { LoadingModal } from '../LoadingModal';
import { cartProductActions } from '../../_actions/cartProduct.action';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import { myFunction } from '../../_components/TickitDetailsPopupModal/TickeraSeatFunction'

class TickitToRideModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: false,
            description: `<div class="row">
               <div class="col-sm-6">
                 <div data-report-id="report-1">
                   A React component for report-1
                 </div>
               </div>
               <div class="col-sm-6">
                 <div data-report-id="report-2">
                   A React component for report-2 
                 </div>
               </div>
             </div>`,
            formDetail: [],
            status: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        var tikera_seat_chart = JSON.parse(localStorage.getItem("TIKERA_SEAT_CHART"));
        if (tikeraSelectedSeats.length > 0) {
            tikeraSelectedSeats.map(items => {
                var checkFormIsAvailable = tikera_seat_chart && tikera_seat_chart.find(check => check.chart_id == items.chart_id && check.seat_id == items.seat_id);
                if (checkFormIsAvailable) {
                    items['seat_check'] = items.seat_check == "true" ? "false" : "true";
                    tikeraSelectedSeats.push(items);
                } else {
                    tikera_seat_chart && tikera_seat_chart.map(Items => {
                        if (Items.seat_check == "true") {
                            tikeraSelectedSeats.push(Items);
                        }
                    })
                }
            })

        } else {
            tikera_seat_chart && tikera_seat_chart.map(Items => {
                if (Items.seat_check == "true") {
                    tikeraSelectedSeats.push(Items);
                }
            })
        }

        var objArr = tikeraSelectedSeats.reduce((acc, cur) => [
            ...acc.filter((obj) => (obj.chart_id == cur.chart_id || obj.chart_id !== cur.chart_id) && obj.seat_id !== cur.seat_id), cur
        ], []);
        localStorage.setItem('TIKERA_SELECTED_SEATS', JSON.stringify(objArr));
        localStorage.removeItem("TIKERA_SEAT_CHART");
        $('#ticket_to_ride').modal('hide');
        const { dispatch } = this.props;
        dispatch(cartProductActions.getTicketSeatForm(false));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.form_ticket_seating) {
            this.setState({ isloading: true })
            setTimeout(function () {
                this.appendData();
            }.bind(this), 500)
        }

        if (nextProps.reserved_tikera_seat) {
            this.setState({ isloading: false })
        }
    }

    appendFormId() {
        const { formDetail, status } = this.state;

        setTimeout(function () {
            formDetail.map(form => {
                var chart_id = form.id;
                $(`div.form-data-${chart_id}`).find("span.tc_seat_unit").attr("data-chart-id", `${chart_id}`);
            })

        }.bind(this), 500)
    }

    // add onClick handler for the tickera seats and call myFunction()
    setTickeraOnclick() {
        var elem = $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit")
        $(elem).off('click').on('click',function (e) {
            e.preventDefault();
            var val = $(this)[0]
            myFunction(val)
        })
    }

    appendData() {
        var formDetails = [];
        var default_reserved_seats = [];
        const { form_ticket_seating, Ticket_Detail, reserved_tikera_seat } = this.props;
        formDetails = JSON.parse(form_ticket_seating.Searialize_detail);
        this.setState({
            formDetail: formDetails,
            status: true
        })
        var default_seat_color = Ticket_Detail.tcForSeating && Ticket_Detail.tcForSeating._seat_color;
        if (reserved_tikera_seat) {
            default_reserved_seats = reserved_tikera_seat;
        }

        localStorage.setItem("DEFAULT_SEAT_COLOR", default_seat_color);
        // $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit").attr("onclick", 'myFunction(this)');
        $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit")
        $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit").attr("data-event-id", `${Ticket_Detail.tick_event_id}`);
        $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit").attr("data-product-id", `${Ticket_Detail.product_id}`);
        $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit").css("background-color", `${default_seat_color}`);
        $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit").attr("data-chart-id", `${formDetails.id}`);
        $("div .tc-group-content.ui-selectable").find("div.tc-seat-row").find("span.tc_seat_unit").attr("data-quantity", `${Ticket_Detail.quantity}`);
    //    call setTicketOnclikc function
        this.setTickeraOnclick();
        var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        if (tikeraSelectedSeats.length > 0) {
            var tikeraSeatChart = new Array();
            tikeraSelectedSeats.map(items => {
                if (parseInt(items.chart_id) == parseInt(formDetails.id) && items.seat_check == "true") {
                    //rgb(65, 135, 201) blue
                    // rgb(220, 203, 203) light brown 
                    $(`#${items.seat_id}`).css("background-color", "rgb(65, 135, 201)");
                    $(`#${items.seat_id}`).attr("data-checked", "true");
                    tikeraSeatChart.push(items)
                }
            })
            $('#counter').text(tikeraSeatChart.length);
            localStorage.setItem("TIKERA_SEAT_CHART", JSON.stringify(tikeraSeatChart));
        }

        if (default_reserved_seats && default_reserved_seats.length > 0) {

            default_reserved_seats.map(reserveColor => {
                $(`#${reserveColor}`).css("background-color", "rgb(220, 203, 203)");
            })
        }
    }

    closeModal() {
        localStorage.removeItem("TIKERA_SEAT_CHART");
        this.setState({ formDetail: [] })
        const { dispatch } = this.props;
        dispatch(cartProductActions.getTicketSeatForm(false));
        dispatch(cartProductActions.getReservedTikeraChartSeat(0));
    }

    render() {
        const { Ticket_Detail } = this.props;
        const { isloading, formDetail, status } = this.state;
        const available_seat_color = Ticket_Detail && Ticket_Detail.tcForSeating && Ticket_Detail.tcForSeating._seat_color;
        const select_seat_qty = Ticket_Detail && Ticket_Detail.quantity;
        const default_seat_color = { backgroundColor: `${available_seat_color}`, borderColor: `${available_seat_color}` }
        return (
            (isMobileOnly == true) ?
                <div>
                    {/* <!-- App Header --> */}
                    <div className="appHeader">
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-center position-relative">
                                {LocalizedLanguage.ticketToRideTitle}
                                <a className="position-absolute left-0" onClick={() => this.props.openModal("view_cart")}>
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* <!-- App Content --> */}
                    <div className="appCapsule vh-100 overflow-auto" style={{ paddingBottom: 80 }}>
                        <div className="py-3 bg-light container-fluid">
                            <div className="row">
                                <div className="col-12 col-sm-12">
                                    <h6 className="font-weight-bold fz-16">{LocalizedLanguage.bookingDetail} </h6>
                                    <ul className="list-group list-group-flush record-list">
                                        {/* <li className="list-group-item fz-15">{LocalizedLanguage.selectedSeat} (0) :</li> */}
                                        <li className="list-group-item fz-15">{LocalizedLanguage.selectedSeat} (<span id="counter">0</span>)</li>
                                        <li className="list-group-item fz-15">{LocalizedLanguage.total}: ${select_seat_qty}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-6 col-sm-7">
                                    <ul className="ticket_list">
                                        <li className="d-flex align-items-center fz-13">
                                            <div className="ticket_circle" style={{ backgroundColor: 'rgb(237, 0, 237)' }}></div>
                                            $20.23 - Event 2 Ticket </li>
                                        <li className="d-flex align-items-center fz-13">
                                            <div className="ticket_circle" style={{ backgroundColor: 'rgb(220, 203, 203)' }}></div> {LocalizedLanguage.bookedSeat} </li>
                                        <li className="d-flex align-items-center fz-13">
                                            <div className="ticket_circle"></div> {LocalizedLanguage.economyClass}</li>
                                    </ul>
                                </div>
                                {/* <div className="col-6 col-sm-5">
                                               <div className="numbers-row">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <button className="btn p-0 shadow-none pointer dec btnincdec" type="button" id="button-addon1">
                                                    <img src="../mobileAssets/img/minus.png" />
                                                </button>
                                            </div>
                                            <input type="text" className="form-control border-0 shadow-none text-center h-40 transparent" placeholder="Qty." value="2" />
                                            <div className="input-group-prepend">
                                                <button className="btn p-0 shadow-none pointer inc btnincdec" type="button" id="button-addon1" value="+">
                                                    <img src="../mobileAssets/img/plus.png" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                            </div> */}

                            </div>
                        </div>
                        {/* <div className="container-fluid pt-3"> */}
                        <div className="row" style={{ textAlign: 'center' }}>
                            <div className="col-sm-12">
                                <form className="form-addon-medium" autoComplete="on">
                                    {formDetail && formDetail.chart_data ?
                                        <div id="seat-map" className="d-inline-block" dangerouslySetInnerHTML={{ __html: formDetail.chart_data }} />
                                        :
                                        <div id="seat-map" className="d-inline-block" dangerouslySetInnerHTML={{ __html: this.state.description }} />
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <!-- App Footer --> */}
                    <div className="appBottomMenu appBottomCustomerButton" onClick={this.handleSubmit}>
                        <button className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.checkout}</button>
                    </div>
                </div>
                :
                <div id="ticket_to_ride" tabIndex="-1" className="modal modal-wide fade md-full-height">
                    {/* {isloading == true ? <LoadingModal /> : ''} */}
                    <div className="modal-dialog" style={{ width: '80%' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => this.closeModal()} >
                                    <img src="assets/img/Close.svg" />
                                </button>
                                <h5 className="modal-title">{LocalizedLanguage.ticketToRideTitle}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="seatCharts-container-main">
                                    <div className="container">
                                        <div className="row no-gutters">
                                            <div className="col-sm-9">
                                                <div className="bg-white p-3 d-inline-block">
                                                    <div className="booking-details">
                                                        <h2>{LocalizedLanguage.bookingDetail}</h2>
                                                        <h3> {LocalizedLanguage.selectedSeat} (<span id="counter">0</span>):</h3>
                                                        <ul id="selected-seats">
                                                        </ul>
                                                        {LocalizedLanguage.total}: <b>$<span id="total">{select_seat_qty}</span></b>
                                                        <div id="legend" className="seatCharts-legend">
                                                            <ul className="seatCharts-legendList">
                                                                <li className="seatCharts-legendItem">
                                                                    <div style={default_seat_color} className="seatCharts-seat seatCharts-cell available first-className"></div>
                                                                    <span className="seatCharts-legendDescription">$20.23 - Event 2 Ticket</span>
                                                                </li>
                                                                <li className="seatCharts-legendItem">
                                                                    <div className="seatCharts-seat seatCharts-cell unavailable first-className"></div>
                                                                    <span className="seatCharts-legendDescription">{LocalizedLanguage.bookedSeat}</span>
                                                                </li>
                                                                <li className="seatCharts-legendItem">
                                                                    <div className="seatCharts-seat seatCharts-cell incart"></div>
                                                                    <span className="seatCharts-legendDescription">{LocalizedLanguage.economyClass}</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3">
                                                <div className="minus-plus-group">
                                                    <div className="btn-group btn-group-justified" role="group" aria-label="...">
                                                        <div className="btn-group" role="group">
                                                            <a className="btn btn-default bd-r h_eight70 btn-plus">
                                                                <button className="icon icon-plus button"></button>
                                                            </a>
                                                        </div>
                                                        <div className="btn-group" role="group">
                                                            <a className="btn btn-default h_eight70 btn-plus">
                                                                <button className="icon icon-minus button"></button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 text-center">
                                                {formDetail && formDetail.chart_data ?
                                                    <div id="seat-map" className="d-inline-block" dangerouslySetInnerHTML={{ __html: formDetail.chart_data }} />
                                                    :
                                                    <div id="seat-map" className="d-inline-block" dangerouslySetInnerHTML={{ __html: this.state.description }} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bt-0">
                                <button type="button" onClick={this.handleSubmit} className="btn btn-primary checkout-button d-inline-block m-0 round-8">{LocalizedLanguage.checkout}</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { form_ticket_seating, reserved_tikera_seat } = state;
    return {
        form_ticket_seating: form_ticket_seating.items,
        reserved_tikera_seat: reserved_tikera_seat.items
    };
}

const connectedTickitToRideModal = connect(mapStateToProps)(TickitToRideModal);
export { connectedTickitToRideModal as TickitToRideModal };