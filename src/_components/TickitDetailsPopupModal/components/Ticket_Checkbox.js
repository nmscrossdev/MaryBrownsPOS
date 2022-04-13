import React from 'react';
import { connect } from 'react-redux'
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";

class Ticket_Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = name
        this.state = {
            Tic_checkbox: [],
            showCheckbox_Value: []
        }
        if (this.props.displayvalue && this.props.displayvalue != "")
            this.state.showCheckbox_Value = this.props.displayvalue.split(',')
    }

    componentDidMount() {
        const { tick_content, displayvalue } = this.props;
        var Checkbox = tick_content && tick_content.split(',');
        this.setState({ Tic_checkbox: Checkbox })
        if (displayvalue) {
            var ItemsArray = displayvalue.split(',')
            ItemsArray && ItemsArray.map(elements => {
                setTimeout(function () {
                    $(`input[value=${elements}]`).prop("checked", true);
                }.bind(this), 500)
            })
        }
    }

    paytype(name, value) {
        const { displayvalue, indexing } = this.props;
        var div = "#div" + this.props.indexing + " input[type=checkbox]";
        var allchecked = "#div" + this.props.indexing + " input[type=checkbox]:checked";
        var checkboxArray = new Array();
        var selecedValue = (displayvalue ? displayvalue + "," : "") + value;
        if (this.props.displayvalue) {
            checkboxArray = [...new Set([...checkboxArray, ...selecedValue.split(',')])];
        }
        var indexId = indexing
        if (indexing) {
            if (checkboxArray !== "") {
                var check_value = checkboxArray.join();
                var index = indexId - 1
                this.props.TickCheck(name, check_value, index)
            }
        }
        this.setState({
            showCheckbox_Value: checkboxArray,
            name: value
        })
    }

    handleOnChange(event) {
        const { showCheckbox_Value } = this.state;
        var checkboxArray = new Array();
        if (showCheckbox_Value && showCheckbox_Value.length > 0) {
            checkboxArray = showCheckbox_Value;
        }
        var findval = checkboxArray.find(checkItem => checkItem === event.target.value)
        if (findval && event.target.checked == false) {
            var index = checkboxArray.indexOf(event.target.value);
            if (index > -1) {
                checkboxArray.splice(index, 1);
            }
        } else {
            checkboxArray.push(event.target.value)
        }
        this.state.showCheckbox_Value = checkboxArray;
        this.setState({ showCheckbox_Value: checkboxArray })
        this.props.TickCheck(event.target.name, checkboxArray.join(), this.props.indexing - 1)
    }

    render() {
        const { name, required, validateArry, displayvalue, tick_title, indexing } = this.props;
        const { showCheckbox_Value, Tic_checkbox } = this.state;
        var checkedName = this.state.name;
        var ItemsArray = displayvalue && displayvalue.split(',');
        var is_required = validateArry;
        var validation_name;
        if (is_required) {
            is_required.find(item => {
                if (item.key == indexing - 1) {
                    validation_name = item.title === tick_title ? item.title : ''
                    return validation_name;
                }
            })
        }
        return (
            (isMobileOnly == true) ?
                // <div className="input-group flex-nowrap  mb-3">
                //     <div className="input-group-prepend">
                //         <span className="input-group-text border-right-0">{tick_title ? tick_title : ''}</span>
                //     </div>
                //     {Tic_checkbox && Tic_checkbox.map((check, index) => {
                //         var itemexist = showCheckbox_Value && showCheckbox_Value.filter(checkItem => checkItem === check)
                //         var isExist = itemexist && itemexist.length > 0 ? true : false;
                //         return (
                //             <div key={index} className="btn-group btn-group-toggle RegisterTouchButtons" data-toggle="buttons">
                //                 <label className="btn btn-style-03 mr-2" >
                //                     <input type="checkbox" onChange={this.handleOnChange.bind(this)} checked={isExist} name={name} value={check} />{check}
                //                 </label>
                //             </div>
                //         )
                //     })}
                //     {((!showCheckbox_Value || showCheckbox_Value == "" || validation_name == "undefined") && (required && required == true)) &&
                //         LocalizedLanguage.require
                //     }
                // </div>
                <div className="input-group flex-nowrap mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text border-right-0">{tick_title ? tick_title : ''} <span
                            className="text-danger">{((!showCheckbox_Value || showCheckbox_Value == "" || validation_name == "undefined") && (required && required == true)) &&
                                '*'
                            }</span></span>
                    </div>
                    <div className="form-control border-radius-lg shadow-none h-100">
                        {Tic_checkbox && Tic_checkbox.map((check, index) => {
                            var itemexist = showCheckbox_Value && showCheckbox_Value.filter(checkItem => checkItem === check);
                            var isExist = itemexist && itemexist.length > 0 ? true : false;
                            return (
                                <div key={index} className="button-single-state mb-2">
                                    <div className="btn-group-toggle" data-toggle="buttons">
                                        <label className="btn btn-default btn-block">
                                            <input type="checkbox" onChange={this.handleOnChange.bind(this)} checked={isExist} name={name} value={check} /> {check}
                                        </label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                :
                <div className={'form-group' + (!showCheckbox_Value || validation_name == 'undefined' ? ' has-error' : '')}>
                    <div className="input-group">
                        <div className="input-group-addon">
                            {tick_title ? tick_title : ''}
                        </div>
                        <div className="form-control" id={"div" + indexing} name="user_notes" type="text" style={{ height: 'auto' }}>
                            {Tic_checkbox && Tic_checkbox.map((check, index) => {
                                var itemexist = showCheckbox_Value && showCheckbox_Value.filter(checkItem => checkItem === check)
                                var isExist = itemexist && itemexist.length > 0 ? true : false;
                                return (
                                    <div key={index} className="w-50-block p-1"  >
                                        <label className="tickira_checkbox">{check}
                                            <input type="checkbox" onChange={this.handleOnChange.bind(this)} checked={isExist} name={name} value={check} />
                                            <span className="tickira_checkmark"></span>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {((!showCheckbox_Value || showCheckbox_Value == "" || validation_name == "undefined") && (required && required == true)) &&
                        <div className="help-block" style={{ color: '#a94442' }}> {LocalizedLanguage.require}</div>
                    }
                </div>
        )
    }
}
function mapStateToProps(state) {
    return {};
}
const connectedTicket_Checkbox = connect(mapStateToProps)(Ticket_Checkbox);
export { connectedTicket_Checkbox as Ticket_Checkbox };