import React from 'react'

function SendMailComponent() {
  return (
    <div className='payment payment-email'>

      <img src="../assets/image/mblogobig.png" alt="" />
      <p>Please enter your email address</p>
      <input type="email" placeholder="Email Address" />
      <label>
        <input type="checkbox" />
        <div className="custom-checkbox">
          <svg width={21} height={18} viewBox="0 0 21 18">
            <path d="M17.4237 1.42326C17.7736 1.07644 18.2459 0.881249 18.7385 0.87989C19.2312 0.878531 19.7045 1.07111 20.0563 1.416C20.4081 1.76088 20.61 2.23036 20.6184 2.72293C20.6268 3.2155 20.441 3.69159 20.1012 4.04826L10.1212 16.5233C9.94966 16.708 9.74265 16.8563 9.51252 16.9592C9.28238 17.0621 9.03386 17.1175 8.78181 17.1222C8.52976 17.1269 8.27936 17.0807 8.04558 16.9863C7.81179 16.892 7.59943 16.7515 7.42119 16.5733L0.808685 9.95826C0.624468 9.7866 0.476713 9.5796 0.374233 9.34961C0.271753 9.11961 0.216648 8.87132 0.212206 8.61957C0.207764 8.36781 0.254076 8.11774 0.348379 7.88427C0.442681 7.65079 0.583043 7.43871 0.76109 7.26066C0.939136 7.08262 1.15122 6.94226 1.38469 6.84795C1.61816 6.75365 1.86823 6.70734 2.11999 6.71178C2.37175 6.71622 2.62003 6.77133 2.85003 6.87381C3.08003 6.97629 3.28703 7.12404 3.45868 7.30826L8.69369 12.5408L17.3762 1.47826C17.3917 1.45889 17.4084 1.44052 17.4262 1.42326H17.4237Z" fill="#0AACDB" />
          </svg>
        </div>
        Receive promotional emails
      </label>
      <button onclick="changeURL('./Home_Screen.html')">Send Receipt</button>


    </div>
  )
}

export default SendMailComponent;