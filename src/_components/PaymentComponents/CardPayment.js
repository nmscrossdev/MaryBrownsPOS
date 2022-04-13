import React from 'react';
import { connect } from 'react-redux';


class CardPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
        }
        this.handleCardChange = this.handleCardChange.bind(this);
    }

    handleCardChange(e) {
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (e.target.value === '' || re.test(e.target.value)) {
            const { name, value } = e.target;
             this.setState({ [name]: value });
         }
    }

    hideTab(st) {
        setTimeout(function () {
            boxHeight();
       }, 50);
        if(st==true){
            this.props.activeDisplay(`${this.props.code}_true`)
        }else{
            this.props.activeDisplay(false)  
        }
        this.setState({
            status: st,
        })
    }

    hideTab2(st) {
        this.setState({ status: st })
        this.props.activeDisplay(false)  
    }

    render() {
        const { status } = this.state;
        const { color, Name ,styles } = this.props;
        return (
            status !== true ?
                <div style={{display:styles}} onClick={() => this.hideTab(!status)} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0">
                    <div className="section">
                        <div className="" data-isopen="">
                            <div className="pointer">
                                <div style={{ borderColor: color }} className="d-flex box-flex box-flex-border-left box-flex-background-giftcard border-dynamic">
                                    <div className="box-flex-text-heading">
                                        <h2>{Name}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0">
                    <div className="section">
                        <div className="">
                            <div  style={{ backgroundColor:color }} className="box__block_caption giftcard-background b-0 round-top-corner" data-title="Giftcard">
                                <img onClick={() => this.hideTab(!status)} src="../assets/img/cross_white.svg" className="accordion_close" />
                            </div>
                            <div className="overflowscroll giftcard_body" id="">
                                <div className="p-3 clearfix">
                                    <div className="gray-background round-8 mb-3 overflowHidden">
                                        <div className="d-flex d-column box-flex line-height-30">
                                            <div className="col-sm-12">
                                                <div className="block__box_text_hint capital">
                                                    Amount On Card
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="block__box_text_price">123098123909</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100-block button_with_checkbox mb-2" title="">
                                        <input id="10" name="radio-group" type="radio" />
                                        <label htmlFor="10" className="label_select_button">Check Value</label>
                                    </div>
                                </div>
                                <div className="line-height-30">
                                    <p className="fs16 color-4b">Amount On Card</p>
                                    <p className="fs24 theme-color">250.00</p>
                                </div>
                            </div>
                            <div className="box__block_button giftcard-background b-0 round-bottom-corner">
                                <button  style={{ backgroundColor:color }} onClick={() => this.hideTab2(!status)} type="button" className="btn transparent color-white fs24 w-100 no-outline pt-4 pb-4">Add Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
 return {};
}
const connectedCardPayment = connect(mapStateToProps)(CardPayment);
export { connectedCardPayment as CardPayment };