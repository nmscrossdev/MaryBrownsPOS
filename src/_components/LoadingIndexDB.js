import React from 'react';
import { connect } from 'react-redux';
import { idbProductActions, taxRateAction,tipsActions } from '../_actions';
import { get_UDid } from '../ALL_localstorage'
import { openDb } from 'idb';
import Config from '../Config';
import { history } from '../_helpers';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { checkoutActions } from '../CheckoutPage';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import { refresh } from './views/m.commonjs'
import { refreshwebManu } from "../_components/CommonFunction";
import ActiveUser from '../settings/ActiveUser';
import LoaderOnboarding from '../onboarding/components/LoaderOnboarding'
import { serverRequest } from '../CommonServiceRequest/serverRequest'
import { checkShopSTatusAction, discountActions, attributesActions,categoriesActions, cartProductActions,exchangerateActions,productModifierActions } from '../_actions';
import { favouriteListActions } from '../ShopView';
import { selfCheckoutActions } from '../SelfCheckout/actions/selfCheckout.action';
import { cashManagementAction } from "../CashManagementPage/actions/cashManagement.action";
import { registerActions } from '../LoginRegisterPage/actions/register.action';
import { redirectToURL } from './CommonJS';
class LoadingIndexDB extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loadingProducts: '',loadPerc:0 }
        // this.props.dispatch(idbProductActions.createProductDB());
        this.props.dispatch(productModifierActions.getAll());
        if (!localStorage.getItem("shopstatus")) {
            this.props.dispatch(checkShopSTatusAction.getStatus());
        }
        this.props.dispatch(taxRateAction.getTaxSetting());
        this.props.dispatch(checkoutActions.getOrderReceipt());
        localStorage.removeItem("tipsInfo"); 
        this.props.dispatch(tipsActions.getAll());
        //ActiveUser.key.isSelfcheckout =  localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem('selectedRegister')).IsSelfCheckout : null
        this.getProductList = this.getProductList.bind(this);

        const UID = get_UDid('UDID');
        if (sessionStorage.getItem("AUTH_KEY")) {
           
            this.props.dispatch(checkShopSTatusAction.getStatus());
            // this.props.dispatch(selfCheckoutActions.get_selfcheckout_setting());
            // this.props.dispatch(cartProductActions.getTaxRateList());
            // this.props.dispatch(taxRateAction.getGetRates());
            // this.props.dispatch(taxRateAction.getIsMultipleTaxSupport());
            this.props.dispatch(checkoutActions.GetExtensions());

            this.props.dispatch(favouriteListActions.userList());
            
            
            this.props.dispatch(favouriteListActions.get_TickeraSetting());
            this.props.dispatch(checkoutActions.cashRounding());
            this.props.dispatch(checkoutActions.getOrderReceipt());
            this.props.dispatch(discountActions.getAll());
            this.props.dispatch(categoriesActions.getAll());
            this.props.dispatch(attributesActions.getAll());
            //this.props.dispatch(pinLoginActions.getBlockerInfo())
            // this.props.dispatch(cartProductActions.getTaxRateList());
            
            this.props.dispatch(exchangerateActions.getUSDConversionRate());
           
            const register_Id = localStorage.getItem('register');
            this.props.dispatch(registerActions.GetRegisterPermission(register_Id));
            // this.props.dispatch(checkoutActions.GetExtensions());
            if (UID && register_Id) {
                // this.props.dispatch(favouriteListActions.getAll(UID, register_Id));
                var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
                var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
                if (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true) {
                    this.props.dispatch(cashManagementAction.GetOpenRegister(register_Id));
                }
                else {
                    localStorage.setItem("IsCashDrawerOpen", "false");
                }
            }
            
        }
        else {
            history.push('/login');
        }



    }

    componentWillMount() {

        if (!localStorage.getItem('UDID')) {
            history.push('/login');
        }

        // if (!localStorage.getItem('clientDetail') || !sessionStorage.getItem("issuccess")) { //localStorage.getItem('user')
        //     redirectToURL()
        //     // history.push('/loginpin');
        // }

    }
    getProductList(pn, pz, pl, trc) {
        if (trc != 0) {
            var _perc=((pl.length*100)/trc).toFixed(0);
            this.setState({ loadingProducts: "Synched " + pl.length + " Products, Out of " + trc + "",loadPerc: _perc });          
        }

        var self = this;
        // if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
        //     redirectToURL()
        //     // history.push('/loginpin');
        // }
        var RedirectUrl ='/SelfCheckoutView';// ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/shopview';

        var udid = get_UDid(localStorage.getItem("UDID"));
        var reloadCount = localStorage.getItem("ReloadCount") ? localStorage.getItem("ReloadCount") : 0;
        var WarehouseId = localStorage.getItem("WarehouseId") ? parseInt(localStorage.getItem("WarehouseId")) : 0;

        var pageNumber = pn;
        var PageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;
        var ProductArray = pl;
        var TotaltotalRecord = trc;
        const requestOptions = {
            method: 'GET',
            headers: {
                "access-control-allow-origin": "*",
                "access-control-allow-credentials": "true",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
            }
            , mode: 'cors'
        };
        var isDemoUser =localStorage.getItem('demoUser') == 'true' && localStorage.getItem('DemoGuid');
        if (isDemoUser==true) {
            requestOptions.headers['demoauth'] = localStorage.getItem('DemoGuid') && localStorage.getItem('DemoGuid')
        }
        if (TotaltotalRecord == 0 && isDemoUser==false) {
            // window.location = RedirectUrl ;  
            self.UpdateIndexDB(udid, ProductArray, RedirectUrl);
        }
        // call firstTime------------------
        //  call common service
        //  serverRequest.clientServiceRequest('GET', `/ShopData/GetProductPageUpdatedWithCount?udid=${udid}&pageNumber=${pageNumber}&pageSize=${PageSize}`, '')

        fetch(`${Config.key.OP_API_URL}/v1/Product/Records?pageNumber=${pageNumber}&pageSize=${PageSize}&WarehouseId=${WarehouseId}`, requestOptions)
            .then(response => {
                if (response.ok) { return response.json(); }
                throw new Error(response.statusText)  // throw an error if there's something wrong with the response
            })
            .then(function handleData(data) {
                var reloadCount = localStorage.getItem("ReloadCount");
                ProductArray = [...new Set([...ProductArray, ...data.content.Records])];
               
                //check dataExist into indexdb-------------------------
                var isExist = false;
                      
                console.log("--------------Total Products count--------" + TotaltotalRecord);               
               
                console.log("Test", TotaltotalRecord, ProductArray.length)
                if (isDemoUser==false && (TotaltotalRecord > ProductArray.length) && ((TotaltotalRecord != ProductArray.length) || pageNumber <= (TotaltotalRecord / PageSize * 1.0))) {
                    console.log("--------------Product list request time--------" + new Date());
                    // self.UpdateIndexDB(udid,ProductArray);
                    pageNumber++;
                    //console.log("ProductArray1",ProductArray.length)                   
                    self.getProductList(pageNumber, PageSize, ProductArray, TotaltotalRecord);
                }
                else {
                    console.log("--------------all records are done-----------");
                    //console.log("ProductArray2",ProductArray.length)                        
             
                    self.UpdateIndexDB(udid, ProductArray, RedirectUrl);
                    //history.push('/shopview');

                }
            })
            .catch(function handleError(error) {
                console.error('Console.save: No data ' + error + " " + JSON.stringify(error));
                var reloadCount = localStorage.getItem("ReloadCount");
                // handle errors here
                if (reloadCount < 3) {
                    localStorage.setItem("ReloadCount", (parseInt(reloadCount) + 1));
                    setTimeout(function () {
                        window.location = '/'; //Reload to get product
                        // window.location = '/shopview'
                    }, 1000)
                    history.push('/')
                }
            })
    }
    async UpdateIndexDB(udid, ProductArray, RedirectUrl) {
        var TotaltotalRecord = localStorage.getItem('productcount');        
        var _perc=0;
        if(ProductArray && ProductArray.length>0 && TotaltotalRecord && TotaltotalRecord>0)
        {_perc= ((ProductArray.length*100)/TotaltotalRecord).toFixed(0);
        }
        this.setState({ loadPerc: _perc });    
        
        const dbPromise = openDb('ProductDB', 1, upgradeDB => {
            upgradeDB.createObjectStore(udid);
        });
        const idbKeyval = {
            async get(key) {
                const db = await dbPromise;
                return db.transaction(udid).objectStore(udid).get(key);
            },
            async set(key, val) {
                const db = await dbPromise;
                const tx = db.transaction(udid, 'readwrite');
                tx.objectStore(udid).put(val, key);
                return tx.complete;
            },
        };
        // for unique array----------------------
        const arrayUniqueByKey = [...new Map(ProductArray.map(item =>
            [item['WPID'], item])).values()];
        idbKeyval.set('ProductList', arrayUniqueByKey);

        idbKeyval.get('ProductList').then(val => {
            if (ProductArray.length == 0 || !val || val.length == 0 || val == null || val == "") {
                console.log("wait...");              
            } else {
                if (ActiveUser.key.isSelfcheckout == true) {
                    if(isMobileOnly == true){
                        history.push('/SelfCheckoutView')
                    }else{
                        window.location = '/SelfCheckoutView';
                    }
                   
                }
                // else {
                //     if(isMobileOnly == true){
                //         history.push('/shopview')
                //     }else{
                //         window.location = '/shopview';
                //     }
                // }
            }
        })

        //------------------------------------------


    }
    componentDidMount() {
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        // if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
        //     // history.push('/loginpin');
        //     redirectToURL()

        // }
        //To Clear indexDB----------------------------
        var RedirectUrl ='/SelfCheckoutView'// ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/shopview';
        var udid = get_UDid(localStorage.getItem("UDID"));
        var pcount = localStorage.getItem('productcount');
        if(isDemoUser ==false){
            if (pcount == null || typeof (pcount) == 'undefined' || pcount == 0) {
                window.location = RedirectUrl;
            }
            this.UpdateIndexDB(udid, [], RedirectUrl);
        }
        //------------------------------------------------
        localStorage.setItem("ProductLoad", "true");
        console.log("--------------Product list request First time--------" + new Date());

        this.getProductList(1, Config.key.FETCH_PRODUCTS_PAGESIZE, [], pcount);

    }

    render() {
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        console.log("isDemoUser", isDemoUser)
        return (
            (isMobileOnly == true) ?
            <LoaderOnboarding isDemoUser={isDemoUser} statusCompleted={this.state.loadPerc}/>
                // <div className="background-image-1">
                //     <div className="container-fluid">
                //         <div className="row vh-100 align-items-center">
                //             <div className="col-auto mx-auto text-center text-white">
                //                 <div className="page-title mb-20 mx-width-410 mx-auto">
                //                     <img src="mobileAssets/img/owl_tween.gif" style={{ height: '10%', width: '30%' }} />
                //                     <h1 className="h1 fz-20">{LocalizedLanguage.pleaseWait}</h1>
                //                     <p className="m-0 fz-12 lh-26">{LocalizedLanguage.loadIndexDBMsg}</p>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                //     <div className="tagOwls">
                //         {LocalizedLanguage.powerdByOliver}
                //     </div>
                // </div>
                :
                // isDemoUser == false ?
                //     <div className="bgimg-1">
                //         <div className="content_main_wapper">
                //             <div className="onboarding-loginBox">
                //                 <img src="assets/img/frame02-03s.gif" style={{ height: '40%', width: '40%' }} />
                //                 <div className="onboarding-pg-heading" ><h1>{LocalizedLanguage.pleaseWait}</h1><h2>{LocalizedLanguage.loadIndexDBMsg}</h2></div>
                //                 {/* <p style={{fontSize:12}}>{this.state.loadingProducts}</p> */}
                //             </div>
                //             <div className="powered-by-oliver">
                //                 <a href="javascript:void(0)">{LocalizedLanguage.powerdByOliver}</a>
                //             </div>
                //         </div>
                //     </div>
                //     :
                    <LoaderOnboarding isDemoUser={isDemoUser} statusCompleted={this.state.loadPerc}/>
        )
    }
}

function mapStateToProps(state) {
    const { productlist } = state;
    return {
        productlist: productlist
    };
}

const connectedList = connect(mapStateToProps)(LoadingIndexDB);
export { connectedList as LoadingIndexDB };