import React from 'react';
import { connect } from 'react-redux';
import { AllProduct } from '../../_components/AllProduct';
import { Attributes } from '../../_components/Attributes';
import { Categories } from '../../_components/Categories';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            item: 0,
        }
    }

    ActiveList(item) {     
        this.setState({
            active: true,
            item: item
        })
    }
          
    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    shouldComponentUpdate(nextProps, nextState){
      if (this.state.item === nextState.item) {
        return false
      }
      return true
      }

    componentWillReceiveProps(){     
        if(this.props.filterType==="product-search")
        {
        this.setState({
            active: true,
            item: 1
        })
    }
    }

    render() {
        const { active, item } = this.state; 
        return (
            <div>
                { active != true ?
                    <div className="col-lg-9 col-sm-8 col-xs-8 pr-0">
                        <div className="items pt-3 ">
                            <div className="item-heading text-center">{LocalizedLanguage.library}</div>
                            <div className="panel panel-default panel-product-list overflowscroll p-0" id="allProductHeight">
                                <div className="searchDiv" style={{ display: 'none' }}>
                                    <input type="search" className="form-control nameSearch" placeholder={LocalizedLanguage.placeholderSearchAndScan} />
                                </div>
                                <table className="table ShopProductTable">
                                    <colgroup>
                                        <col style={{ width: '*' }} />
                                        <col style={{ width: 40 }} />
                                    </colgroup>
                                    <tbody>
                                        <tr  className="pointer" key='1' onClick={() => this.ActiveList(1)}>
                                            <td>{LocalizedLanguage.allItems}</td>
                                            <td><a className="fs24"><i className="icons8-login"></i></a></td>
                                        </tr>
                                        <tr  className="pointer" key='2' onClick={() => this.ActiveList(2)}>
                                            <td>{LocalizedLanguage.attribute}</td>
                                            <td><a className="fs24"><i className="icons8-login"></i></a></td>
                                        </tr>
                                        <tr  className="pointer" key='3' onClick={() => this.ActiveList(3)}>
                                            <td>{LocalizedLanguage.categories}</td>
                                            <td><a className="fs24"><i className="icons8-login"></i></a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    :
                    (
                        item == 1 ?
                            <div className="col-lg-9 col-sm-8 col-xs-8 pr-0">
                                <AllProduct  productData={this.props.productData} onRef={this.props.onRef} parantPage="list"  simpleProductData={this.props.simpleProductData} msg={this.props.msg} />
                            </div>
                            : item == 2 ?
                                <Attributes   productData={this.props.productData} onRef={this.props.onRef} msg={this.props.msg}  />
                                : item == 3 ?
                                    <Categories productData={this.props.productData} onRef={this.props.onRef} msg={this.props.msg} />
                                    : null
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedList = connect(mapStateToProps)(List);
export { connectedList as List };


