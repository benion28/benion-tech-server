const _ = require("lodash")
const request = require('request');
const { sendEmail } = require("./helpers")
const firebaseDatabase = require("../config/firebase")

const { initializePayment, verifyPayment } = require('../config/paystack')(request)


// Handle Get Users
const paymentHomepage = async (request, response) => {
    response.render("paymentHomePage", {
        user: request.user
    });
    response.status(304);
}

// Handle Get Users
const addPaymet = (request, response) => {
    const { username, amount, email } = request.body
    try {
        const value = amount * 100
        const form = {
            username,
            amount: value,
            email
        }
    
        initializePayment(form, (error, body)=>{
            if(error){
                //handle errors
                console.log(error);
                const message = error.message ? error.message : "Payment Verification Error"
                return response.redirect('/benion-payments/error'+message)
            }
            paymentResponse = JSON.parse(body)
            response.redirect(paymentResponse.data.authorization_url)
        })
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

const paystackError = (request, response) => {
    const message = request.params.message
    response.render("paymentError", {
        message
    })
    response.status(401)
}

const paystackSuccess = (request, response) => {
    const reference = request.params.reference
    response.render("paymentSuccess", {
        reference
    })
    response.status(304)
}

const paymentCallback = (request, response) => {
    const ref = request.query.reference
    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            const message = error.message ? error.message : "Payment Verification Error"
            return response.redirect('/benion-payments/error'+message);
        }
        const paymentResponse = JSON.parse(body);        

        // const data = _.at(paymentResponse.data, ['reference', 'amount','customer.email', 'metadata.username']);
        // const data = _.at(paymentResponse.customer, ['reference', 'amount','customer.email', 'metadata.username']);

        // [reference, amount, email, username] =  data;
        
        const object = {
            reference: paymentResponse.data.reference ? paymentResponse.data.reference : "", 
            channel: paymentResponse.data.channel ? paymentResponse.data.channel : "",
            amount: paymentResponse.data.amount ? paymentResponse.data.amount : 0, 
            date: paymentResponse.data.created_at ? paymentResponse.data.created_at : "",
            currency: paymentResponse.data.currency ? paymentResponse.data.currency : "",
            ipAddress: paymentResponse.data.ip_address ? paymentResponse.data.ip_address : "",
            sendersEmail: paymentResponse.data?.metadata?.email ? paymentResponse.data?.metadata?.email : "", 
            recieversUsername: paymentResponse.data?.metadata?.username ? paymentResponse.data?.metadata?.username : "",
            customersFirstName: paymentResponse.data.customer?.first_name ? paymentResponse.data.customer?.first_name : "",
            customersLastName: paymentResponse.data.customer?.last_name ? paymentResponse.data.customer?.last_name : "",
            customersEmail: paymentResponse.data.customer?.email ? paymentResponse.data.customer?.email : "",
            authCode: paymentResponse.data.authorization?.authorization_code ? paymentResponse.data.authorization?.authorization_code : "",
            cardType: paymentResponse.data.authorization?.card_type ? paymentResponse.data.authorization?.card_type : "",
            expiryMonth: paymentResponse.data.authorization?.exp_month ? paymentResponse.data.authorization?.exp_month : "",
            expiryYear: paymentResponse.data.authorization?.exp_year ? paymentResponse.data.authorization?.exp_year : "",
            last4: paymentResponse.data.authorization?.last4 ? paymentResponse.data.authorization?.last4 : "",
            bank: paymentResponse.data.authorization?.bank ? paymentResponse.data.authorization?.bank : "",
            accountName: paymentResponse.data.authorization?.account_name ? paymentResponse.data.authorization?.account_name : "",
            channel: paymentResponse.data.authorization?.channel ? paymentResponse.data.authorization?.channel : "",
            type: "credit"
        }

        console.log("paymentResponse", paymentResponse)
        console.log("object", object)

        firebaseDatabase.ref("payments").push(object, error => {
            if (error) {
                const message = error.message ? error.message : "Payment Verification Error"
                response.redirect('/benion-payments/error'+message)
            } else {
                response.redirect('/benion-payments/receipt/'+object.reference)
            }
        })
    })
}

