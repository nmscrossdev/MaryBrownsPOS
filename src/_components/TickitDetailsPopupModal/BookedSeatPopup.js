import React from 'react';
import { connect } from 'react-redux';
import { LoadingModal } from '../LoadingModal';
import { cartProductActions } from  '../../_actions/cartProduct.action';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class BookedSeatPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = { }
    }

    closePopup() {
        var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        var alreadyBookedSeat =  localStorage.getItem('BOOKED_SEATS') ? JSON.parse(localStorage.getItem('BOOKED_SEATS')) : [];
        var updateSeats = "";
        if(tikeraSelectedSeats.length > 0){
            tikeraSelectedSeats.length > 0 && tikeraSelectedSeats.map(item => {
                if(item.seat_check == "true"){
                  updateSeats = alreadyBookedSeat.find(Items=>Items.chart_id == item.chart_id && Items.product_id == item.product_id && Items.seat_id == item.seat_id)
                 if(updateSeats){
                    item['seat_check'] = "false";
                  } 
                }
            })
            localStorage.setItem('TIKERA_SELECTED_SEATS', JSON.stringify(tikeraSelectedSeats))
            localStorage.removeItem('RESERVED_SEATS');
            localStorage.removeItem("BOOKED_SEATS");  
            localStorage.removeItem("CHECKLIST");
        }
       this.props.dispatch(cartProductActions.bookedSeats("false"))
    }


    render() {
        const { booked_seats } = this.props;
        var bookedSeats = booked_seats ? booked_seats : localStorage.getItem("BOOKED_SEATS")?JSON.parse(localStorage.getItem("BOOKED_SEATS")):null;
        var remove_seat_list = []
        if(booked_seats && booked_seats!== "false" && bookedSeats!== null){
            bookedSeats.map(seat=>{
                remove_seat_list.push(seat.Title+`(${LocalizedLanguage.alreadyBookTicket} (${seat.seat_id}))`); 
            })
              
        }
        return (
            <div id="booked_seat" className="modal modal-wide modal-wide1 fade">
                {/* {bookedSeats == null ?<LoadingModal/>:""} */}
                <div className="modal-dialog" id="dialog-midle-align">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button onClick={() => this.closePopup()} type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                <img src="../assets/img/delete-icon.png" />
                            </button>
                            <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                        </div>
                        <div className="modal-body p-0">
                            {remove_seat_list.length > 0 &&
                                <div>
                                    <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.alreadyBookTicketMsg}</h3>

                                    <h5 id="epos_error_model_message" style={{ padding: 5 }} className="popup_payment_error_msg">
                                        {remove_seat_list.map(name => {
                                            return (
                                                name + ", "
                                            )
                                        })}
                                    </h5>
                                </div>
                               }
                        </div>
                        <div className="modal-footer p-0">
                            <button onClick={() => this.closePopup()} type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { booked_seats } = state;
    return {
        booked_seats: booked_seats.items,
    };
}
const connectedBookedSeatPopup = connect(mapStateToProps)(BookedSeatPopup);
export { connectedBookedSeatPopup as BookedSeatPopup };