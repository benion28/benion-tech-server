const express = require("express")
const router = express.Router()
const {
    getCryptos,
    getCrypto,
    getCryptoHistory,
    getCryptoExchanges,
    getBingNews,
    getCyptoNews,
    getPosts, 
    addPost, 
    editPost, 
    deletePost
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

// Get All Posts
// router.get("/api/all-posts", ensureAdminAuthenticated, getPosts)
router.get("/api/all-posts", getPosts)

// Add An Post
router.route("/api/add-post")
.post(addPost)

// Update A Post
// router.put("/api/edit-post/:key", ensureAdminAuthenticated, editPost)
router.put("/api/edit-post/:key", editPost)

// Delete A Post
// router.delete("/api/delete-post/:key", ensureAdminAuthenticated, deletePost)
router.delete("/api/delete-post/:key", deletePost)

module.exports = router