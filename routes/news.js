const express = require("express");
const router = express.Router();
const {
    getATopStoriesNews,
    getAllTopStoriesNews,
    handleATopStoriesNews,
    handleEntertainmentNews,
    getAllEntertainmentNews,
    handleAnEntertainmentNews,
    getAnEntertaimentNews,
    getAllSportNews,
    handleSportNews,
    handleASportNews,
    getASportNews,
    getAllTechnologyNews,
    handleTechnologyNews,
    handleATechnologyNews,
    getATechnologyNews,
    handleBenionNews
} = require("../controllers/news");

// Handle Entertaiment News
router.get("/benion-news-entertainment", handleEntertainmentNews);

// Handle Sport News
router.get("/benion-news-sports", handleSportNews);

// Handle Technology News
router.get("/benion-news-technology", handleTechnologyNews);

// Handle Top Stories News
router.get("/", handleBenionNews);

// Top Stories News Page
router.get("/:key", handleATopStoriesNews);

// Entertainment News Page
router.get("/benion-news-entertainment/:key", handleAnEntertainmentNews);

// Sport News Page
router.get("/benion-news-sports/:key", handleASportNews);

// Technology News Page
router.get("/benion-news-technology/:key", handleATechnologyNews);

// Get All TopStories News
router.route("/api/benion-get-all-topstories-news")
.get(getAllTopStoriesNews);

// Get All Entertaiment News
router.route("/api/benion-get-all-entertainment-news")
.get(getAllEntertainmentNews);

// Get All Sport News
router.route("/api/benion-get-all-sport-news")
.get(getAllSportNews);

// Get All Technology News
router.route("/api/benion-get-all-technology-news")
.get(getAllTechnologyNews);

// Get A Top Stories News
router.route("/api/benion-get-a-topstories-news/:key")
.get(getATopStoriesNews);

// Get An Entertaiment News
router.route("/api/benion-get-an-entertainment-news/:key")
.get(getAnEntertaimentNews);

// Get A Sport News
router.route("/api/benion-get-a-sport-news/:key")
.get(getASportNews);

// Get A Technology News
router.route("/api/benion-get-a-technology-news/:key")
.get(getATechnologyNews);

module.exports = router;