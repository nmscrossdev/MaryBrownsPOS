
//console.log("envournment",API_URL);

exports.key = {  
    OP_API_URL              : process.env.API_URL,
    AUTH_KEY                :  sessionStorage.getItem("AUTH_KEY"),
    //"posk_3dd80552ca15f4fe59bd42875d618e3ccf560bd6" + ":" +  "poss_5a3f7d8d34dc3605ea5796eda8d6dfcf6cf82254",
    // AUTH_NAME           : "posk_3dd80552ca15f4fe59bd42875d618e3ccf560bd6",
    // AUTH_PWD            : "poss_5a3f7d8d34dc3605ea5796eda8d6dfcf6cf82254",
    ENV                     :  process.env.ENVIRONMENT,
    PPRODUCT_PAGE_SIZE      :  100,
    CUSTOMER_PAGE_SIZE      :  50,
    ACTIVITY_PAGE_SIZE      : 100, 
    FETCH_PRODUCTS_PAGESIZE : 1000,
    DATE_FORMAT             :'DD, MMMM YYYY',
    DATETIME_FORMAT         :'DD, MMMM YYYY, h:mm a',
    TIMEDATE_FORMAT         :'h:mm A DD, MMMM YYYY',
        RECIEPT_IMAGE_DOMAIN    : "https://"+ (process.env.ENVIRONMENT=='production'?'app.oliverpos.com' :process.env.ENVIRONMENT=='development'?'qa1.app.olivertest.com':'dev1.app.olivertest.com'),
    NOTIFICATION_LIMIT      : 100 ,
    NOTIFICATION_FORMAT     :'DD/MM/YY, h:mm a',
    SYNC_COUNT_LIMIT        :100,
    BUGSNAG_KEY             : process.env.ENVIRONMENT=='production'?'1b6822fe1472fcdb1089ae3dbbc58d1c' :process.env.ENVIRONMENT=='development'?'36d2896ab825e64ceeffda1d5840cb4d':'44dbab7bfa5373855271ad1de88669dc',
    PRODUCT_SEARCH_LENGHT   :2,
    DEMO_USER_PING_INTERVAL : 30000,
    GOOGLE_CLIENT_ID        :'868968713299-g32dlt8ib214vh0ukc88bj909cp9cjp9.apps.googleusercontent.com',
    FACEBOOK_CLIENT_ID      : "1066839183753303",
    DEMO_USER_NAME          : "Demo User",
    OLIVERPOS_CONTACT_LINK  :'https://oliverpos.com/contact-oliver-pos/',
    OLIVERPOS_TUTORIAL_LINK : 'https://youtu.be/EoCdEwfIZww',
    OLIVERPOS_GETTING_STARTED : 'https://oliverpos.com/getting-started/',
    SEGMENT_ANALYTIC_KEY    : 'xnSztkKDSndS5XpNN7rrj8sJBvfABbvh',
    FIREBASE_NOTIFICATION_COUNT : 5,
    ALTERNATIVE_PRODUCT_SEARCH_START:20000, // starting the product searching on alternative input character by this limit
    APPLE_LOGIN_RETURN_URL:window.location.href.includes('dev1.selfcheckout.olivertest.com')?'https://dev1.selfcheckout.olivertest.com/login': window.location.href.includes('qa1.selfcheckout.olivertest.com')?'qa1.selfcheckout.olivertest.com':'https://kiosk.oliverpos.com/login'
    //New google tag script has been placed in live branch
   // GA_KEY                  : process.env.ENVIRONMENT=='production'? 'UA-114926859-8':'UA-141287502-1'
    
}