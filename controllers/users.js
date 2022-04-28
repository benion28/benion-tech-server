const { app } = require("../config/utils");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const mailgun = require("mailgun-js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mail = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });


let host;

const pageHost = (request, response, next) => {
    host = `${ request.protocol }://${ request.get("host") }`;
    next();
};
app.use(pageHost);


// Handle Get Users
const getUsers = async (request, response) => {
    try {
        const allUsers = await User.find();
        const guestUsers = allUsers.filter(user => user.role === "guest");
        const adminUsers = allUsers.filter(user => user.role === "admin");
        return response.status(200).json({
            success: true,
            count: allUsers.length,
            data: {
                allUsers,
                adminUsers,
                guestUsers
            }
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};


// Handle Delete A User
const deleteUser = async (request, response) => {
    const id = request.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return response.status(404).json({
                success: false,
                error: "User Not Found"
            });
        }
        await user.remove();
        return response.status(200).json({
            success: true,
            message: `User ${ user.username } Deleted Successful`
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};

const deleteUsers = async (id) => {
    const user = await User.findById(id);
    await user.remove();
};

// Handle Delete A User
const deleteAllUsers = async (request, response) => {
    try {
        const allUsers = await User.find();
        totalUsers = 0;

        allUsers.forEach(object => {
            deleteUsers(object._id);
            totalUsers += 1;
        });
        return response.status(200).json({
            success: true,
            message: `${ totalUsers } Users Deleted Successful`
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};


// Handle Activate
const activatePage = (request, response) => {
    const token = request.params.token;

    if (token) {
        jwt.verify(token, process.env.JWT_ACTIVATE_SECRET_USERS, async (error, decodedToken) => {
            if (error) {
                response.status(400).json({
                    success: false,
                    error: "Incorrect Or Expired Token"
                });
                return response.redirect("/");
            }

            const { firstname, lastname, username, city, email, password, role } = decodedToken;

            User.findOne({ email }).exec((error, user) => {
                if (user) {
                    response.status(400).json({
                        success: false,
                        error: "User With This Email Has Already Been Registered"
                    });
                    return response.redirect("/");
                }

                const newUser = new User({
                    firstname,
                    lastname,
                    username,
                    city,
                    email,
                    password,
                    role
                });

                // Save New User
                newUser.save((error, success) => {
                    if (error) {
                        console.log("Error In Registering New User: ", error);
                        response.status(400).json({ 
                            success: false, 
                            error: "Error While Activating User"
                        });
                        return response.redirect("/");
                    }

                    console.log("Registeration Successfull, You Can Now Login");
                    response.status(200).json({ 
                        success: true,
                        message: "Registeration Successfull, You Can Now Login"
                    });
                    return response.redirect("/");
                });
            });
        });
    } else {
        console.log("Server Error", error);
        response.status(500).json({
            success: false,
            error: "Server Error"
        });
        return response.redirect("/");
    }
};

// Activate User
const activateUser = (request, response) => {
    const token = request.body.token;

    if (token) {
        jwt.verify(token, process.env.JWT_ACTIVATE_SECRET_USERS, async (error, decodedToken) => {
            if (error) {
                console.log("Incorrect Or Expired Token", error);
                return response.status(400).json({
                    success: false,
                    error: "Incorrect Or Expired Token"
                });
            }

            const { firstname, lastname, username, city, email, password, role } = decodedToken;

            User.findOne({ email }).exec((error, user) => {
                if (user) {
                    console.log("User With This Email Has Already Been Registered");
                    return response.status(400).json({
                        success: false,
                        error: "User With This Email Has Already Been Registered"
                    })
                }

                const newUser = new User({
                    firstname,
                    lastname,
                    username,
                    city,
                    email,
                    password,
                    role
                });

                // Save New User
                newUser.save((error, success) => {
                    if (error) {
                        console.log("Error In Registering New User: ", error);
                        return response.status(400).json({ 
                            success: false, 
                            error: "Error While Activating User"
                        });
                    }

                    console.log(`${username.toUpperCase()} Has Been Registered Successful`);
                    return response.status(200).json({ 
                        success: true,
                        message: `${username.toUpperCase()} Has Been Registered Successful`
                    });
                });
            });
        });
    } else {
        console.log("Server Error", error);
        return response.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};


// Handle Password Change
const passwordChange = (request, response) => {
    const { password, password2 } = request.body;
	const token = request.params.token;

    if (password.trim() !== password2.trim()) {
        console.log("Passwords Do Not Match");
        return response.status(400).json({
            success: false,
            error: "Passwords Do Not Match"
        });
    }

    if (password.length < 8) {
        console.log("Passwords Should Be A Minimum of 8 Characters");
        return response.status(400).json({
            success: false,
            error: "Passwords Should Be A Minimum of 8 Characters"
        });
    }

    if (token) {
        jwt.verify(token, process.env.JWT_RESET_SECRET_USERS, (error, decodedToken) => {
            if (error) {
                return response.status(401).json({ 
                    success: false, 
                    error: "Incorrect Or Expired Token" 
                });
            }

            User.findOne({ resetToken: token }, (error, user) => {
                if (error || !user) {
                    return response.status(401).json({ 
                        success: false, 
                        error: "User With The Given Token Doesn't Exist" 
                    });
                }

                const updatedPassword = {
                    password,
                    resetToken: ""
                };

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(updatedPassword.password, salt, (error, hash) => {
                        if (error) {
                            console.log("Encrypting Password Error: ", error);
                        }

                        // Set Password To Hashed
                        updatedPassword.password = hash;

                        // Update Password
                        user = _.extend(user, updatedPassword);

                        user.save((error, result) => {
                            if (error) {
                                return response.status(400).json({ 
                                    success: false, 
                                    error: "Reset Password Error" 
                                });
                            } else {
                                return response.status(200).json({ 
                                    success: true, 
                                    message: "Password Has Been Changed Successfully" 
                                });
                            }
                        });
                    });
                });
            });
        });
    } else {
        return response.status(401).json({ 
            success: false, 
            error: "Authentication Error" 
        });
    }
};


// Reset Login User Page
const resetPasswordPage = (request, response) => {
    const token = request.params.token;

    if (token) {
        jwt.verify(token, process.env.JWT_RESET_SECRET_USERS, (error, decodedToken) => {
            if (error) {
                console.log("Incorrect Or Expired Token", error);
                response.status(400).json({ 
                    success: false, 
                    error: "Incorrect Or Expired Token"
                });
                return response.redirect("/");
            }

            LoginUser.findOne({ resetToken: token }).exec((error, user) => {
                if (!user || error) {
                    console.log("User With This Token Doesn't Exist Or Has Already Been Used", error);
                    response.status(400).json({ 
                        success: false, 
                        error: "User With This Token Doesn't Exist Or Has Already Been Used"
                    });
                    return response.redirect("/");
                }

                console.log("You Can Now Set A New Password");
                response.status(200).json({ 
                    success: true, 
                    message: "You Can Now Set A New Password",
                    data: {
                        id: user._id,
                        email: user.email,
                        token
                    }
                });
                return response.redirect(`/benion-users/change-password/${token}`);
            });
        });
    } else {
        console.log("Authentication Error", error);
        response.status(400).json({
            success: false,
            error: "Authentication Error"
        });
        return response.redirect("/");
    }
};


// Register User
const registerUser = (request, response) => {
    const { firstname, lastname, username, city, email, password, password2 } = request.body;

    if (password.trim() !== password2.trim()) {
        console.log("Passwords Do Not Match");
        return response.status(400).json({
            success: false,
            error: "Passwords Do Not Match"
        });
    }

    if (password.length < 8) {
        console.log("Passwords Should Be A Minimum of 8 Characters");
        return response.status(400).json({
            success: false,
            error: "Passwords Should Be A Minimum of 8 Characters"
        });
    }

    User.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            });
        } 
    });

    User.findOne({ email }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Email Already Exists"
            });
        } 

        const userData = {
            firstname,
            lastname,
            username,
            city,
            email,
            password,
            role: "guest"
        };

        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(userData.password, salt, (error, hash) => {
                if (error) {
                    console.log("Hashing Password Error: ", error);
                }

                // Set Password To Hashed
                userData.password = hash;

                // Send Activation Link
                const token = jwt.sign(userData, process.env.JWT_ACTIVATE_SECRET_USERS, { expiresIn: "24h" });
                const href = `${ host }/benion-users/benion-users-activate-email-link/${ token }`;
                const data = {
                    from: "Benion-Tech <me@samples.mailgun.org>",
                    to: userData.email,
                    subject: "Benion-Tech Account Activation Link",
                    html: `
                        <div style="
                        color: rgb(18, 93, 40);
                        background-color: rgb(211, 240, 219);
                        border-color: rgb(193, 233, 205);
                        position: relative;
                        margin-bottom: 1rem;
                        padding: 0.75rem 1.25rem;
                        border-width: 1px;
                        border-style: solid;
                        border-image: initial;
                        border-radius: 0.25rem;
                        display: block;
                        box-sizing: border-box;
                        text-align: center;
                        ">
                            <h1 style="
                            color: inherit;
                            font-size: 2.5rem;
                            margin-bottom: 0.5rem;
                            display: block;
                            margin-block-start: 0.67em;
                            margin-block-end: 0.67em;
                            margin-inline-start: 0px;
                            margin-inline-end: 0px;
                            font-weight: bold;
                            ">Benion-Tech</h1>
                            <h4 style="
                            color: inherit;
                            font-size: 1.5rem;
                            margin-bottom: 0.5rem;
                            display: block;
                            margin-block-start: 1.33em;
                            margin-block-end: 1.33em;
                            margin-inline-start: 0px;
                            margin-inline-end: 0px;
                            font-weight: bold;
                            ">Action Required Within 24 Hours !!!</h4>
                            <hr>
                            <p>There was an attempt to create an account with this email ${ userData.email }, if it was you</p>
                            <hr>
                            <p>click on this button below to activate the account</p>
                            <hr>
                            <a href=${ href }><button 
                                style="
                                color: #007bff;
                                background-color: transparent;
                                background-image: none;
                                border-color: #17a2b8;
                                cursor: pointer;
                                display: inline-block;
                                font-weight: 400;
                                text-align: center;
                                white-space: nowrap;
                                vertical-align: middle;
                                overflow: visible;
                                text-transform: none;
                                box-sizing: border-box;
                                user-select: none;
                                padding: 0.375rem 0.75rem;
                                font-size: 1rem;
                                line-height: 1.5;
                                border-radius: 0.25rem;
                                transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                                ">Activate Account</button></a>
                            <hr>
                            <p>OR</p>
                            <hr>
                            <p>copy the link below to your browser or you can click on this link below to activate the account</p>
                            <hr>
                            <p><a style="color: rgb(255, 0, 0);" href=${ href }>${ href }</a></p>
                            <hr>
                            <p>If you didn't do this just ignore as link expires in 24 hours</p>
                        </div>
                    `
                };
        
                mail.messages().send(data, (error, body) => {
                    if (error) {
                        return response.status(401).json({ 
                            success: false, 
                            error: error.message 
                        });
                    }
                    return response.status(200).json({ 
                        success: true, 
                        message: `Activation Link Has Been Sent to ${ userData.email }, Expires In 24 Hours`
                    });
                });
            });
        });
    });
};

