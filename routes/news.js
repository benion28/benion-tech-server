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
router.get("/api/all-cryptos", getCryptos)

// Get A Crypto
router.get("/api/crypto/:id", getCrypto)

// Get A Crypto History
router.get("/api/crypto-history", getCryptoHistory)

// Get Crypto Exchanges
router.get("/api/crypto-exchanges", getCryptoExchanges)

// Get Bing News
router.get("/api/bing-news", getBingNews)

// Get Crypto News
router.get("/api/crypto-news", getCyptoNews)

module.exports = router