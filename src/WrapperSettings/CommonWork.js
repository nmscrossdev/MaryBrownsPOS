import { history } from '../_helpers';
  export function removeActiveCss(clsName) {
    var x, i;
    x = document.querySelectorAll("."+clsName);
    if (x) {
        for (i = 0; i <= x.length; i++) {
            if (x && x[i]) {
                x[i].classList.remove('active');
            }
        }
    }
}
export function showSelected(cls,val)
{
    $('.'+cls).each(function() {
        if ($(this).attr('data-value')==val)
        {
            $(this).addClass('active');
        }
    });
}
export function isShowWrapperSetting(page,action_method,nav="")
{
    var isFirstLogin=localStorage.getItem("isFirstLogin");
    var isWrapper=false;    
    if(typeof Android !== "undefined" && Android !== null) {
        if(!isFirstLogin || typeof isFirstLogin=="undefined" || isFirstLogin==null || isFirstLogin=="")
        {
            isWrapper=Android.getDatafromDevice("isWrapper");
            if(isWrapper && typeof isWrapper!="undefined" && isWrapper==true)
            {
                localStorage.setItem("isFirstLogin",true);
               
                //Printer Setting  -default value set--
                localStorage.setItem('selected_printer','built-in-printer');
                localStorage.setItem('selected_papersize','80mm');
                localStorage.setItem('is_autoprint_receipt','yes');

                //Cash Drawer Setting -default value set--
                localStorage.setItem('selected_drawer','cash-only');

                //Front Facing Display Setting -default value set--
                localStorage.setItem('selected_ffdisplay','yes');
                localStorage.setItem('selected_wtdisplay','nview');

                window.location = '/wsetting?'+action_method;
                if(nav=='push')
                {
                    history.push('/wsetting?'+action_method)
                }
                else
                {
                    window.location = '/wsetting?'+action_method;
                }
            }
            else
            {
                do_navigate(action_method,nav);
            }
        }
        else
        {
            do_navigate(action_method,nav); 
        }
     }
     else
     {
        do_navigate(action_method,nav);
     }
}
export function isOpenCashDrawer(orderList,isSale=true)
{
    if(typeof Android !== "undefined" && Android !== null)
    {
        var whenToOpenDrawer=localStorage.getItem('selected_drawer');
        var isPaymentCash=false;
        if(isSale==true)
        {
            orderList && orderList.map((item, index) => {
                //CHECK FOR THE CASH PAYMENT----
                if(item.payment_type && item.payment_amount>0)
                    {
                        if(item.payment_type==="cash")
                        {
                            isPaymentCash=true;
                        }
                    }
            });
        }
        else
        {
            orderList && orderList.map((item, index) => { 
            if(item.type && item.amount>0)
            {
                if(item.type==="cash")
                {
                    isPaymentCash=true;
                }
            }
            });
        }
        if((isPaymentCash==true && (typeof whenToOpenDrawer!="undefined" && whenToOpenDrawer!="" && whenToOpenDrawer=="cash-only"))|| (typeof whenToOpenDrawer!="undefined" && whenToOpenDrawer!="" && whenToOpenDrawer=="every-sale"))
        {
            var isTizenWrapper = localStorage.getItem("isTizenWrapper");
            if(isTizenWrapper && isTizenWrapper!=null && typeof isTizenWrapper!="undefined" && isTizenWrapper=="true")
            {
                if(Tizen && Tizen!=null && typeof Tizen!="undefined")
                {
                    Tizen.openCashBox();
                }
            }
            Android.openCahsDrawer();
            //console.log("---------drawer opening isOpenCashDrawer-------")
        }
    }
}
export function softkeyboardhandlingEvent()
{
    //console.log("-softkeyboardhandlingEvent---")
    if(typeof Android !== "undefined" && Android !== null && Android.getDatafromDevice("isWrapper")==true) {
        Android.softkeyboardhandlingEvent()
    }
}
function do_navigate(action_method,nav="")
{
    if(nav=='push')
        {
            history.push(action_method)
        }
        else
        {
            window.location ='/'+action_method;
        }
}
export function getProductSummery(attributes,product)
{
    let psummary="";
    let items= product.combination.split("~");
    let i=0;
    attributes && attributes.length>0 && attributes.map(item => {
        items && items.length>0
        {
            psummary += item.Name+": "+ items[i];
            if(items.length>i+1)
            {
                psummary+=", ";
            }
            i++;
        }
    });
    //text-transform: capitalize;
    console.log("-----product summery---"+psummary);
    return psummary;
}


  