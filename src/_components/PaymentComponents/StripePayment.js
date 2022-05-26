import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly, isIOS } from "react-device-detect";
import { AndroidAndIOSLoader } from '../AndroidAndIOSLoader';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { textChangeRangeIsUnchanged } from 'typescript';
import { LoadingModal } from '../LoadingModal';
import ActiveUser from '../../settings/ActiveUser';
import Config from '../../Config'
class StripePayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDisplayStatus: false,
            card_number: '',
            expairy_date: '',
            cvv_number: '',
            displaybuttonStyle: '',
            displayPopupStyle: 'none',
            popupClass: '',
            loading: false,
            msgColor: 'red',
            // strpe states
            status: "requires_initializing", // requires_connecting || reader_registration || workflows
            backendURL: Config.key.RECIEPT_IMAGE_DOMAIN,//'https://dev1.app.olivertest.com',//'http://localhost:5000'
            discoveredReaders: [],
            connectionStatus: "not_connected",
            reader: null,
            readerLabel: "",
            registrationCode: "",
            cancelablePayment: false,
            chargeAmount: 0,
            itemDescription: "Red t-shirt",
            taxAmount: 0,
            currency: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).currency && (JSON.parse(localStorage.getItem('user')).currency).toLowerCase() : 'usd',
            workFlowInProgress: null,
            disoveryWasCancelled: false,
            refundedChargeID: null,
            refundedAmount: null,
            cancelableRefund: false,
            usingSimulator: false,
            testCardNumber: "4242424242424242",
            testPaymentMethod: "visa",
            discoveryInProgress: false,
            requestInProgress: false,
            connectReedersErr: '',
            processingStart: false,
            paymentCancelClicked: false,
            cancelManually: false
        }
        // this.handleCardChange = this.handleCardChange.bind(this)
    }

    hideTab(st) {
       // this.refs.btn.setAttribute("disabled", "disabled");
        console.log("Call hideTab")
        const { backendURL } = this.state
        const { paymentDetails } = this.props;
        if(process.env.ENVIRONMENT !=='dev1' //For development need to connect with simulator
            && paymentDetails && paymentDetails.HasTerminal== true && paymentDetails.TerminalCount== 0 && paymentDetails.Support== "Terminal"){
            this.props.terminalPopup(LocalizedLanguage.terminalnotconnected)
        }
        else
        {
            this.setState({ popupClass: 'in', displayPopupStyle: 'block', paymentCancelClicked: false, cancelManually: false })
            setTimeout(() => {
                // boxHeight();
                if (this.props.type == 'refund') {
                    // this.props.hideCashTab(false)
                    // this.setState({ connectReedersErr: ``, popupClass: '', displayPopupStyle: 'none', activeDisplayStatus: false, loading: false, msgColor: 'green', processingStart: false })
                    this.props.pay_amount(this.props.code)
                }else{
                    console.log("call Initialize")
                    this.initializeBackendClientAndTerminal(backendURL)
                    if(process.env.ENVIRONMENT =='dev1')
                    {// just used simulator to collect payment
                        this.connectToSimulator()
                    }else{
                        this.discoverReaders()
                    }
                     
                }

            }, 2000);
            if (st == true) {
                // this.props.activeDisplay(`${this.props.code}_true`)
            } else {
                // this.props.activeDisplay(false)
            }
            this.setState({
                activeDisplayStatus: st,
            })
            if (this.props.type == 'refund') {
                // this.props.hideCashTab(false)
            }
        }
    }
    closePopup = () => {
        this.setState({ popupClass: '', displayPopupStyle: 'none', activeDisplayStatus: false })
    }
    componentWillReceiveProps = (nextprops)=>{
        if(nextprops.stripRefundError !==''){
            this.setState({ connectReedersErr: nextprops.stripRefundError, loading: false, msgColor: 'red',})
        }


    }

    hideTab2(st) {
        // this.setState({ activeDisplayStatus: st })
        // this.props.activeDisplay(false)
        // if (this.props.type == 'refund') {
        //     this.props.hideCashTab(false)
        // }
    }

    // stripe methods

    componentDidMount = () => {
        setTimeout(() => {
            // this.initializeBackendClientAndTerminal(this.state.backendURL)
            // var stripeAmount = $('#my-input').val();
            // this.setState({ chargeAmount: parseFloat(this.props.paidAmount) })
            // console.log("chargeAmount",this.state.chargeAmount)
            //// this.discoverReaders()
        }, 2000);
    }

    // 1. Stripe Terminal Initialization
    initializeBackendClientAndTerminal(url) {
        // 1a. Initialize Client class, which communicates with the example terminal backend
        this.client = new Client(url);
        // 1b. Initialize the StripeTerminal object
        try {
            this.terminal = window.StripeTerminal.create({
                // 1c. Create a callback that retrieves a new ConnectionToken from the example backend
                onFetchConnectionToken: async () => {
                    let connectionTokenResult = await this.client.createConnectionToken();
                   if(connectionTokenResult && connectionTokenResult.is_success == false){
                        this.setState({ connectReedersErr: connectionTokenResult.message, loading: false, msgColor: 'red', cancelManually: true })
                    }else{
                        return connectionTokenResult.content.secret;
                    }

                },
                // 1c. (Optional) Create a callback that will be called if the reader unexpectedly disconnects.
                // You can use this callback to alert your user that the reader is no longer connected and will need to be reconnected.
    
                onUnexpectedReaderDisconnect: this.client.unexpectedReaderDisconnect(
                    () => {
                        alert("Unexpected disconnect from the reader");
                        this.setState({
                            connectionStatus: "not_connected",
                            reader: null
                        });
                    }
                ),
            });
        } catch (error) {
            this.setState({ connectReedersErr: error, loading: false, msgColor: 'red', cancelManually: true })
        }
        
    }

    // 2. Discover and connect to a reader.
    discoverReaders = async () => {
        const { discoveredReaders } = this.state
        this.setState({
            discoveryWasCancelled: false,
            loading: true
        });
        // 2a. Discover registered readers to connect to.
        const discoverResult = await this.terminal.discoverReaders();
        if (discoverResult.error) {
            console.log("Failed to discover: ", discoverResult.error);
            this.setState({ connectReedersErr: discoverResult.error, loading: false, msgColor: 'red', cancelManually: true })
            return discoverResult.error;
        } else {
            if (this.state.discoveryWasCancelled) return;
            this.setState({
                discoveredReaders: discoverResult.discoveredReaders,
                cancelManually: false
            });
            var stripeTerminal = []
            var paymentTypes = localStorage.getItem('PAYMENT_TYPE_NAME') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : []
            paymentTypes && paymentTypes.length > 0 && paymentTypes.map((payType, i) => {
                if (payType.Code == this.props.code) {
                    stripeTerminal = payType.TerminalSerialNo

                }
            })
            var isTerminalFound=false; 
            discoverResult.discoveredReaders && discoverResult.discoveredReaders.length > 0 && discoverResult.discoveredReaders.map((reeder, i) => {
                
                stripeTerminal.length > 0 && stripeTerminal.map((st)=>{
                        if(st ==reeder.serial_number){
                            this.onConnectToReader(reeder)
                            isTerminalFound=true;
                        }
                    })               
            })
            if(isTerminalFound==false){
                this.setState({connectReedersErr:"No terminal found!"})
                this.setState({cancelManually:true})
            }
            return discoverResult.discoveredReaders;
        }
    };

    onChangeTestPaymentMethod = (e) => {
        this.setState({ testPaymentMethod: e.target.value });
    };

    onChangeTestCardNumber = (e) => {
        this.setState({ testCardNumber: e.target.value });
    };

    connectToSimulator = async () => {
        const simulatedResult = await this.terminal.discoverReaders({
            simulated: true,
        });
        await this.connectToReader(simulatedResult.discoveredReaders[0]);
    };

    // on click on any reeder in list 
    onConnectToReader = async (reader) => {
        this.setState({ requestInProgress: true, loading: true });
        try {
            await this.connectToReader(reader);
        } finally {
            this.setState({ requestInProgress: false });
        }
    };

    connectToReader = async (selectedReader) => {
        // 2b. Connect to a discovered reader.
        const connectResult = await this.terminal.connectReader(selectedReader);
        if (connectResult.error) {
            console.log(connectResult.error);
            this.setState({ connectReedersErr: connectResult.error.message, loading: false, msgColor: 'red', cancelManually: true })
            if (this.state.paymentCancelClicked == true) {
                this.cancelPendingPayment()
            }
        } else {
            this.setState({
                usingSimulator: selectedReader.id === "SIMULATOR",
                status: "workflows",
                discoveredReaders: [],
                reader: connectResult.reader,
                cancelManually: false
            });
            this.collectCardPayment() // collect payment after connect to reeder
            return connectResult;
        }
    };

    // register new reeder
    registerAndConnectNewReader = async () => {
        try {
            var label = 'oliverPOS'
            var registrationCode = 'bear-keen-outset'
            let reader = await this.client.registerDevice({
                label,
                registrationCode
            });
            if(reader && reader.IsSuccess == false){
                this.setState({ connectReedersErr: reader.Message, loading: false, msgColor: 'red', cancelManually: true })
            }else{
                // After registering a new reader, we can connect immediately using the reader object returned from the server.
                await this.connectToReader(reader.Content);
                console.log("Registered and Connected Successfully!");
                this.setState({ connectReedersErr: 'Registered and Connected Successfully!', msgColor: 'blue' })
            }
        } catch (e) {
            // Suppress backend errors since they will be shown in logs
            console.log("error!", e);
            this.setState({ connectReedersErr: e, loading: false, msgColor: 'red', cancelManually: true })
        }
    };

    // collect payment

    // 3b. Collect a card present payment
    collectCardPayment = async () => {
        // We want to reuse the same PaymentIntent object in the case of declined charges, so we
        // store the pending PaymentIntent's secret until the payment is complete.
        if (!this.pendingPaymentIntentSecret) {
            try {
                let paymentMethodTypes = ["card_present"];//card_present
                // if ((this.state.currency.toLowerCase()) == "cad") {
                //     //paymentMethodTypes = ["interac_present"];
                //     paymentMethodTypes.push("interac_present");
                // }
                console.log("this.props.paidAmount",this.props.paidAmount)
                let createIntentResponse = await this.client.createPaymentIntent({
                    amount: parseFloat(this.props.paidAmount),
                    currency: this.state.currency,
                    description: "TestCharge",
                    paymentMethodTypes: paymentMethodTypes,
                    CaptureMethod: "manual",
                });
                if(createIntentResponse.content && createIntentResponse.content.RefranseCode ){
                this.pendingPaymentIntentSecret = createIntentResponse.content.RefranseCode;               
                }else if(createIntentResponse && createIntentResponse.is_success && createIntentResponse.is_success==false){
                     this.setState({  loading: false, msgColor: 'red', cancelManually: createIntentResponse.message ? true : false,connectReedersErr: `${createIntentResponse.message ? createIntentResponse.message : ''}`, })
                }else{
                    this.setState({  loading: false, msgColor: 'red', cancelManually: createIntentResponse.message ? true : false,connectReedersErr: `${createIntentResponse.message ? createIntentResponse.message : ''}`, })
                }
                // this.pendingPaymentIntentSecret = createIntentResponse.Content.client_secret;
            } catch (e) {
                this.setState({ connectReedersErr: e, loading: false, msgColor: 'red', cancelManually: true })
                // Suppress backend errors since they will be shown in logs
                return;
            }
        }
        // Read a card from the customer
        this.terminal.setSimulatorConfiguration({
            testPaymentMethod: this.state.testPaymentMethod,
            testCardNumber: this.state.testCardNumber,
        });
        const paymentMethodPromise = this.terminal.collectPaymentMethod(
            this.pendingPaymentIntentSecret
        );
        this.setState({ cancelablePayment: true, loading: true });
        if (this.state.paymentCancelClicked == true) {
            this.cancelPendingPayment()
        }
        const result = await paymentMethodPromise;
        if (result.error) {
            this.setState({ connectReedersErr: `Collect payment method failed: ${result.error.message}`, loading: false, msgColor: 'red', cancelManually: true })
        } else {
            this.setState({ connectReedersErr: `Payment processing!!`, msgColor: 'blue' })
            const confirmResult = await this.terminal.processPayment(
                result.paymentIntent
            );
            // At this stage, the payment can no longer be canceled because we've sent the request to the network.
            this.setState({ cancelablePayment: false, processingStart: true });
            if (confirmResult.error) {
                this.setState({ connectReedersErr: `Process payment - ${confirmResult.error.message}`, loading: false, msgColor: 'red' })
               // alert(`Confirm failed: ${confirmResult.error.message}`);
               console.log("Error in Payment processing!");
            } else if (confirmResult.paymentIntent) {
                if (confirmResult.paymentIntent.status !== "succeeded") {
                    try {
                        // Capture the PaymentIntent from your backend client and mark the payment as complete
                        let captureResult = await this.client.capturePaymentIntent({
                            paymentIntentId: confirmResult.paymentIntent.id
                        });
                        this.pendingPaymentIntentSecret = null;
                       
                        if (captureResult && captureResult.is_success == false) {
                            this.setState({ connectReedersErr: `capture payment response - ${captureResult.message}`, loading: false, msgColor: 'red' })
                        } else {
                            console.log("With capture!");
                            console.log("Payment Successful!");
                            localStorage.setItem('STRIPE_PAYMENT_RESPONSE', JSON.stringify(captureResult))
                            localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(captureResult));
                            this.setState({ connectReedersErr: `Payment Successful!`, popupClass: '', displayPopupStyle: 'none', activeDisplayStatus: false, loading: false, msgColor: 'green', processingStart: false })
                            this.props.pay_amount(this.props.code)
                        }
                        return captureResult;
                    } catch (e) {
                        this.setState({ connectReedersErr: e, loading: false, msgColor: 'red' })
                        // Suppress backend errors since they will be shown in logs
                        console.log("Error in Payment!");
                        return;
                    }
                } else {                   
                    this.pendingPaymentIntentSecret = null;
                    console.log("Without capture");
                    console.log("Single-message payment successful!");                   
                    this.setState({ connectReedersErr: `Payment successful!!`, loading: false, msgColor: 'green' })
                    this.props.pay_amount(this.props.code)
                    return confirmResult;
                }
            }
        }
    };

    // 3c. Cancel a pending payment.
    // Note this can only be done before calling `processPayment`.
    cancelPendingPayment = async () => {
        const { cancelManually } = this.state
        if(this.props.type == 'refund'){
            this.setState({ processingStart: false, paymentCancelClicked: false, cancelablePayment: false, loading: false, connectReedersErr: '', msgColor: 'red', activeDisplayStatus: false });
        return;
        }
        this.setState({ paymentCancelClicked: true })
        if (this.state.cancelablePayment == true) {
            await this.terminal.cancelCollectPaymentMethod();
            this.pendingPaymentIntentSecret = null;
            setTimeout(() => {
                this.setState({ processingStart: false, paymentCancelClicked: false, cancelablePayment: false, loading: false, connectReedersErr: '', msgColor: 'red', activeDisplayStatus: false });
            }, 1000);
        } else if (this.state.processingStart == true) {
            this.setState({ paymentCancelClicked: false, loading: false, connectReedersErr: 'Payment can not be canceled ! processing Started ', msgColor: 'red' });
        } else {
            this.setState({ loading: false, connectReedersErr: cancelManually ? '' : 'Canceling your payment...', msgColor: 'blue', activeDisplayStatus: cancelManually == true ? false : true });
        }

    };

    render() {
        const { activeDisplayStatus, discoveredReaders, connectReedersErr, usingSimulator } = this.state;
        const { color, Name, code, pay_amount, styles } = this.props;
        const { displaybuttonStyle, displayPopupStyle, popupClass } = this.state;

        return (
            
                activeDisplayStatus !== true ?
                    // <div style={{ display: styles }}  ref="btn" onClick={() => this.hideTab(!activeDisplayStatus)} className={`white-background box-flex-shadow box-flex-border ${ActiveUser.key.isSelfcheckout == true ? 'mb-5' : 'mb-2'} round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0`}>
                    /* <div className="section">
                                    <div className="accordion_header" data-isopen="false">
                                        <div className="pointer">
                                            <div style={{ borderColor: ActiveUser.key.isSelfcheckout == true ? 'white' : color }} id="others" value="other" name="payments-type"  className="d-flex box-flex box-flex-border-left box-flex-background-others border-dynamic">
                                                <div className="box-flex-text-heading">
                                                    <h2>{Name}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */

                                // <div className="row" style={{ display: styles }}>
                <button ref="btn" onClick={() => this.hideTab(!activeDisplayStatus)}>{Name}</button>
            // </div>
                    //  </div>


                            // <div style={isOrderPaymentOnline == false ? { display: styles, pointerEvents: 'none', borderColor: '#765b72', marginBottom: 15, opacity: 0.5 } : { display: styles }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0">
                            //     <div className="section">
                            //         <div className="accordion_header" data-isopen="false">
                            //             <div className="pointer">
                            //                 <div style={{ borderColor: color }} id="others" value="other" name="payments-type" onClick={() => this.handleCardPopup(code)} className="d-flex box-flex box-flex-border-left box-flex-background-others border-dynamic">
                            //                     <div className="box-flex-text-heading">
                            //                         <h2>{Name}</h2>
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     </div>
                            // </div>



                    :
                    // <div className="loader-fixed">
                        <div className="popup productPopup bodyCenter">
                        <div className="user_login user_login_popup">
                            <div className="user__login_header">
                                <div className="user_login_container">
                                    <img alt="Logo" src="../assets/images/logo-dark.svg" />
                                </div>
                            </div>
                            <div className="user_login_pages">
                                <div className="user_login_container">
                                    <div className="user_login_row">
                                        <div className="user_login_form_wrapper">
                                            <div className="user_login_form_wrapper_container">
                                                <div className="user_login_form">
                                                    <div className="">
                                                        <div className="user_login_scroll_in">
                                                            <div className="user_login_center">
                                                                <div className="user_login_head user_login_join">
                                                                    <h3 className="user_login_head_title">
                                                                        {LocalizedLanguage.waitingOnPaymentTerminal}
                                                    </h3>
                                                                    {/* <!-- <h3 className="user_login_head__title">
                                                        Please Do not close your window <br>, Back we cache your shop
                                                    </h3> --> */}
                                                                    <div className="user_login_head_logo">
                                                                        <a href="#">
                                                                            <svg
                                                                                version="1.1" id="ologo"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                                x="0px"
                                                                                y="0px"
                                                                                viewBox="0 0 400 400"
                                                                                style={{ "enableBackground": 'new 0 0 400 400' }}
                                                                                xmlSpace="preserve" width="120px" height="120px"
                                                                            >

                                                                                <rect id="lime" x="249.28" y="156.01"
                                                                                    className="st0 ologo-1" width="103.9" height="103.9">
                                                                                </rect>
                                                                                <path id="teal" className="st1 ologo-2"
                                                                                    d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z">
                                                                                </path>
                                                                                <rect id="cyan" x="145.38" y="259.91"
                                                                                    className="st2 ologo-3" width="103.9" height="103.89">
                                                                                </rect>
                                                                                <path id="blue" className="st3 ologo-4"
                                                                                    d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z">
                                                                                </path>
                                                                                <rect id="purple" x="41.49" y="156.01"
                                                                                    className="st4 ologo-5" width="103.9" height="103.9">
                                                                                </rect>
                                                                                <path id="red" className="st5 ologo-6"
                                                                                    d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z">
                                                                                </path>
                                                                                <rect id="orange" x="145.38" y="52.12"
                                                                                    className="st6 ologo-7" width="103.9" height="103.9">
                                                                                </rect>
                                                                                <path id="yellow" className="st7 ologo-8"
                                                                                    d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z">
                                                                                </path>
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    className="btn btn-50 btn-border-primary btn-text-primary btn-radius-4 btn-padding-30" onClick={this.cancelPendingPayment}>{LocalizedLanguage.cancel}</button>
                                                                {/* <!-- <h3 className="user_login_head__title">Loading Demo</h3> --> */}
                                                                <p style={{ color: this.state.msgColor,paddingTop:"20px" }}>{connectReedersErr}</p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedCardPayment = connect(mapStateToProps)(StripePayment);
export { connectedCardPayment as StripePayment };

// Client for the example terminal backend: https://github.com/stripe/example-terminal-backend
class Client {
    constructor(url) {
        this.url = url;
    }

    createConnectionToken() {
        const formData = new URLSearchParams();
        return this.doPost(this.url + "/connection_token", formData);
    }

    registerDevice({ label, registrationCode }) {
        // const formData = new URLSearchParams();
        // formData.append("label", label);
        // formData.append("registration_code", registrationCode);

        var resgisterData = {
            label: label,
            registration_code: registrationCode
        }
        return this.doPost(this.url + "/register_reader", JSON.stringify(resgisterData));
    }

    createPaymentIntent({ amount, currency, description, paymentMethodTypes, CaptureMethod }) {
        // const formData = new URLSearchParams();
        // formData.append("amount", amount);
        // formData.append("currency", currency);
        // formData.append("description", description);
        // paymentMethodTypes.forEach((type) => formData.append(`payment_method_types[]`, type));
        var data = {
            amount: amount,
            currency: currency,
            description: description,//
            payment_method_types: paymentMethodTypes,//
            CaptureMethod: CaptureMethod//
        }
        return this.doPost(this.url + "/create_payment_intent", JSON.stringify(data));
    }
    // now return only async  fucntion as onUnexpectedReaderDisconnect need async fucntion
    unexpectedReaderDisconnect() {
        return async function (...args) {
        }
    }

    capturePaymentIntent({ paymentIntentId }) {
        // const formData = new URLSearchParams();
        // formData.append("payment_intent_id", paymentIntentId);
        var captureData = {
            id: paymentIntentId
        }
        return this.doPost(this.url + "/capture_payment_intent", JSON.stringify(captureData));
    }

    savePaymentMethodToCustomer({ paymentMethodId }) {
        const formData = new URLSearchParams();
        formData.append("payment_method_id", paymentMethodId);
        return this.doPost(
            this.url + "/attach_payment_method_to_customer",
            formData
        );
    }

    async doPost(url, body) {
        try {
            let response = await fetch(url, {
                method: "post",
                body: body,
                headers: {
                    "access-control-allow-origin": "*",
                    "access-control-allow-credentials": "true",
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
                }
            });
    
            if (response.ok) {
                return response.json();
            } else {
                let text = await response.text();
                throw new Error("Request Failed: " + text);
            }
        } catch (error) {
            console.log('----API error---',error);
        }
       
    }

}

export default Client;
