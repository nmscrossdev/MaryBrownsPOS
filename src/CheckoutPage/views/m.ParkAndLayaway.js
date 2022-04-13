import React from 'react';

export const ParkAndLayaway = (props) => {
    const { shop_order, LocalizedLanguage, onClick, parkOrder, activeNoteButton, validateNote } = props;
    return (
        <div id="park-sale-and-layaway-modal" data-status="park_sale">
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-12">
                            <a className="appHeaderBack" href="/checkout">
                                <img src="../mobileassets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.cancel}
                    </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="appCapsule h-100 overflow-hidden pb-0">
                <div className="container-fluid p-0 pt-3 addfeeForm">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="textareaFee">
                                <textarea id="park-sale-and-layaway-modal-note" cols="30" rows="10" onChange={(e) => validateNote(e)} className="shadow-none form-control" placeholder={LocalizedLanguage.placeholderNote}></textarea>
                            </div>
                            {(activeNoteButton == true) ?
                                <button onClick={onClick} type="button" className="btn btn-primary rounded-0 btn-block h-70-px shadow-none text-uppercase">{LocalizedLanguage.saveAndClose}</button>
                                :
                                <button disabled type="button" className="btn btn-primary rounded-0 btn-block h-70-px shadow-none text-uppercase">{LocalizedLanguage.saveAndClose}</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParkAndLayaway;