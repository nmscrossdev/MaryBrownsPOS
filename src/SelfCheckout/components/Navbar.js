import React from 'react';
import {_key,getApps} from '../../settings/SelfCheckoutSettings';
// import { history } from '../../_helpers';
const changeURL=()=>
{
  //history.push='/checkout';
}


// const GoBack=()=>{
//        window.location='/SelfCheckoutView';
// }

const Navbar=(props)=> {
  var apps=props.page?getApps(props.page):null
    return ( <div>
        <div className={props.margin?props.margin:"header m-b-9"}>
        <img src="assets/image/Mary_Browns_Logo.png" alt="" />
        <div className="row">
          {
            apps &&  apps.map((item, index) => {
             return(<button onClick={() =>props.showExtensionIframe? props.showExtensionIframe(item.Id):null} className="icon" key={"nvapp_"+index}>
             {item.logo!=null? <img src={item.logo} alt={item.logo}  style={{height:"21px",width:"24px"}}/>:
              <svg
              width="21"
              height="24"
              viewBox="0 0 21 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.47467 10.0959C6.53529 10.2782 6.52108 10.4771 6.43517 10.6489C6.34926 10.8207 6.19867 10.9514 6.01647 11.0123C5.79386 11.0827 5.58739 11.1964 5.40895 11.347C5.23052 11.4976 5.08365 11.6819 4.97682 11.8895C4.70857 12.3956 4.52442 13.2279 4.69407 14.5865C4.71196 14.7744 4.6559 14.9618 4.53778 15.109C4.41967 15.2562 4.24883 15.3515 4.06155 15.3748C3.87426 15.398 3.68531 15.3473 3.53483 15.2334C3.38435 15.1195 3.2842 14.9514 3.25567 14.7649C3.06282 13.2235 3.24117 12.0621 3.69792 11.208C4.16192 10.338 4.86807 9.86679 5.55827 9.63769C5.74056 9.57708 5.93945 9.59128 6.11127 9.67719C6.28309 9.7631 6.41379 9.91369 6.47467 10.0959ZM13.629 2.31229C13.8045 2.24629 13.9476 2.11484 14.0283 1.94556C14.1089 1.77628 14.1209 1.58232 14.0616 1.40443C14.0023 1.22653 13.8763 1.07853 13.7102 0.991502C13.5441 0.904474 13.3508 0.885187 13.1708 0.937692C11.8107 1.39009 10.9624 2.50659 10.4651 3.70284C10.3976 3.86452 10.3357 4.02847 10.2795 4.19439C10.0083 3.67994 9.66123 3.20922 9.24997 2.79804C8.69264 2.23951 8.02695 1.80089 7.29383 1.50914C6.56072 1.21739 5.77567 1.07868 4.98697 1.10154C4.58304 1.1125 4.19865 1.27776 3.91279 1.56335C3.62693 1.84894 3.46131 2.23317 3.44997 2.63709C3.42711 3.43639 3.57018 4.23175 3.87016 4.97297C4.17015 5.71419 4.62052 6.38518 5.19287 6.94359C3.97486 7.20743 2.87416 7.85638 2.05364 8.79441C1.23313 9.73244 0.736399 10.9097 0.63697 12.152L0.628269 12.2593C0.436843 14.6477 0.945767 17.0402 2.09277 19.1439L2.61332 20.098C2.62782 20.1226 2.64232 20.1473 2.65972 20.1705L4.10972 22.2034C4.43835 22.6636 4.86331 23.0468 5.35503 23.3261C5.84675 23.6055 6.39342 23.7743 6.95703 23.821C7.52063 23.8676 8.08763 23.7909 8.61858 23.5962C9.14953 23.4015 9.63169 23.0934 10.0315 22.6935C10.0929 22.6321 10.1658 22.5833 10.2461 22.5501C10.3263 22.5169 10.4123 22.4997 10.4991 22.4997C10.586 22.4997 10.672 22.5169 10.7522 22.5501C10.8325 22.5833 10.9054 22.6321 10.9668 22.6935C11.3666 23.0934 11.8488 23.4015 12.3797 23.5962C12.9107 23.7909 13.4777 23.8676 14.0413 23.821C14.6049 23.7743 15.1515 23.6055 15.6433 23.3261C16.135 23.0468 16.5599 22.6636 16.8886 22.2034L18.3386 20.1719C18.356 20.1483 18.372 20.1236 18.3864 20.098L18.9055 19.1439C20.053 17.0403 20.5625 14.6479 20.3715 12.2593L20.3628 12.152C20.2986 11.3514 20.0688 10.5729 19.688 9.86577C19.3073 9.15863 18.7838 8.53828 18.1508 8.04401C17.5177 7.54975 16.7889 7.19234 16.0106 6.99443C15.2322 6.79652 14.4212 6.76242 13.629 6.89429L11.2249 7.29449C11.2394 6.30704 11.4134 5.19634 11.802 4.25964C12.2094 3.28089 12.8126 2.58489 13.629 2.31229ZM8.64097 7.10599L8.41767 7.06829C7.56672 6.90375 6.78477 6.48751 6.17307 5.87349C5.75387 5.45568 5.42465 4.95647 5.2057 4.4066C4.98675 3.85673 4.8827 3.26785 4.89997 2.67624C4.90035 2.64265 4.91396 2.61057 4.93785 2.58695C4.96174 2.56333 4.99398 2.55009 5.02757 2.55009C5.61893 2.53302 6.20754 2.63717 6.75714 2.85611C7.30675 3.07506 7.80573 3.40417 8.22337 3.82319C9.10352 4.70334 9.52837 5.86479 9.49647 7.02044C9.49609 7.05378 9.48268 7.08565 9.4591 7.10923C9.43553 7.1328 9.40366 7.14622 9.37032 7.14659C9.1265 7.1534 8.88253 7.13982 8.64097 7.10599ZM8.16537 8.49654L8.41767 8.53859L9.54577 8.72709C10.1775 8.83244 10.8223 8.83244 11.454 8.72709L13.8668 8.32399C14.4611 8.22486 15.0696 8.25029 15.6536 8.39867C16.2376 8.54704 16.7844 8.81512 17.2593 9.18592C17.7343 9.55672 18.127 10.0221 18.4126 10.5527C18.6983 11.0833 18.8705 11.6674 18.9186 12.268L18.9258 12.3753C19.0945 14.4831 18.6451 16.5944 17.6324 18.4508L17.1336 19.3643L15.7083 21.3595C15.5021 21.6484 15.2355 21.889 14.927 22.0644C14.6184 22.2398 14.2754 22.3459 13.9217 22.3753C13.568 22.4047 13.2121 22.3567 12.8788 22.2346C12.5456 22.1125 12.2429 21.9193 11.9919 21.6683C11.596 21.2725 11.059 21.0501 10.4991 21.0501C9.93925 21.0501 9.40229 21.2725 9.00637 21.6683C8.75537 21.9193 8.4527 22.1125 8.11944 22.2346C7.78618 22.3567 7.43031 22.4047 7.07661 22.3753C6.7229 22.3459 6.37984 22.2398 6.07131 22.0644C5.76277 21.889 5.49616 21.6484 5.29002 21.3595L3.86467 19.3643L3.36587 18.4508C2.35323 16.5944 1.90376 14.4831 2.07247 12.3753L2.08117 12.268C2.1292 11.6674 2.30149 11.0833 2.58711 10.5527C2.87274 10.0221 3.26547 9.55672 3.74042 9.18592C4.21537 8.81512 4.76218 8.54704 5.34618 8.39867C5.93017 8.25029 6.53863 8.22486 7.13297 8.32399L8.16537 8.49654Z"
                fill="white"
              />
              </svg>}
              <p>{item.Name}</p>
              </button>)
            })
          }
            {/* <button onClick={null} className="icon">
            <svg
						width="21"
						height="24"
						viewBox="0 0 21 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.47467 10.0959C6.53529 10.2782 6.52108 10.4771 6.43517 10.6489C6.34926 10.8207 6.19867 10.9514 6.01647 11.0123C5.79386 11.0827 5.58739 11.1964 5.40895 11.347C5.23052 11.4976 5.08365 11.6819 4.97682 11.8895C4.70857 12.3956 4.52442 13.2279 4.69407 14.5865C4.71196 14.7744 4.6559 14.9618 4.53778 15.109C4.41967 15.2562 4.24883 15.3515 4.06155 15.3748C3.87426 15.398 3.68531 15.3473 3.53483 15.2334C3.38435 15.1195 3.2842 14.9514 3.25567 14.7649C3.06282 13.2235 3.24117 12.0621 3.69792 11.208C4.16192 10.338 4.86807 9.86679 5.55827 9.63769C5.74056 9.57708 5.93945 9.59128 6.11127 9.67719C6.28309 9.7631 6.41379 9.91369 6.47467 10.0959ZM13.629 2.31229C13.8045 2.24629 13.9476 2.11484 14.0283 1.94556C14.1089 1.77628 14.1209 1.58232 14.0616 1.40443C14.0023 1.22653 13.8763 1.07853 13.7102 0.991502C13.5441 0.904474 13.3508 0.885187 13.1708 0.937692C11.8107 1.39009 10.9624 2.50659 10.4651 3.70284C10.3976 3.86452 10.3357 4.02847 10.2795 4.19439C10.0083 3.67994 9.66123 3.20922 9.24997 2.79804C8.69264 2.23951 8.02695 1.80089 7.29383 1.50914C6.56072 1.21739 5.77567 1.07868 4.98697 1.10154C4.58304 1.1125 4.19865 1.27776 3.91279 1.56335C3.62693 1.84894 3.46131 2.23317 3.44997 2.63709C3.42711 3.43639 3.57018 4.23175 3.87016 4.97297C4.17015 5.71419 4.62052 6.38518 5.19287 6.94359C3.97486 7.20743 2.87416 7.85638 2.05364 8.79441C1.23313 9.73244 0.736399 10.9097 0.63697 12.152L0.628269 12.2593C0.436843 14.6477 0.945767 17.0402 2.09277 19.1439L2.61332 20.098C2.62782 20.1226 2.64232 20.1473 2.65972 20.1705L4.10972 22.2034C4.43835 22.6636 4.86331 23.0468 5.35503 23.3261C5.84675 23.6055 6.39342 23.7743 6.95703 23.821C7.52063 23.8676 8.08763 23.7909 8.61858 23.5962C9.14953 23.4015 9.63169 23.0934 10.0315 22.6935C10.0929 22.6321 10.1658 22.5833 10.2461 22.5501C10.3263 22.5169 10.4123 22.4997 10.4991 22.4997C10.586 22.4997 10.672 22.5169 10.7522 22.5501C10.8325 22.5833 10.9054 22.6321 10.9668 22.6935C11.3666 23.0934 11.8488 23.4015 12.3797 23.5962C12.9107 23.7909 13.4777 23.8676 14.0413 23.821C14.6049 23.7743 15.1515 23.6055 15.6433 23.3261C16.135 23.0468 16.5599 22.6636 16.8886 22.2034L18.3386 20.1719C18.356 20.1483 18.372 20.1236 18.3864 20.098L18.9055 19.1439C20.053 17.0403 20.5625 14.6479 20.3715 12.2593L20.3628 12.152C20.2986 11.3514 20.0688 10.5729 19.688 9.86577C19.3073 9.15863 18.7838 8.53828 18.1508 8.04401C17.5177 7.54975 16.7889 7.19234 16.0106 6.99443C15.2322 6.79652 14.4212 6.76242 13.629 6.89429L11.2249 7.29449C11.2394 6.30704 11.4134 5.19634 11.802 4.25964C12.2094 3.28089 12.8126 2.58489 13.629 2.31229ZM8.64097 7.10599L8.41767 7.06829C7.56672 6.90375 6.78477 6.48751 6.17307 5.87349C5.75387 5.45568 5.42465 4.95647 5.2057 4.4066C4.98675 3.85673 4.8827 3.26785 4.89997 2.67624C4.90035 2.64265 4.91396 2.61057 4.93785 2.58695C4.96174 2.56333 4.99398 2.55009 5.02757 2.55009C5.61893 2.53302 6.20754 2.63717 6.75714 2.85611C7.30675 3.07506 7.80573 3.40417 8.22337 3.82319C9.10352 4.70334 9.52837 5.86479 9.49647 7.02044C9.49609 7.05378 9.48268 7.08565 9.4591 7.10923C9.43553 7.1328 9.40366 7.14622 9.37032 7.14659C9.1265 7.1534 8.88253 7.13982 8.64097 7.10599ZM8.16537 8.49654L8.41767 8.53859L9.54577 8.72709C10.1775 8.83244 10.8223 8.83244 11.454 8.72709L13.8668 8.32399C14.4611 8.22486 15.0696 8.25029 15.6536 8.39867C16.2376 8.54704 16.7844 8.81512 17.2593 9.18592C17.7343 9.55672 18.127 10.0221 18.4126 10.5527C18.6983 11.0833 18.8705 11.6674 18.9186 12.268L18.9258 12.3753C19.0945 14.4831 18.6451 16.5944 17.6324 18.4508L17.1336 19.3643L15.7083 21.3595C15.5021 21.6484 15.2355 21.889 14.927 22.0644C14.6184 22.2398 14.2754 22.3459 13.9217 22.3753C13.568 22.4047 13.2121 22.3567 12.8788 22.2346C12.5456 22.1125 12.2429 21.9193 11.9919 21.6683C11.596 21.2725 11.059 21.0501 10.4991 21.0501C9.93925 21.0501 9.40229 21.2725 9.00637 21.6683C8.75537 21.9193 8.4527 22.1125 8.11944 22.2346C7.78618 22.3567 7.43031 22.4047 7.07661 22.3753C6.7229 22.3459 6.37984 22.2398 6.07131 22.0644C5.76277 21.889 5.49616 21.6484 5.29002 21.3595L3.86467 19.3643L3.36587 18.4508C2.35323 16.5944 1.90376 14.4831 2.07247 12.3753L2.08117 12.268C2.1292 11.6674 2.30149 11.0833 2.58711 10.5527C2.87274 10.0221 3.26547 9.55672 3.74042 9.18592C4.21537 8.81512 4.76218 8.54704 5.34618 8.39867C5.93017 8.25029 6.53863 8.22486 7.13297 8.32399L8.16537 8.49654Z"
							fill="white"
						/>
            </svg>
            <p>Nutrition</p>
            </button>
            <button onClick={null} className="icon">
            <svg width="18" height="20" viewBox="0 0 18 20">
            <path
            d="M18 12V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V12C0.530433 12 1.03914 11.7893 1.41421 11.4142C1.78929 11.0391 2 10.5304 2 10C2 9.46957 1.78929 8.96086 1.41421 8.58579C1.03914 8.21071 0.530433 8 0 8V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V8C17.4696 8 16.9609 8.21071 16.5858 8.58579C16.2107 8.96086 16 9.46957 16 10C16 10.5304 16.2107 11.0391 16.5858 11.4142C16.9609 11.7893 17.4696 12 18 12ZM16 13.465C15.3917 13.114 14.8865 12.6089 14.5354 12.0007C14.1843 11.3924 13.9996 10.7023 14 10C14 8.52 14.804 7.227 16 6.535V2H2V6.535C3.196 7.227 4 8.52 4 10C4 11.48 3.196 12.773 2 13.465V18H16V13.465ZM6 4H12V6H6V4ZM6 14H12V16H6V14Z"
            fill="white"
            />
            </svg>
            <p>Offers</p>
            </button>
            <button onClick={null} className="icon">
            <svg width="26" height="24" viewBox="0 0 26 24">
            <path
            d="M25.0859 9.08877C24.9694 8.7272 24.7551 8.40493 24.4667 8.15763C24.1784 7.91034 23.8272 7.74766 23.4521 7.68761L17.5661 6.73104L14.8375 1.42877C14.6637 1.09122 14.4003 0.808062 14.0761 0.610374C13.752 0.412687 13.3797 0.308105 13 0.308105C12.6203 0.308105 12.248 0.412687 11.9239 0.610374C11.5997 0.808062 11.3363 1.09122 11.1625 1.42877L8.43391 6.73104L2.548 7.68761C2.17327 7.7486 1.82258 7.91163 1.53441 8.15882C1.24624 8.406 1.03172 8.72779 0.914395 9.08887C0.797069 9.44995 0.781469 9.83637 0.869306 10.2057C0.957144 10.5751 1.14502 10.9131 1.41233 11.1827L5.61194 15.4163L4.70296 21.3097C4.64463 21.6851 4.69095 22.0692 4.83684 22.42C4.98272 22.7707 5.22251 23.0744 5.52984 23.2977C5.83716 23.521 6.20011 23.6552 6.57877 23.6856C6.95743 23.7159 7.33712 23.6413 7.6761 23.4698L13 20.784L18.3241 23.4698C18.6631 23.6409 19.0427 23.7153 19.4212 23.6848C19.7997 23.6543 20.1625 23.5201 20.4697 23.2969C20.7769 23.0736 21.0167 22.7701 21.1626 22.4195C21.3086 22.069 21.3552 21.685 21.2972 21.3097L20.3882 15.4163L24.5878 11.1827C24.856 10.9136 25.0444 10.5756 25.1324 10.206C25.2203 9.83646 25.2042 9.44977 25.0859 9.08877ZM23.434 10.0384L18.657 14.8539L19.6911 21.5575C19.704 21.6378 19.6943 21.7201 19.6632 21.7952C19.6322 21.8704 19.5809 21.9354 19.5151 21.9832C19.4494 22.031 19.3716 22.0596 19.2906 22.066C19.2095 22.0723 19.1283 22.056 19.0559 22.019L13 18.9639L6.94403 22.0191C6.87164 22.0562 6.79042 22.0724 6.70937 22.0661C6.62831 22.0597 6.55059 22.0311 6.48482 21.9833C6.41904 21.9355 6.36778 21.8705 6.33672 21.7953C6.30565 21.7202 6.29599 21.6379 6.30881 21.5576L7.34297 14.8539L2.56603 10.0383C2.50899 9.98069 2.4689 9.90847 2.45017 9.82957C2.43144 9.75067 2.43479 9.66814 2.45985 9.59102C2.48491 9.51389 2.53071 9.44515 2.59223 9.39233C2.65376 9.33951 2.72864 9.30463 2.80866 9.29154L9.50371 8.2035L12.6074 2.17236C12.6445 2.10021 12.7008 2.03969 12.7701 1.99744C12.8393 1.95518 12.9189 1.93283 13 1.93283C13.0811 1.93283 13.1607 1.95518 13.2299 1.99744C13.2992 2.03969 13.3555 2.10021 13.3926 2.17236L16.4963 8.2035L23.1913 9.29154C23.2714 9.30463 23.3462 9.33951 23.4078 9.39233C23.4693 9.44515 23.5151 9.51389 23.5402 9.59102C23.5652 9.66814 23.5686 9.75067 23.5498 9.82957C23.5311 9.90847 23.491 9.98069 23.434 10.0383L23.434 10.0384Z"
            fill="white"
            />
            </svg>
            <p>Loyalty</p>
            </button> */}
            <button onClick={()=>changeURL()} className="icon big relative" disabled={props.page==_key.CHECKOUT_PAGE}>
            <svg width="27" height="27" viewBox="0 0 27 27">
            <path
            d="M0 1.625C0 1.39294 0.0921872 1.17038 0.256282 1.00628C0.420376 0.842187 0.642936 0.75 0.875 0.75H3.5C3.69518 0.750054 3.88474 0.815364 4.03853 0.935543C4.19232 1.05572 4.30152 1.22387 4.34875 1.41325L5.0575 4.25H25.375C25.5035 4.25012 25.6304 4.27853 25.7466 4.33321C25.8629 4.3879 25.9657 4.46751 26.0477 4.56641C26.1297 4.6653 26.1889 4.78104 26.2212 4.90541C26.2534 5.02977 26.2579 5.15971 26.2343 5.286L23.6093 19.286C23.5717 19.4865 23.4653 19.6676 23.3084 19.798C23.1515 19.9284 22.954 19.9998 22.75 20H7C6.79601 19.9998 6.59849 19.9284 6.44159 19.798C6.2847 19.6676 6.17829 19.4865 6.14075 19.286L3.5175 5.31225L2.8175 2.5H0.875C0.642936 2.5 0.420376 2.40781 0.256282 2.24372C0.0921872 2.07962 0 1.85706 0 1.625ZM5.4285 6L7.72625 18.25H22.0238L24.3215 6H5.4285ZM8.75 20C7.82174 20 6.9315 20.3687 6.27513 21.0251C5.61875 21.6815 5.25 22.5717 5.25 23.5C5.25 24.4283 5.61875 25.3185 6.27513 25.9749C6.9315 26.6313 7.82174 27 8.75 27C9.67826 27 10.5685 26.6313 11.2249 25.9749C11.8813 25.3185 12.25 24.4283 12.25 23.5C12.25 22.5717 11.8813 21.6815 11.2249 21.0251C10.5685 20.3687 9.67826 20 8.75 20ZM21 20C20.0717 20 19.1815 20.3687 18.5251 21.0251C17.8687 21.6815 17.5 22.5717 17.5 23.5C17.5 24.4283 17.8687 25.3185 18.5251 25.9749C19.1815 26.6313 20.0717 27 21 27C21.9283 27 22.8185 26.6313 23.4749 25.9749C24.1313 25.3185 24.5 24.4283 24.5 23.5C24.5 22.5717 24.1313 21.6815 23.4749 21.0251C22.8185 20.3687 21.9283 20 21 20ZM8.75 21.75C9.21413 21.75 9.65925 21.9344 9.98744 22.2626C10.3156 22.5908 10.5 23.0359 10.5 23.5C10.5 23.9641 10.3156 24.4092 9.98744 24.7374C9.65925 25.0656 9.21413 25.25 8.75 25.25C8.28587 25.25 7.84075 25.0656 7.51256 24.7374C7.18437 24.4092 7 23.9641 7 23.5C7 23.0359 7.18437 22.5908 7.51256 22.2626C7.84075 21.9344 8.28587 21.75 8.75 21.75ZM21 21.75C21.4641 21.75 21.9092 21.9344 22.2374 22.2626C22.5656 22.5908 22.75 23.0359 22.75 23.5C22.75 23.9641 22.5656 24.4092 22.2374 24.7374C21.9092 25.0656 21.4641 25.25 21 25.25C20.5359 25.25 20.0908 25.0656 19.7626 24.7374C19.4344 24.4092 19.25 23.9641 19.25 23.5C19.25 23.0359 19.4344 22.5908 19.7626 22.2626C20.0908 21.9344 20.5359 21.75 21 21.75Z"
            fill="white"
            />
            </svg>
            {props.itemCount?<div className="indicator">
            {props.itemCount}
            </div>:null}
            </button>
        </div>
    </div>
    {props.catName || props.catPName?
    <div className="category-header-row" onClick={props.GoBackhandleClick}>
			<div className="category-header-col">
				<p style={{textTransform:"capitalize"}} className="path">Menu &#62; {(props.catName && props.catName!=""&& props.catPName && props.catPName!='')? props.catPName:''}</p>
				<p style={{textTransform:"capitalize"}} className="title">{(props.catName==null || props.catName=="" && props.catPName && props.catPName!='')? props.catPName: props.catName}</p>
			</div>
			<button >
				<svg width="22" height="20" viewBox="0 0 22 20">
					<path
						d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="transparent"
					/>
				</svg>
				Go back to main menu
			</button>
		</div>:null}
    </div>);
    }

    export default Navbar;