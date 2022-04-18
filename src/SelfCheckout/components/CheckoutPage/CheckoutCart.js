import React from 'react';
import { history } from '../../../_helpers';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import ActiveUser from '../../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import CommonJs, { onBackTOLoginBtnClick } from '../../../_components/CommonJS';
class CheckoutCart extends React.Component {
    constructor(props) {
        super(props);
        this.GoBackhandleClick = this.GoBackhandleClick.bind(this);
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof EnableContentScroll != "undefined"){EnableContentScroll();}
        }, 2000)

    }

    GoBackhandleClick() {
        history.push('/SelfCheckoutView');
        setTimeout(function () { selfCheckoutJs(); }, 100)
    }


    render() {
        const { checkList, cash_round, payments, count, paid_amount, Markup, NumberFormat, RoundAmount, RemoveCustomer, cartDiscountAmount, selfcheckoutstatusmanagingevnt, SelfCheckoutStatus } = this.props;
        var landingScreen = '';
        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
        var register_content = Register_Permissions ? Register_Permissions.content : '';
        var landingScreen=ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo :''; 
        // if (Register_Permissions) {
        //     Register_Permissions.content && Register_Permissions.content.filter(item => item.slug == "landing-screen").map(permission => {
        //         landingScreen = permission.value;
        //     })
        // }
        console.log("checkList-----",checkList)
        console.log("payments-----",payments)
        console.log("count-----",count)
        console.log("paid_amount-----",paid_amount)
        console.log("RoundAmount-----",RoundAmount)
        console.log("SelfCheckoutStatus-----",SelfCheckoutStatus)
        console.log("cartDiscountAmount-----",cartDiscountAmount)
        return (
            <div>
                <div className="portrait">

                    {/* <div className="page-payment scroll-hidden">
                        <div className="payment-nav">
                            <button className="btn btn-success text-uppercase btn-14" onClick={() => this.GoBackhandleClick()}>{LocalizedLanguage.goBack}</button>
                        </div>
                        <div className="payment-content pt-3">
                            <div className="w-100">
                                <div className="payment-page-title">
                                    <img src={landingScreen} className="mx-auto" alt="" />
                                    <div className="spacer-40"></div>
                                    <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.orderDetails}</h1>
                                    <div className="spacer-25"></div>
                                </div>
                                <div className="self-checkout-table widget_day_record">
                                    <div className="self-checkout-product-light">
                                        <div className="self-checkout-all-product overflowscroll">
                                            <table className="table table-customise table-day-record fixed-table-cell">
                                                <tbody>
                                                    {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                                                        var _order_Meta= product.addons_meta_data && product.addons_meta_data.length>0 ? CommonJs.showAddons("",product.addons_meta_data):""
                                                        return (
                                                            <tr key={"cart" + index}>
                                                                <td className="action action-short action-pointer">
                                                                    <h6>{product.quantity ? product.quantity : (product.customTags && (typeof product.customTags !== 'undefined')) ? "" : 1 || (product.customExtFee && (typeof product.customExtFee !== 'undefined')) ? "" : 1}</h6>
                                                                </td>
                                                                <td>
                                                                    <div className="widget_day_record_text">
                                                                        <h6><Markup content={product.Title} /></h6>
                                                                        {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
                                                                        {(product.customTags && (typeof product.customTags !== 'undefined')) ?
                                                                            this.extensionArray(product.customTags)
                                                                            :
                                                                            (product.customExtFee && (typeof product.customExtFee !== 'undefined') && product.Price !== 0) ?
                                                                                <div className="font-italic">{product.customExtFee}</div>
                                                                                :
                                                                                <div className="font-italic">{product.color}  {product.size ? ',' + product.size : null}</div>
                                                                        }
                                                                        {product.psummary && typeof product.psummary!="undefined" && product.psummary!=""?<div  style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{product.psummary}</div>:null}
                                                                    </div>
                                                                </td>
                                                                {(typeof product.product_id !== 'undefined') ?
                                                                    <td>
                                                                        <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - product.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</span>
                                                                        {parseFloat(product.product_discount_amount) !== 0.00 ?
                                                                            <del>
                                                                                <div className="widget_day_record_text text-right">
                                                                                    <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                                </div>
                                                                            </del>
                                                                            :
                                                                            <div className="widget_day_record_text text-right">
                                                                                <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    :
                                                                    <td>
                                                                        <div className="widget_day_record_text text-right">
                                                                            <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                        </div>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <table id="tblminusto_list" className="table table-day-record">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="2">
                                                        <div className="widget_day_record_text">
                                                            <h6>{LocalizedLanguage.tax}: <NumberFormat value={checkList && checkList.tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <div className="widget_day_record_text text-right">
                                                            <h6>{LocalizedLanguage.total}: <NumberFormat value={checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="payment-button-group pb-0">
                                        <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")}>{LocalizedLanguage.continueToPayment}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="payment-footer text-center">
                            <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                            <img src="../../assets/img/images/logo-light.svg" alt=""/>
                        </div>
                    </div> */}



        <div className="topnav margin-bottom-59">
          <img onclick="changeURL('./Home_Screen.html')" src="../assets/Mary_Browns_Logo.png" alt="" />
          <div className="topnav-row">
            <div className="topnav-col">
              <div onclick="toggleApp('nutrition-info')" className="icon">
                <svg width={21} height={24} viewBox="0 0 21 24">
                  <path d="M6.47479 10.0959C6.53541 10.2782 6.5212 10.4771 6.43529 10.6489C6.34938 10.8207 6.19879 10.9514 6.01659 11.0123C5.79398 11.0827 5.58751 11.1964 5.40907 11.347C5.23064 11.4976 5.08377 11.6819 4.97694 11.8895C4.70869 12.3956 4.52454 13.2279 4.69419 14.5865C4.71208 14.7744 4.65602 14.9618 4.53791 15.109C4.4198 15.2562 4.24895 15.3515 4.06167 15.3748C3.87439 15.398 3.68543 15.3473 3.53495 15.2334C3.38447 15.1195 3.28432 14.9514 3.25579 14.7649C3.06294 13.2235 3.24129 12.0621 3.69804 11.208C4.16204 10.338 4.86819 9.86679 5.55839 9.63769C5.74068 9.57708 5.93957 9.59128 6.11139 9.67719C6.28321 9.7631 6.41391 9.91369 6.47479 10.0959ZM13.6291 2.31229C13.8046 2.24629 13.9477 2.11484 14.0284 1.94556C14.109 1.77628 14.121 1.58232 14.0617 1.40443C14.0024 1.22653 13.8765 1.07853 13.7104 0.991502C13.5443 0.904474 13.3509 0.885187 13.1709 0.937692C11.8108 1.39009 10.9625 2.50659 10.4652 3.70284C10.3977 3.86452 10.3358 4.02847 10.2796 4.19439C10.0084 3.67994 9.66135 3.20922 9.25009 2.79804C8.69276 2.23951 8.02707 1.80089 7.29395 1.50914C6.56084 1.21739 5.77579 1.07868 4.98709 1.10154C4.58316 1.1125 4.19877 1.27776 3.91291 1.56335C3.62705 1.84894 3.46143 2.23317 3.45009 2.63709C3.42723 3.43639 3.5703 4.23175 3.87029 4.97297C4.17027 5.71419 4.62065 6.38518 5.19299 6.94359C3.97499 7.20743 2.87428 7.85638 2.05376 8.79441C1.23325 9.73244 0.736521 10.9097 0.637092 12.152L0.628392 12.2593C0.436965 14.6477 0.945889 17.0402 2.09289 19.1439L2.61344 20.098C2.62794 20.1226 2.64244 20.1473 2.65984 20.1705L4.10984 22.2034C4.43848 22.6636 4.86343 23.0468 5.35515 23.3261C5.84687 23.6055 6.39355 23.7743 6.95715 23.821C7.52075 23.8676 8.08775 23.7909 8.6187 23.5962C9.14966 23.4015 9.63181 23.0934 10.0316 22.6935C10.093 22.6321 10.1659 22.5833 10.2462 22.5501C10.3264 22.5169 10.4124 22.4997 10.4993 22.4997C10.5861 22.4997 10.6721 22.5169 10.7524 22.5501C10.8326 22.5833 10.9055 22.6321 10.9669 22.6935C11.3667 23.0934 11.8489 23.4015 12.3798 23.5962C12.9108 23.7909 13.4778 23.8676 14.0414 23.821C14.605 23.7743 15.1517 23.6055 15.6434 23.3261C16.1351 23.0468 16.5601 22.6636 16.8887 22.2034L18.3387 20.1719C18.3561 20.1483 18.3721 20.1236 18.3865 20.098L18.9056 19.1439C20.0531 17.0403 20.5626 14.6479 20.3716 12.2593L20.3629 12.152C20.2987 11.3514 20.0689 10.5729 19.6882 9.86577C19.3074 9.15863 18.7839 8.53828 18.1509 8.04401C17.5179 7.54975 16.7891 7.19234 16.0107 6.99443C15.2323 6.79652 14.4213 6.76242 13.6291 6.89429L11.225 7.29449C11.2395 6.30704 11.4135 5.19634 11.8021 4.25964C12.2095 3.28089 12.8127 2.58489 13.6291 2.31229ZM8.64109 7.10599L8.41779 7.06829C7.56684 6.90375 6.78489 6.48751 6.17319 5.87349C5.75399 5.45568 5.42477 4.95647 5.20582 4.4066C4.98687 3.85673 4.88282 3.26785 4.90009 2.67624C4.90047 2.64265 4.91408 2.61057 4.93797 2.58695C4.96186 2.56333 4.9941 2.55009 5.02769 2.55009C5.61906 2.53302 6.20766 2.63717 6.75726 2.85611C7.30687 3.07506 7.80585 3.40417 8.22349 3.82319C9.10364 4.70334 9.52849 5.86479 9.49659 7.02044C9.49621 7.05378 9.4828 7.08565 9.45923 7.10923C9.43565 7.1328 9.40378 7.14622 9.37044 7.14659C9.12662 7.1534 8.88265 7.13982 8.64109 7.10599ZM8.16549 8.49654L8.41779 8.53859L9.54589 8.72709C10.1776 8.83244 10.8224 8.83244 11.4541 8.72709L13.8669 8.32399C14.4612 8.22486 15.0697 8.25029 15.6537 8.39867C16.2377 8.54704 16.7845 8.81512 17.2594 9.18592C17.7344 9.55672 18.1271 10.0221 18.4127 10.5527C18.6984 11.0833 18.8707 11.6674 18.9187 12.268L18.9259 12.3753C19.0947 14.4831 18.6452 16.5944 17.6325 18.4508L17.1337 19.3643L15.7084 21.3595C15.5023 21.6484 15.2356 21.889 14.9271 22.0644C14.6186 22.2398 14.2755 22.3459 13.9218 22.3753C13.5681 22.4047 13.2122 22.3567 12.879 22.2346C12.5457 22.1125 12.243 21.9193 11.992 21.6683C11.5961 21.2725 11.0592 21.0501 10.4993 21.0501C9.93937 21.0501 9.40241 21.2725 9.00649 21.6683C8.75549 21.9193 8.45283 22.1125 8.11956 22.2346C7.7863 22.3567 7.43043 22.4047 7.07673 22.3753C6.72302 22.3459 6.37997 22.2398 6.07143 22.0644C5.76289 21.889 5.49628 21.6484 5.29014 21.3595L3.86479 19.3643L3.36599 18.4508C2.35335 16.5944 1.90388 14.4831 2.07259 12.3753L2.08129 12.268C2.12932 11.6674 2.30161 11.0833 2.58723 10.5527C2.87286 10.0221 3.2656 9.55672 3.74055 9.18592C4.21549 8.81512 4.7623 8.54704 5.3463 8.39867C5.9303 8.25029 6.53875 8.22486 7.13309 8.32399L8.16549 8.49654Z" fill="white" />
                </svg>
                <p>Nutrition</p>
              </div>
            </div>
            <div className="topnav-col">
              <div onclick="toggleApp('offers')" className="icon">
                <svg width={18} height={20} viewBox="0 0 18 20">
                  <path d="M18 12V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V12C0.530433 12 1.03914 11.7893 1.41421 11.4142C1.78929 11.0391 2 10.5304 2 10C2 9.46957 1.78929 8.96086 1.41421 8.58579C1.03914 8.21071 0.530433 8 0 8V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V8C17.4696 8 16.9609 8.21071 16.5858 8.58579C16.2107 8.96086 16 9.46957 16 10C16 10.5304 16.2107 11.0391 16.5858 11.4142C16.9609 11.7893 17.4696 12 18 12ZM16 13.465C15.3917 13.114 14.8865 12.6089 14.5354 12.0007C14.1843 11.3924 13.9996 10.7023 14 10C14 8.52 14.804 7.227 16 6.535V2H2V6.535C3.196 7.227 4 8.52 4 10C4 11.48 3.196 12.773 2 13.465V18H16V13.465ZM6 4H12V6H6V4ZM6 14H12V16H6V14Z" fill="white" />
                </svg>
                <p>Offers</p>
              </div>
            </div>
            <div className="topnav-col">
              <div onclick="toggleApp('loyalty')" className="icon">
                <svg width={26} height={24} viewBox="0 0 26 24">
                  <path d="M25.0859 9.08877C24.9694 8.7272 24.7551 8.40493 24.4667 8.15763C24.1784 7.91034 23.8272 7.74766 23.4521 7.68761L17.5661 6.73104L14.8375 1.42877C14.6637 1.09122 14.4003 0.808062 14.0761 0.610374C13.752 0.412687 13.3797 0.308105 13 0.308105C12.6203 0.308105 12.248 0.412687 11.9239 0.610374C11.5997 0.808062 11.3363 1.09122 11.1625 1.42877L8.43391 6.73104L2.548 7.68761C2.17327 7.7486 1.82258 7.91163 1.53441 8.15882C1.24624 8.406 1.03172 8.72779 0.914395 9.08887C0.797069 9.44995 0.781469 9.83637 0.869306 10.2057C0.957144 10.5751 1.14502 10.9131 1.41233 11.1827L5.61194 15.4163L4.70296 21.3097C4.64463 21.6851 4.69095 22.0692 4.83684 22.42C4.98272 22.7707 5.22251 23.0744 5.52984 23.2977C5.83716 23.521 6.20011 23.6552 6.57877 23.6856C6.95743 23.7159 7.33712 23.6413 7.6761 23.4698L13 20.784L18.3241 23.4698C18.6631 23.6409 19.0427 23.7153 19.4212 23.6848C19.7997 23.6543 20.1625 23.5201 20.4697 23.2969C20.7769 23.0736 21.0167 22.7701 21.1626 22.4195C21.3086 22.069 21.3552 21.685 21.2972 21.3097L20.3882 15.4163L24.5878 11.1827C24.856 10.9136 25.0444 10.5756 25.1324 10.206C25.2203 9.83646 25.2042 9.44977 25.0859 9.08877ZM23.434 10.0384L18.657 14.8539L19.6911 21.5575C19.704 21.6378 19.6943 21.7201 19.6632 21.7952C19.6322 21.8704 19.5809 21.9354 19.5151 21.9832C19.4494 22.031 19.3716 22.0596 19.2906 22.066C19.2095 22.0723 19.1283 22.056 19.0559 22.019L13 18.9639L6.94403 22.0191C6.87164 22.0562 6.79042 22.0724 6.70937 22.0661C6.62831 22.0597 6.55059 22.0311 6.48482 21.9833C6.41904 21.9355 6.36778 21.8705 6.33672 21.7953C6.30565 21.7202 6.29599 21.6379 6.30881 21.5576L7.34297 14.8539L2.56603 10.0383C2.50899 9.98069 2.4689 9.90847 2.45017 9.82957C2.43144 9.75067 2.43479 9.66814 2.45985 9.59102C2.48491 9.51389 2.53071 9.44515 2.59223 9.39233C2.65376 9.33951 2.72864 9.30463 2.80866 9.29154L9.50371 8.2035L12.6074 2.17236C12.6445 2.10021 12.7008 2.03969 12.7701 1.99744C12.8393 1.95518 12.9189 1.93283 13 1.93283C13.0811 1.93283 13.1607 1.95518 13.2299 1.99744C13.2992 2.03969 13.3555 2.10021 13.3926 2.17236L16.4963 8.2035L23.1913 9.29154C23.2714 9.30463 23.3462 9.33951 23.4078 9.39233C23.4693 9.44515 23.5151 9.51389 23.5402 9.59102C23.5652 9.66814 23.5686 9.75067 23.5498 9.82957C23.5311 9.90847 23.491 9.98069 23.434 10.0383L23.434 10.0384Z" fill="white" />
                </svg>
                <p>Loyalty</p>
              </div>
            </div>
            <div className="topnav-col">
              <div className="icon big relative disabled">
                <svg width={27} height={27} viewBox="0 0 27 27">
                  <path d="M0 1.625C0 1.39294 0.0921872 1.17038 0.256282 1.00628C0.420376 0.842187 0.642936 0.75 0.875 0.75H3.5C3.69518 0.750054 3.88474 0.815364 4.03853 0.935543C4.19232 1.05572 4.30152 1.22387 4.34875 1.41325L5.0575 4.25H25.375C25.5035 4.25012 25.6304 4.27853 25.7466 4.33321C25.8629 4.3879 25.9657 4.46751 26.0477 4.56641C26.1297 4.6653 26.1889 4.78104 26.2212 4.90541C26.2534 5.02977 26.2579 5.15971 26.2343 5.286L23.6093 19.286C23.5717 19.4865 23.4653 19.6676 23.3084 19.798C23.1515 19.9284 22.954 19.9998 22.75 20H7C6.79601 19.9998 6.59849 19.9284 6.44159 19.798C6.2847 19.6676 6.17829 19.4865 6.14075 19.286L3.5175 5.31225L2.8175 2.5H0.875C0.642936 2.5 0.420376 2.40781 0.256282 2.24372C0.0921872 2.07962 0 1.85706 0 1.625ZM5.4285 6L7.72625 18.25H22.0238L24.3215 6H5.4285ZM8.75 20C7.82174 20 6.9315 20.3687 6.27513 21.0251C5.61875 21.6815 5.25 22.5717 5.25 23.5C5.25 24.4283 5.61875 25.3185 6.27513 25.9749C6.9315 26.6313 7.82174 27 8.75 27C9.67826 27 10.5685 26.6313 11.2249 25.9749C11.8813 25.3185 12.25 24.4283 12.25 23.5C12.25 22.5717 11.8813 21.6815 11.2249 21.0251C10.5685 20.3687 9.67826 20 8.75 20ZM21 20C20.0717 20 19.1815 20.3687 18.5251 21.0251C17.8687 21.6815 17.5 22.5717 17.5 23.5C17.5 24.4283 17.8687 25.3185 18.5251 25.9749C19.1815 26.6313 20.0717 27 21 27C21.9283 27 22.8185 26.6313 23.4749 25.9749C24.1313 25.3185 24.5 24.4283 24.5 23.5C24.5 22.5717 24.1313 21.6815 23.4749 21.0251C22.8185 20.3687 21.9283 20 21 20ZM8.75 21.75C9.21413 21.75 9.65925 21.9344 9.98744 22.2626C10.3156 22.5908 10.5 23.0359 10.5 23.5C10.5 23.9641 10.3156 24.4092 9.98744 24.7374C9.65925 25.0656 9.21413 25.25 8.75 25.25C8.28587 25.25 7.84075 25.0656 7.51256 24.7374C7.18437 24.4092 7 23.9641 7 23.5C7 23.0359 7.18437 22.5908 7.51256 22.2626C7.84075 21.9344 8.28587 21.75 8.75 21.75ZM21 21.75C21.4641 21.75 21.9092 21.9344 22.2374 22.2626C22.5656 22.5908 22.75 23.0359 22.75 23.5C22.75 23.9641 22.5656 24.4092 22.2374 24.7374C21.9092 25.0656 21.4641 25.25 21 25.25C20.5359 25.25 20.0908 25.0656 19.7626 24.7374C19.4344 24.4092 19.25 23.9641 19.25 23.5C19.25 23.0359 19.4344 22.5908 19.7626 22.2626C20.0908 21.9344 20.5359 21.75 21 21.75Z" fill="white" />
                </svg>
                <div className="topnav-indicator">
                  <p>2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="category-header-row">
          <div className="category-header-col">
            <p className="title">Order Summary</p>
          </div>
          <button onclick="changeURL('./Home_Screen.html')">
            <svg width={22} height={20} viewBox="0 0 22 20">
              <path d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
            </svg>
            Go back to main menu
          </button>
        </div>
        <div className="category-header-divider margin-bottom-59" />
        <div className="cart margin-bottom-43">
          <div className="text-row">
            <p className="bold">Review your order</p>
            <p className="highlight">(X items)</p>
          </div>
          <div className="cart-items">
            <div className="items-group scroll">
              <div className="item">
                <div className="col">
                  <p className="prod-name">Tater Poutine</p>
                </div>
                <div className="row">
                  <label className="number-input-container">
                    <div onclick="decrement(this)" className="svg-container left">
                      <svg width={16} height={2} viewBox="0 0 16 2">
                        <rect width={16} height={2} fill="#758696" />
                      </svg>
                    </div>
                    <input type="number" defaultValue={1} />
                    <div onclick="increment(this)" className="svg-container right">
                      <svg width={16} height={16} viewBox="0 0 16 16">
                        <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                      </svg>
                    </div>
                  </label>
                  <div className="inner-row">
                    <p className="price">$6.99</p>
                    <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="col">
                  <p className="prod-name">Big Mary Combo</p>
                  <p className="description">Big Mary Sandwich</p>
                  <p className="description">Diet 7up</p>
                  <p className="description">Taters</p>
                  <p className="description">Small Coleslaw Salad</p>
                  <p className="note">Note: No Mayo</p>
                  <p className="note">Discount: $2.99</p>
                </div>
                <div className="row">
                  <label className="number-input-container">
                    <div onclick="decrement(this)" className="svg-container left">
                      <svg width={16} height={2} viewBox="0 0 16 2">
                        <rect width={16} height={2} fill="#758696" />
                      </svg>
                    </div>
                    <input type="number" defaultValue={1} />
                    <div onclick="increment(this)" className="svg-container right">
                      <svg width={16} height={16} viewBox="0 0 16 16">
                        <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                      </svg>
                    </div>
                  </label>
                  <div className="inner-row">
                    <p className="price">$12.99</p>
                    <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="item note">
                <div className="col">
                  <p className="prod-name">Note</p>
                  <p className="description">Please have ready for pickup at 1:30</p>
                </div>
                <div className="row">
                  <div />
                  <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                    <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="empty hide">
              <p>Cart is Empty</p>
            </div>
            <div className="cart-total">
              <div className="subtotal">
                <div className="col">
                  <p>Subtotal</p>
                  <p>Discount</p>
                  <p>Tax</p>
                </div>
                <div className="col">
                  <p className="subtotal-amount right">$19.98</p>
                  <p className="discount-amount right">$2.99</p>
                  <p className="tax-amount right">$2.99</p>
                </div>
              </div>
              <div className="total">
                <p>Total</p>
                <p className="cart-amount">$25.96</p>
              </div>
            </div>
          </div>
        </div>
        <p className="instructions">Order instructions</p>
        <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""} />
        <div className="recommendations">
          <p>Recommendations</p>
          <div className="row">
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
          </div>
        </div>
        <button onclick="changeURL('./Payment.html')" className="view-cart scroll-end">
          Continue to Payment
        </button>
        <div className="cover hide" />
        <div className="app nutrition-info hide">
          <div onclick="toggleApp()" className="close">
            <svg width={23} height={23} viewBox="0 0 23 23">
              <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
            </svg>
          </div>
          <div className="row">
            <div className="icon">
              <svg width={39} height={44} viewBox="0 0 39 44">
                <path d="M11.8659 17.9405C11.9808 18.2862 11.9539 18.6634 11.7909 18.9893C11.628 19.3151 11.3424 19.563 10.9969 19.6785C10.5747 19.812 10.1831 20.0277 9.84466 20.3133C9.50625 20.5988 9.22771 20.9485 9.0251 21.3422C8.51635 22.302 8.1671 23.8805 8.48885 26.4572C8.52279 26.8135 8.41645 27.169 8.19245 27.4482C7.96845 27.7273 7.64443 27.9081 7.28924 27.9521C6.93405 27.9962 6.57569 27.9 6.29029 27.684C6.0049 27.468 5.81497 27.1493 5.76085 26.7955C5.3951 23.8722 5.73335 21.6695 6.5996 20.0497C7.4796 18.3997 8.81885 17.506 10.1279 17.0715C10.4736 16.9565 10.8508 16.9835 11.1766 17.1464C11.5025 17.3093 11.7504 17.5949 11.8659 17.9405ZM25.4344 3.17848C25.7672 3.0533 26.0387 2.804 26.1916 2.48295C26.3446 2.1619 26.3673 1.79406 26.2548 1.45667C26.1423 1.11928 25.9035 0.838589 25.5885 0.673535C25.2735 0.508481 24.9068 0.471903 24.5654 0.571482C21.9859 1.42948 20.3771 3.54698 19.4339 5.81573C19.3059 6.12237 19.1885 6.4333 19.0819 6.74798C18.5675 5.77229 17.9093 4.87955 17.1294 4.09973C16.0723 3.04045 14.8098 2.20857 13.4194 1.65525C12.029 1.10194 10.5402 0.83887 9.04435 0.882231C8.27828 0.903022 7.54927 1.21644 7.00712 1.75808C6.46497 2.29971 6.15087 3.02843 6.12935 3.79448C6.08599 5.31039 6.35734 6.81883 6.92627 8.2246C7.49521 9.63036 8.34937 10.9029 9.43485 11.962C7.12484 12.4624 5.0373 13.6931 3.48115 15.4722C1.925 17.2512 0.982926 19.4839 0.794354 21.84L0.777854 22.0435C0.414803 26.5733 1.38 31.1107 3.55535 35.1005L4.5426 36.91C4.5701 36.9567 4.5976 37.0035 4.6306 37.0475L7.3806 40.903C8.00388 41.7758 8.80983 42.5025 9.7424 43.0323C10.675 43.5621 11.7118 43.8823 12.7807 43.9708C13.8496 44.0593 14.9249 43.9138 15.9319 43.5445C16.9389 43.1752 17.8533 42.591 18.6116 41.8325C18.7281 41.716 18.8663 41.6236 19.0185 41.5605C19.1707 41.4975 19.3338 41.465 19.4985 41.465C19.6632 41.465 19.8263 41.4975 19.9785 41.5605C20.1306 41.6236 20.2689 41.716 20.3854 41.8325C21.1436 42.591 22.0581 43.1752 23.0651 43.5445C24.072 43.9138 25.1474 44.0593 26.2163 43.9708C27.2852 43.8823 28.322 43.5621 29.2546 43.0323C30.1871 42.5025 30.9931 41.7758 31.6164 40.903L34.3664 37.0502C34.3994 37.0053 34.4297 36.9585 34.4571 36.91L35.4416 35.1005C37.6179 31.1109 38.5841 26.5735 38.2219 22.0435L38.2054 21.84C38.0836 20.3217 37.6479 18.8452 36.9257 17.504C36.2036 16.1629 35.2107 14.9864 34.0102 14.049C32.8096 13.1116 31.4274 12.4337 29.9512 12.0584C28.475 11.683 26.9369 11.6184 25.4344 11.8685L20.8749 12.6275C20.9024 10.7547 21.2324 8.64823 21.9694 6.87173C22.7421 5.01548 23.8861 3.69548 25.4344 3.17848ZM15.9744 12.27L15.5509 12.1985C13.937 11.8864 12.454 11.097 11.2939 9.93248C10.4988 9.14008 9.87443 8.19329 9.45918 7.15043C9.04393 6.10758 8.8466 4.99074 8.87935 3.86873C8.88008 3.80503 8.90589 3.74418 8.9512 3.69939C8.9965 3.6546 9.05764 3.62948 9.12135 3.62948C10.2429 3.59711 11.3592 3.79462 12.4016 4.20986C13.4439 4.6251 14.3903 5.24928 15.1824 6.04398C16.8516 7.71323 17.6574 9.91598 17.5969 12.1077C17.5961 12.171 17.5707 12.2314 17.526 12.2761C17.4813 12.3208 17.4208 12.3463 17.3576 12.347C16.8952 12.3599 16.4325 12.3341 15.9744 12.27ZM15.0724 14.9072L15.5509 14.987L17.6904 15.3445C18.8884 15.5443 20.1113 15.5443 21.3094 15.3445L25.8854 14.58C27.0126 14.392 28.1665 14.4402 29.2741 14.7216C30.3817 15.003 31.4187 15.5114 32.3195 16.2147C33.2203 16.9179 33.9651 17.8006 34.5068 18.8068C35.0485 19.8131 35.3753 20.9208 35.4664 22.06L35.4801 22.2635C35.8001 26.2611 34.9476 30.2653 33.0271 33.786L32.0811 35.5185L29.3779 39.3025C28.9869 39.8504 28.4813 40.3067 27.8961 40.6394C27.3109 40.9721 26.6603 41.1733 25.9895 41.2291C25.3187 41.2848 24.6438 41.1937 24.0117 40.9622C23.3797 40.7306 22.8056 40.3641 22.3296 39.8882C21.5787 39.1374 20.5603 38.7156 19.4985 38.7156C18.4366 38.7156 17.4182 39.1374 16.6674 39.8882C16.1913 40.3641 15.6173 40.7306 14.9852 40.9622C14.3532 41.1937 13.6783 41.2848 13.0075 41.2291C12.3366 41.1733 11.686 40.9721 11.1009 40.6394C10.5157 40.3067 10.0101 39.8504 9.6191 39.3025L6.91585 35.5185L5.96985 33.786C4.04933 30.2653 3.19689 26.2611 3.51685 22.2635L3.53335 22.06C3.62444 20.9208 3.95119 19.8131 4.4929 18.8068C5.03461 17.8006 5.77945 16.9179 6.68021 16.2147C7.58098 15.5114 8.61802 15.003 9.72561 14.7216C10.8332 14.4402 11.9872 14.392 13.1144 14.58L15.0724 14.9072Z" fill="white" />
              </svg>
            </div>
            <div className="col">
              <p>Nutritional Information</p>
              <div className="divider" />
            </div>
          </div>
          <img src="../assets/Mary-Browns-Nutritional-Chart.png" alt="" />
        </div>
        <div className="app offers hide">
          <div onclick="toggleApp()" className="close">
            <svg width={23} height={23} viewBox="0 0 23 23">
              <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
            </svg>
          </div>
          <div className="row">
            <div className="icon">
              <svg width={39} height={39} viewBox="0 0 39 39">
                <path d="M39 23.2841V36.6569C39 37.1636 38.7717 37.6495 38.3654 38.0078C37.9591 38.366 37.408 38.5673 36.8333 38.5673H2.16667C1.59203 38.5673 1.04093 38.366 0.634602 38.0078C0.228273 37.6495 0 37.1636 0 36.6569V23.2841C1.14927 23.2841 2.25147 22.8816 3.06413 22.1651C3.87679 21.4485 4.33333 20.4767 4.33333 19.4633C4.33333 18.45 3.87679 17.4782 3.06413 16.7616C2.25147 16.0451 1.14927 15.6426 0 15.6426V2.26977C0 1.7631 0.228273 1.27719 0.634602 0.918917C1.04093 0.560648 1.59203 0.359375 2.16667 0.359375H36.8333C37.408 0.359375 37.9591 0.560648 38.3654 0.918917C38.7717 1.27719 39 1.7631 39 2.26977V15.6426C37.8507 15.6426 36.7485 16.0451 35.9359 16.7616C35.1232 17.4782 34.6667 18.45 34.6667 19.4633C34.6667 20.4767 35.1232 21.4485 35.9359 22.1651C36.7485 22.8816 37.8507 23.2841 39 23.2841ZM34.6667 26.0829C33.3486 25.4123 32.2541 24.4475 31.4934 23.2854C30.7327 22.1233 30.3326 20.8051 30.3333 19.4633C30.3333 16.636 32.0753 14.1658 34.6667 12.8438V4.18017H4.33333V12.8438C6.92467 14.1658 8.66667 16.636 8.66667 19.4633C8.66667 22.2907 6.92467 24.7609 4.33333 26.0829V34.7465H34.6667V26.0829ZM13 8.00096H26V11.8218H13V8.00096ZM13 27.1049H26V30.9257H13V27.1049Z" fill="white" />
              </svg>
            </div>
            <div className="col">
              <p>Offers</p>
              <div className="divider" />
            </div>
          </div>
          <div className="offers-bank">
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
          </div>
        </div>
        <div className="app loyalty hide">
          <div onclick="toggleApp()" className="close">
            <svg width={23} height={23} viewBox="0 0 23 23">
              <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
            </svg>
          </div>
          <div className="row">
            <div className="icon">
              <svg width={53} height={51} viewBox="0 0 53 51">
                <path d="M52.7776 19.1512C52.5242 18.3627 52.0582 17.6598 51.4312 17.1204C50.8042 16.5811 50.0406 16.2263 49.225 16.0953L36.4267 14.0091L30.4938 2.44499C30.1159 1.7088 29.5431 1.09125 28.8383 0.660094C28.1335 0.228943 27.3239 0.000854492 26.4984 0.000854492C25.6729 0.000854492 24.8633 0.228943 24.1585 0.660094C23.4537 1.09125 22.8809 1.7088 22.503 2.44499L16.5701 14.0091L3.77201 16.0953C2.95722 16.2284 2.19469 16.5839 1.5681 17.123C0.94151 17.6621 0.475072 18.3639 0.219964 19.1514C-0.0351441 19.9389 -0.0690643 20.7817 0.121925 21.5873C0.312914 22.3928 0.721433 23.1301 1.30266 23.7181L10.4341 32.9513L8.45765 45.8047C8.33083 46.6234 8.43156 47.4612 8.74876 48.2262C9.06597 48.9912 9.58736 49.6536 10.2556 50.1406C10.9238 50.6275 11.713 50.9202 12.5363 50.9864C13.3597 51.0527 14.1853 50.8898 14.9223 50.5159L26.4984 44.6582L38.0748 50.5159C38.8119 50.8891 39.6373 51.0513 40.4603 50.9847C41.2834 50.9182 42.0722 50.6254 42.7402 50.1386C43.4082 49.6518 43.9295 48.9898 44.2469 48.2252C44.5643 47.4607 44.6656 46.6232 44.5395 45.8047L42.563 32.9513L51.6945 23.7181C52.2775 23.1312 52.6873 22.394 52.8785 21.588C53.0696 20.7819 53.0347 19.9386 52.7776 19.1512V19.1512ZM49.1857 21.2223L38.7988 31.7248L41.0473 46.3453C41.0752 46.5204 41.0542 46.6998 40.9867 46.8636C40.9191 47.0275 40.8077 47.1694 40.6646 47.2736C40.5216 47.3778 40.3526 47.4403 40.1764 47.4541C40.0002 47.4679 39.8235 47.4325 39.6661 47.3518L26.4984 40.6887L13.3306 47.352C13.1732 47.4327 12.9965 47.4681 12.8203 47.4543C12.6441 47.4405 12.4751 47.3781 12.3321 47.2738C12.189 47.1696 12.0776 47.0277 12.01 46.8639C11.9425 46.7 11.9215 46.5206 11.9494 46.3455L14.198 31.7248L3.81121 21.2222C3.68717 21.0965 3.60002 20.939 3.5593 20.7669C3.51857 20.5948 3.52585 20.4148 3.58033 20.2466C3.63482 20.0784 3.7344 19.9285 3.86818 19.8133C4.00196 19.6981 4.16478 19.622 4.33878 19.5935L18.8962 17.2205L25.6448 4.06673C25.7255 3.90939 25.8478 3.7774 25.9984 3.68524C26.149 3.59308 26.322 3.54433 26.4984 3.54433C26.6748 3.54433 26.8478 3.59308 26.9984 3.68524C27.149 3.7774 27.2713 3.90939 27.352 4.06673L34.1006 17.2205L48.658 19.5935C48.832 19.622 48.9948 19.6981 49.1286 19.8133C49.2624 19.9285 49.362 20.0784 49.4165 20.2466C49.471 20.4148 49.4782 20.5948 49.4375 20.7669C49.3968 20.939 49.3096 21.0965 49.1856 21.2222L49.1857 21.2223Z" fill="white" />
              </svg>
            </div>
            <div className="col">
              <p>Nutritional Information</p>
              <div className="divider" />
            </div>
          </div>
          <div className="col">
            <p>Scan your QR code below</p>
            <svg className="barcode" width={214} height={214} viewBox="0 0 214 214">
              <path d="M80.25 48.15V80.25H48.15V48.15H80.25ZM96.3 32.1H32.1V96.3H96.3V32.1ZM80.25 133.75V165.85H48.15V133.75H80.25ZM96.3 117.7H32.1V181.9H96.3V117.7ZM165.85 48.15V80.25H133.75V48.15H165.85ZM181.9 32.1H117.7V96.3H181.9V32.1ZM117.7 117.7H133.75V133.75H117.7V117.7ZM133.75 133.75H149.8V149.8H133.75V133.75ZM149.8 117.7H165.85V133.75H149.8V117.7ZM117.7 149.8H133.75V165.85H117.7V149.8ZM133.75 165.85H149.8V181.9H133.75V165.85ZM149.8 149.8H165.85V165.85H149.8V149.8ZM165.85 133.75H181.9V149.8H165.85V133.75ZM165.85 165.85H181.9V181.9H165.85V165.85ZM203.3 53.5C197.415 53.5 192.6 48.685 192.6 42.8V21.4H171.2C165.315 21.4 160.5 16.585 160.5 10.7C160.5 4.815 165.315 0 171.2 0H203.3C209.185 0 214 4.815 214 10.7V42.8C214 48.685 209.185 53.5 203.3 53.5ZM214 203.3V171.2C214 165.315 209.185 160.5 203.3 160.5C197.415 160.5 192.6 165.315 192.6 171.2V192.6H171.2C165.315 192.6 160.5 197.415 160.5 203.3C160.5 209.185 165.315 214 171.2 214H203.3C209.185 214 214 209.185 214 203.3ZM10.7 214H42.8C48.685 214 53.5 209.185 53.5 203.3C53.5 197.415 48.685 192.6 42.8 192.6H21.4V171.2C21.4 165.315 16.585 160.5 10.7 160.5C4.815 160.5 0 165.315 0 171.2V203.3C0 209.185 4.815 214 10.7 214ZM0 10.7V42.8C0 48.685 4.815 53.5 10.7 53.5C16.585 53.5 21.4 48.685 21.4 42.8V21.4H42.8C48.685 21.4 53.5 16.585 53.5 10.7C53.5 4.815 48.685 0 42.8 0H10.7C4.815 0 0 4.815 0 10.7Z" fill="#E6702A" />
            </svg>
            <img src="../assets/arrow.gif" alt="" />&gt;
          </div>
        </div>
      



                </div>
                <div className="landscape">
                    {/* <div className="page-payment scroll-hidden">
                        <div className="payment-nav">
                            <button className="btn btn-success text-uppercase btn-14" onClick={() => this.GoBackhandleClick()}>{LocalizedLanguage.goBack}</button>
                        </div>
                        <div className="payment-content flex-columns pt-3">
                            <div className="w-100 row d-flex">
                                <div className="col-sm-5">
                                    <div className="payment-page-title">
                                        <img src={landingScreen} className="mx-auto" alt="" />
                                        <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.orderDetails}</h1>
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    <div className="self-checkout-table widget_day_record pt-3">
                                        <div className="self-checkout-product-light">
                                           <div className="self-checkout-all-product2 overflowscroll padding-10">
                                                <table className="table table-customise table-day-record fixed-table-cell">
                                                    <tbody>
                                                        {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                                                             var _order_Meta= product.addons_meta_data && product.addons_meta_data.length>0 ? CommonJs.showAddons("",product.addons_meta_data):""
                                                            return (
                                                                <tr key={"cart" + index}>
                                                                    <td className="action action-short action-pointer">
                                                                        <h6>{product.quantity ? product.quantity : (product.customTags && (typeof product.customTags !== 'undefined')) ? "" : 1 || (product.customExtFee && (typeof product.customExtFee !== 'undefined')) ? "" : 1}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <div className="widget_day_record_text">
                                                                            <h6><Markup content={product.Title} /></h6>
                                                                            {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
                                                                            {(product.customTags && (typeof product.customTags !== 'undefined')) ?
                                                                                this.extensionArray(product.customTags)
                                                                                :
                                                                                (product.customExtFee && (typeof product.customExtFee !== 'undefined') && product.Price !== 0) ?
                                                                                    <div className="font-italic">{product.customExtFee}</div>
                                                                                    :
                                                                                    <div className="font-italic">{product.color}  {product.size ? ',' + product.size : null}</div>
                                                                            }
                                                                        {product.psummary && typeof product.psummary!="undefined" && product.psummary!=""?<div  style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{product.psummary}</div>:null}
                                                                        </div>
                                                                    </td>
                                                                    {(typeof product.product_id !== 'undefined') ?
                                                                        <td>
                                                                            <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - product.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</span>
                                                                            {parseFloat(product.product_discount_amount) !== 0.00 ?
                                                                                <del>
                                                                                    <div className="widget_day_record_text text-right">
                                                                                        <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                                    </div>
                                                                                </del>
                                                                                :
                                                                                <div className="widget_day_record_text text-right">
                                                                                    <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                                </div>
                                                                            }
                                                                        </td>
                                                                        :
                                                                        <td>
                                                                            <div className="widget_day_record_text text-right">
                                                                                <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                            </div>
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>
                                            <table id="tblminusto_list" className="table table-day-record">
                                                <tbody>
                                                    <tr>
                                                        <td colspane="2">
                                                            <div className="widget_day_record_text">
                                                                <h6>{LocalizedLanguage.tax} <NumberFormat value={checkList && checkList.tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                            </div>
                                                        </td>
                                                        <td  className="w-50">
                                                            <div className="widget_day_record_text text-right">
                                                                <h6>{LocalizedLanguage.total}: <NumberFormat value={checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="spacer-25"></div>
                            <div className="w-100 row d-flex align-items-center">
                                <div className="col-sm-5 col-xs-5">
                                    <div className="payment-footer text-center p-0">
                                        <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                                        <img src="../../assets/img/images/logo-light.svg" alt=""/>
                                    </div>
                                </div>
                                <div className="col-sm-7 col-xs-7">
                                    <div className="payment-button-group p-0">
                                        <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")}>{LocalizedLanguage.continueToPayment}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}


<div className="topnav margin-bottom-59">
          <img onclick="changeURL('./Home_Screen.html')" src="../assets/Mary_Browns_Logo.png" alt="" />
          <div className="topnav-row">
            <div className="topnav-col">
              <div onclick="toggleApp('nutrition-info')" className="icon">
                <svg width={21} height={24} viewBox="0 0 21 24">
                  <path d="M6.47479 10.0959C6.53541 10.2782 6.5212 10.4771 6.43529 10.6489C6.34938 10.8207 6.19879 10.9514 6.01659 11.0123C5.79398 11.0827 5.58751 11.1964 5.40907 11.347C5.23064 11.4976 5.08377 11.6819 4.97694 11.8895C4.70869 12.3956 4.52454 13.2279 4.69419 14.5865C4.71208 14.7744 4.65602 14.9618 4.53791 15.109C4.4198 15.2562 4.24895 15.3515 4.06167 15.3748C3.87439 15.398 3.68543 15.3473 3.53495 15.2334C3.38447 15.1195 3.28432 14.9514 3.25579 14.7649C3.06294 13.2235 3.24129 12.0621 3.69804 11.208C4.16204 10.338 4.86819 9.86679 5.55839 9.63769C5.74068 9.57708 5.93957 9.59128 6.11139 9.67719C6.28321 9.7631 6.41391 9.91369 6.47479 10.0959ZM13.6291 2.31229C13.8046 2.24629 13.9477 2.11484 14.0284 1.94556C14.109 1.77628 14.121 1.58232 14.0617 1.40443C14.0024 1.22653 13.8765 1.07853 13.7104 0.991502C13.5443 0.904474 13.3509 0.885187 13.1709 0.937692C11.8108 1.39009 10.9625 2.50659 10.4652 3.70284C10.3977 3.86452 10.3358 4.02847 10.2796 4.19439C10.0084 3.67994 9.66135 3.20922 9.25009 2.79804C8.69276 2.23951 8.02707 1.80089 7.29395 1.50914C6.56084 1.21739 5.77579 1.07868 4.98709 1.10154C4.58316 1.1125 4.19877 1.27776 3.91291 1.56335C3.62705 1.84894 3.46143 2.23317 3.45009 2.63709C3.42723 3.43639 3.5703 4.23175 3.87029 4.97297C4.17027 5.71419 4.62065 6.38518 5.19299 6.94359C3.97499 7.20743 2.87428 7.85638 2.05376 8.79441C1.23325 9.73244 0.736521 10.9097 0.637092 12.152L0.628392 12.2593C0.436965 14.6477 0.945889 17.0402 2.09289 19.1439L2.61344 20.098C2.62794 20.1226 2.64244 20.1473 2.65984 20.1705L4.10984 22.2034C4.43848 22.6636 4.86343 23.0468 5.35515 23.3261C5.84687 23.6055 6.39355 23.7743 6.95715 23.821C7.52075 23.8676 8.08775 23.7909 8.6187 23.5962C9.14966 23.4015 9.63181 23.0934 10.0316 22.6935C10.093 22.6321 10.1659 22.5833 10.2462 22.5501C10.3264 22.5169 10.4124 22.4997 10.4993 22.4997C10.5861 22.4997 10.6721 22.5169 10.7524 22.5501C10.8326 22.5833 10.9055 22.6321 10.9669 22.6935C11.3667 23.0934 11.8489 23.4015 12.3798 23.5962C12.9108 23.7909 13.4778 23.8676 14.0414 23.821C14.605 23.7743 15.1517 23.6055 15.6434 23.3261C16.1351 23.0468 16.5601 22.6636 16.8887 22.2034L18.3387 20.1719C18.3561 20.1483 18.3721 20.1236 18.3865 20.098L18.9056 19.1439C20.0531 17.0403 20.5626 14.6479 20.3716 12.2593L20.3629 12.152C20.2987 11.3514 20.0689 10.5729 19.6882 9.86577C19.3074 9.15863 18.7839 8.53828 18.1509 8.04401C17.5179 7.54975 16.7891 7.19234 16.0107 6.99443C15.2323 6.79652 14.4213 6.76242 13.6291 6.89429L11.225 7.29449C11.2395 6.30704 11.4135 5.19634 11.8021 4.25964C12.2095 3.28089 12.8127 2.58489 13.6291 2.31229ZM8.64109 7.10599L8.41779 7.06829C7.56684 6.90375 6.78489 6.48751 6.17319 5.87349C5.75399 5.45568 5.42477 4.95647 5.20582 4.4066C4.98687 3.85673 4.88282 3.26785 4.90009 2.67624C4.90047 2.64265 4.91408 2.61057 4.93797 2.58695C4.96186 2.56333 4.9941 2.55009 5.02769 2.55009C5.61906 2.53302 6.20766 2.63717 6.75726 2.85611C7.30687 3.07506 7.80585 3.40417 8.22349 3.82319C9.10364 4.70334 9.52849 5.86479 9.49659 7.02044C9.49621 7.05378 9.4828 7.08565 9.45923 7.10923C9.43565 7.1328 9.40378 7.14622 9.37044 7.14659C9.12662 7.1534 8.88265 7.13982 8.64109 7.10599ZM8.16549 8.49654L8.41779 8.53859L9.54589 8.72709C10.1776 8.83244 10.8224 8.83244 11.4541 8.72709L13.8669 8.32399C14.4612 8.22486 15.0697 8.25029 15.6537 8.39867C16.2377 8.54704 16.7845 8.81512 17.2594 9.18592C17.7344 9.55672 18.1271 10.0221 18.4127 10.5527C18.6984 11.0833 18.8707 11.6674 18.9187 12.268L18.9259 12.3753C19.0947 14.4831 18.6452 16.5944 17.6325 18.4508L17.1337 19.3643L15.7084 21.3595C15.5023 21.6484 15.2356 21.889 14.9271 22.0644C14.6186 22.2398 14.2755 22.3459 13.9218 22.3753C13.5681 22.4047 13.2122 22.3567 12.879 22.2346C12.5457 22.1125 12.243 21.9193 11.992 21.6683C11.5961 21.2725 11.0592 21.0501 10.4993 21.0501C9.93937 21.0501 9.40241 21.2725 9.00649 21.6683C8.75549 21.9193 8.45283 22.1125 8.11956 22.2346C7.7863 22.3567 7.43043 22.4047 7.07673 22.3753C6.72302 22.3459 6.37997 22.2398 6.07143 22.0644C5.76289 21.889 5.49628 21.6484 5.29014 21.3595L3.86479 19.3643L3.36599 18.4508C2.35335 16.5944 1.90388 14.4831 2.07259 12.3753L2.08129 12.268C2.12932 11.6674 2.30161 11.0833 2.58723 10.5527C2.87286 10.0221 3.2656 9.55672 3.74055 9.18592C4.21549 8.81512 4.7623 8.54704 5.3463 8.39867C5.9303 8.25029 6.53875 8.22486 7.13309 8.32399L8.16549 8.49654Z" fill="white" />
                </svg>
                <p>Nutrition</p>
              </div>
            </div>
            <div className="topnav-col">
              <div onclick="toggleApp('offers')" className="icon">
                <svg width={18} height={20} viewBox="0 0 18 20">
                  <path d="M18 12V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V12C0.530433 12 1.03914 11.7893 1.41421 11.4142C1.78929 11.0391 2 10.5304 2 10C2 9.46957 1.78929 8.96086 1.41421 8.58579C1.03914 8.21071 0.530433 8 0 8V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V8C17.4696 8 16.9609 8.21071 16.5858 8.58579C16.2107 8.96086 16 9.46957 16 10C16 10.5304 16.2107 11.0391 16.5858 11.4142C16.9609 11.7893 17.4696 12 18 12ZM16 13.465C15.3917 13.114 14.8865 12.6089 14.5354 12.0007C14.1843 11.3924 13.9996 10.7023 14 10C14 8.52 14.804 7.227 16 6.535V2H2V6.535C3.196 7.227 4 8.52 4 10C4 11.48 3.196 12.773 2 13.465V18H16V13.465ZM6 4H12V6H6V4ZM6 14H12V16H6V14Z" fill="white" />
                </svg>
                <p>Offers</p>
              </div>
            </div>
            <div className="topnav-col">
              <div onclick="toggleApp('loyalty')" className="icon">
                <svg width={26} height={24} viewBox="0 0 26 24">
                  <path d="M25.0859 9.08877C24.9694 8.7272 24.7551 8.40493 24.4667 8.15763C24.1784 7.91034 23.8272 7.74766 23.4521 7.68761L17.5661 6.73104L14.8375 1.42877C14.6637 1.09122 14.4003 0.808062 14.0761 0.610374C13.752 0.412687 13.3797 0.308105 13 0.308105C12.6203 0.308105 12.248 0.412687 11.9239 0.610374C11.5997 0.808062 11.3363 1.09122 11.1625 1.42877L8.43391 6.73104L2.548 7.68761C2.17327 7.7486 1.82258 7.91163 1.53441 8.15882C1.24624 8.406 1.03172 8.72779 0.914395 9.08887C0.797069 9.44995 0.781469 9.83637 0.869306 10.2057C0.957144 10.5751 1.14502 10.9131 1.41233 11.1827L5.61194 15.4163L4.70296 21.3097C4.64463 21.6851 4.69095 22.0692 4.83684 22.42C4.98272 22.7707 5.22251 23.0744 5.52984 23.2977C5.83716 23.521 6.20011 23.6552 6.57877 23.6856C6.95743 23.7159 7.33712 23.6413 7.6761 23.4698L13 20.784L18.3241 23.4698C18.6631 23.6409 19.0427 23.7153 19.4212 23.6848C19.7997 23.6543 20.1625 23.5201 20.4697 23.2969C20.7769 23.0736 21.0167 22.7701 21.1626 22.4195C21.3086 22.069 21.3552 21.685 21.2972 21.3097L20.3882 15.4163L24.5878 11.1827C24.856 10.9136 25.0444 10.5756 25.1324 10.206C25.2203 9.83646 25.2042 9.44977 25.0859 9.08877ZM23.434 10.0384L18.657 14.8539L19.6911 21.5575C19.704 21.6378 19.6943 21.7201 19.6632 21.7952C19.6322 21.8704 19.5809 21.9354 19.5151 21.9832C19.4494 22.031 19.3716 22.0596 19.2906 22.066C19.2095 22.0723 19.1283 22.056 19.0559 22.019L13 18.9639L6.94403 22.0191C6.87164 22.0562 6.79042 22.0724 6.70937 22.0661C6.62831 22.0597 6.55059 22.0311 6.48482 21.9833C6.41904 21.9355 6.36778 21.8705 6.33672 21.7953C6.30565 21.7202 6.29599 21.6379 6.30881 21.5576L7.34297 14.8539L2.56603 10.0383C2.50899 9.98069 2.4689 9.90847 2.45017 9.82957C2.43144 9.75067 2.43479 9.66814 2.45985 9.59102C2.48491 9.51389 2.53071 9.44515 2.59223 9.39233C2.65376 9.33951 2.72864 9.30463 2.80866 9.29154L9.50371 8.2035L12.6074 2.17236C12.6445 2.10021 12.7008 2.03969 12.7701 1.99744C12.8393 1.95518 12.9189 1.93283 13 1.93283C13.0811 1.93283 13.1607 1.95518 13.2299 1.99744C13.2992 2.03969 13.3555 2.10021 13.3926 2.17236L16.4963 8.2035L23.1913 9.29154C23.2714 9.30463 23.3462 9.33951 23.4078 9.39233C23.4693 9.44515 23.5151 9.51389 23.5402 9.59102C23.5652 9.66814 23.5686 9.75067 23.5498 9.82957C23.5311 9.90847 23.491 9.98069 23.434 10.0383L23.434 10.0384Z" fill="white" />
                </svg>
                <p>Loyalty</p>
              </div>
            </div>
            <div className="topnav-col">
              <div className="icon big relative disabled">
                <svg width={27} height={27} viewBox="0 0 27 27">
                  <path d="M0 1.625C0 1.39294 0.0921872 1.17038 0.256282 1.00628C0.420376 0.842187 0.642936 0.75 0.875 0.75H3.5C3.69518 0.750054 3.88474 0.815364 4.03853 0.935543C4.19232 1.05572 4.30152 1.22387 4.34875 1.41325L5.0575 4.25H25.375C25.5035 4.25012 25.6304 4.27853 25.7466 4.33321C25.8629 4.3879 25.9657 4.46751 26.0477 4.56641C26.1297 4.6653 26.1889 4.78104 26.2212 4.90541C26.2534 5.02977 26.2579 5.15971 26.2343 5.286L23.6093 19.286C23.5717 19.4865 23.4653 19.6676 23.3084 19.798C23.1515 19.9284 22.954 19.9998 22.75 20H7C6.79601 19.9998 6.59849 19.9284 6.44159 19.798C6.2847 19.6676 6.17829 19.4865 6.14075 19.286L3.5175 5.31225L2.8175 2.5H0.875C0.642936 2.5 0.420376 2.40781 0.256282 2.24372C0.0921872 2.07962 0 1.85706 0 1.625ZM5.4285 6L7.72625 18.25H22.0238L24.3215 6H5.4285ZM8.75 20C7.82174 20 6.9315 20.3687 6.27513 21.0251C5.61875 21.6815 5.25 22.5717 5.25 23.5C5.25 24.4283 5.61875 25.3185 6.27513 25.9749C6.9315 26.6313 7.82174 27 8.75 27C9.67826 27 10.5685 26.6313 11.2249 25.9749C11.8813 25.3185 12.25 24.4283 12.25 23.5C12.25 22.5717 11.8813 21.6815 11.2249 21.0251C10.5685 20.3687 9.67826 20 8.75 20ZM21 20C20.0717 20 19.1815 20.3687 18.5251 21.0251C17.8687 21.6815 17.5 22.5717 17.5 23.5C17.5 24.4283 17.8687 25.3185 18.5251 25.9749C19.1815 26.6313 20.0717 27 21 27C21.9283 27 22.8185 26.6313 23.4749 25.9749C24.1313 25.3185 24.5 24.4283 24.5 23.5C24.5 22.5717 24.1313 21.6815 23.4749 21.0251C22.8185 20.3687 21.9283 20 21 20ZM8.75 21.75C9.21413 21.75 9.65925 21.9344 9.98744 22.2626C10.3156 22.5908 10.5 23.0359 10.5 23.5C10.5 23.9641 10.3156 24.4092 9.98744 24.7374C9.65925 25.0656 9.21413 25.25 8.75 25.25C8.28587 25.25 7.84075 25.0656 7.51256 24.7374C7.18437 24.4092 7 23.9641 7 23.5C7 23.0359 7.18437 22.5908 7.51256 22.2626C7.84075 21.9344 8.28587 21.75 8.75 21.75ZM21 21.75C21.4641 21.75 21.9092 21.9344 22.2374 22.2626C22.5656 22.5908 22.75 23.0359 22.75 23.5C22.75 23.9641 22.5656 24.4092 22.2374 24.7374C21.9092 25.0656 21.4641 25.25 21 25.25C20.5359 25.25 20.0908 25.0656 19.7626 24.7374C19.4344 24.4092 19.25 23.9641 19.25 23.5C19.25 23.0359 19.4344 22.5908 19.7626 22.2626C20.0908 21.9344 20.5359 21.75 21 21.75Z" fill="white" />
                </svg>
                <div className="topnav-indicator">
                  <p>2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="category-header-row">
          <div className="category-header-col">
            <p className="title">Order Summary</p>
          </div>
          <button onclick="changeURL('./Home_Screen.html')">
            <svg width={22} height={20} viewBox="0 0 22 20">
              <path d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
            </svg>
            Go back to main menu
          </button>
        </div>
        <div className="category-header-divider margin-bottom-59" />
        <div className="cart margin-bottom-43">
          <div className="text-row">
            <p className="bold">Review your order</p>
            <p className="highlight">(X items)</p>
          </div>
          <div className="cart-items">
            <div className="items-group scroll">
              <div className="item">
                <div className="col">
                  <p className="prod-name">Tater Poutine</p>
                </div>
                <div className="row">
                  <label className="number-input-container">
                    <div onclick="decrement(this)" className="svg-container left">
                      <svg width={16} height={2} viewBox="0 0 16 2">
                        <rect width={16} height={2} fill="#758696" />
                      </svg>
                    </div>
                    <input type="number" defaultValue={1} />
                    <div onclick="increment(this)" className="svg-container right">
                      <svg width={16} height={16} viewBox="0 0 16 16">
                        <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                      </svg>
                    </div>
                  </label>
                  <div className="inner-row">
                    <p className="price">$6.99</p>
                    <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="col">
                  <p className="prod-name">Big Mary Combo</p>
                  <p className="description">Big Mary Sandwich</p>
                  <p className="description">Diet 7up</p>
                  <p className="description">Taters</p>
                  <p className="description">Small Coleslaw Salad</p>
                  <p className="note">Note: No Mayo</p>
                  <p className="note">Discount: $2.99</p>
                </div>
                <div className="row">
                  <label className="number-input-container">
                    <div onclick="decrement(this)" className="svg-container left">
                      <svg width={16} height={2} viewBox="0 0 16 2">
                        <rect width={16} height={2} fill="#758696" />
                      </svg>
                    </div>
                    <input type="number" defaultValue={1} />
                    <div onclick="increment(this)" className="svg-container right">
                      <svg width={16} height={16} viewBox="0 0 16 16">
                        <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                      </svg>
                    </div>
                  </label>
                  <div className="inner-row">
                    <p className="price">$12.99</p>
                    <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="item note">
                <div className="col">
                  <p className="prod-name">Note</p>
                  <p className="description">Please have ready for pickup at 1:30</p>
                </div>
                <div className="row">
                  <div />
                  <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                    <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="empty hide">
              <p>Cart is Empty</p>
            </div>
            <div className="cart-total">
              <div className="subtotal">
                <div className="col">
                  <p>Subtotal</p>
                  <p>Discount</p>
                  <p>Tax</p>
                </div>
                <div className="col">
                  <p className="subtotal-amount right">$19.98</p>
                  <p className="discount-amount right">$2.99</p>
                  <p className="tax-amount right">$2.99</p>
                </div>
              </div>
              <div className="total">
                <p>Total</p>
                <p className="cart-amount">$25.96</p>
              </div>
            </div>
          </div>
        </div>
        <p className="instructions">Order instructions</p>
        <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""} />
        <div className="recommendations">
          <p>Recommendations</p>
          <div className="row">
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
            <div className="item">
              <img src="../assets/bigmary.png" alt="" className="scale" />
              <p className="prod-name">Big Mary</p>
              <p className="price">$10.99</p>
              <button onclick="addItem()">
                <svg width={28} height={27} viewBox="0 0 28 27">
                  <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                  <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                </svg>
                Add Item
              </button>
            </div>
          </div>
        </div>
        <button onclick="changeURL('./Payment.html')" className="view-cart scroll-end">
          Continue to Payment
        </button>
        <div className="cover hide" />
        <div className="app nutrition-info hide">
          <div onclick="toggleApp()" className="close">
            <svg width={23} height={23} viewBox="0 0 23 23">
              <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
            </svg>
          </div>
          <div className="row">
            <div className="icon">
              <svg width={39} height={44} viewBox="0 0 39 44">
                <path d="M11.8659 17.9405C11.9808 18.2862 11.9539 18.6634 11.7909 18.9893C11.628 19.3151 11.3424 19.563 10.9969 19.6785C10.5747 19.812 10.1831 20.0277 9.84466 20.3133C9.50625 20.5988 9.22771 20.9485 9.0251 21.3422C8.51635 22.302 8.1671 23.8805 8.48885 26.4572C8.52279 26.8135 8.41645 27.169 8.19245 27.4482C7.96845 27.7273 7.64443 27.9081 7.28924 27.9521C6.93405 27.9962 6.57569 27.9 6.29029 27.684C6.0049 27.468 5.81497 27.1493 5.76085 26.7955C5.3951 23.8722 5.73335 21.6695 6.5996 20.0497C7.4796 18.3997 8.81885 17.506 10.1279 17.0715C10.4736 16.9565 10.8508 16.9835 11.1766 17.1464C11.5025 17.3093 11.7504 17.5949 11.8659 17.9405ZM25.4344 3.17848C25.7672 3.0533 26.0387 2.804 26.1916 2.48295C26.3446 2.1619 26.3673 1.79406 26.2548 1.45667C26.1423 1.11928 25.9035 0.838589 25.5885 0.673535C25.2735 0.508481 24.9068 0.471903 24.5654 0.571482C21.9859 1.42948 20.3771 3.54698 19.4339 5.81573C19.3059 6.12237 19.1885 6.4333 19.0819 6.74798C18.5675 5.77229 17.9093 4.87955 17.1294 4.09973C16.0723 3.04045 14.8098 2.20857 13.4194 1.65525C12.029 1.10194 10.5402 0.83887 9.04435 0.882231C8.27828 0.903022 7.54927 1.21644 7.00712 1.75808C6.46497 2.29971 6.15087 3.02843 6.12935 3.79448C6.08599 5.31039 6.35734 6.81883 6.92627 8.2246C7.49521 9.63036 8.34937 10.9029 9.43485 11.962C7.12484 12.4624 5.0373 13.6931 3.48115 15.4722C1.925 17.2512 0.982926 19.4839 0.794354 21.84L0.777854 22.0435C0.414803 26.5733 1.38 31.1107 3.55535 35.1005L4.5426 36.91C4.5701 36.9567 4.5976 37.0035 4.6306 37.0475L7.3806 40.903C8.00388 41.7758 8.80983 42.5025 9.7424 43.0323C10.675 43.5621 11.7118 43.8823 12.7807 43.9708C13.8496 44.0593 14.9249 43.9138 15.9319 43.5445C16.9389 43.1752 17.8533 42.591 18.6116 41.8325C18.7281 41.716 18.8663 41.6236 19.0185 41.5605C19.1707 41.4975 19.3338 41.465 19.4985 41.465C19.6632 41.465 19.8263 41.4975 19.9785 41.5605C20.1306 41.6236 20.2689 41.716 20.3854 41.8325C21.1436 42.591 22.0581 43.1752 23.0651 43.5445C24.072 43.9138 25.1474 44.0593 26.2163 43.9708C27.2852 43.8823 28.322 43.5621 29.2546 43.0323C30.1871 42.5025 30.9931 41.7758 31.6164 40.903L34.3664 37.0502C34.3994 37.0053 34.4297 36.9585 34.4571 36.91L35.4416 35.1005C37.6179 31.1109 38.5841 26.5735 38.2219 22.0435L38.2054 21.84C38.0836 20.3217 37.6479 18.8452 36.9257 17.504C36.2036 16.1629 35.2107 14.9864 34.0102 14.049C32.8096 13.1116 31.4274 12.4337 29.9512 12.0584C28.475 11.683 26.9369 11.6184 25.4344 11.8685L20.8749 12.6275C20.9024 10.7547 21.2324 8.64823 21.9694 6.87173C22.7421 5.01548 23.8861 3.69548 25.4344 3.17848ZM15.9744 12.27L15.5509 12.1985C13.937 11.8864 12.454 11.097 11.2939 9.93248C10.4988 9.14008 9.87443 8.19329 9.45918 7.15043C9.04393 6.10758 8.8466 4.99074 8.87935 3.86873C8.88008 3.80503 8.90589 3.74418 8.9512 3.69939C8.9965 3.6546 9.05764 3.62948 9.12135 3.62948C10.2429 3.59711 11.3592 3.79462 12.4016 4.20986C13.4439 4.6251 14.3903 5.24928 15.1824 6.04398C16.8516 7.71323 17.6574 9.91598 17.5969 12.1077C17.5961 12.171 17.5707 12.2314 17.526 12.2761C17.4813 12.3208 17.4208 12.3463 17.3576 12.347C16.8952 12.3599 16.4325 12.3341 15.9744 12.27ZM15.0724 14.9072L15.5509 14.987L17.6904 15.3445C18.8884 15.5443 20.1113 15.5443 21.3094 15.3445L25.8854 14.58C27.0126 14.392 28.1665 14.4402 29.2741 14.7216C30.3817 15.003 31.4187 15.5114 32.3195 16.2147C33.2203 16.9179 33.9651 17.8006 34.5068 18.8068C35.0485 19.8131 35.3753 20.9208 35.4664 22.06L35.4801 22.2635C35.8001 26.2611 34.9476 30.2653 33.0271 33.786L32.0811 35.5185L29.3779 39.3025C28.9869 39.8504 28.4813 40.3067 27.8961 40.6394C27.3109 40.9721 26.6603 41.1733 25.9895 41.2291C25.3187 41.2848 24.6438 41.1937 24.0117 40.9622C23.3797 40.7306 22.8056 40.3641 22.3296 39.8882C21.5787 39.1374 20.5603 38.7156 19.4985 38.7156C18.4366 38.7156 17.4182 39.1374 16.6674 39.8882C16.1913 40.3641 15.6173 40.7306 14.9852 40.9622C14.3532 41.1937 13.6783 41.2848 13.0075 41.2291C12.3366 41.1733 11.686 40.9721 11.1009 40.6394C10.5157 40.3067 10.0101 39.8504 9.6191 39.3025L6.91585 35.5185L5.96985 33.786C4.04933 30.2653 3.19689 26.2611 3.51685 22.2635L3.53335 22.06C3.62444 20.9208 3.95119 19.8131 4.4929 18.8068C5.03461 17.8006 5.77945 16.9179 6.68021 16.2147C7.58098 15.5114 8.61802 15.003 9.72561 14.7216C10.8332 14.4402 11.9872 14.392 13.1144 14.58L15.0724 14.9072Z" fill="white" />
              </svg>
            </div>
            <div className="col">
              <p>Nutritional Information</p>
              <div className="divider" />
            </div>
          </div>
          <img src="../assets/Mary-Browns-Nutritional-Chart.png" alt="" />
        </div>
        <div className="app offers hide">
          <div onclick="toggleApp()" className="close">
            <svg width={23} height={23} viewBox="0 0 23 23">
              <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
            </svg>
          </div>
          <div className="row">
            <div className="icon">
              <svg width={39} height={39} viewBox="0 0 39 39">
                <path d="M39 23.2841V36.6569C39 37.1636 38.7717 37.6495 38.3654 38.0078C37.9591 38.366 37.408 38.5673 36.8333 38.5673H2.16667C1.59203 38.5673 1.04093 38.366 0.634602 38.0078C0.228273 37.6495 0 37.1636 0 36.6569V23.2841C1.14927 23.2841 2.25147 22.8816 3.06413 22.1651C3.87679 21.4485 4.33333 20.4767 4.33333 19.4633C4.33333 18.45 3.87679 17.4782 3.06413 16.7616C2.25147 16.0451 1.14927 15.6426 0 15.6426V2.26977C0 1.7631 0.228273 1.27719 0.634602 0.918917C1.04093 0.560648 1.59203 0.359375 2.16667 0.359375H36.8333C37.408 0.359375 37.9591 0.560648 38.3654 0.918917C38.7717 1.27719 39 1.7631 39 2.26977V15.6426C37.8507 15.6426 36.7485 16.0451 35.9359 16.7616C35.1232 17.4782 34.6667 18.45 34.6667 19.4633C34.6667 20.4767 35.1232 21.4485 35.9359 22.1651C36.7485 22.8816 37.8507 23.2841 39 23.2841ZM34.6667 26.0829C33.3486 25.4123 32.2541 24.4475 31.4934 23.2854C30.7327 22.1233 30.3326 20.8051 30.3333 19.4633C30.3333 16.636 32.0753 14.1658 34.6667 12.8438V4.18017H4.33333V12.8438C6.92467 14.1658 8.66667 16.636 8.66667 19.4633C8.66667 22.2907 6.92467 24.7609 4.33333 26.0829V34.7465H34.6667V26.0829ZM13 8.00096H26V11.8218H13V8.00096ZM13 27.1049H26V30.9257H13V27.1049Z" fill="white" />
              </svg>
            </div>
            <div className="col">
              <p>Offers</p>
              <div className="divider" />
            </div>
          </div>
          <div className="offers-bank">
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
            <img src="../assets/offer1.png" alt="" />
          </div>
        </div>
        <div className="app loyalty hide">
          <div onclick="toggleApp()" className="close">
            <svg width={23} height={23} viewBox="0 0 23 23">
              <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
            </svg>
          </div>
          <div className="row">
            <div className="icon">
              <svg width={53} height={51} viewBox="0 0 53 51">
                <path d="M52.7776 19.1512C52.5242 18.3627 52.0582 17.6598 51.4312 17.1204C50.8042 16.5811 50.0406 16.2263 49.225 16.0953L36.4267 14.0091L30.4938 2.44499C30.1159 1.7088 29.5431 1.09125 28.8383 0.660094C28.1335 0.228943 27.3239 0.000854492 26.4984 0.000854492C25.6729 0.000854492 24.8633 0.228943 24.1585 0.660094C23.4537 1.09125 22.8809 1.7088 22.503 2.44499L16.5701 14.0091L3.77201 16.0953C2.95722 16.2284 2.19469 16.5839 1.5681 17.123C0.94151 17.6621 0.475072 18.3639 0.219964 19.1514C-0.0351441 19.9389 -0.0690643 20.7817 0.121925 21.5873C0.312914 22.3928 0.721433 23.1301 1.30266 23.7181L10.4341 32.9513L8.45765 45.8047C8.33083 46.6234 8.43156 47.4612 8.74876 48.2262C9.06597 48.9912 9.58736 49.6536 10.2556 50.1406C10.9238 50.6275 11.713 50.9202 12.5363 50.9864C13.3597 51.0527 14.1853 50.8898 14.9223 50.5159L26.4984 44.6582L38.0748 50.5159C38.8119 50.8891 39.6373 51.0513 40.4603 50.9847C41.2834 50.9182 42.0722 50.6254 42.7402 50.1386C43.4082 49.6518 43.9295 48.9898 44.2469 48.2252C44.5643 47.4607 44.6656 46.6232 44.5395 45.8047L42.563 32.9513L51.6945 23.7181C52.2775 23.1312 52.6873 22.394 52.8785 21.588C53.0696 20.7819 53.0347 19.9386 52.7776 19.1512V19.1512ZM49.1857 21.2223L38.7988 31.7248L41.0473 46.3453C41.0752 46.5204 41.0542 46.6998 40.9867 46.8636C40.9191 47.0275 40.8077 47.1694 40.6646 47.2736C40.5216 47.3778 40.3526 47.4403 40.1764 47.4541C40.0002 47.4679 39.8235 47.4325 39.6661 47.3518L26.4984 40.6887L13.3306 47.352C13.1732 47.4327 12.9965 47.4681 12.8203 47.4543C12.6441 47.4405 12.4751 47.3781 12.3321 47.2738C12.189 47.1696 12.0776 47.0277 12.01 46.8639C11.9425 46.7 11.9215 46.5206 11.9494 46.3455L14.198 31.7248L3.81121 21.2222C3.68717 21.0965 3.60002 20.939 3.5593 20.7669C3.51857 20.5948 3.52585 20.4148 3.58033 20.2466C3.63482 20.0784 3.7344 19.9285 3.86818 19.8133C4.00196 19.6981 4.16478 19.622 4.33878 19.5935L18.8962 17.2205L25.6448 4.06673C25.7255 3.90939 25.8478 3.7774 25.9984 3.68524C26.149 3.59308 26.322 3.54433 26.4984 3.54433C26.6748 3.54433 26.8478 3.59308 26.9984 3.68524C27.149 3.7774 27.2713 3.90939 27.352 4.06673L34.1006 17.2205L48.658 19.5935C48.832 19.622 48.9948 19.6981 49.1286 19.8133C49.2624 19.9285 49.362 20.0784 49.4165 20.2466C49.471 20.4148 49.4782 20.5948 49.4375 20.7669C49.3968 20.939 49.3096 21.0965 49.1856 21.2222L49.1857 21.2223Z" fill="white" />
              </svg>
            </div>
            <div className="col">
              <p>Nutritional Information</p>
              <div className="divider" />
            </div>
          </div>
          <div className="col">
            <p>Scan your QR code below</p>
            <svg className="barcode" width={214} height={214} viewBox="0 0 214 214">
              <path d="M80.25 48.15V80.25H48.15V48.15H80.25ZM96.3 32.1H32.1V96.3H96.3V32.1ZM80.25 133.75V165.85H48.15V133.75H80.25ZM96.3 117.7H32.1V181.9H96.3V117.7ZM165.85 48.15V80.25H133.75V48.15H165.85ZM181.9 32.1H117.7V96.3H181.9V32.1ZM117.7 117.7H133.75V133.75H117.7V117.7ZM133.75 133.75H149.8V149.8H133.75V133.75ZM149.8 117.7H165.85V133.75H149.8V117.7ZM117.7 149.8H133.75V165.85H117.7V149.8ZM133.75 165.85H149.8V181.9H133.75V165.85ZM149.8 149.8H165.85V165.85H149.8V149.8ZM165.85 133.75H181.9V149.8H165.85V133.75ZM165.85 165.85H181.9V181.9H165.85V165.85ZM203.3 53.5C197.415 53.5 192.6 48.685 192.6 42.8V21.4H171.2C165.315 21.4 160.5 16.585 160.5 10.7C160.5 4.815 165.315 0 171.2 0H203.3C209.185 0 214 4.815 214 10.7V42.8C214 48.685 209.185 53.5 203.3 53.5ZM214 203.3V171.2C214 165.315 209.185 160.5 203.3 160.5C197.415 160.5 192.6 165.315 192.6 171.2V192.6H171.2C165.315 192.6 160.5 197.415 160.5 203.3C160.5 209.185 165.315 214 171.2 214H203.3C209.185 214 214 209.185 214 203.3ZM10.7 214H42.8C48.685 214 53.5 209.185 53.5 203.3C53.5 197.415 48.685 192.6 42.8 192.6H21.4V171.2C21.4 165.315 16.585 160.5 10.7 160.5C4.815 160.5 0 165.315 0 171.2V203.3C0 209.185 4.815 214 10.7 214ZM0 10.7V42.8C0 48.685 4.815 53.5 10.7 53.5C16.585 53.5 21.4 48.685 21.4 42.8V21.4H42.8C48.685 21.4 53.5 16.585 53.5 10.7C53.5 4.815 48.685 0 42.8 0H10.7C4.815 0 0 4.815 0 10.7Z" fill="#E6702A" />
            </svg>
            <img src="../assets/arrow.gif" alt="" />&gt;
          </div>
        </div>




                </div>
                <OnboardingShopViewPopup
                        title={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_TITLE}
                        subTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE}
                        subTitle2={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE_TWO}
                        onClickContinue={onBackTOLoginBtnClick}
                        imageSrc={''}
                        btnTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_BUTTON_TITLE}
                        id={'firebaseRegisterAlreadyusedPopup'}
                    />
            </div>
        )
    }
}
export default CheckoutCart;