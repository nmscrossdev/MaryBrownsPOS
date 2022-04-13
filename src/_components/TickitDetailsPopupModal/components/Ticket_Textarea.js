import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class Ticket_Textarea extends React.Component {
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
    var findval = checkboxArray.find(checkItem => checkItem === event.target.value);
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
    this.props.TickTextarea(name, this.state.name, this.props.indexing - 1)
  }

  componentWillReceiveProps(nexprops) {
    if (nexprops.displayvalue) {
      this.state.name = nexprops.displayvalue
      this.setState({ [name]: nexprops.displayvalue })
    }
  }

  Editchange(e) {
    this.setState({ status: true })
  }

  render() {
    const { name, required, id, placeholder, tick_title } = this.props;
    return (
      (isMobileOnly == true) ?
        <div className="input-group flex-nowrap mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text border-right-0">{tick_title}<span className="text-danger"> {((!this.state.name || this.state.name == "") && (required && required == true)) &&
            '*'
          }</span></span>
          </div>
          <textarea type="text" className="form-control border-radius-lg shadow-none h-101-pxi" id={id} name={name} placeholder={placeholder} value={this.state.name}  onChange={this.handleChange} aria-label="note" aria-describedby="addon-wrapping"></textarea>
         
        </div>
        :
        <div className={'form-group' + ((!this.state.name || this.state.name == "") && (required && required == true) ? ' has-error' : '')}>
          <div className="input-group">
            <div className="input-group-addon">
              {tick_title}
            </div>
            <textarea className="form-control" type="text" style={{ height: 'auto' }} id={id} name={name} placeholder={placeholder} value={this.state.name} onChange={this.handleChange}>
            </textarea>
          </div>
          {((!this.state.name || this.state.name == "") && (required && required == true)) &&
            <div className="help-block">{LocalizedLanguage.require}</div>
          }
        </div>

    )
  }
}

function mapStateToProps(state) {
  return {};
}
const connectedTicket_Textarea = connect(mapStateToProps)(Ticket_Textarea);
export { connectedTicket_Textarea as Ticket_Textarea };