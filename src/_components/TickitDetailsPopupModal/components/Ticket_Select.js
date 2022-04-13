import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class Ticket_Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = name
        this.state = {
            Tic_Select: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.state.name = this.props.displayvalue
        this.setState({ [name]: this.props.displayvalue })
    }

    handleChange(e) {
        const { indexing } = this.props;
        const { value, name } = e.target;
        this.setState({ name: value })
        if (indexing) {
            var index = indexing - 1
            this.props.TickSelect(name, value, index)
        }
    }

    componentDidMount() {
        var select = this.props.tick_content.split(',');
        this.setState({ Tic_Select: select })
    }

    render() {
        const { name, required, tick_title, displayvalue, id } = this.props;
        const { Tic_Select } = this.state;
        return (
            (isMobileOnly == true) ?
                <div className="input-group flex-nowrap  mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text border-right-0">{tick_title}<span className="text-danger"> {((!this.state.name || this.state.name == "") && (required && required == true)) && '*'}</span></span>
                    </div>
                    <select type="text" className="form-control border-radius-lg shadow-none" name={name} onChange={this.handleChange}
                        id={id}
                        value={this.state.name ? this.state.name : displayvalue} aria-label="city" aria-describedby="addon-wrapping" >
                        <option value=''>{LocalizedLanguage.select}</option>
                        {Tic_Select.map((item, index) => {
                            return (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            )
                        })}
                    </select>
                </div>
                :
                <div className={'form-group' + ((!this.state.name || this.state.name == "") && (required && required == true) ? ' has-error' : '')}>
                    <div className="input-group">
                        <div className="input-group-addon">
                            {tick_title}
                        </div>
                        <select className="form-control" name={name} onChange={this.handleChange} id={id} value={this.state.name ? this.state.name : displayvalue} >
                            <option value=''>{LocalizedLanguage.select}</option>
                            {Tic_Select.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                )
                            })}
                        </select>
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
const connectedTicket_Select = connect(mapStateToProps)(Ticket_Select);
export { connectedTicket_Select as Ticket_Select };