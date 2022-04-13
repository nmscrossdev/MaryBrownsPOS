import React from 'react';
import Footer from '../../_components/views/m.Footer';
import CustomerList from './m.CustomerList';
import CustomerEdit from './m.CustomerEdit';
import Header from '../../_components/views/m.Header';
const MobileCustomerView = (props) => {
    const { CommonHeader, NavbarPage, loading, submitted, updateCustomer, customerList, filterCustomer, setAndroidKeyboard, search, LocalizedLanguage, activeFilter, filteredList, activeClass, TotalRecords, PageNumber, PageSize, loadMore, activeCreateEditDiv, ActiveAddToSale, backUrl, clearInput} = props;
    //console.log("activeCreateEditDiv", activeCreateEditDiv)
    var isDemoUser = localStorage.getItem('demoUser')
    const tdNotFound = {
        textAlign: "unset"
    };
    const pStylenotFound = {
        textAlign: 'center'
    };
    return (
        activeCreateEditDiv == "create" || activeCreateEditDiv == "edit" ?
            <CustomerEdit {...props} Header={Header} />
            :
            <div>
                <div className="appHeader">
                    <div className="container-fluid">
                        {backUrl ?
                            <Header backUrl={backUrl} />
                            :
                            <CommonHeader {...props} />
                        }
                    </div>
                </div>
                <div className={isDemoUser == true || isDemoUser == 'true' ? "appCapsule h-100 appCapsuleBoarding" : "appCapsule h-100"}>
                    <div className="bg-light py-2">
                        <div className="toggleSearchboxFull fadeIn my-0">
                            <div className="searchbar-input-container searchbar-input-container">
                                <input onClick={setAndroidKeyboard("search")} onChange={filterCustomer} value={search} className="searchbar-input searchbar-input" placeholder={LocalizedLanguage.placeholderSearchOfCustomer}
                                    type="text" autoComplete="off" autoCorrect="off" spellCheck="false" />
                                {/* <button className="searchbar-search-icon"> */}
                                <button onClick={() => clearInput()} className="searchbar-clear-icon shadow-none">
                                     <img src="../mobileAssets/img/close.svg" className="w-20" alt="" />
                                </button>
                                {/* </button> */}
                            </div>
                        </div>
                    </div>
                    <div className="scroll_head-foot_search scrollbar">
                        <table className="table table-striped mb-0 table-verticle-middle table-customer table-layout-fixed">
                            <tbody>
                                {activeFilter == true && filteredList && filteredList.length > 0 ?
                                    filteredList.map((item, index) => {
                                        return (
                                            <CustomerList goBack={props.goBack} addNewCustomter={props.addNewCustomter} key={index} items={item} onClick={() => activeClass(item, index)} />
                                        )
                                    })
                                    :
                                    activeFilter == false && customerList !== null && customerList.length > 0 ?
                                    customerList.map((item, index) => {
                                        return (
                                            <CustomerList goBack={props.goBack} addNewCustomter={props.addNewCustomter} key={index} items={item} onClick={() => activeClass(item, index)} />
                                        )
                                    })
                                    :
                                    <tr>
                                        <td style={tdNotFound}><p style={pStylenotFound}>{LocalizedLanguage.noFound}</p></td>
                                    </tr>
                                    }
                            </tbody>
                        </table>
                    </div>
                </div>
                {(TotalRecords > (PageNumber * PageSize)) && activeFilter == false ?
                    <div className="appBottomMenu appBottomCustomerButton" style={{ marginBottom: 50 }}>
                        <button onClick={() => loadMore(1)} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                    </div>
                    : <div />}
                <NavbarPage {...props} />
                <Footer {...props} active="customerview" />
            </div>
    )
}
export default MobileCustomerView;