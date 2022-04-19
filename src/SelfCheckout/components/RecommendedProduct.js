import React, { Component } from 'react'

export default class RecommendedProduct extends Component {
  render() {
    return (
        <div className="recommendations">
        <p>Recommendations</p>
        <div className="row">
            <div className="item">
                <img src="../assets/bigmary.png" alt="" className="scale" />
                <p className="prod-name">Big Mary</p>
                <p className="price">$10.99</p>
                <button onclick="addItem()">
                    <svg width={28} height={27} viewBox="0 0 28 27">
                        <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                        <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                    </svg>
                    Add Item
                </button>
            </div>
            <div className="item">
                <img src="../assets/bigmary.png" alt="" className="scale" />
                <p className="prod-name">Big Mary</p>
                <p className="price">$10.99</p>
                <button onclick="addItem()">
                    <svg width={28} height={27} viewBox="0 0 28 27">
                        <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                        <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                    </svg>
                    Add Item
                </button>
            </div>
            <div className="item">
                <img src="../assets/bigmary.png" alt="" className="scale" />
                <p className="prod-name">Big Mary</p>
                <p className="price">$10.99</p>
                <button onclick="addItem()">
                    <svg width={28} height={27} viewBox="0 0 28 27">
                        <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                        <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                    </svg>
                    Add Item
                </button>
            </div>
            <div className="item">
                <img src="../assets/bigmary.png" alt="" className="scale" />
                <p className="prod-name">Big Mary</p>
                <p className="price">$10.99</p>
                <button onclick="addItem()">
                    <svg width={28} height={27} viewBox="0 0 28 27">
                        <path d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z" fill="white" />
                        <path d="M20.7295 12.6562H14.7612V6.75H13.0559V12.6562H7.08765V14.3438H13.0559V20.25H14.7612V14.3438H20.7295V12.6562Z" fill="white" />
                    </svg>
                    Add Item
                </button>
            </div>
        </div>
    </div>
    )
  }
}