// Forget Login Password
const forgetPassword = (request, response) => {
    const { email } = request.body;

    User.findOne({ email }, (error, user) => {
        if (error || !user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With The Given Email Doesn't Exist" 
            });
        }

        const userData = {
            email
        };

        // Send Reset Link
        const token = jwt.sign(userData, process.env.JWT_RESET_SECRET_USERS, { expiresIn: "30m" });
        const href = `${ host }/benion-users/benion-users-reset-password-link/${ token }`;
        const data = {
            from: "Benion-Tech <me@samples.mailgun.org>",
            to: userData.email,
            subject: "Benion-Tech Password Reset Link",
            html: `
                <div style="
                color: rgb(18, 93, 40);
                background-color: rgb(211, 240, 219);
                border-color: rgb(193, 233, 205);
                position: relative;
                margin-bottom: 1rem;
                padding: 0.75rem 1.25rem;
                border-width: 1px;
                border-style: solid;
                border-image: initial;
                border-radius: 0.25rem;
                display: block;
                box-sizing: border-box;
                text-align: center;
                ">
                    <h1 style="
                    color: inherit;
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    display: block;
                    margin-block-start: 0.67em;
                    margin-block-end: 0.67em;
                    margin-inline-start: 0px;
                    margin-inline-end: 0px;
                    font-weight: bold;
                    ">Benion-Tech</h1>
                    <h4 style="
                    color: inherit;
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    display: block;
                    margin-block-start: 1.33em;
                    margin-block-end: 1.33em;
                    margin-inline-start: 0px;
                    margin-inline-end: 0px;
                    font-weight: bold;
                    ">Action Required Within 30 Minutes !!!</h4>
                    <hr>
                    <p>There was an attempt to reset an account's password with this email ${ userData.email }, if it was you</p>
                    <hr>
                    <p>click on this button below to activate the account</p>
                    <hr>
                    <a href=${ href }><button 
                        style="
                        color: #007bff;
                        background-color: transparent;
                        background-image: none;
                        border-color: #17a2b8;
                        cursor: pointer;
                        display: inline-block;
                        font-weight: 400;
                        text-align: center;
                        white-space: nowrap;
                        vertical-align: middle;
                        overflow: visible;
                        text-transform: none;
                        box-sizing: border-box;
                        user-select: none;
                        padding: 0.375rem 0.75rem;
                        font-size: 1rem;
                        line-height: 1.5;
                        border-radius: 0.25rem;
                        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                        ">Reset Password</button></a>
                    <hr>
                    <p>OR</p>
                    <hr>
                    <p>copy the link below to your browser or you can click on this link below to reset password for the account</p>
                    <hr>
                    <p><a style="color: rgb(255, 0, 0);" href=${ href }>${ href }</a></p>
                    <hr>
                    <p>If you didn't do this just ignore as link expires in 30 minutes</p>
                </div>
            `
        };

        return user.updateOne({resetToken: token }, (error, success) => {
            if (error || !user) {
                return response.status(401).json({ 
                    success: false, 
                    error: "Reset Password Link Error" 
                });
            } else {
                mail.messages().send(data, (error, body) => {
                    if (error) {
                        return response.status(401).json({ 
                            success: false, 
                            error: error.message 
                        });
                    }
                    return response.status(200).json({ 
                        success: true, 
                        message: `Reset Link Has Been Sent To ${ userData.email }, Expires In 30 Minutes` 
                    });
                });
            }
        });
    });
};

