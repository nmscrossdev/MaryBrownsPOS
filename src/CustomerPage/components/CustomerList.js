import React from 'react';

export const CustomerViewFirst = (props) => {  
    return (
        <tr className={props.className} onClick={props.onClick} id={props.FirstName} className={"pointer activity-order "+ props.className ?props.className:""} style={{cursor: "pointer"}}>
            <td style={{width:"65%"}}>
                <div className="widget_day_record_text ">
                    <h6 className="text-capitalize-remove"> {props.FirstName ? props.FirstName : props.Email}{" "}{props.LastName ? props.LastName : ''}</h6>
                    <p className="text-capitalize-remove">{props.FirstName ? props.Email:''}</p>
                </div>
            </td>
            <td>
                <div className="widget_day_record_text text-right">
                {props.PhoneNumber}   
                </div>
            </td>
            </tr>
       
    );
}