// Get All Payments
const getPaymentsData = (request, response) => {
	try {
        let paymentData = []

        firebaseDatabase.ref("payments").once("value", snapshot => {
            if (snapshot.val() !== null) {
                paymentData =  []
                payments = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < payments.length; index++) {
                    paymentData.push({
                        ...payments[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${payments.length} Payment Data Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${payments.length} Payment Data Fetched Successfully`,
                    count: payments.length,
                    data: [
                        keys,
                        payments,
                        snapshot.val(),
                        paymentData.reverse()
                    ]
                })
            } else {
                console.log("No Payment Data Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Payment Data Fetched Successfully",
                    count: paymentData.length,
                    data: [
                        [],
                        [],
                        {},
                        paymentData
                    ]
                })
            }
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Add Payment
const addPayment = (request, response) => {
    const { reference, channel, amount, date, currency, ipAddress, sendersEmail, recieversUsername, customersFirstName, customersLastName, customersEmail, authCode, cardType, expiryMonth, expiryYear, last4, bank, accountName, type } = request.body

    const object = {
        reference: reference ? reference : "", 
        channel: channel ? channel : "",
        amount: amount ? amount : 0,
        date: date ? date : "",
        currency: currency ? currency : "",
        ipAddress: ipAddress ? ipAddress : "",
        sendersEmail: sendersEmail ? sendersEmail : "", 
        recieversUsername: recieversUsername ? recieversUsername : "",
        customersFirstName: customersFirstName ? customersFirstName : "",
        customersLastName: customersLastName ? customersLastName : "",
        customersEmail: customersEmail ? customersEmail : "",
        authCode: authCode ? authCode : "",
        cardType: cardType ? cardType : "",
        expiryMonth: expiryMonth ? expiryMonth : "",
        expiryYear: expiryYear ? expiryYear : "",
        last4: last4 ? last4 : "",
        bank: bank ? bank : "",
        accountName: accountName ? accountName : "",
        channel: channel ? channel : "",
        type: type ? type : ""
    }

    firebaseDatabase.ref("payments").push(object, error => {
        if (error) {
            console.log("Add Payment Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Add Payment Error"
            })
        } else {
            console.log("Add Payment Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Add Payment Successfull",
                data: object
            })
        }
    })
}

// Edit Payment
const editPayment = (request, response) => {
    const { reference, channel, amount, date, currency, ipAddress, sendersEmail, recieversUsername, customersFirstName, customersLastName, customersEmail, authCode, cardType, expiryMonth, expiryYear, last4, bank, accountName, type } = request.body
    const key = request.params.key

    const object = {
        reference: reference ? reference : "", 
        channel: channel ? channel : "",
        amount: amount ? amount : 0,
        date: date ? date : "",
        currency: currency ? currency : "",
        ipAddress: ipAddress ? ipAddress : "",
        sendersEmail: sendersEmail ? sendersEmail : "", 
        recieversUsername: recieversUsername ? recieversUsername : "",
        customersFirstName: customersFirstName ? customersFirstName : "",
        customersLastName: customersLastName ? customersLastName : "",
        customersEmail: customersEmail ? customersEmail : "",
        authCode: authCode ? authCode : "",
        cardType: cardType ? cardType : "",
        expiryMonth: expiryMonth ? expiryMonth : "",
        expiryYear: expiryYear ? expiryYear : "",
        last4: last4 ? last4 : "",
        bank: bank ? bank : "",
        accountName: accountName ? accountName : "",
        channel: channel ? channel : "",
        type: type ? type : ""
    }

    const data = {
        $key: request.params.key,
        reference: reference ? reference : "", 
        channel: channel ? channel : "",
        amount: amount ? amount : 0,
        date: date ? date : "",
        currency: currency ? currency : "",
        ipAddress: ipAddress ? ipAddress : "",
        sendersEmail: sendersEmail ? sendersEmail : "", 
        recieversUsername: recieversUsername ? recieversUsername : "",
        customersFirstName: customersFirstName ? customersFirstName : "",
        customersLastName: customersLastName ? customersLastName : "",
        customersEmail: customersEmail ? customersEmail : "",
        authCode: authCode ? authCode : "",
        cardType: cardType ? cardType : "",
        expiryMonth: expiryMonth ? expiryMonth : "",
        expiryYear: expiryYear ? expiryYear : "",
        last4: last4 ? last4 : "",
        bank: bank ? bank : "",
        accountName: accountName ? accountName : "",
        channel: channel ? channel : "",
        type: type ? type : ""
    }

    firebaseDatabase.ref(`payments/${key}`).set(object, error => {
        if (error) {
            console.log("EditPaymente Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Edit Payment Error"
            })
        } else {
            console.log("Edit Payment Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Edit Payment Successfull",
                data
            })
        }
    })
}

// Delete Payment
const deletePayment = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`payments/${key}`).remove(error => {
        if (error) {
            console.log("Delete Payment Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Delete Payment Error"
            })
        } else {
            console.log("Delete Payment Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Delete Payment Successfull"
            }) 
        }
    })
}


module.exports = {
    paymentHomepage,
    addPaymet,
    paystackError,
    paystackSuccess,
    paymentCallback,
    getPaymentsData,
    addPayment,
    editPayment,
    deletePayment
}