// Update User
const updateUser = (request, response) => {
    const id = request.params.id;
    const { firstname, lastname, username, city, email, password, role, amountBalance } = request.body;

    User.findOne({ _id: id }, (error, user) => {
        if (error || !user) {
            return response.status(403).json({
                success: false, 
                error: "User  With The Given ID Doesn't Exist" 
            });
        }

        const updatedData = {
            firstname,
            lastname,
            username,
            city,
            email,
            password,
            role,
            amountBalance
        };

        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(updatedData.password, salt, (error, hash) => {
                if (error) throw error;

                // Set Password To Hashed
                updatedData.password = hash;

                // Update Password
                user = _.extend(user, updatedData);
                
                user.save((error, result) => {
                    if (error) {
                        console.log("Update User Error");
                        return response.status(403).json({
                            success: false,
                            error: "Update User Error"
                        });
                    } else {
                        console.log(`User ${username.toUpperCase()} Has Been Updated Successfully`);
                        return response.status(200).json({
                            success: true,
                            message: `User ${username.toUpperCase()} Has Been Updated Successfully`
                        });
                    }
                });
            });
        });
    });
};

// Add A New User
const addUser = (request, response) => {
    const { firstname, lastname, username, city, email, password, role } = request.body;

    User.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            });
        } 
    });

    User.findOne({ email }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Email Already Exists"
            });
        } 

        const newUser = new User({
            firstname,
            lastname,
            username,
            city,
            email,
            password,
            role
        });

        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error, hash) => {
                if (error) throw error;

                // Set Password To Hashed
                newUser.password = hash;

                // Save New User
                newUser.save()
                .then(user => {
                    return response.status(200).json({ 
                        success: true, 
                        message: `${ role.toUpperCase() } User Added Successfully`
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            });
        });
    });
};


