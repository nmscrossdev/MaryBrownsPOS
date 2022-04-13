
exports.appskey ={  
    update_status:  {name:'Update Status',disabled:true,img:'Woo.png'},  
    print_ticket:   {name:'Print Tickets',disabled:true,img:'Tickera.png'},
    sent_sms:       {name:'Sent SMS',disabled:true,img:'Twilio.png'},
    print_label:    {name:'Show Detail',disabled:true,img:'Woo.png'}, 
    adjust_credit:    {name:'Adjust Credit',disabled:true,img:'blue_owl.svg'}, 
    customer_addnotes:    {name:'Add Note',disabled:true,img:'blue_owl.svg'}, 
}
exports.DisplayApps = (appsKey) => {
    var _displayApp=this.appskey;   
        Object.keys(_displayApp).map((item, index) => {           
               _displayApp[item].disabled=true;         
        });
        if (appsKey && appsKey.length>0){
            Object.keys(_displayApp).map((item, index) => {
                if(appsKey.indexOf(item) > -1){
                   _displayApp[item].disabled=false;
                }
            });  
        
        } 

    // console.log("_displayApp",_displayApp);
}
