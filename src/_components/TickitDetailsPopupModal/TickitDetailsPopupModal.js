import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../../_actions/cartProduct.action';
import { Tickit_Create } from '../../_components/TickitDetailsPopupModal/components/Tickit_Create';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class TickitDetailsPopupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      productid: '',
      formData: [],
      Input_field: [],
      ticket_View: '',
      validation_array: [],
      getSetting: localStorage.getItem('TickeraSetting') && typeof(localStorage.getItem('TickeraSetting')) !=='undefined' && localStorage.getItem('TickeraSetting') !=='undefined' ? JSON.parse(localStorage.getItem('TickeraSetting')) : '',
      seatingStatus: false,
      reserveStatus: true,
    }
    this.addTickettoCart = this.addTickettoCart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.InputClick = this.InputClick.bind(this);

  }

  handleChange(e) {
    var name = e.target.value
    this.setState({ selectedValue: name })
  }

  onChange(e) {
    this.setState({ full_name: e.target.value })
  }

  paytype(item) {
    this.setState({ SelectedAddon: item })
  }

  componentWillReceiveProps(nextprops) {
    const { Ticket_Detail, form_ticket_seating } = nextprops;
    var ticket_form = new Array();
    if (Ticket_Detail && Ticket_Detail == '') {
      this.setState({ formData: [] })
    }
    if (Ticket_Detail && Ticket_Detail != '') {
      this.setState({
        productid: Ticket_Detail.product_id,
        ticket_View: Ticket_Detail.ticket_info ? Ticket_Detail.ticket_info : '',
        variation_id: Ticket_Detail.variation_id

      })

      for (var ticket_num = 0; ticket_num < Ticket_Detail.quantity; ticket_num++) {
        var tickfield = Ticket_Detail.product_ticket.fields
        ticket_form.push(Ticket_Detail.product_ticket.fields)
        this.setState({
          Input_field: ticket_form,
          form_title: Ticket_Detail.product_ticket.title,
          formData: []
        })

      }
    }
    localStorage.setItem('selectProduct', JSON.stringify(ticket_form))
    if (form_ticket_seating) {
      this.setState({ seatingStatus: false })
      var Id = form_ticket_seating.Searialize_detail && JSON.parse(form_ticket_seating.Searialize_detail);

      if (this.state.reserveStatus == true) {
        this.state.reserveStatus = false
        this.setState({ reserveStatus: false })
        this.props.dispatch(cartProductActions.getReservedTikeraChartSeat(Id.id));
      }
      $('#counter').text('0');
      if (isMobileOnly == true) {
        this.props.openModal("ticket_ride_modal");
      } else {
        $('#ticket_to_ride').modal('show');
      }

    }
  }

  checKValidation() {
    const { formData, ticket_View, Input_field, getSetting } = this.state;
    var chechked;
    var fil1;
    var filter = formData;
    var armArr = [];
    var validation_array = [];
    //  //--check static fields------------------ 
    var staticField_value = ["first_name", "last_name", "owner_email"];
    var setting = getSetting
    var staticField = staticField_value.filter(function (value, index, arr) {

      return value == "first_name" &&  setting  && ( setting.show_attendee_first_and_last_name_fields && setting.show_attendee_first_and_last_name_fields == "yes" ||
        value == "last_name" && setting.show_attendee_first_and_last_name_fields == "yes")
        || (setting  && (value == "owner_email" && setting.show_owner_email_field == "yes"));
    });

    staticField && staticField.map(staticItem => {
      var found = false;
      var isStaticFieldEmpty = false;

      if (ticket_View == '' || ticket_View !== '' && Input_field.length > 0 && ticket_View.length !== Input_field.length) {
        filter && filter.map((field_value, field_index) => {
          var field_data = field_value.newArr ? field_value.newArr : field_value;
          field_data.map(val => {
            for (name in val) {
              if (val.hasOwnProperty(name)) {
                if (staticItem === name) {
                  found == true;
                  if (val[name] !== "") {
                    isStaticFieldEmpty = true;
                  }
                }
              }
            }
          })
        })
      } else if (ticket_View !== '' && Input_field.length > 0 && ticket_View.length == Input_field.length) {
        var check_validation;
        filter && filter.map(edit_field => {
          var field_data = edit_field.newArr ? edit_field.newArr : edit_field;
          ticket_View.map((item, itms_index) => {
            for (var name in item) {
              field_data.map((val, editIndex) => {
                for (var key in val) {
                  if (name == key) {
                    if (staticItem == key) {
                      check_validation = false
                      if (val[key] !== '') {
                        check_validation = true
                      }
                    }
                  }
                }
              })
            }
          })
        })
        isStaticFieldEmpty = ticket_View && filter.length == 0 ? true : check_validation
      }

      if (isStaticFieldEmpty == false) {
        var CurrForm = { key: 0, title: staticItem }
        armArr.push(CurrForm);
      }
    })

    Input_field && Input_field.map((item, inputIndex) => {
      item && item.map(checkfield => {
        var field_info = JSON.parse(checkfield.field_info)
        if (field_info.is_required == true) {
          var remove_special_charac = field_info.title.split('?')[0]
          var title = remove_special_charac.replace(/ /g, "_");
          var isExist = false;
          if (ticket_View == '' || ticket_View !== '' && Input_field.length > 0 && ticket_View.length !== Input_field.length) {
            var Existdata;
            ticket_View && ticket_View.find(function (elem, index) {
              var newArr = []
              for (var key_ele in elem) {
                newArr.push({ [key_ele]: elem[key_ele] })
                Existdata = { key: index, newArr }
              }
              if (Existdata) {
                filter.push(Existdata)
              }
            })
            const filteredArr = Existdata && filter.reduce((acc, current) => {
              const x = acc.find(item => item.key === current.key);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            var num = filteredArr && filteredArr.sort((a, b) => a.key - b.key)
            var _finalFilter = filteredArr ? filteredArr : filter
            _finalFilter && _finalFilter.map((field_value, field_index) => {
              var field_data = field_value.newArr ? field_value.newArr : field_value;
              field_data.filter(val => {
                for (name in val) {
                  if (val.hasOwnProperty(name)) {

                    var index_key = field_value.key ? field_value.key : field_index;
                    if (title === name && (val !== "") && index_key == inputIndex) {
                      return isExist = true;
                    }
                  }
                }
              })
            })
          } else if (ticket_View !== '' && Input_field.length > 0 && ticket_View.length == Input_field.length) {
            var check_validation;
            filter && filter.map(edit_field => {
              var field_data = edit_field.newArr ? edit_field.newArr : edit_field;
              ticket_View.map((item, itms_index) => {
                for (var name in item) {

                  field_data.map((val, editIndex) => {
                    for (var key in val) {

                      if (name == key) {

                        if (title == key) {
                          check_validation = false
                          if (val[key] !== '') {

                            check_validation = true
                          }
                        }
                      }
                    }
                  })
                }
              })
            })
            isExist = ticket_View && filter.length == 0 ? true : check_validation
          }

          if (isExist === false) {
            validation_array.push(CurrForm)
            var CurrForm = { key: inputIndex, title: title }
            armArr.push(CurrForm);
          }
        }
      })
    })
    validation_array = armArr
    this.setState({ validation_array: armArr })
  }

  addTickettoCart(e) {
    const { dispatch, cartproductlist } = this.props;
    const { ticket_View, productid, variation_id, formData, getSetting, validation_array } = this.state;
    var cartlist = cartproductlist ? cartproductlist : [];
    var validation_check = this.checKValidation()
    var new_array = []
    cartlist.map((Crdprod, index) => {
      if (variation_id == 0 && productid == Crdprod.product_id || variation_id != 0 && variation_id == Crdprod.variation_id) {
        var ticketArr = ticket_View;
        var res = "";
        var isExist = false
        formData && formData.map((item, updatedTicketIndex) => {
          var tick_item = null
          var isExist = false
          if (ticket_View && ticket_View.length > 0 && ticket_View != null) {
            tick_item = ticket_View.find(function (element, index) {
              return index === item.key;
            });
            isExist = !tick_item ? true : tick_item == 'undefined' ? false : ''
          }
          if (tick_item) {
            for (var key in tick_item) {
              var name_key = key;
              var res = "";
              item && item.newArr.map((itm, index) => {
                var name = ""
                for (name in itm) {
                  if (itm.hasOwnProperty(name)) {
                    if (name_key == name) {
                      tick_item[name] = itm[name]
                    }
                    else {
                      tick_item[name] = itm[name]
                    }
                  }
                }
              })
            }
            new_array.push(tick_item)
          } else {
            var newData = item.newArr ? item.newArr : item;
            var res = "";
            newData && newData.map((itm, index) => {
              var name = ""
              for (name in itm) {
                if (itm.hasOwnProperty(name)) {
                  res += res !== "" ? (',"' + name + '":"' + itm[name]) + '"' : '"' + name + '":"' + itm[name] + '"';
                }
              }
            })
            var frmdataCollection = JSON.parse('{' + res + '}');
            new_array.push(frmdataCollection)
          }
        })

        if (ticketArr && new_array) {
          ticketArr.map((item, index) => {
            var tick_item = new_array.find(function (element, newIndex) {
              return item.first_name === element.first_name && item.last_name === element.last_name && item.owner_email === element.owner_email;
            })
            if (!tick_item) {
              new_array.push(item)
            }
          })
        }

        var customerDetails = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : ''
        getSetting.show_attendee_first_and_last_name_fields == "no" || getSetting.show_owner_email_field == "no" ? new_array.map((new_item, new_index) => {
          if (getSetting.show_attendee_first_and_last_name_fields == "no" && getSetting.show_owner_email_field == "no") {
            new_array[new_index].first_name = customerDetails && customerDetails.content.FirstName ? customerDetails.content.FirstName : '-';
            new_array[new_index].last_name = customerDetails && customerDetails.content.LastName ? customerDetails.content.LastName : '-';
            new_array[new_index].owner_email = customerDetails && customerDetails.content.Email ? customerDetails.content.Email : '-';

          } else if (getSetting.show_attendee_first_and_last_name_fields == "yes" && getSetting.show_owner_email_field == "no") {
            new_array[new_index].owner_email = customerDetails && customerDetails.content.Email ? customerDetails.content.Email : '-';

          } else if (getSetting.show_attendee_first_and_last_name_fields == "no" && getSetting.show_owner_email_field == "yes") {

            new_array[new_index].first_name = customerDetails && customerDetails.content.FirstName ? customerDetails.content.FirstName : '-';
            new_array[new_index].last_name = customerDetails && customerDetails.content.LastName ? customerDetails.content.LastName : '-';
          }

        }) : ''
        const filteredArr = new_array.reduce((acc, current) => {
          const x = acc.find(item => item === current);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        Crdprod['ticket_info'] = filteredArr;
      }
    })
    if (validation_array.length == 0 || validation_array == 'undefined') {
      $('#user_fname').val(null);
      $('#user_fname').val(null);
      $('#user_lname').val(null);
      dispatch(cartProductActions.addtoCartProduct(cartlist));
      $(".close").trigger("click");
      if (isMobileOnly == true && this.props.openModal) {
        this.props.openModal("view_cart")
      }
    }
  }

  InputClick(index, name, value) {
    const { ticket_View, formData } = this.state;
    if (ticket_View == '') {
      var armArr = formData;
      if (formData.length > 0) {
        var CurrForm = armArr.find(function (element, key) {
          return key === index;
        });
        if (CurrForm) {
          var frmcollection = CurrForm;
          var existFieldArr = frmcollection.find(function (element) {
            var data = Object.keys(element)
            return data[0] === name;
          });
          if (existFieldArr)
            existFieldArr[name] = value;
          else {
            frmcollection.push({ [name]: value })
          }
        }
        else {
          var newArr = [];
          newArr.push({ [name]: value })
          var CurrForm = newArr
          armArr.push(CurrForm);
        }
      }
      else {
        var newArr = [];
        newArr.push({ [name]: value })
        var CurrForm = newArr
        armArr.push(CurrForm);


      }
      this.setState({ formData: armArr });
    } else if (ticket_View != '') {
      var armArr = formData;
      if (formData.length > 0) {
        var CurrForm = armArr.find(function (element, key) {
          return element.key === index;
        });

        if (CurrForm) {
          var frmcollection = CurrForm;
          var existFieldArr = frmcollection.newArr.find(function (element) {
            var data = Object.keys(element)
            return data[0] === name;
          });
          if (!existFieldArr) {
            frmcollection.newArr.push({ [name]: value })
          } else { existFieldArr[name] = value };
        }
        else {
          var newArr = [];
          newArr.push({ [name]: value })
          var CurrForm = { key: index, newArr }
          armArr.push(CurrForm);
        }
      } else {
        var newArr = [];
        newArr.push({ [name]: value })
        var CurrForm = { key: index, newArr }
        armArr.push(CurrForm);
      }
      this.setState({ formData: armArr });
    }
  }

  close_Model() { }

  componentDidMount() { }

  openTicketRideModal(seat) {
    this.setState({
      seatingStatus: true,
      reserveStatus: true
    })
    var event_id = seat.tick_event_id;
    var product_id = seat.product_id;
    const { dispatch } = this.props;
    dispatch(cartProductActions.getTicketSeatForm(event_id, product_id));
  }
  /*
    Created By   : Shakuntala Jatav
    Created Date : 20-06-2019
    Description  : show popup for choose seats through the function call.

    Updated By   :
    Updated Date :
    Description :    
    */

  render() {
    const { Ticket_Detail } = this.props;
    const { ticket_View, Input_field, form_title, validation_array } = this.state;
    var Prosuct_ticket = localStorage.getItem('selectProduct') ? JSON.parse(localStorage.getItem('selectProduct')) : ''
    return (
      (isMobileOnly == true) ?
        <div>
          {/* <!-- App Header --> */}
          <div className="appHeader">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-12">
                  <a className="appHeaderBack" onClick={() => this.props.openModal("view_cart")}>
                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.cancel}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- App Content --> */}
          <div className="appCapsule vh-100" style={{ paddingBottom: 80 }}>
            <div className="h-100  overflow-auto scrollbar">
              <div className="cartContent w-100">
                {Ticket_Detail && Ticket_Detail.tcForSeating && Ticket_Detail.tcForSeating._tc_used_for_seatings == "yes" &&
                  <button type="button" className="btn btn-primary btn-block h66 round-4" onClick={() => this.openTicketRideModal(Ticket_Detail)} >{LocalizedLanguage.selectSeat}</button>
                }
                {Input_field && Input_field.map((field_Name, index) => {
                  var Tic_index = index + 1
                  return (
                    <div key={index}>
                      <Tickit_Create
                        Item={field_Name}
                        indexing={Tic_index}
                        real_index={index}
                        InputClick={this.InputClick}
                        id="input_blank"
                        id1="input_blank1"
                        ticket_View={Ticket_Detail.ticket_info && Ticket_Detail.ticket_info !== null ? Ticket_Detail.ticket_info : ''}
                        required_field={validation_array}
                        type={ticket_View == '' ? LocalizedLanguage.create : LocalizedLanguage.edit}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="appBottomAbove fixed-bottom-i">
              <button onClick={this.addTickettoCart.bind(this)} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.capitalSaveUpdate}</button>
            </div>
          </div>
        </div>

        :
        <div id="tickitDetails" tabIndex="-1" className="modal fade modal-wide">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"  >
                  <img src="assets/img/Close.svg" />
                </button>
                <h4 className="modal-title">{form_title ? form_title : ''}</h4>
              </div>
              <div className="modal-body" id="fullHeightPopup">
                {Ticket_Detail && Ticket_Detail.tcForSeating && Ticket_Detail.tcForSeating._tc_used_for_seatings == "yes" &&
                  <button type="button" className="btn btn-primary btn-block h66 round-4" onClick={() => this.openTicketRideModal(Ticket_Detail)} >{LocalizedLanguage.selectSeat}</button>
                }
                <form className="clearfix form_editinfo form_tickira">
                  <div className="tickira-panel">
                    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

                      {Input_field && Input_field.map((field_Name, index) => {
                        var Tic_index = index + 1
                        return (
                          <Tickit_Create
                            key={index}
                            Item={field_Name}
                            indexing={Tic_index}
                            real_index={index}
                            InputClick={this.InputClick}
                            id="input_blank"
                            id1="input_blank1"
                            ticket_View={Ticket_Detail.ticket_info && Ticket_Detail.ticket_info !== null ? Ticket_Detail.ticket_info : ''}
                            required_field={validation_array}
                            type={ticket_View == '' ? LocalizedLanguage.create : LocalizedLanguage.edit}
                          />
                        )
                      })}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer p-0">
                <button type="button" className="btn btn-primary btn-block h66" onClick={this.addTickettoCart.bind(this)}>{LocalizedLanguage.capitalSaveUpdate}</button>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const { cartproductlist, form_ticket_seating } = state;
  return {
    cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
    form_ticket_seating: form_ticket_seating.items,
  };
}
const connectedTickitDetailsPopupModal = connect(mapStateToProps)(TickitDetailsPopupModal);
export { connectedTickitDetailsPopupModal as TickitDetailsPopupModal };    