// Handle Login
const handleLogin = (request, response, next) => {

    const generateUserLoginToken = () => {
        const userData = {
            id: this._id,
            username: this.username,
            role: this.role
        };

        return jwt.sign(userData, process.env.JWT_LOGIN_SECRET_USERS, { expiresIn: "59m" });
    };
	
	request.logout();

    passport.authenticate("local", (error, user, message) => {
        if (error) {
            return response.status(400).json({
                success: false,
                error
            });
        } else if (user) {
            console.log(`User ${user.username.toUpperCase()} Authenticated Successfully`);
            return response.status(200).json({
                success: true,
                message: `User ${user.username.toUpperCase()} Authenticated Successfully`,
                data: {
                    user: _.pick(user, ["firstname", "lastname", "email", "username", "role", "amountBalance"]),
                    token: generateUserLoginToken()
                }
            });
        } else {
            console.log("User Authentication Error", message);
            return response.status(404).json({
                success: false,
                error: message
            });
        }
    })(request, response, next);
};

// Handle Log Out
const handleLogOut = (request, response) => {
    console.log("This", this.user.username);
    console.log("Request", request.user.username);
    username = request.user.username;
    request.logout();
    console.log("You Are Now Logged Out");
    return response.status(200).json({
        success: true,
        message: "You Are Now Logged Out"
    });
};

