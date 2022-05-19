import React from 'react';

export const AndroidAndIOSLoader = () => {
    return (
        <div className="popup">
        <div className="loader-centered text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="120" height="120" viewBox="0 0 400 400" enableBackground="new 0 0 400 400">
                <g>
                    <rect x="249.28" y="156.01" className="st0 ologo-1" width="103.9" height="103.9"></rect>
                    <path id="teal" className="st1 ologo-2" d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z"></path>
                    <rect id="cyan" x="145.38" y="259.91" className="st2 ologo-3" width="103.9" height="103.89"></rect>
                    <path id="blue" className="st3 ologo-4" d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z"></path>
                    <rect id="purple" x="41.49" y="156.01" className="st4 ologo-5" width="103.9" height="103.9"></rect>
                    <path id="red" className="st5 ologo-6" d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z"></path>
                    <rect id="orange" x="145.38" y="52.12" className="st6 ologo-7" width="103.9" height="103.9"></rect>
                    <path id="yellow" className="st7 ologo-8" d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z"></path>
                </g>
            </svg>
            <div>
                <span className="">Loading</span> <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            </div>
        </div>
    </div>
    //     <div className="loader-fixed">
    //     <div className="loader-centered text-primary">
    //         <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns="xmlns:xlink='http://www.w3.org/1999/xlink" x="0px" y="0px" width="120px" height="120px"
    //             viewBox="0 0 200 200" enableBackground="new 0 0 200 200" xml="xml:space='preserve'">
    //             <g>
    //                 <rect x="81" y="78.7" className="st2" width="37.7" height="23.3" fill="#fff"></rect>
    //                 <g id="eyes-follows">

    //                     <path clipPath="url(#SVGID_2_)" fill="#A9D47D"
    //                         d="M12.684,107.321c4.304,49.196,47.674,85.589,96.87,81.284
    //                                                 c0.426-0.037,0.845-0.091,1.266-0.143c-0.158-0.546-0.271-1.129-0.327-1.759c-0.045-0.518-0.037-1.008-0.004-1.481
    //                                                 c-0.405,0.05-0.81,0.102-1.219,0.138c-47.403,4.147-89.193-30.919-93.341-78.322c-4.147-47.404,30.919-89.195,78.323-93.342
    //                                                 c44.535-3.896,87.011,26.567,95.429,69.576c-8.236-44.833-49.385-76.874-95.713-72.821C44.771,14.755,8.379,58.125,12.684,107.321" />

    //                     <path clipPath="url(#SVGID_2_)" fill="#A9D47D" d="M90.524,185.718c0,0,4.398,14.248,15.807,6.431c0,0,5.829,6.229,6.101-3.176
    //                                                 l4.989-4.471" />

    //                     <path clipPath="url(#SVGID_2_)" fill="#A9D47D" d="M90.55,186.095c0,0,2.885-14.631,15.049-8.048c0,0,5.146-6.807,6.398,2.52
    //                                                 l5.43,3.926" />
    //                 </g>
    //                 <path clipPath="url(#SVGID_2_)" fill="#AED084" d="M110.921,151.552c-7.23,0.002-14.462,0.002-21.692,0.004
    //                                                 c0.001-2.054,0.001-4.106,0.001-6.763c1.801,2.34,3.213,4.174,4.625,6.006c0.242-0.183,0.483-0.366,0.724-0.55
    //                                                 c-0.505-0.788-0.93-1.645-1.529-2.353c-2.629-3.111-4.638-6.408-3.841-10.752c0.088-0.484-0.213-1.042-0.369-1.716
    //                                                 c-0.465,0.319-0.641,0.374-0.677,0.477c-0.093,0.265-0.215,0.567-0.166,0.826c0.841,4.55-1.124,8.096-3.989,11.338
    //                                                 c-0.38,0.431-0.725,0.917-0.974,1.429c-0.143,0.297-0.061,0.699-0.081,1.055c0.143,0.07,0.286,0.142,0.429,0.212
    //                                                 c1.421-1.842,2.842-3.683,4.597-5.958v6.744c-3.686,0.022-7.375,0.106-11.057,0.018c-0.721-0.018-1.627-0.52-2.107-1.087
    //                                                 c-5.344-6.311-7.827-13.877-9.406-21.825c-1.403-7.063-2.138-14.167-0.399-21.258c0.63-2.57,1.969-4.958,2.71-7.509
    //                                                 c0.393-1.351,0.706-3.089,0.193-4.284c-3.635-8.473-2.608-16.136,3.195-23.322c0.997-1.235,1.505-3.143,1.595-4.775
    //                                                 c0.224-4.015,0.074-8.05,0.074-12.589c1.631,1.178,2.815,2.194,4.143,2.962c4.299,2.49,8.466,5.332,13.02,7.232
    //                                                 c9.004,3.754,17.72,2.142,25.871-2.841c3.684-2.254,7.195-4.792,11.024-7.363c0,1.127-0.018,2.161,0.003,3.195
    //                                                 c0.067,3.389-0.077,6.806,0.322,10.157c0.19,1.601,1.194,3.261,2.229,4.579c5.258,6.673,6.411,13.895,3.155,21.736
    //                                                 c-0.926,2.23-0.908,4.178,0.145,6.406c4.37,9.28,3.913,18.846,1.653,28.587c-1.8,7.759-5.802,14.424-9.719,21.16
    //                                                 c-0.271,0.472-1.13,0.841-1.723,0.849c-3.612,0.061-7.229,0-10.84-0.019c0.002-2.04,0.002-4.08,0.002-6.12
    //                                                 c0.159-0.027,0.317-0.053,0.475-0.079c1.383,1.802,2.765,3.608,4.149,5.413c0.24-0.17,0.478-0.339,0.717-0.509
    //                                                 c-0.604-0.945-1.097-1.99-1.836-2.815c-2.569-2.872-4.103-6.039-3.463-10.015c0.092-0.577-0.169-1.213-0.269-1.822
    //                                                 c-0.88,2.726-0.897,5.56-1.894,7.994c-0.989,2.412-2.967,4.423-4.511,6.606c0.262,0.185,0.521,0.37,0.781,0.555
    //                                                 c1.423-1.853,2.849-3.703,4.273-5.557c0.146,0.055,0.29,0.108,0.437,0.165C110.921,147.434,110.921,149.493,110.921,151.552
    //                                                     M97.955,86.132c-0.008-6.113-5.106-11.267-11.128-11.251c-6.221,0.018-11.465,5.303-11.429,11.521
    //                                                 c0.032,6.021,5.191,11.21,11.208,11.273C92.773,97.742,97.964,92.46,97.955,86.132 M124.42,86.435
    //                                                 c0.049-6.129-5.018-11.388-11.132-11.558c-5.958-0.166-11.382,5.179-11.426,11.256c-0.046,6.283,5.179,11.6,11.341,11.542
    //                                                 C119.205,97.619,124.374,92.438,124.42,86.435 M100.109,92.036c-4,3.5-3.844,6.529,0.375,9.431
    //                                                 C104.188,97.681,104.1,94.608,100.109,92.036" />

    //                 <path clipPath="url(#SVGID_2_)" fill="#51ADCB" d="M87.979,151.551v-6.744c-1.755,2.275-3.176,4.116-4.597,5.958
    //                                                 c-0.143-0.07-0.286-0.142-0.429-0.212c0.02-0.355-0.062-0.758,0.081-1.055c0.249-0.512,0.594-0.998,0.974-1.429
    //                                                 c2.866-3.241,4.83-6.788,3.99-11.338c-0.049-0.258,0.073-0.562,0.166-0.826c0.036-0.103,0.211-0.157,0.677-0.477
    //                                                 c0.155,0.674,0.456,1.232,0.368,1.716c-0.796,4.344,1.212,7.642,3.842,10.752c0.598,0.708,1.024,1.564,1.528,2.353
    //                                                 c-0.241,0.184-0.482,0.367-0.724,0.55c-1.411-1.832-2.823-3.666-4.625-6.006c0,2.656,0,4.709-0.001,6.763
    //                                                 C88.812,151.554,88.396,151.554,87.979,151.551" />

    //                 <path clipPath="url(#SVGID_2_)" fill="#4BABCF"
    //                     d="M110.921,151.552v-6.18c-0.145-0.053-0.289-0.107-0.437-0.162
    //                                                 c-1.425,1.853-2.849,3.705-4.271,5.557c-0.262-0.184-0.52-0.371-0.781-0.555c1.544-2.186,3.521-4.193,4.509-6.605
    //                                                 c0.998-2.435,1.015-5.271,1.896-7.993c0.098,0.606,0.36,1.242,0.267,1.821c-0.638,3.975,0.896,7.143,3.464,10.014
    //                                                 c0.738,0.824,1.23,1.87,1.837,2.816c-0.24,0.17-0.48,0.339-0.721,0.509c-1.381-1.805-2.763-3.61-4.147-5.415
    //                                                 c-0.157,0.026-0.315,0.053-0.475,0.081c0,2.038,0,4.078-0.002,6.118C111.679,151.556,111.299,151.554,110.921,151.552" />

    //                 <path clipPath="url(#SVGID_2_)" fill="#FFFFFF" d="M97.955,86.132c0.01,6.329-5.182,11.61-11.349,11.544
    //                                                 c-6.017-0.065-11.175-5.253-11.208-11.274c-0.036-6.22,5.208-11.503,11.429-11.522C92.848,74.864,97.947,80.02,97.955,86.132
    //                                                     M91.952,86.218c-0.026-2.995-2.42-5.378-5.354-5.332c-2.895,0.045-5.238,2.517-5.208,5.491c0.032,2.992,2.432,5.37,5.367,5.317
    //                                                 C89.772,91.637,91.979,89.313,91.952,86.218" />

    //                 <path clipPath="url(#SVGID_2_)" fill="#FFFFFF" d="M124.42,86.436c-0.046,6.003-5.215,11.184-11.217,11.239
    //                                                 c-6.162,0.058-11.387-5.258-11.342-11.542c0.045-6.077,5.467-11.422,11.427-11.256C119.402,75.046,124.469,80.306,124.42,86.436
    //                                                     M118.417,86.314c0.007-2.966-2.381-5.424-5.273-5.427c-3.007-0.005-5.283,2.314-5.29,5.388c-0.006,3.085,2.242,5.404,5.256,5.42
    //                                                 C116.047,91.71,118.412,89.313,118.417,86.314" />

    //                 <path clipPath="url(#SVGID_2_)" fill="#46A9D4" d="M100.109,92.036c3.99,2.573,4.079,5.645,0.375,9.431
    //                                                 C96.265,98.563,96.109,95.536,100.109,92.036" />

    //                 <path id="right-eye01" clipPath="url(#SVGID_2_)" fill="#46A9D4"
    //                     d="M95.15,91.458c-0.299,3.078-2.734,5.163-5.741,4.9
    //                                                 c-2.923-0.251-5.063-2.868-4.782-5.849c0.283-2.959,2.872-5.171,5.756-4.913C93.303,85.854,95.438,88.477,95.15,91.458" />

    //                 <path id="right-eye02" clipPath="url(#SVGID_2_)" fill="#46A9D4"
    //                     d="M119.979,90.696c0.562,3.041-1.207,5.716-4.168,6.292
    //                                                 c-2.88,0.565-5.658-1.361-6.208-4.303c-0.545-2.923,1.334-5.762,4.178-6.31C116.658,85.819,119.432,87.751,119.979,90.696" />

    //             </g>

    //         </svg>
    //         <div>
    //             <span className="">Loading</span> <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    //         </div>
    //     </div>
    // </div>
    );
}