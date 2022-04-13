import React from 'react';

const CustomerList = (props) => {
    const { items, addNewCustomter, goBack } = props;
    return (
        <tr onClick={props.onClick}>
            <td className="text-truncate" onClick={()=>addNewCustomter('edit')}>
            {/* {items.Email} */}
                {items.FirstName ? items.FirstName : items.Email}{" "}{items.LastName ? items.LastName : ''}

              <div>{items.PhoneNumber}</div>
            </td>
            <td className="w-60">
                <div className="appCustomizeRadioCheckbox float-right" id={items.FirstName}>
                    <div className="custom-control custom-radio">
                        <input type="radio" name="customer" id={items.Email} className="custom-control-input" onClick={()=>goBack(true, items.Email)} />
                        <label className="custom-control-label label-40" htmlFor={items.Email}></label>
                    </div>
                </div>
            </td>
        </tr>
    )
}

export default CustomerList;