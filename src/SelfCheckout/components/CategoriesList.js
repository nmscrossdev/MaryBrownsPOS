import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
class CategoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            item: null,
            num: '',
            current_categories:[]
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
      
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 500);
        this.props.tileFilterData(null, "product", null)
    }
    
    render() {
        const { current_categories,item } = this.state;
        return (
            <div className="category-tile-group" >
                {
                 item==null?null:
                    <div className="category-tile grouped" style={{backgroundColor:"#a9d47d"}} onClick={() => this.updateActiveStateOnRef(false)}>
                    <p>{LocalizedLanguage.back}</p>
                    </div>
                 }
                {
                current_categories && current_categories.map((item, index) => {                 
                        var titleName = item.Value
                        return (
                            item.parent==0 ?
                            <div className="category-tile grouped"  key={"category" + item.id} data-category-id={item.id} data-id={`attr_${item.id}`} data-category-slug={item.Value}  onClick={() => this.ActiveList(item, 2, "category")}>
                            <p>{titleName}</p>
                            </div>
                        : item.parent!=0 ?
                            <div className="category-tile grouped" key={"sub_category" + item.id} data-category-id={item.id} data-id={`attr_${item.id}`} data-category-slug={item.Value} onClick={() => this.ActiveList(item, 4, "sub-category")}>
                            <p>{titleName}</p>
                            </div>
                        : ''
                        )
                    })
                }
            </div>
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