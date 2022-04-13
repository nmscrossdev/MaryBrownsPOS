
var _allowRefund=false ;
var _allowDiscount=false;
var _allowMobileSetting=false;
     var  userLocal= localStorage.getItem("user");
   
     var userData = JSON.parse(userLocal);
     userData && userData.permissions && userData.permissions.map(perm=>{
        if(perm.PermissionKey && perm.PermissionKey=='IssueRefund' && perm.IsAllow){                           
            _allowRefund=true;
        }
        if(perm.PermissionKey && perm.PermissionKey=='GiveDiscount' && perm.IsAllow){                           
           _allowDiscount=true;
        }
        if(perm.PermissionKey && perm.PermissionKey=='MobileSetting' && perm.IsAllow){                           
            _allowMobileSetting=true;
        }
    })


exports.key = {      
    allowRefund:_allowRefund ,
    allowDiscount:_allowDiscount,
    allowMobileSetting:_allowMobileSetting   ,
    RefundErrorMsg:"You have not permission to refund",
    DiscountErrorMsg:"You have not permission to apply discount",
    MobileSettingErrorMsg:"You have not permission to change mobile setting"
}

exports.updatePermissions=()=>{
    var  userLocal= localStorage.getItem("user");
   
    var userData = JSON.parse(userLocal);
    userData && userData.permissions && userData.permissions.map(perm=>{
       if(perm.PermissionKey && perm.PermissionKey=='IssueRefund' && perm.IsAllow){                           
           _allowRefund=true;
       }
       if(perm.PermissionKey && perm.PermissionKey=='GiveDiscount' && perm.IsAllow){                           
          _allowDiscount=true;
       }
       if(perm.PermissionKey && perm.PermissionKey=='MobileSetting' && perm.IsAllow){                           
           _allowMobileSetting=true;
       }
   })
}