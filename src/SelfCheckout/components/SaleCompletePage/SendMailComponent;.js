import React from 'react'

function SendMailComponent() {
  return (
    <div className="payment-view email-payment">
    <div className="wrapper">
      <img src="../assets/image/mblogobig.png" alt="" />
      <p>Please enter your email address</p>
      <input type="email" placeholder="Enter Email" />
      <label>
        <input type="checkbox" />
        <div className="custom-checkbox">
          <svg width={21} height={18} viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.4237 1.42317C17.7736 1.07635 18.2459 0.881158 18.7385 0.879798C19.2312 0.878439 19.7045 1.07102 20.0563 1.4159C20.4081 1.76079 20.61 2.23027 20.6184 2.72284C20.6268 3.21541 20.441 3.6915 20.1012 4.04817L10.1212 16.5232C9.94966 16.7079 9.74265 16.8562 9.51252 16.9591C9.28238 17.062 9.03386 17.1174 8.78181 17.1221C8.52976 17.1268 8.27936 17.0806 8.04558 16.9862C7.81179 16.8919 7.59943 16.7514 7.42119 16.5732L0.808685 9.95817C0.624468 9.78651 0.476713 9.57951 0.374233 9.34951C0.271753 9.11952 0.216648 8.87123 0.212206 8.61947C0.207764 8.36772 0.254076 8.11764 0.348379 7.88417C0.442681 7.6507 0.583043 7.43862 0.76109 7.26057C0.939136 7.08253 1.15122 6.94216 1.38469 6.84786C1.61816 6.75356 1.86823 6.70725 2.11999 6.71169C2.37175 6.71613 2.62003 6.77124 2.85003 6.87372C3.08003 6.9762 3.28703 7.12395 3.45868 7.30817L8.69369 12.5407L17.3762 1.47817C17.3917 1.4588 17.4084 1.44043 17.4262 1.42317H17.4237Z" fill="#0aacdb" />
          </svg>
        </div>
        Receive promotional emails
      </label>
      <button id="sendReceipt">Send Receipt</button>
    </div>
  </div>
  )
}

export default SendMailComponent;