const depositAmount = (request, response) => {
    const { username, amount }  = request.body;

    if (amount < 100) {
        console.log("Amount Should Not Be Less Than N100");
        return response.status(400).json({
            success: false,
            message: "Amount Should Not Be Less Than N100"
        });
    }

    User.findOne({ username }).exec((error, user) => {
        if (!user) {
            console.log("No Corresponding User Found With The Username");
            return response.status(400).json({ 
                success: false, 
                error: "No Corresponding User Found With The Username"
            });
        }

        // Set Deposited Balance
        previousBalance = user.amountBalance;
        currentBalance = previousBalance + amount;
        updatedBalance = {
            amountBalance: currentBalance
        };

        // Update Balance
        user = _.extend(user, updatedBalance);
        
        user.save((error, result) => {
            if (error) {
                console.log("Update User Balance Error", error);
                return response.status(403).json({
                    success: false, 
                    error: "Update User Balance Error"
                });
            } else {

                const data = {
                    from: "Benion-Tech <me@samples.mailgun.org>",
                    to: user.email,
                    subject: "Benion-Tech <Payment Notification>",
                    html: `
                        <div style="
                        color: rgb(18, 93, 40);
                        background-color: rgb(211, 240, 219);
                        border-color: rgb(193, 233, 205);
                        position: relative;
                        margin-bottom: 1rem;
                        padding: 0.75rem 1.25rem;
                        border-width: 1px;
                        border-style: solid;
                        border-image: initial;
                        border-radius: 0.25rem;
                        display: block;
                        box-sizing: border-box;
                        text-align: center;
                        ">
                            <h1 style="
                            color: inherit;
                            font-size: 2.5rem;
                            margin-bottom: 0.5rem;
                            display: block;
                            margin-block-start: 0.67em;
                            margin-block-end: 0.67em;
                            margin-inline-start: 0px;
                            margin-inline-end: 0px;
                            font-weight: bold;
                            ">Benion-Tech</h1>
                            <h4 style="
                            color: inherit;
                            font-size: 1.5rem;
                            margin-bottom: 0.5rem;
                            display: block;
                            margin-block-start: 1.33em;
                            margin-block-end: 1.33em;
                            margin-inline-start: 0px;
                            margin-inline-end: 0px;
                            font-weight: bold;
                            ">Account Credit Alert Successful !!!</h4>
                            <hr>
                            <p>A Deposit was made for the account with this email ${ user.email }, if it was you just ignore the message</p>
                            <hr>
                            <p><b>Amount:   </b>N${amount}</p>
                            <p><b>Reference:   </b>Deposited By Admin --${request.username}--</p>
                            <p><b>Previous Balance:   </b>N${previousBalance}</p>
                            <p><b>Current Balance:   </b>N${currentBalance}</p>
                            <hr>
                            <p>The amount should reflect in your dashboard balance within 30 minutes</p>
                        </div>
                    `
                };
        
                mail.messages().send(data, (error, body) => {
                    if (error) {
                        console.log(error.message);
                        return response.status(401).json({ 
                            success: false, 
                            error: error.message 
                        });
                    }
                    console.log(`Success Notification Has Been Sent to ${ user.email }`);
                    return response.status(200).json({
                        success: true, 
                        message: `Success Notification Has Been Sent to ${ user.email } and User's Balance Has Been Updated Successfully`
                    });
                });
            }
        });
    });
};


module.exports = {
    getUsers,
    deleteUser,
    deleteAllUsers,
    activatePage,
    activateUser,
    passwordChange,
    resetPasswordPage,
    registerUser,
    forgetPassword,
    updateUser,
    addUser,
    handleLogin,
    handleLogOut,
    depositAmount
};
