import React from 'react';
import { history } from '../../../_helpers';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import ActiveUser from '../../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import CommonJs, { onBackTOLoginBtnClick } from '../../../_components/CommonJS';
import RecommendedProduct from '../../../SelfCheckout/components/RecommendedProduct'
import Navbar from '../../../SelfCheckout/components/Navbar'

class CheckoutCart extends React.Component {
  constructor(props) {
    super(props);
    this.GoBackhandleClick = this.GoBackhandleClick.bind(this);
  }

  componentDidMount() {
    setTimeout(function () {
      if (typeof EnableContentScroll != "undefined") { EnableContentScroll(); }
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
    var landingScreen = ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo : '';
    // if (Register_Permissions) {
    //     Register_Permissions.content && Register_Permissions.content.filter(item => item.slug == "landing-screen").map(permission => {
    //         landingScreen = permission.value;
    //     })
    // }
    console.log("checkList---------->",checkList)
    console.log("cartDiscountAmount------->",cartDiscountAmount)
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
            <img onClick={() => this.GoBackhandleClick()} src="assets/image/Mary_Browns_Logo.png" alt="" />
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
            <button onClick={() => this.GoBackhandleClick()}>
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


                {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                  var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (

                    <div className="item">
                      <div className="col">
                        <p className="prod-name"><Markup content={product.Title} /></p>

                        <p class="description">Big Mary Sandwich</p>
                        <p class="description">Diet 7up</p>
                        <p class="description">Taters</p>
                        <p class="description">Small Coleslaw Salad</p>
                        <p class="note">Note: No Mayo</p>
                        <p class="note">Discount: $2.99</p>

                      </div>
                      <div className="row">
                        <label className="number-input-container">
                          <div onclick="decrement(this)" className="svg-container left">
                            {/* <img src="assets/image/minus-sign.png" style={{width:"16px" , height:"40px"}} /> */}
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
                          <p className="price"> {product.Price}</p>
                          <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                            <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })
                }


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
                    <p>{LocalizedLanguage.subTotal}</p>
                    <p>{LocalizedLanguage.discount}</p>
                    <p>{LocalizedLanguage.tax}</p>
                  </div>
                  <div className="col">
                    <p className="subtotal-amount right"> {checkList && checkList.subTotal}</p>
                    <p className="discount-amount right">$2.99</p>
                    <p className="tax-amount right">{checkList && checkList.tax} </p>
                  </div>
                </div>
                <div className="total">
                  <p>{LocalizedLanguage.total}</p>
                  <p className="cart-amount"> {checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="instructions">Order instructions</p>
          <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""} />




          <RecommendedProduct />

          <button onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart scroll-end">
            {LocalizedLanguage.continueToPayment}
          </button>

         



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
            <Navbar />
          
          </div>
          <div className="category-header-row">
            <div className="category-header-col">
              <p className="title">Order Summary</p>
            </div>
            <button onClick={() => this.GoBackhandleClick()}>
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


                {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                  var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (

                    <div className="item">
                      <div className="col">
                        <p className="prod-name"><Markup content={product.Title} /></p>

                        <p class="description">Big Mary Sandwich</p>
                        <p class="description">Diet 7up</p>
                        <p class="description">Taters</p>
                        <p class="description">Small Coleslaw Salad</p>
                        <p class="note">Note: No Mayo</p>
                        <p class="note">Discount: $2.99</p>

                      </div>
                      <div className="row">
                        <label className="number-input-container">
                          <div onclick="decrement(this)" className="svg-container left">
                            {/* <img src="assets/image/minus-sign.png" style={{width:"16px" , height:"40px"}} /> */}
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
                          <p className="price"> {product.Price}</p>
                          <svg onclick="deleteItem(this)" width={15} height={15} viewBox="0 0 15 15">
                            <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })
                }


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
                    <p>{LocalizedLanguage.subTotal}</p>
                    <p>{LocalizedLanguage.discount}</p>
                    <p>{LocalizedLanguage.tax}</p>
                  </div>
                  <div className="col">
                    <p className="subtotal-amount right"> {checkList && checkList.subTotal}</p>
                    <p className="discount-amount right">$2.99</p>
                    <p className="tax-amount right">{checkList && checkList.tax} </p>
                  </div>
                </div>
                <div className="total">
                  <p>{LocalizedLanguage.total}</p>
                  <p className="cart-amount"> {checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="instructions">Order instructions</p>
          <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""} />




          <RecommendedProduct />

          <button onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart scroll-end">
            {LocalizedLanguage.continueToPayment}
          </button>



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