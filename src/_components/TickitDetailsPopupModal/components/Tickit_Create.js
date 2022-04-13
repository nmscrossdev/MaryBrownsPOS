import React from 'react';
import { connect } from 'react-redux';
import { Ticket_Checkbox, Ticket_Select, Ticket_Textarea, Ticket_radio, Ticket_Input, Ticket_Firstname } from './';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class Tickit_Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: [],
            getSetting: localStorage.getItem('TickeraSetting') ? JSON.parse(localStorage.getItem('TickeraSetting')) : ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    InputClick(name, inp_text, index) {
        var rename = name.split('?')[0]
        var str = rename.replace(/-|\s/g, '_')
        this.props.InputClick(index, str, inp_text)
    }

    addTickettoCart() {
        this.props.status = false;
    }

    handleChange(e) {
        const { value, name } = e.target;
        this.setState({ [name]: value })
        if (this.props.indexing) {
            var index = this.props.indexing - 1
            var rename = name.split('?')[0]
            this.props.InputClick(index, rename, value)
        }
    }

    getfieldValue(fieldindex, name) {
        var staic_name
        if (this.props.ticket_View) {
            this.props.ticket_View && this.props.ticket_View.map((itmview, index) => {
                if (fieldindex == index)
                    staic_name = itmview[name]
                return staic_name
            })
        } else {
            return "";
        }
    }

    render() {
        const { Item, ticket_View, indexing, id, required_field, key } = this.props;
        const { getSetting } = this.state;
        var FistName = '';
        var LastName = '';
        var OwnerEmail = '';
        if (ticket_View) {
            var ticketownerInfo = ticket_View[indexing - 1];
            if (ticketownerInfo) {
                FistName = ticketownerInfo.first_name;
                LastName = ticketownerInfo.last_name;
                OwnerEmail = ticketownerInfo.owner_email;
            }
        }

        return (
            (isMobileOnly == true) ?
                <div className="accordion" id="accordionExample">
                    <div className="card border-0">
                        <div className="card-header p-3" id="headingOne">
                            <button className="btn btn-link p-0 d-flex align-items-center text-dark text-decoration-none" type="button"
                                data-toggle="collapse" data-target={"#tickit-" + indexing} aria-expanded="true" aria-controls={"tickit-" + indexing}>
                                <img src="../mobileAssets/img/plus.svg" alt="" className="mr-10" />{LocalizedLanguage.ticket}{indexing}
                            </button>
                        </div>
                        <div id={"tickit-" + indexing} className="show collapse in" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div className="card-body pb-0 p-3">
                                <form className="form-addon-medium" autoComplete="on">
                                    {getSetting && getSetting.show_attendee_first_and_last_name_fields == "yes" &&
                                        <Ticket_Firstname indexing={indexing} name={"first_name?" + indexing} tick_title={"First Name"} TickInput={(name, text, index) => this.InputClick(name, text, index)} placeholder={"First Name"}
                                            EditValue={FistName ? FistName : ''}
                                        />
                                    }
                                    {getSetting && getSetting.show_attendee_first_and_last_name_fields == "yes" &&
                                        <Ticket_Input indexing={indexing} name={"last_name?" + indexing} tick_title={"Last Name"} TickInput={(name, text, index) => this.InputClick(name, text, index)}
                                            displayvalue={LastName ? LastName : ''}
                                            placeholder={"Last Name"} />
                                    }

                                    {Item && Item.map((item, index) => {
                                        var field_info = JSON.parse(item.field_info, "this.props.indexing", indexing)
                                        var display_name = ''
                                        if (ticket_View) {
                                            ticket_View && ticket_View.map((itmview, index) => {
                                                if (parseInt(indexing - 1) == index) {
                                                    var rename = field_info.title ? field_info.title.split('?')[0] : ''
                                                    var str = rename ? rename.replace(/-|\s/g, '_') : ''
                                                    display_name = itmview[str]
                                                }
                                            })

                                        }
                                        return (
                                            <div key={index}>
                                                {field_info.field_type == "input" ?
                                                    <Ticket_Input id={id} required={field_info.is_required ? field_info.is_required : ''} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickInput={(name, text, index) => this.InputClick(name, text, index)} placeholder={field_info.placeholder ? field_info.placeholder : ''} displayvalue={display_name ? display_name : ''}
                                                    /> :
                                                    field_info.field_type == "checkbox" && field_info.content != '' && field_info.content != null ?
                                                        <Ticket_Checkbox id={id} required={field_info.is_required ? field_info.is_required : ''} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''}
                                                            validateArry={required_field}
                                                            TickCheck={(name, text, index) => this.InputClick(name, text, index)}
                                                            displayvalue={display_name}
                                                        /> :
                                                        field_info.field_type == "select" && field_info.content != '' && field_info.content != null ?
                                                            <Ticket_Select required={field_info.is_required ? field_info.is_required : ''} id={id} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickSelect={(name, text, index) => this.InputClick(name, text, index)} displayvalue={display_name}
                                                            /> :
                                                            field_info.field_type == "textarea" ?
                                                                <Ticket_Textarea id={id} required={field_info.is_required ? field_info.is_required : ''} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickTextarea={(name, text, index) => this.InputClick(name, text, index)} placeholder={field_info.placeholder ? field_info.placeholder : ''}
                                                                    displayvalue={display_name}
                                                                /> :
                                                                field_info.field_type == "radio" && field_info.content != '' && field_info.content != null ?
                                                                    <Ticket_radio required={field_info.is_required ? field_info.is_required : ''} id={id} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickRadio={(name, text, index) => this.InputClick(name, text, index)} displayvalue={display_name}
                                                                    /> :
                                                                    ''}
                                            </div>
                                        )
                                    })}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="panel">
                    <div className="panel-heading" role="tab" id="headingOne">
                        <h4 className="panel-title ticket-number after-border-remove" data-toggle="collapse" data-parent="#accordion" href={"#tickit-" + indexing} aria-expanded="true" aria-controls={"#tickit-" + indexing}>
                            <a role="button">
                                <i className="tickira-less icon icon-plus icon-css-override"></i>
                                {LocalizedLanguage.ticket}{indexing}
                            </a>
                        </h4>
                    </div>

                    <div id={"tickit-" + indexing} className={indexing == 1 ? "panel-collapse collapse in" : "panel-collapse collapse"} role="tabpanel" aria-labelledby="headingOne">
                        <div className="panel-body p-0">
                            <div className="tickt-list clearfix">

                                <div className={getSetting && getSetting.show_attendee_first_and_last_name_fields == "yes" ? "col-lg-6 col-md-6 col-sm-6 col-xs-12" : ''}>
                                    {getSetting && getSetting.show_attendee_first_and_last_name_fields == "yes" &&
                                        <Ticket_Firstname indexing={indexing} name={"first_name?" + indexing} tick_title={"First Name"} TickInput={(name, text, index) => this.InputClick(name, text, index)} placeholder={"First Name"}
                                            EditValue={FistName ? FistName : ''}
                                        />
                                    }
                                </div>
                                <div className={getSetting && getSetting.show_attendee_first_and_last_name_fields == "yes" ? "col-lg-6 col-md-6 col-sm-6 col-xs-12" : ''}>
                                    {getSetting && getSetting.show_attendee_first_and_last_name_fields == "yes" &&
                                        <Ticket_Input indexing={indexing} name={"last_name?" + indexing} tick_title={"Last Name"} TickInput={(name, text, index) => this.InputClick(name, text, index)}
                                            displayvalue={LastName ? LastName : ''}
                                            placeholder={"Last Name"} />
                                    }
                                </div>
                                <div className={getSetting && getSetting.show_owner_email_field == "yes" ? "col-sm-12" : ''}>
                                    {getSetting && getSetting.show_owner_email_field == "yes" &&
                                        <Ticket_Input indexing={indexing} name={"owner_email?" + indexing} tick_title={"Email"} TickInput={(name, text, index) => this.InputClick(name, text, index)} displayvalue={OwnerEmail ? OwnerEmail : ''} placeholder={"Email"} />
                                    }
                                </div>
                                {Item && Item.map((item, index) => {
                                    var field_info = JSON.parse(item.field_info, "this.props.indexing", indexing)
                                    var display_name = ''
                                    if (ticket_View) {
                                        ticket_View && ticket_View.map((itmview, index) => {
                                            if (parseInt(indexing - 1) == index) {
                                                var rename = field_info.title ? field_info.title.split('?')[0] : ''
                                                var str = rename ? rename.replace(/-|\s/g, '_') : ''
                                                display_name = itmview[str]
                                            }
                                        })

                                    }
                                    return (
                                        <div className="col-sm-12" key={index}>
                                            {field_info.field_type == "input" ?
                                                <Ticket_Input id={id} required={field_info.is_required ? field_info.is_required : ''} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickInput={(name, text, index) => this.InputClick(name, text, index)} placeholder={field_info.placeholder ? field_info.placeholder : ''} displayvalue={display_name ? display_name : ''}
                                                /> :
                                                field_info.field_type == "checkbox" && field_info.content != '' && field_info.content != null ?
                                                    <Ticket_Checkbox id={id} required={field_info.is_required ? field_info.is_required : ''} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''}
                                                        validateArry={required_field}
                                                        TickCheck={(name, text, index) => this.InputClick(name, text, index)}
                                                        displayvalue={display_name}
                                                    /> :
                                                    field_info.field_type == "select" && field_info.content != '' && field_info.content != null ?
                                                        <Ticket_Select required={field_info.is_required ? field_info.is_required : ''} id={id} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickSelect={(name, text, index) => this.InputClick(name, text, index)} displayvalue={display_name}
                                                        /> :
                                                        field_info.field_type == "textarea" ?
                                                            <Ticket_Textarea id={id} required={field_info.is_required ? field_info.is_required : ''} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickTextarea={(name, text, index) => this.InputClick(name, text, index)} placeholder={field_info.placeholder ? field_info.placeholder : ''}
                                                                displayvalue={display_name}
                                                            /> :
                                                            field_info.field_type == "radio" && field_info.content != '' && field_info.content != null ?
                                                                <Ticket_radio required={field_info.is_required ? field_info.is_required : ''} id={id} indexing={indexing} name={field_info.title ? field_info.title + "?" + indexing : field_info.field_type + "?" + indexing} tick_content={field_info.content ? field_info.content : ''} tick_title={field_info.title ? field_info.title : ''} TickRadio={(name, text, index) => this.InputClick(name, text, index)} displayvalue={display_name}
                                                                /> :
                                                                ''
                                            }
                                        </div>

                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>

        )
    }
}

function mapStateToProps(state) {
    const { cartproductlist } = state;
    return {
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
    };
}
const connectedTickit_Create = connect(mapStateToProps)(Tickit_Create);
export { connectedTickit_Create as Tickit_Create };     