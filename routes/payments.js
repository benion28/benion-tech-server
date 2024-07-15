const express = require("express");
const router = express.Router();
const { paymentHomepage, addPaymet, paystackError, paystackSuccess, paymentCallback, getPaymentsData, addPayment, editPayment, deletePayment } = require("../controllers/payments")

// Users Dashboard
router.get("/", paymentHomepage)

// Callback
router.get("/paystack-callback", paymentCallback)

// Add Payment
router.post("/payment", addPaymet)

// Payment Error
router.get("/error/:message", paystackError)

// Payment Success
router.get("/receipt/:reference", paystackSuccess)

// Get All Payment
router.get("/api/all-payments", getPaymentsData)

// Update A Payment
router.put("/api/edit-payment/:key", editPayment)

// Add A Payment
router.route("/api/add-payment")
.post(addPayment)

// Delete A Payment
router.delete("/api/delete-payment/:key", deletePayment)

module.exports = router