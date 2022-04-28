const firebaseDatabase = require("../config/firebase");

const handleHomepage = (request, response) => {
    try {
        firebaseDatabase.ref("topStoriesNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("main/homePage", {
                    user: request.user,
                    Data: Object.entries(snapshot.val()).reverse()
                });
                response.status(304);
            } else {
                response.render("main/homePage", {
                    user: request.user,
                    Data: []
                });
                response.status(400);
            }
        });
    } catch (error) {
        let errors = [];

        errors.push({
            message: "Server Error"
        });

        response.render("main/homePage", {
            user: request.user,
            errors,
            topStories: Object.entries(snapshot.val()).reverse()
        });
        response.status(403);

        console.log("Server Error: ", error);
    }
};

const handleBenionNews = (request, response) => {
    try {
        firebaseDatabase.ref("topStoriesNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/benionNews", {
                    user: request.user,
                    Data: Object.entries(snapshot.val()).reverse()
                });
                response.status(304);
            } else {
                response.render("news/benionNews", {
                    user: request.user,
                    Data: []
                });
                response.status(400);
            }
        });
    } catch (error) {
        let errors = [];

        errors.push({
            message: "Server Error"
        });

        response.render("news/benionNews", {
            user: request.user,
            errors,
            topStories: Object.entries(snapshot.val()).reverse()
        });
        response.status(403);

        console.log("Server Error: ", error);
    }
};

const getAllTopStoriesNews = (request, response) => {
    try {
        firebaseDatabase.ref("topStoriesNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    sucess: true,
                    data: Object.entries(snapshot.val()).reverse()
                });
            } else {
                response.status(400).json({
                    sucess: false,
                    data: []
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            sucess: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const getAllSportNews = (request, response) => {
    try {
        firebaseDatabase.ref("sportsNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    sucess: true,
                    data: Object.entries(snapshot.val()).reverse()
                });
            } else {
                response.status(400).json({
                    sucess: false,
                    data: []
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            sucess: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const getAllTechnologyNews = (request, response) => {
    try {
        firebaseDatabase.ref("technologyNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    sucess: true,
                    data: Object.entries(snapshot.val()).reverse()
                });
            } else {
                response.status(400).json({
                    sucess: false,
                    data: []
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            sucess: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const handleEntertainmentNews = (request, response) => {
    try {
        firebaseDatabase.ref("entertainmentNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/entertainmentPage", {
                    user: request.user,
                    Data: Object.entries(snapshot.val()).reverse()
                });
                response.status(304);
            } else {
                response.render("news/entertainmentPage", {
                    user: request.user,
                    Data: []
                });
                response.status(400);
            }
        });
    } catch (error) {
        let errors = [];

        errors.push({
            message: "Server Error"
        });

        response.render("news/entertainmentPage", {
            user: request.user,
            errors,
            topStories: Object.entries(snapshot.val()).reverse()
        });
        response.status(403);

        console.log("Server Error: ", error);
    }
};

const handleTechnologyNews = (request, response) => {
    try {
        firebaseDatabase.ref("technologyNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/technologyPage", {
                    user: request.user,
                    Data: Object.entries(snapshot.val()).reverse()
                });
                response.status(304);
            } else {
                response.render("news/technologyPage", {
                    user: request.user,
                    Data: []
                });
                response.status(400);
            }
        });
    } catch (error) {
        let errors = [];

        errors.push({
            message: "Server Error"
        });

        response.render("news/technologyPage", {
            user: request.user,
            errors,
            topStories: Object.entries(snapshot.val()).reverse()
        });
        response.status(403);

        console.log("Server Error: ", error);
    }
};

const handleSportNews = (request, response) => {
    try {
        firebaseDatabase.ref("sportsNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/sportsPage", {
                    user: request.user,
                    Data: Object.entries(snapshot.val()).reverse()
                });
                response.status(304);
            } else {
                response.render("news/sportsPage", {
                    user: request.user,
                    Data: []
                });
                response.status(400);
            }
        });
    } catch (error) {
        let errors = [];

        errors.push({
            message: "Server Error"
        });

        response.render("news/sportsPage", {
            user: request.user,
            errors,
            topStories: Object.entries(snapshot.val()).reverse()
        });
        response.status(403);

        console.log("Server Error: ", error);
    }
};

