import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class Ticket_Firstname extends React.Component {
  constructor(props) {
    super(props);
    const { name } = this.props;
    this.state = name
    this.state = {
      status: false,
      firstname: '',
    }

    this.state.name = this.props.EditValue && this.props.EditValue != '' ? this.props.EditValue : ''
    this.setState({ [name]: this.props.EditValue && this.props.EditValue != '' ? this.props.EditValue : '' })
    this.handleChange = this.handleChange.bind(this);
    this.Editchange = this.Editchange.bind(this);

  }

  handleChange(e) {
    const { value, name } = e.target;
    if (this.state.name && this.state.name.length > 0) {
      checkboxArray = name;
    }

    var checkboxArray = [];
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
    this.props.TickInput(name, this.state.name, this.props.indexing - 1)
  }


  Editchange(e) {
    this.setState({ status: true })
  }

  componentWillReceiveProps(nexprops) {
    if (nexprops.EditValue) {
      this.state.name = nexprops.EditValue
      this.setState({ [name]: nexprops.EditValue })
    } else {
      this.state.name = ""
      this.setState({ [name]: "" })
    }
  }

  render() {
    const { name, tick_title, placeholder, id } = this.props;
    return (
      (isMobileOnly == true) ?
        <div className="input-group flex-nowrap  mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text border-right-0"> {tick_title ? tick_title : ''}<span className="text-danger"> {!this.state.name && '*'}</span></span>
          </div>
          <input type="text" className="form-control border-radius-lg shadow-none" id={id} name={name} value={this.state.name} placeholder={placeholder} onChange={this.handleChange} aria-label="Username" aria-describedby="addon-wrapping" />
        </div>
        :
        <div className={'form-group' + (!this.state.name ? ' has-error' : '')}>
          <div className="input-group">
            <div className="input-group-addon">
              {tick_title ? tick_title : ''}
            </div>
            <input className="form-control" id={id} name={name} value={this.state.name} placeholder={placeholder} type="text" onChange={this.handleChange} />
          </div>
          {!this.state.name &&
            <div className="help-block"> {LocalizedLanguage.require}</div>
          }
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}
const connectedTicket_Firstname = connect(mapStateToProps)(Ticket_Firstname);
export { connectedTicket_Firstname as Ticket_Firstname };