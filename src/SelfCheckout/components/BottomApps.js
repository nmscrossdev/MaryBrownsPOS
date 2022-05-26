import React from 'react';
import {_key,getApps,get_uuid,getInitials} from '../../settings/SelfCheckoutSettings';
import Config from '../../Config';
const BottomApps=(props)=> {
  var apps=props.apps;
    return ( 
      <React.Fragment>
        <div className="divider" />
          <div className="header" style={{justifyContent:"center"}}>
          <div className="row">
            {
              apps && apps.map((item, index) => {
                let inName = item.Name?getInitials(item.Name):"";
                let uid=get_uuid();
              return(
                  <div onClick={() =>props.showExtensionIframe? props.showExtensionIframe(item.Id):null} className="col icon app" key={"btmapp_"+index}><button className='initial' id={"appInitial_"+uid} style={{display:"none",color:"white",fontSize:"1.8vw"}}>{inName}</button>
                  {item.logo!=null && item.logo!=Config.key.RECIEPT_IMAGE_DOMAIN+"/" ? <img className="app-icon" id={"appLogo_"+uid} src={item.logo} alt={inName}  onError={(e) => { e.target.onerror = null; document.getElementById("appInitial_"+uid).style.display="block";document.getElementById("appLogo_"+uid).style.display="none";/* e.target.src = showInitials(inName)*/}} />:
                  <button className='initial' id={"appInitial_"+uid} style={{color:"white",fontSize:"1.8vw"}}>{inName}</button>}
                  <p>{item.Name}</p>
                  </div>
                )
              })
            }
        </div>
        </div>
       </React.Fragment>)
    }

    export default BottomApps;