const jwt = require("jsonwebtoken");

const ensureAdminAuthorization = (request, response, next) => {
    try {
        let token;
        const authorization = "authorization";

        if (authorization in request.headers) {
            token = request.headers[authorization].split(" ")[1];
        } else {
            console.log("No Authorization In Header, Please Log In To View This Page");
            response.status(401).json({ 
                authentication: false, 
                error: "No Authorization In Header, Please Log In To View This Page"
            });
            return response.redirect("/");
        }

        if (!token) {
            console.log("No Token Provided, Please Log In To View This Page");
            response.status(401).json({ 
                authentication: false, 
                error: "No Token Provided, Please Log In To View This Page"
            });
            return response.redirect("/");
        } else {
            jwt.verify(token, process.env.JWT_LOGIN_SECRET_ADMIN, (error, decodedToken) => {
                const { role, username } = decodedToken;
                if (error) {
                    console.log("Expired Session, Please Log In");
                    request.logout();
                    response.status(400).json({ 
                        authentication: false, 
                        error: "Expired Session, Please Log In"
                    });
                    return response.redirect("/");
                } else {
                    if (role === "admin") {
                        console.log(`${username.toUpperCase()} (${role}) Has Been Access Granted !!!`);
                        response.status(200).json({ 
                            authentication: true, 
                            message: `${username.toUpperCase()} (${role}) Has Been Access Granted !!!`
                        });
                        return next();
                    }

                    console.log("You Are Not An Admin, Please Log In As Admin");
                    response.status(401).json({ 
                        authentication: false, 
                        error: "You Are Not An Admin, Please Log In As Admin"
                    });
                    return response.redirect("/");
                }
            });
        }
    } catch(error) {
        console.log("Server Error, Please Try Again", error);
        response.status(500).json({ 
            authentication: false, 
            error: "Server Error, Please Try Again" 
        });
        return response.redirect("/");
    }
};

const ensureAuthorization = (request, response, next) => {
    try {
        let token;
        const authorization = "authorization";

        if (authorization in request.headers) {
            token = request.headers[authorization].split(" ")[1];
        } else {
            console.log("No Authorization In Header, Please Log In To View This Page");
            response.status(401).json({ 
                authentication: false, 
                error: "No Authorization In Header, Please Log In To View This Page"
            });
            return response.redirect("/");
        }

        if (!token) {
            console.log("No Token Provided, Please Log In To View This Page");
            response.status(401).json({ 
                authentication: false, 
                error: "No Token Provided, Please Log In To View This Page"
            });
            return response.redirect("/");
        } else {
            jwt.verify(token, process.env.JWT_LOGIN_SECRET_ADMIN, (error, decodedToken) => {
                const { role, username } = decodedToken;
                if (error) {
                    console.log("Expired Session, Please Log In");
                    request.logout();
                    response.status(400).json({ 
                        authentication: false, 
                        error: "Expired Session, Please Log In"
                    });
                    return response.redirect("/");
                } else {
                    console.log(`${username.toUpperCase()} Has Been Access Granted !!!`);
                    response.status(200).json({ 
                        authentication: true, 
                        message: `${username.toUpperCase()} Has Been Access Granted !!!`
                    });
                    return next();
                }
            });
        }
    } catch(error) {
        console.log("Server Error, Please Try Again", error);
        response.status(500).json({ 
            authentication: false, 
            error: "Server Error, Please Try Again" 
        });
        return response.redirect("/");
    }
};

const ensureAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }

    console.log("Please Log In To View This Page");
    response.status(401).json({ 
        authentication: false, 
        message: "Please Log In To View This Page"
    });
    return response.redirect("/");
};

const ensureAdminAuthenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        if (request.user.role !== "admin") {
            console.log("You Are Not An Admin");
            response.status(401).json({ 
                authentication: false, 
                message: "You Are Not An Admin"
            });
            return response.redirect("/");
        } 
        return next();
    } else {
        console.log("Please Log In To View This Page");
        response.status(401).json({ 
            authentication: false, 
            message: "Please Log In To View This Page"
        });
        return response.redirect("/");
    }
};

module.exports = {
    ensureAdminAuthorization,
    ensureAuthorization,
    ensureAuthenticated,
    ensureAdminAuthenticated
};