const getAllEntertainmentNews = (request, response) => {
    try {
        firebaseDatabase.ref("entertainmentNews").once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    sucess: true,
                    data: Object.entries(snapshot.val()).reverse()
                });
            } else {
                response.status(400).json({
                    sucess: false,
                    data: []
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            sucess: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const handleATopStoriesNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("topStoriesNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/newsPage", {
                    user: request.user,
                    news: Object.values(snapshot.val())
                });
                response.status(304);
            } else {
                response.redirect("/page-not-found");
                response.status(404);
            }
        });
    } catch (error) {
        response.redirect("/page-not-found");
        response.status(404);
        console.log("Server Error: ", error);
    }
};

const handleAnEntertainmentNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("entertainmentNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/entainmentNewsPage", {
                    user: request.user,
                    news: Object.values(snapshot.val())
                });
                response.status(304);
            } else {
                response.redirect("/page-not-found");
                response.status(404);
            }
        });
    } catch (error) {
        response.redirect("/page-not-found");
        response.status(404);
        console.log("Server Error: ", error);
    }
};

const handleATechnologyNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("technologyNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/technologyNewsPage", {
                    user: request.user,
                    news: Object.values(snapshot.val())
                });
                response.status(304);
            } else {
                response.redirect("/page-not-found");
                response.status(404);
            }
        });
    } catch (error) {
        response.redirect("/page-not-found");
        response.status(404);
        console.log("Server Error: ", error);
    }
};

const handleASportNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("sportsNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.render("news/sportsNewsPage", {
                    user: request.user,
                    news: Object.values(snapshot.val())
                });
                response.status(304);
            } else {
                response.redirect("/page-not-found");
                response.status(404);
            }
        });
    } catch (error) {
        response.redirect("/page-not-found");
        response.status(404);
        console.log("Server Error: ", error);
    }
};

const getATopStoriesNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("topStoriesNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    success: true,
                    data: Object.values(snapshot.val())
                });
            } else {
                response.status(404).json({
                    success: false,
                    error: "Message With The Given Key Is Not Found"
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const getAnEntertaimentNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("entertainmentNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    success: true,
                    data: Object.values(snapshot.val())
                });
            } else {
                response.status(404).json({
                    success: false,
                    error: "Message With The Given Key Is Not Found"
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const getASportNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("sportsNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    success: true,
                    data: Object.values(snapshot.val())
                });
            } else {
                response.status(404).json({
                    success: false,
                    error: "Message With The Given Key Is Not Found"
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

const getATechnologyNews = (request, response) => {
    try {
        const key  = request.params.key;

        firebaseDatabase.ref("technologyNews").child(key).once("value", snapshot => {
            if (snapshot.val() !== null) {
                response.status(200).json({
                    success: true,
                    data: Object.values(snapshot.val())
                });
            } else {
                response.status(404).json({
                    success: false,
                    error: "Message With The Given Key Is Not Found"
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: "Server Error"
        });

        console.log("Server Error: ", error);
    }
};

module.exports = {
    getAllTopStoriesNews,
    handleHomepage,
    handleATopStoriesNews,
    getAllEntertainmentNews,
    handleEntertainmentNews,
    handleAnEntertainmentNews,
    getAnEntertaimentNews,
    getAllSportNews,
    handleSportNews,
    getATopStoriesNews,
    handleASportNews,
    getASportNews,
    getAllTechnologyNews,
    handleTechnologyNews,
    handleATechnologyNews,
    getATechnologyNews,
    handleBenionNews
};