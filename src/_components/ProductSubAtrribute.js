import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from "react-device-detect";
import ActiveUser from '../settings/ActiveUser';
class ProductSubAtrribute extends React.Component {
    constructor(props) {
        super(props);
    }

    removeSpecialChar(item) {
        return item.replace(/\s/g, '-').replace(/\//g, "-").replace("'", "").replace(".", "").replace("-", "").toLowerCase();
    }

    combo(c) {
        var r = [];
        var len = c.length;
        var tmp = [];
        function nodup() {
            var got = {};
            for (var l = 0; l < tmp.length; l++) {
                if (got[tmp[l]]) return false;
                got[tmp[l]] = true;
            }
            return true;
        }
        function iter(col, done) {
            var l, rr;
            if (col === len) {
                if (nodup()) {
                    rr = [];
                    for (l = 0; l < tmp.length; l++)
                        rr.push(c[tmp[l]]);
                    r.push(rr.join('~'));
                }
            } else {
                for (l = 0; l < len; l++) {
                    tmp[col] = l;
                    iter(col + 1);
                }
            }
        }
        iter(0);
        return r;
    }

    render() {
        const ProductSubAttribute = this.props;
        let _OptionAll=ProductSubAttribute.OptionAll && JSON.parse(ProductSubAttribute.OptionAll);
        var isAllOption=false;
        if( Array.isArray(_OptionAll)==true || _OptionAll.length >=1){
            isAllOption=true;
        }
        else{
            _OptionAll=ProductSubAttribute.options?ProductSubAttribute.options.split(','):[];
        }
        return (
            _OptionAll && _OptionAll !== undefined ? (
                _OptionAll.map((_allOpt, index) => {
                    var randomNum=Math.floor(Math.random() * 100); //used to differentiate the IDs
                    var option= isAllOption ==true && _allOpt.slug ?_allOpt.slug:_allOpt;
                    var displayOption=isAllOption ==true && _allOpt.name ?_allOpt.name:_allOpt;
                    var isExist = false;
                    var newOption = isAllOption ==true && _allOpt.slug ? _allOpt.slug:_allOpt;
                    var isVariationExist = false;
                    //Find options Code----------------------------------------------
                    var attribute_list = null;
                    attribute_list = localStorage.getItem("attributelist") && localStorage.getItem("attributelist") !=='undefined' && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true ? JSON.parse(localStorage.getItem("attributelist")) : null;
                    var sub_attribute;
                    //var option;
                    if(attribute_list !== null && attribute_list !== undefined && attribute_list.length > 0){
                        var found = attribute_list.find(function (element) {
                            return element.Code.toLowerCase() == ProductSubAttribute.parentAttribute.toLowerCase()
                        })
                        if (found) {
                            sub_attribute = found.SubAttributes.find(function (element) {
                                return element.Value.toLowerCase() == option.toLowerCase()
                            })
                        }
                    }
                   
                    newOption = sub_attribute ? sub_attribute.Code : newOption;
                    var newOptionVal = sub_attribute ? sub_attribute.Value : newOption; // get sub_attribute value attr if Code not matched
                    var variationsOfrenderOption = [];
                    ProductSubAttribute.productVariations && ProductSubAttribute.productVariations.map(variation => {
                        if (variation && variation.combination) {
                            var arrComb = variation.combination.split('~');
                            if (arrComb && arrComb.length > 0) {
                                // compare all variation combination positions on arrComb
                                arrComb && arrComb.map((itm, i)=>{
                                    var combinationAtindex = arrComb[i];// put one by one combination position to check variation conbination
                                    if(combinationAtindex != null && newOption != null){
                                        // compare for newOptionVal 
                                        if ((combinationAtindex !== 'undefined' && newOption !=='undefined' && combinationAtindex.toLowerCase() === newOption.toLowerCase() || combinationAtindex.toLowerCase() === newOptionVal.toLowerCase()) || combinationAtindex == '**')  //variation exist for option to be displayed
                                        {
                                            if(combinationAtindex.toLowerCase() === newOptionVal.toLowerCase()){
                                                newOption = newOptionVal
                                            }
                                            if (variationsOfrenderOption.indexOf(variation) == -1) {
                                                variationsOfrenderOption.push(variation);
                                            }
                                            isVariationExist = true;
                                        }
                                    }
                                })
                            }
                        }
                    })
                    //=================================================================
                    //=======Handle the filter===========================================
                    var checkVariationExistforFilter = true;
                    var arrmatch = [];
                    this.props.selectedOptions && this.props.selectedOptions !== undefined && this.props.selectedOptions.map(selectedAtt => {
                        var exist = false;
                        this.props.selectedOptions && variationsOfrenderOption && variationsOfrenderOption.map(variation => {
                            if (variation !==null && variation.combination !== null && variation.combination) {
                                var arrComb = variation.combination.split('~');
                                if (arrComb && arrComb.length > 0) {
                                // compare all variation combination positions on arrComb
                                    arrComb && arrComb.map((itm, i)=>{
                                        var combiOnFinterIndex = arrComb[i];// put one by one variation combination position 
                                        if (combiOnFinterIndex ? combiOnFinterIndex.toLowerCase() === selectedAtt.option.toLowerCase() || selectedAtt.option.includes(combiOnFinterIndex.toLowerCase()) || combiOnFinterIndex == '**' : null)  //variation exist for option to be displayed
                                        {
                                            exist = true
                                        }
                                })
                                }
                            }
                        })
                        if (exist == true || selectedAtt.index == ProductSubAttribute.itemIndex) {
                            arrmatch.push("match");
                        } else {
                            arrmatch.push("mismatch");
                        }
                    })
                    if (arrmatch.includes("mismatch")) {
                        checkVariationExistforFilter = false;
                    } else {
                        checkVariationExistforFilter = true;
                    }         
                    var isEnabled = isVariationExist == true && checkVariationExistforFilter == true ? true : false; // && isExist === true
                    var selectedValueSplit = this.props.showSelectedProduct ? this.props.showSelectedProduct.split("~") : '';
                    var matchOption = selectedValueSplit && selectedValueSplit.find(function (item) {
                        return item == option.toLowerCase() || item == newOption.toLowerCase();
                    })
                    var ischecked
                    if (!matchOption) {
                        ischecked = this.props.showSelectedProduct &&
                            (this.props.showSelectedProduct.toLowerCase().includes(newOption.toLowerCase())) ? 'checked' : null
                    }
                    var checked = matchOption ? 'checked' : ischecked ? 'checked' : null
                    var attrIndex = this.props.itemIndex ? this.props.itemIndex : 0;
                    var _isSelfcheckout=ActiveUser.key.isSelfcheckout? ActiveUser.key.isSelfcheckout:false;
                    return (
                        // isMobileOnly == true && (_isSelfcheckout == true) ?                        
                        //     <div key={"subattr-" + index} className="subattributesBorder">
                        //         <input type="radio" disabled={!isEnabled} name={`variation-option-${ProductSubAttribute.parentAttribute}`} value={option}
                        //         checked={checked} id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} onClick={this.props.click.bind(this, newOption, ProductSubAttribute.parentAttribute, attrIndex)} />
                        //         <label  className='subattributetext' htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} title={option}>{option}</label>
                        //     </div>
                        // :
                        // isMobileOnly == true && (_isSelfcheckout == false) ?
                        //     <label key={"subattr-" + index} className={`btn ${checked ? 'active' : ''}btn-style-03`} htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} title={option} onClick={() => this.props.click(newOption, ProductSubAttribute.parentAttribute, attrIndex)}>
                        //         <input disabled={!isEnabled} type="radio" checked={checked} 
                        //         id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} name={`variation-option-${ProductSubAttribute.
                        //         parentAttribute}`} value={option} /> 
                        //         {option.length > 13 ? option.substring(0, 10) + "..." : option}
                        //     </label>
                        // :
                       // _isSelfcheckout == true ?
                            // <div key={"subattr-" + index}>
                            //     <div className="subattributesBorder">
                            //         <input type="radio" disabled={!isEnabled} checked={checked} id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} 
                            //         name={`variation-option-${ProductSubAttribute.parentAttribute}`} value={option}  onClick={this.props.click.bind(this, newOption, ProductSubAttribute.parentAttribute, attrIndex)} />
                            //         <label  className='subattributetext' htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} title={option}>{option}</label>
                            //     </div>
                            // </div>

                        <label key={"subattr-" + index} htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`}>
                        <input disabled={!isEnabled} type="radio" id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} name={`variation-option-${ProductSubAttribute.parentAttribute}`} value={option} onClick={this.props.click.bind(this, newOption, ProductSubAttribute.parentAttribute, attrIndex)}/>
                        <div className="custom-radio">
                            <p>{option}</p>
                        </div>
                        </label>

                            //   :
                            // displayOption.length > 13 &&  displayOption.length < 26 ?
                            // <div className="col-sm-8" key={"subattr-" + index} >
                            //         <div className="button_with_checkbox p-0">
                            //             <input disabled={!isEnabled} type="radio" checked={checked} id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} name={`variation-option-${ProductSubAttribute.parentAttribute}`} value={option} onClick={this.props.click.bind(this, newOption, ProductSubAttribute.parentAttribute, attrIndex)} />
                            //             <label htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} className="label_select_button" title={option}>{displayOption}</label>
                            //         </div>
                            //     </div>
                            //     :
                            //     displayOption.length > 26 ?
                            //     <div className="col-sm-12" key={"subattr-" + index} >
                            //         <div className="button_with_checkbox p-0">
                            //                 <input disabled={!isEnabled} type="radio" checked={checked} id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} name={`variation-option-${ProductSubAttribute.parentAttribute}`} value={option} onClick={this.props.click.bind(this, newOption, ProductSubAttribute.parentAttribute, attrIndex)} />
                            //                 <label htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} className="label_select_button" title={option}>{displayOption}</label>
                            //             </div>
                            //         </div>
                            //         :
                            //         <div className="col-sm-4 col-xs-4" key={"subattr-" + index}>
                            //             <div className="button_with_checkbox p-0">
                            //                 <input disabled={!isEnabled} type="radio" checked={checked} id={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} name={`variation-option-${ProductSubAttribute.parentAttribute}`} value={option} onClick={this.props.click.bind(this, newOption, ProductSubAttribute.parentAttribute, attrIndex)} />
                            //                 <label htmlFor={`variation-size-${option}-${_allOpt.term_id}-${randomNum}`} className="label_select_button" title={option}>{displayOption}</label>
                            //             </div>
                            //         </div>
                    )
                })
            ) : ""
        )
    }
}
function mapStateToProps(state) {
    return {};
}
const connectedProductSubAtrribute = connect(mapStateToProps)(ProductSubAtrribute);
export { connectedProductSubAtrribute as ProductSubAtrribute };