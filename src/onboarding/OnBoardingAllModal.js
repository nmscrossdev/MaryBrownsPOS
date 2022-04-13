import React from 'react';
import { BridgeNotConnectedModal } from './components/BridgeNotConnectedModal'
import { WebRegisterExpertPopup } from './components/WebRegisterExpertPopup'
import { BridgeNotConnectedTwo } from './components/BridgeNotConnectedTwo'
import { ExpertChatModal } from './components/ExperChatModal'
import { ExpertCallModal } from './components/ExpertCallModal'
import { ExpertBookTimeModal } from './components/ExpertBookTimeModal'
import { ExpertGetInTouchModal } from './components/ExpertGetInTouchModal'
import { ExpertUpdateNumberModal } from './components/ExpertUpdateNumberModal'
import { BridgeNotConnectedSuccess } from './components/BridgeNotConnectedSuccess'
import { BookingConfirmedModal } from './components/BookingConfirmedModal'
// import { OnboardingShopViewPopup } from './components/OnboardingShopViewPopup'
import { LoadMyProductsModal } from './components/LoadMyProductsModal'

class OnBoardingAllModal extends React.Component {

    render() {
        return (
            <div>
                <LoadMyProductsModal/>
                {/* <OnboardingShopViewPopup/> */}
                <BridgeNotConnectedModal />
                <WebRegisterExpertPopup />
                <ExpertChatModal />
                <BridgeNotConnectedSuccess />
                <BridgeNotConnectedTwo />
                <ExpertCallModal />
                <BookingConfirmedModal />
                <ExpertBookTimeModal />
                <ExpertGetInTouchModal />
                <ExpertUpdateNumberModal />
            </div>
        )
    }
}
export { OnBoardingAllModal };