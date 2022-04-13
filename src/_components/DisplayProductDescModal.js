import React from 'react';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';
import { Markup } from 'interweave';
export const DisplayProductDescModal = (props) => {
    const { getVariationProductData } = props;
    //var _data=JSON.parse( getVariationProductData)
   // console.log("Variation: ", getVariationProductData);
    return(           
        <div className="modal fade modal-small" id="displayproductdesciption" role="dialog">
            <div className="modal-dialog modal-sm modal-center-block">
            <div className="modal-content">
                <div className="modal-header header-modal modal-mini-header">
                    <h1>{getVariationProductData ? getVariationProductData.Title : " "}</h1>
                    <div className="data-dismiss" data-dismiss="modal">
                        <img src="../assets/img/close.svg"  alt=""/>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="full-product">
                        <div className="full-product-image">
                            <img src={getVariationProductData ? getVariationProductData.ProductImage : '../assets/img/placeholder.png'} alt=""/>
                        </div>
                        <div className="full-product-description px-4">
                        {getVariationProductData && getVariationProductData.ShortDescription ?
                         <div className="full-product-sections">
                                <h6>{LocalizedLanguage.shortdescription}</h6>
                                <div>{getVariationProductData ? <Markup content={getVariationProductData.ShortDescription} /> : ''}</div>
                            </div>
                            : <div></div>
                        }
                           {getVariationProductData && getVariationProductData.Description ?
                            <div className="full-product-sections">
                                <h6>{LocalizedLanguage.longdescription}</h6>
                                <div>{getVariationProductData ? <Markup content={getVariationProductData.Description} /> : ''} </div>
                            </div>
                            : <div></div>
                        }
                        {getVariationProductData && getVariationProductData.Sku ?
                            <div className="full-product-sections">
                                <h6>Sku</h6>
                                <div>{getVariationProductData ? <Markup content={getVariationProductData.Sku} /> : ''} </div>
                            </div>
                            : <div></div>
                        }
                         {
                          getVariationProductData && getVariationProductData.ProductAttributes &&
                            <div className="full-product-sections">
                                <h6>Product Details</h6>
                                <ul>
                                    {
                                        getVariationProductData.Sku &&  getVariationProductData.Sku !=='' && <li key={"sku"}>{"Sku" + " : " +  getVariationProductData.Sku}</li>
                                    }
                                    {
                                          getVariationProductData.Barcode && getVariationProductData.Barcode !=='' && <li key={'barcode'}>{"Barcode" + " : " +  getVariationProductData.Barcode}</li>
                                    }
                                    {
                                    
                                    getVariationProductData && getVariationProductData.ProductAttributes &&
                                        getVariationProductData.ProductAttributes.map((item,index)=>{
                                            if(item && item.Option){
                                        return <li key={index}>{item.Name + " : " +  item.Option}</li>
                                            }
                                        })
                                    }                                  
                                </ul>
                            </div>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
