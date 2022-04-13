import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from "react-device-detect";

class Ticket_radio extends React.Component {
  constructor(props) {
    super(props);
    this.state = name
    this.state = {
      status: false
    }
  }

  paytype(name, value) {
    this.setState({ name: value, status: true })
    if (this.props.indexing) {
      var index = this.props.indexing - 1
      this.props.TickRadio(name, value, index)
    }
  }

  componentDidMount() {
    const { tick_content } = this.props;
    var radio = tick_content.split(',');
    this.setState({ Tick_radio: radio })
  }

  render() {
    const { name, tick_title, indexing, id, displayvalue } = this.props;
    const { Tick_radio, status } = this.state;
    return (
      (isMobileOnly == true) ?
        <div className="input-group flex-nowrap mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text border-right-0">{tick_title ? tick_title : ''}</span>
          </div>
          {Tick_radio && Tick_radio.map((check, index) => {
            return (
              status == true ?
                <div  key={index} className="btn-group btn-group-toggle RegisterTouchButtons" data-toggle="buttons" onClick={() => this.paytype(name, check)}>
                  <label className="btn btn-style-03 mr-2">
                    <input id={id} id={"Ticket" + indexing + "_" + check} name={name} value={check} />{check}
                  </label>
                </div>
                : <div  key={index} className="btn-group btn-group-toggle RegisterTouchButtons" data-toggle="buttons" onClick={() => this.paytype(name, check)}>
                  <label className="btn btn-style-03 mr-2">
                    <input id={id} id={"Ticket" + indexing + "_" + check} name={name} value={check} checked={check == displayvalue ? true : false} />{check}
                  </label>
                </div>
            )
          })}
        </div>
        :
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-addon">
              {tick_title ? tick_title : ''}
            </div>
            <div className="form-control" id="user_notes" name="user_notes" type="text" style={{ height: 'auto' }}>
              {Tick_radio && Tick_radio.map((check, index) => {
                return (
                  status == true ?
                    <div key={index} className="col-sm-6 button_with_checkbox mt-1" onClick={() => this.paytype(name, check)}>
                      <input type="radio" id={id} id={"Ticket" + indexing + "_" + check} name={name} value={check} />
                      <label htmlFor={"Ticket" + indexing + "_" + check} className="label_select_button">{check}</label>
                    </div>
                    :
                    <div key={index} className="col-sm-6 button_with_checkbox mt-1" onClick={() => this.paytype(name, check)}>
                      <input type="radio" id={id} id={"Ticket" + indexing + "_" + check} name={name} value={check}
                        checked={check == displayvalue ? true : false}
                      />
                      <label htmlFor={"Ticket" + indexing + "_" + check} className="label_select_button">{check}</label>
                    </div>

                )
              })}
            </div>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}
const connectedTicket_radio = connect(mapStateToProps)(Ticket_radio);
export { connectedTicket_radio as Ticket_radio };