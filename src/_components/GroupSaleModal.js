import React from 'react';
import { connect } from 'react-redux';

import { Markup } from 'interweave';

import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";

class GroupSaleModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
      
        this.handleSelection = this.handleSelection.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }
   
  
    handleSelection(selectedGroupSale) {
        localStorage.setItem("selectedGroupSale",JSON.stringify(selectedGroupSale));
        this.closeModel();
       
    }


    closeModel() {
       // $(".custom_radio input").prop("checked", false);
      
        $('.close').trigger('click');
        hideModal('groupsalemodal');
        // if (isMobileOnly == true) {
        //     this.props.openModal("")
        // }
    }

   

    render() {
       var groupSale=this.props.GroupSaleRecord;
       if(!groupSale){
        groupSale= localStorage.getItem("GroupSaleRecord")? JSON.parse(localStorage.getItem("GroupSaleRecord")):null
       }      
       var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
         var groupSaleType=user && user.group_sales && user.group_sales !== null && user.group_sales !== "" && user.group_sales !== "undefined" ?user.group_sales_by:""
        return (
         
                <div id="groupsalemodal" tabIndex="-1" className="modal modal-wide fade full_height_one disabled_popup_tile_close modal-wide-responsive">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close fs36 mt-0" aria-hidden="true" data-dismiss="modal" onClick={() => this.closeModel()} >
                                    <img src="assets/img/Close.svg" />
                                    {/* <i className="icon icon-fill-close icon-css-override text-danger pointer push-top-3"></i> */}
                                </button>
                                <h4 className="modal-title">{'Add '+ groupSaleType}</h4>
                            </div>
                            <div className="modal-body pl-0 pr-0 pt-0" id="scroll_mdl_body">
                                <div className="all_product">
                                    <div className="overflowscroll" id="scroll_mdl_body">
                                            <div id="viewTile">  
                                                <div>
                                                    <table className="table ShopProductTable" id="list">
                                                        <colgroup>
                                                            <col style={{ width: '*' }} />
                                                            <col style={{ width: 40 }} />
                                                        </colgroup>
                                                        <tbody>
                                                            {( !groupSale) ?
                                                                <tr>
                                                                    <td>  <i className="fa fa-spinner fa-spin">{LocalizedLanguage.loading}</i></td>
                                                                </tr>
                                                                 :
                                                                 groupSale && groupSale.length==0?
                                                                 <tr key="norecord" >
                                                                 <td align="left" className="pl-2">{LocalizedLanguage.noMatchingProductFound}</td><td ></td><td className="text-right" ></td>
                                                                 </tr>
                                                                :
                                                                groupSale && groupSale.map((item, index) => {
                                                                   
                                                                    return (
                                                                        <tr key={index} >
                                                                           
                                                                            <td align="left" className="pl-3" >{item.Label ? <Markup content={item.Label}></Markup> : 'N/A'}
                                                                            </td>
                                                                          <td style={{width: "56px"}} className="pointer" onClick={() => this.handleSelection(item)}>
                                                                                        <div className="custom_radio custom_radio_set">
                                                                                            <input type="radio" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-type="product" data-slug={item.Slug} data-id={`id_${item.Id}`} />
                                                                                            <label htmlFor={`id_${item.Id}`} className="pl-3">&nbsp;</label>
                                                                                        </div>
                                                                                    </td>
                                                                          
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        
                                    </div>
                                  
                                </div>
                            </div>
                         
                        </div>
                    </div>
                </div>
        )
    }
}

const divStyle = {
    width: "56px"
};

const divStyle2 = {
    width: "14px"
};

function mapStateToProps(state) {
    const { categorylist, productlist, attributelist, favourites } = state;
    return {
        // categorylist: categorylist.categorylist,
        // productlist: productlist,
        // attributelist: attributelist.attributelist,
        // favourites: favourites
    };
}

const connectedList = connect(mapStateToProps)(GroupSaleModal);
export { connectedList as GroupSaleModal };