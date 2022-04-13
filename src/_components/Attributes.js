import React from 'react';
import { connect } from 'react-redux';
import { attributesActions } from '../_actions/allAttributes.action'
import { history } from '../_helpers';
import { LoadingModal } from '.';
import { SubAttributes } from './SubAttributes';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';

class Attributes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            isLoading: true,
            subattributelist: [],
            isLoading: true,
            loading: false
        }
        const { dispatch } = this.props;
        dispatch(attributesActions.getAll());
     }

    loadSubAttribute(item) {
        this.setState({
            active: true,
            subattributelist: item
        })
    }

    componentWillMount() {
        this.setState({ loading: true })
        $(".overflowscroll ").mCustomScrollbar("update");
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    Back() {
        history.go();
    }

    render() {
        const { attributelist } = this.props;
        const { active, subattributelist, loading, isLoading } = this.state;
        return (
            <div>

                {active != true ?
                    <div className="col-lg-9 col-sm-8 col-xs-8 pr-0">
                        {loading == false ? !attributelist ? <LoadingModal /> : '' : ''}
                        {/* {loading == false ? !attributelist || attributelist.length == 0 ? <LoadingModal /> : '' : ''} */}
                        <div className="items pt-3">
                            <div className="item-heading text-center">{LocalizedLanguage.library}</div>
                            <div className="panel panel-default panel-product-list overflowscroll p-0" id="allProductHeight" style={{ height: 300 }} >
                                <div className="searchDiv" style={{ display: 'none' }}>
                                    <input type="search" className="form-control nameSearch" placeholder={LocalizedLanguage.placeholderSearchAndScan} />
                                </div>
                                <div className="pl-1 pr-4 previews_setting  pointer">
                                    <a onClick={() => this.Back()} className="back-button d-flex align-items-center mt-0 mb-0" id="mainBack" >
                                        <i className="icons8-undo ml-2 mr-2 fs30 pointer"></i>
                                        <span>{LocalizedLanguage.back}</span>
                                    </a>
                                </div>
                                <table className="table ShopProductTable">
                                    <colgroup>
                                        <col style={{ width: '*' }} />
                                        <col style={{ width: 40 }} />
                                    </colgroup>
                                    <tbody>
                                        {(isLoading && !attributelist) ?
                                            <tr  >
                                                <td>  <i className="fa fa-spinner fa-spin">{LocalizedLanguage.loading}</i></td>
                                            </tr>
                                            :
                                            (attributelist.map((item, index) => {
                                                return (
                                                    item.SubAttributes && item.SubAttributes.length > 0 ?
                                                        <tr className="pointer" key={index} onClick={() => this.loadSubAttribute(item)}>
                                                            <td>{item.Value}</td>
                                                            <td ><a className="fs24 pointer"><i className="icons8-login"></i></a></td>
                                                        </tr>
                                                        :
                                                        <tr key={index} >
                                                            <td>{item.Value}</td>
                                                            <td ></td>
                                                        </tr>
                                                )
                                            })
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    : <SubAttributes subattributelist={subattributelist} productData={this.props.productData} msg={this.props.msg}/>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { attributelist } = state;
    return {
        attributelist: attributelist.attributelist
    };
}

const connectedList = connect(mapStateToProps)(Attributes);
export { connectedList as Attributes };

