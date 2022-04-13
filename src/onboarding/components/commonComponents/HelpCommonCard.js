import React from 'react';

class HelpCommonCard extends React.Component {
    render() {
        const { title, subTitle, cardImg, btnTitle, btnTarget, btnType } = this.props

        return (
            // <div>
            <div className="card card-basic card-shadow text-center card-equal">
                <div className="card-header no-border pb-1">
                    <h1 className="font-lg">{title}</h1>
                </div>
                <div className="card-body font-sm py-0">
                    <img src={cardImg} className="img-responsive m-auto" width="70" alt="" />
                    <p className="pt-3">{subTitle}</p>
                </div>
                <div className="card-footer no-border">
                    <button
                        className={`btn btn-${btnType} btn-40 btn-break btn-boarding btn-min-200 btn-radius-2 font-sm`}
                        data-toggle="modal"
                        data-target={btnTarget}
                        data-dismiss="modal"
                    >{btnTitle}</button>
                </div>
            </div>
            // </disv>
        )
    }
}
export { HelpCommonCard };