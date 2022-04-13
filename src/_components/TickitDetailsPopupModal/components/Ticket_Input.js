import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class Ticket_Input extends React.Component {
  constructor(props) {
    super(props);
    const { name } = this.props;
    this.state = name
    this.state = {
      status: false,
    }
    this.state.name = this.props.displayvalue
    this.setState({ [name]: this.props.displayvalue })
    this.handleChange = this.handleChange.bind(this);
    this.Editchange = this.Editchange.bind(this);
  }

  handleChange(e) {
    const { value, name } = e.target;
    if (this.state.name && this.state.name.length > 0) {
      checkboxArray = this.state.name;
    }
    var checkboxArray = []
    var findval = checkboxArray.find(checkItem => checkItem === event.target.value)
    if (event.target.value == '') {
      this.state.name = event.target.value;
      this.setState({ name: event.target.value })
      var index = checkboxArray.indexOf(event.target.value);
      if (index > -1) {
        checkboxArray.splice(index, 1);
      }
    } else {
      checkboxArray.push(event.target.value)
    }
    checkboxArray && checkboxArray.map(first => {
      this.state.name = first;
      this.setState({ name: first })

    })
    this.props.TickInput(name, this.state.name, this.props.indexing - 1)
  }

  componentWillReceiveProps(nexprops) {
    if (nexprops.displayvalue) {
      this.state.name = nexprops.displayvalue
      this.setState({ [name]: nexprops.displayvalue })
    } else {
      this.state.name = ""
      this.setState({ [name]: "" })
    }
  }

  Editchange(e) {
    this.setState({ status: true })
  }

  render() {
    const { name, tick_title, id, placeholder, required } = this.props;
    return (
      (isMobileOnly == true) ?
        <div className="input-group flex-nowrap  mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text border-right-0"> {tick_title ? tick_title : ''}<span className="text-danger">{!this.state.name && (tick_title == "Last Name" && name.split('?')[0] == 'last_name') || (tick_title == "Email" && name.split('?')[0] == 'owner_email') ? '*' : required && required == true ? '*' : ''}</span></span>
          </div>
          <input type="text" className="form-control border-radius-lg shadow-none" id={id} name={name} value={this.state.name} placeholder={placeholder} onChange={this.handleChange} aria-label="Username" aria-describedby="addon-wrapping" />
        </div>
        :
        <div className={'form-group' + (!this.state.name ? ' has-error' : '')}>
          <div className="input-group">
            <div className="input-group-addon">
              {tick_title ? tick_title : ''}
            </div>
            <input className="form-control" id={id} name={name} value={this.state.name} placeholder={placeholder} type="text"
              onChange={this.handleChange} />

          </div>
          {!this.state.name &&
            <div className="help-block">{(tick_title == "Last Name" && name.split('?')[0] == 'last_name') || (tick_title == "Email" && name.split('?')[0] == 'owner_email') ? LocalizedLanguage.require : required && required == true ? LocalizedLanguage.require : ''}</div>
          }
        </div>
    )
  }
}
function mapStateToProps(state) {
  return {};
}
const connectedTicket_Input = connect(mapStateToProps)(Ticket_Input);
export { connectedTicket_Input as Ticket_Input };