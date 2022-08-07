const express = require("express")
const router = express.Router()
const {
    getCryptos,
    getCrypto,
    getCryptoHistory,
    getCryptoExchanges,
    getBingNews,
    getCyptoNews
} = require("../controllers/news")

// Get All Cryptos
router.route("/api/all-cryptos").
post(getCryptos)

// Get A Crypto
router.route("/api/crypto/:id").
post(getCrypto)

// Get A Crypto History
router.route("/api/crypto-history").
post(getCryptoHistory)

// Get Crypto Exchanges
router.get("/api/crypto-exchanges", getCryptoExchanges)

// Get Bing News
router.route("/api/bing-news").
post(getBingNews)

// Get Crypto News
router.route("/api/crypto-news").
post(getCyptoNews)

module.exports = router