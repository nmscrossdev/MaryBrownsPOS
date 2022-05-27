import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { Markup } from 'interweave';
import {_key,getTitle,getBanners,getCategories,initDropDown,getApps} from '../../settings/SelfCheckoutSettings';
class CategoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            item: null,
            num: '',
            current_categories:[],
            cat_breadcrumb:[]
        }
        this.ActiveList = this.ActiveList.bind(this);
        this.updateActiveStateOnRef = this.updateActiveStateOnRef.bind(this);
        this.tileProductListFilter = this.tileProductListFilter.bind(this);
    }

    componentWillUnmount = ()=> {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    componentWillMount() {
        this.setState({current_categories:this.props.categories});
    }

    tileProductListFilter(data, type, parent) {
        this.props.tileFilterData(data, type, parent)
    }

    ActiveList(item, index, type, ticketFields = null) {
        if( !item)
        {
            return;
        }
        this.tileProductListFilter(item, type);

        if (item.id) {
            var _sub= item && item.Subcategories; 
            this.setState({ item: item, num: index,current_categories:_sub});
        }
        this.fillCategorySelection(item)
    }

    getParent(item,id)
    {
     var _data=null;
     if(item.id==id)
     {
         return item;
     }
     if(item &&  item.Subcategories.length>0)
     {
        var _data= item.Subcategories.filter((itm) => itm.id==id);
        if(_data==null || _data.length==0)
        {
            item.Subcategories.map((_item, index) => {
                _data= this.getParent(_item,id);
            })
        }
        return _data;
     }
     else
     {
        return null;
     }
        
    }

    updateActiveStateOnRef(st) {
        var _sub= null;
        this.props.categories.map((item, index) => {
            if(_sub==null || _sub.length==0)
            {
                _sub =  this.getParent(item,this.state.item.id);
            }
        })

        if(_sub==null || _sub.length==0)
        {
            _sub = this.props.categories;
        }
        this.state.active = st;
        if(_sub!=null && _sub.length==1)
        {
            if(_sub[0].id==this.state.item.id)
            {
                var _sub2= null;
                    this.props.categories.map((item2, index) => {
                        if(_sub2==null || _sub2.length==0)
                        {
                            _sub2 =  this.getParent(item2,this.state.item.parent);
                        }
                    })
                //console.log("------searched _sub2--"+JSON.stringify(_sub2))
            } 
            this.setState({active:st, current_categories:_sub,item:Array.isArray(_sub2)?_sub2[0]:_sub2})
        }
        else
        {
            if(Array.isArray(_sub))
            {
                this.setState({active:st, current_categories:_sub })
            }
            else
            {
                if(_sub.parent==0)
                {
                    _sub=this.props.categories.filter((itm) => itm.parent==0);
                    this.setState({active:st, current_categories:_sub,item:null }) 
                }
                else
                {
                    //_sub=this.props.categories.filter((itm) => itm.parent==0);
                    var _sub3= null;
                    if(_sub.id==this.state.item.id)
                    {
                       
                        this.props.categories.map((item3, index) => {
                            if(_sub3==null || _sub2.length==0)
                            {
                                _sub3 =  this.getParent(item3,this.state.item.parent);
                            }
                        })
                    //console.log("------searched _sub3--"+JSON.stringify(_sub3))
                    } 
                    this.setState({active:st, current_categories:[_sub],item:Array.isArray(_sub3)?_sub3[0]:_sub3 })
                }

            }
           
        }
        this.RemoveCategorySelection()
        // setTimeout(function () {
        //     if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        // }, 500);
        this.props.tileFilterData(null, "product", null)
       
    }
   fillCategorySelection(item){
        if(this.state.item==null){
            this.state.cat_breadcrumb=[]
        }
            var catList=this.state.cat_breadcrumb;
        if(item){
            catList.push(item)
            this.setState({cat_breadcrumb:catList})
            }     
   }
//    RemoveCategorySelection(){
//     if(this.state.item==null){
//         this.state.cat_breadcrumb=[]
//     }
//     var catList=this.state.cat_breadcrumb;
//     if(catList.length>0){
//         catList.splice(-1)
//         this.setState({cat_breadcrumb:catList})
//     }     
// }
    RemoveCategorySelection(){
        var tempItem=null;
        if(this.state.item==null){
            this.state.cat_breadcrumb=[]
        }
        var catList=this.state.cat_breadcrumb;
        if(catList.length>0){
            catList.splice(-1)
            if(catList.length>0)
            {
                tempItem=catList[catList.length-1];
                this.tileProductListFilter(tempItem,catList.length==1?"category":"sub-category" );
            }
            this.setState({cat_breadcrumb:catList,item:tempItem})
        }     
    }
    showCategorySelection(){      
         var displayCat="";        
        if(this.state.cat_breadcrumb && this.state.cat_breadcrumb.length>0){
            this.state.cat_breadcrumb.map(cat=>{
                displayCat +=cat.Value +" > "
            })
        }
        displayCat = displayCat!=""?displayCat.replace("&amp;","&"):displayCat;
        return displayCat;       
    }
    render() {
        const { current_categories,item } = this.state;
       console.log("current_categories",current_categories,"item",item)
        return (
            <React.Fragment> 
                {item && item !==null && item !==""?
                 <div className="category-header">
                    <div className="col">
                        <p className="path">{this.showCategorySelection()} </p>
                        <p className="current">{item && item !==null && item !==""? item.Value  && item.Value .replace("&amp;","&"): getTitle(_key.TITLE_FOR_CATEGORY_SECTION)}</p>
                        <div className="divider"></div> 
                    </div>
                   { 
                   //item==null?null:
                    // <button className="category-tile" style={{backgroundColor:"#a9d47d"}} onClick={() => this.updateActiveStateOnRef(false)}>
                    // <p>{LocalizedLanguage.back}</p>
                    // </button>
                    item==null?null:
                    <button id="mainMenuButton"  onClick={() => this.updateActiveStateOnRef(false)}>
                        <svg
                            width="22"
                            height="20"
                            viewBox="0 0 22 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Go back to main menu
                    </button>
                    }
                </div>:
                <p className="section">{item && item !==null && item !==""?  item.Value && item.Value.replace("&amp;","&") : getTitle(_key.TITLE_FOR_CATEGORY_SECTION)}</p>
                 } 
                {   
                current_categories && current_categories.length>0 &&
                    <div className="category-tile-container">
                    {current_categories.map((item, index) => {                 
                            var titleName = item.Value
                            return (
                                item.parent==0 ?
                                <button className="category-tile mb10"  key={"category" + item.id} data-category-id={item.id} data-id={`attr_${item.id}`} data-category-slug={item.Value}  onClick={() => this.ActiveList(item, 2, "category")}>
                                <p>{titleName && titleName.replace("&amp;","&")}</p>
                                </button>
                            : item.parent!=0 ?
                                <button className="category-tile mb10" key={"sub_category" + item.id} data-category-id={item.id} data-id={`attr_${item.id}`} data-category-slug={item.Value} onClick={() => this.ActiveList(item, 4, "sub-category")}>
                                <p>{titleName && titleName.replace("&amp;","&")}</p>
                                </button>
                            : ''
                            )
                        })
                    }</div>
            }
                   
                  
                
        </React.Fragment>           
      )
    }
}

function mapStateToProps(state) {
    const { } = state;
    return {
    };
}
const connectedFavouriteList = connect(mapStateToProps)(CategoriesList);
export { connectedFavouriteList as CategoriesList };