import React from 'react';

const MobileActivityView = (props) => {
    //console.log("%cmobile activity view", "color:green", props);
    const { ActivityOrderList, activityBuffer, data, getDistinctActivity, loading, activityTableFilter, activeClass, NavbarPage, CommonHeader, AndroidAndIOSLoader, Emailstatus, clearInput} = props;
    return (
        <div >
            {loading == false ? !activityBuffer || activityBuffer.length == 0 || Emailstatus == true ? <AndroidAndIOSLoader /> : '' : ''}
            <div className="appHeader">
                <div className="container-fluid">
                    <CommonHeader {...props} />
                </div>
            </div>
            <NavbarPage {...props} />
            <ActivityOrderList {...props} loader={data} orders={getDistinctActivity} loader={data} click={activeClass} activityTableFilter={activityTableFilter} clearInput={clearInput}/>
            {/* {activities.activities && !activities.activities.length == 0 && activities.activities.length >= config.key.ACTIVITY_PAGE_SIZE ?
                <div className="appBottomMenu appBottomCustomerButton" onClick={() => load()}>
                    <button className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                </div>
                :
                null
            } */}
        </div>
    )

}

export default MobileActivityView;
