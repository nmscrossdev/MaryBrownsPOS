import React from 'react';

class HelpingTeamImages extends React.Component {
    render() {
        const { title, subTitle, teamImg1, teamImg2, teamImg3 } = this.props
        return (
            <div className="block-helping-team">
                <div className="block-help-team-memeber">
                    <img src="../assets/img/onboarding/team1.png" alt="" />
                </div>
                <div className="block-help-team-memeber-overlay">
                    <div className="block-help-team-memeber">
                        <img src="../assets/img/onboarding/team2.png" alt="" />
                    </div>
                    <div className="block-help-team-memeber">
                        <img src="../assets/img/onboarding/team3.png" alt="" />
                    </div>
                </div>
            </div>
            // <div className="block-helping-team" id="getteamheight">
            //                                     <div className="block-help-team-memeber">
            //                                         <img src="../assets/img/onboarding/team1.png" alt="" />
            //                                     </div>
            //                                     <div className="block-help-team-memeber-overlay">
            //                                         <div className="block-help-team-memeber">
            //                                             <img src="../assets/img/onboarding/team2.png" alt="" />
            //                                         </div>
            //                                         <div className="block-help-team-memeber">
            //                                             <img src="../assets/img/onboarding/team3.png" alt="" />
            //                                         </div>
            //                                     </div>
            //                                 </div>
            // <div>
            //     <h1>{title}</h1>
            //     <div className="text-center">
            //         <div className="block-helping-team" id="getteamheight">
            //             <div className="block-help-team-memeber">
            //                 <img src="../assets/img/onboarding/team1.png" alt="" />
            //             </div>
            //             <div className="block-help-team-memeber-overlay">
            //                 <div className="block-help-team-memeber">
            //                     <img src="../assets/img/onboarding/team2.png" alt="" />
            //                 </div>
            //                 <div className="block-help-team-memeber">
            //                     <img src="../assets/img/onboarding/team3.png" alt="" />
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <p>{subTitle}</p>
            // </div>
        )
    }
}
export { HelpingTeamImages };