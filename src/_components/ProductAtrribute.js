import React from 'react';
import { connect } from 'react-redux';
import { ProductSubAtrribute } from './';
import { isMobileOnly } from "react-device-detect";
import ActiveUser from '../settings/ActiveUser';
class ProductAtrribute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getAttributes: null,
            option: null,
            selectedAttrIndex: null,
        }
        this.handleOptionClick = this.handleOptionClick.bind(this);
    }

    handleOptionClick(option, attribute, attrIndex) {
        this.state.option = option;
        this.state.selectedAttrIndex = attrIndex;
        this.setState({
            option: option,
            selectedAttrIndex: attrIndex,
        })
        this.props.optionClick(option, attribute, attrIndex);        
    }

    render() {
        var ProductAttribute = this.props;
        var _attribute = [];
        if(ProductAttribute.attribute !== null){
            _attribute = ProductAttribute && ProductAttribute.attribute.filter(item => item.Variation == true);
             var _DistictAttribute=[];
            _attribute && _attribute.map((attribute, index) => {
                var item={Name:attribute.Name , Option:attribute.Option ,Slug:attribute.Slug ,Option:attribute.Option, Variation:attribute.Variation,OptionAll:attribute.OptionAll};
                var isExist = _DistictAttribute && _DistictAttribute.find(function (element) {
                    return (element.Slug == item.Slug)
                });
                if (!isExist)               
                _DistictAttribute.push(item);
            });
        }
        var _user= localStorage.getItem("user") ?JSON.parse(localStorage.getItem("user")):null;
        var _isSelfcheckout=ActiveUser.key.isSelfcheckout? ActiveUser.key.isSelfcheckout:false;
       return (
        (_isSelfcheckout == true && isMobileOnly == true) ?
            _DistictAttribute && _DistictAttribute.length > 0 ?
            (_DistictAttribute.map((attribute, index) => {
                return (
                    attribute && attribute.Variation == true &&
                    <div key={index}>                        
                        <p >{attribute.Name}</p>
                        <ProductSubAtrribute 
                            showSelectedProduct={this.props.showSelectedProduct ? this.props.showSelectedProduct.combination : null}
                            itemIndex={index}
                            selectedAttrIndex={this.state.selectedAttrIndex}
                            key={"ProductSubAttr-" + index} options={attribute.Option} parentAttribute={attribute.Slug}
                            click={this.handleOptionClick}
                            filteredAttribute={attribute.Slug == this.props.selectedAttribute ? [] : this.props.filteredAttribute}
                            productVariations={this.props.productVariations}
                            selectedOption={this.props.selectedOptionCode}
                            selectedOptions={this.props.selectedOptions}
                            OptionAll={attribute.OptionAll}/>
                    </div>
                )
            })
            ) : ""
        : 
        (_isSelfcheckout == true && isMobileOnly == false) ?
            _DistictAttribute && _DistictAttribute.length > 0 ?
            (_DistictAttribute.map((attribute, index) => {
                return (
                    attribute && attribute.Variation == true &&
                    <div key={index}>
                        <p>{attribute.Name}</p>
                        <div className="row">
                            <ProductSubAtrribute 
                                showSelectedProduct={this.props.showSelectedProduct ? this.props.showSelectedProduct.combination : null}
                                itemIndex={index}
                                selectedAttrIndex={this.state.selectedAttrIndex}
                                key={"ProductSubAttr-" + index} options={attribute.Option} parentAttribute={attribute.Slug}
                                click={this.handleOptionClick}
                                filteredAttribute={attribute.Slug == this.props.selectedAttribute ? [] : this.props.filteredAttribute}
                                productVariations={this.props.productVariations}
                                selectedOption={this.props.selectedOptionCode}
                                selectedOptions={this.props.selectedOptions}
                                OptionAll={attribute.OptionAll} />
                        </div>
                    </div>
                )
            })
            ) : ""
        :
            isMobileOnly == true && (_isSelfcheckout == false) ?
            _DistictAttribute && _DistictAttribute.length > 0 ?
                    (_DistictAttribute.map((attribute, index) => {
                        return (
                            attribute && attribute.Variation == true &&
                            <div key={index} className="product_features">
                                <h4>{attribute.Name}</h4>
                                <div className="pfScroll text-left">
                                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                        <ProductSubAtrribute 
                                            showSelectedProduct={this.props.showSelectedProduct ? this.props.showSelectedProduct.combination : null}
                                            itemIndex={index}
                                            selectedAttrIndex={this.state.selectedAttrIndex}
                                            key={"ProductSubAttr-" + index} options={attribute.Option} parentAttribute={attribute.Slug}
                                            click={this.handleOptionClick}
                                            filteredAttribute={attribute.Slug == this.props.selectedAttribute ? [] : this.props.filteredAttribute}
                                            productVariations={this.props.productVariations}
                                            selectedOption={this.props.selectedOptionCode}
                                            selectedOptions={this.props.selectedOptions}
                                            OptionAll={attribute.OptionAll}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    ) : ""
                :
                _DistictAttribute && _DistictAttribute.length > 0 ?
                    (_DistictAttribute.map((attribute, index) => {
                        return (
                            attribute && attribute.Variation == true &&
                            <div className="variation-list" key={index}>
                                <h4 className="variation-title">{attribute.Name}</h4>
                                <div className="varialtion-color-category">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <ProductSubAtrribute showSelectedProduct={this.props.showSelectedProduct ? this.props.showSelectedProduct.combination : null}
                                                itemIndex={index}
                                                selectedAttrIndex={this.state.selectedAttrIndex}
                                                key={"ProductSubAttr-" + index} options={attribute.Option} parentAttribute={attribute.Slug}
                                                click={this.handleOptionClick}
                                                filteredAttribute={attribute.Slug == this.props.selectedAttribute ? [] : this.props.filteredAttribute}
                                                productVariations={this.props.productVariations}
                                                selectedOption={this.props.selectedOptionCode}
                                                selectedOptions={this.props.selectedOptions}
                                                OptionAll={attribute.OptionAll}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                )
            ) : ""
        )
    }
}
function mapStateToProps() {
    return {};
}
const connectedProductAtrribute = connect(mapStateToProps)(ProductAtrribute);
export { connectedProductAtrribute as ProductAtrribute };