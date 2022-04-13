import React from 'react';

export class InternalErr extends React.Component {
  render() {
    return (
      <div className="errorView">
        <div className="conatiner"><span className="numer">4</span>
          <div className="circle">
            <div className="drops"></div>
            <div className="drops"></div>
            <div className="hand"></div>
            <div className="hand rgt"></div>
            <div className="holder">
              <div className="bob">
                <img src="../assets/img/owl.png" />
              </div>
            </div>
          </div><span className="numer">4</span>
        </div>
      </div>
    )
  }
}

