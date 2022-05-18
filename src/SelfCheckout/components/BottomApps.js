import React from 'react';
import {_key,getApps,get_uuid,getInitials} from '../../settings/SelfCheckoutSettings';

const BottomApps=(props)=> {
  var apps=props.page?getApps(props.page):null
    return ( 
        <div className="row">
          {
            apps && apps.map((item, index) => {
              let inName = item.Name?getInitials(item.Name):"";
              let uid=get_uuid();
             return(
                <button onClick={() =>props.showExtensionIframe? props.showExtensionIframe(item.Id):null} className="icon" key={"btmapp_"+index}><span id={"appInitial_"+uid} style={{display:"none",color:"white",fontSize:"1.8vw"}}>{inName}</span>
                {/* <svg width={29} height={29} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.1 0H2.9C1.305 0 0 1.305 0 2.9V29L5.8 23.2H26.1C27.695 23.2 29 21.895 29 20.3V2.9C29 1.305 27.695 0 26.1 0ZM26.1 20.3H5.8L2.9 23.2V2.9H26.1V20.3ZM7.25 10.15H10.15V13.05H7.25V10.15ZM13.05 10.15H15.95V13.05H13.05V10.15ZM18.85 10.15H21.75V13.05H18.85V10.15Z" fill="white" />
                </svg> */}
                {item.logo!=null? <img id={"appLogo_"+uid} src={item.logo} alt={inName}  onError={(e) => { e.target.onerror = null; document.getElementById("appInitial_"+uid).style.display="block";document.getElementById("appLogo_"+uid).style.display="none";/* e.target.src = showInitials(inName)*/}}  style={{height:"2vw",width:"2.2vw"}}/>:
              <svg width={29} height={29} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.1 0H2.9C1.305 0 0 1.305 0 2.9V29L5.8 23.2H26.1C27.695 23.2 29 21.895 29 20.3V2.9C29 1.305 27.695 0 26.1 0ZM26.1 20.3H5.8L2.9 23.2V2.9H26.1V20.3ZM7.25 10.15H10.15V13.05H7.25V10.15ZM13.05 10.15H15.95V13.05H13.05V10.15ZM18.85 10.15H21.75V13.05H18.85V10.15Z" fill="white" />
              </svg>}
                <p>{item.Name}</p>
                </button>
              )
            })
          }
    </div>)
    }

    export default BottomApps;