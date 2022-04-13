import React from 'react';
import { connect } from 'react-redux';
import { Markup } from 'interweave';
class CommonInfoPopup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal fade popUpMid" id={this.props.id} role="dialog">
                <div className="modal-dialog modal-sm modal-md2 modal-center-block">
                    <div className="modal-content">
                        <div className="modal-body center-center pt-5 pb-5">
                            <div className="plan-info">
                                    <h4>{this.props.title}</h4>
                                    <div className="mb-3 mt-3"> <Markup content={this.props.subTitle}></Markup></div>
                                <button type="button" className="btn btn-primary btn-lg mb-3" data-toggle="modal" onClick={() => this.props.closeCommonPopup()}
                                        data-target="#myModal">{this.props.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
    };
}
const connectedCommonInfoPopup = connect(mapStateToProps)(CommonInfoPopup);
export { connectedCommonInfoPopup as CommonInfoPopup };
