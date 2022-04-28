const express = require("express");
const router = express.Router();
const paymentRequest = require("request");
const _ = require("lodash");

const Donor = require("../users-passport/models/Donor");
const { initializePayment, verifyPayment } = require("../config/paystack")(paymentRequest);


router.get('/',(request, response) => {
    response.render("donate/donatePage", {
        user: request.user
    });
    response.status(304);
});

router.post('/paystack/pay', (request, response) => {
    const { fullname, email, amount } = request.body;
    let errors = [];

    // Check For Required Fields
    if (!fullname || !amount || !email) {
        errors.push({
            message: "Please Fill In Empty Fields"
        });
    }

    // Check Amount Value
    if (amount < 500) {
        errors.push({
            message: "Please Input Amount of 500 and Above"
        });
    }

    // Check For Error
    if (errors.length > 0) {
        response.render("donate/donatePage", {
            user: request.user,
            errors,
            fullname,
            email,
            amount,
        });
        response.status(400);
    } else {
        const form = _.pick(request.body,['amount','email','fullname']);
        form.metadata = {
            full_name : form.fullname
        };
        form.amount *= 100;
        
        initializePayment(form, (error, body)=>{
            if(error){
                //handle errors
                request.flash("error_message", "Payment Initialization Error");
                response.redirect("/donate-for-benion/paystack/pay");
                response.status(403);
                console.log(error);
            } else {
                paymentResponse = JSON.parse(body);
                request.flash("success_message", "Payment Has Been Initialized Successfully");
                response.redirect(paymentResponse.data.authorization_url)
                response.status(200);
            }
        });
    }
});

router.get('/paystack/callback', (request, response) => {
    const paymentReference = request.query.reference;
    verifyPayment(paymentReference, (error,body)=>{
        if(error){
            //handle errors appropriately
            request.flash("error_message", "Payment Verification Error");
            console.log(error)
            response.redirect('/donate-for-benion/paystack-error');
            response.status(403);
        } else {
            paymentResponse = JSON.parse(body);        

            const data = _.at(paymentResponse.data, ['reference', 'amount','customer.email', 'metadata.fullname']);

            [reference, amount, email, fullname] =  data;
            
            newDonor = {reference, amount, email, fullname}

            const donor = new Donor(newDonor)

            donor.save().then((donor)=>{
                if(!donor){
                    request.flash("error_message", "Donor Verification Error");
                    response.redirect('/donate-for-benion/paystack-error');
                    response.status(403);
                } else {
                    request.flash("success_message", "Donor Has Been Verified Successfully");
                    response.redirect('/donate-for-benion/paystack-receipt/'+donor._id);
                    response.status(200);
                }
            }).catch((error)=>{
                request.flash("error_message", "Donor Saving Error");
                console.log(error);
                response.redirect('/donate-for-benion/paystack-error');
                response.status(403);
            })
        }
    })
});

router.get('/paystack-receipt/:id', (request, response)=>{
    const id = request.params.id;
    Donor.findById(id).then((donor)=>{
        if(!donor){
            //handle error when the donor is not found
            request.flash("error_message", "Donor Not Found");
            response.redirect('/donate-for-benion/paystack-error');
            response.status(403);
        } else {
            response.render('donate/success', {
                donor
            });
            response.status(304);
        }
    }).catch((error)=>{
        request.flash("error_message", "Donor Finding Error");
        console.log(error);
        response.redirect('/donate-for-benion/paystack-error');
        response.status(403);
    })
})

router.get('/paystack-error', (request, response)=>{
    response.render('donate/error');
    response.status(304);
})

module.exports = router;