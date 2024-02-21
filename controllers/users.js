const { app } = require("../config/utils")
const User = require("../models/User")
const GoogleUser = require("../models/GoogleUser")
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const { sendEmail } = require("./helpers")
const firebaseDatabase = require("../config/firebase")


let host

const pageHost = (request, response, next) => {
    host = `${ request.protocol }://${ request.get("host") }`
    next()
};
app.use(pageHost)


// Handle Get Users
const getUsers = async (request, response) => {
    try {
        const allUsers = await User.find();
        const guestUsers = allUsers.filter(user => user.role === "guest");
        const adminUsers = allUsers.filter(user => user.role === "admin");
        return response.status(200).json({
            success: true,
            message: `All ${ allUsers.length } Users Retrieved Successfully`,
            count: allUsers.length,
            data: {
                allUsers,
                adminUsers,
                guestUsers
            }
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Handle Get Google Users
const getGoogleUsers = async (request, response) => {
    try {
        const allGoogleUsers = await GoogleUser.find();
        const guestGoogleUsers = allGoogleUsers.filter(user => user.role === "guest");
        const adminGoogleUsers = allGoogleUsers.filter(user => user.role === "admin");
        return response.status(200).json({
            success: true,
            message: `All ${ allGoogleUsers.length } Google Users Retrieved Successfully`,
            count: allGoogleUsers.length,
            data: {
                allGoogleUsers,
                guestGoogleUsers,
                adminGoogleUsers
            }
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

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

// Handle Delete A Google User
const deleteGoogleUser = async (request, response) => {
    const id = request.params.id;
    try {
        const user = await GoogleUser.findById(id);
        if (!user) {
            return response.status(404).json({
                success: false,
                error: "Google User Not Found"
            });
        }
        await user.remove();
        return response.status(200).json({
            success: true,
            message: `Google User ${ user.username } Deleted Successful`
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};



// Handle Delete All User
const deleteAllUsers = async (request, response) => {
    const deleteUsers = async (id) => {
        const user = await User.findById(id);
        await user.remove();
    };

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

// Handle Delete All User
const deleteAllGoogleUsers = async (request, response) => {
    const deleteUsers = async (id) => {
        const user = await GoogleUser.findById(id);
        await user.remove();
    };

    try {
        const allGoogleUsers = await GoogleUser.find();
        totalUsers = 0;

        allGoogleUsers.forEach(object => {
            deleteUsers(object._id);
            totalUsers += 1;
        });
        return response.status(200).json({
            success: true,
            message: `${ totalUsers } Google Users Deleted Successful`
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
        jwt.verify(token, process.env.JWT_ACTIVATE_SECRET_USERS, (error, decodedToken) => {
            if (error) {
                response.status(400).json({
                    success: false,
                    error: "Incorrect Or Expired Token"
                });
                return response.redirect("/");
            }

            const { firstname, lastname, username, town, email, password, role, birthday, gender } = decodedToken;

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
                    town,
                    email,
                    password,
                    role,
                    gender,
                    birthday
                })

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
    const token = request.body.token

    if (token) {
        jwt.verify(token, process.env.JWT_ACTIVATE_SECRET_USERS, (error, decodedToken) => {
            if (error) {
                console.log("Incorrect Or Expired Token", error);
                return response.status(400).json({
                    success: false,
                    error: "Incorrect Or Expired Token"
                })
            }

            const { firstname, lastname, username, town, email, password, role, gender, birthday } = decodedToken

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
                    town,
                    email,
                    password,
                    role,
                    gender,
                    birthday
                })

                // Save New User
                newUser.save((error, success) => {
                    if (error) {
                        console.log("Error In Registering New User: ", error);
                        return response.status(400).json({ 
                            success: false, 
                            error: "Error While Activating User"
                        })
                    }

                    console.log(`${username.toUpperCase()} Has Been Registered Successful`);
                    return response.status(200).json({ 
                        success: true,
                        message: `${username.toUpperCase()} Has Been Registered Successful`
                    })
                })
            })
        })
    } else {
        console.log("Server Error", error);
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
};


// Handle Password Change
const passwordChange = (request, response) => {
    const { password, password2 } = request.body
	const token = request.params.token

    if (password.trim() !== password2.trim()) {
        console.log("Passwords Do Not Match");
        return response.status(400).json({
            success: false,
            error: "Passwords Do Not Match"
        })
    }

    if (password.length < 8) {
        console.log("Passwords Should Be A Minimum of 8 Characters")
        return response.status(400).json({
            success: false,
            error: "Passwords Should Be A Minimum of 8 Characters"
        })
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
        })
    }
};

// Handle Password Update
const updatePassword = (request, response) => {
    const { username, password, password2 } = request.body

    if (password.trim() !== password2.trim()) {
        console.log("Passwords Do Not Match");
        return response.status(400).json({
            success: false,
            error: "Passwords Do Not Match"
        })
    }

    if (password.length < 8) {
        console.log("Passwords Should Be A Minimum of 8 Characters")
        return response.status(400).json({
            success: false,
            error: "Passwords Should Be A Minimum of 8 Characters"
        })
    }

    User.findOne({ username }, (error, user) => {
        if (error || !user) {
            return response.status(401).json({ 
                success: false, 
                error: "User With The Given Username Doesn't Exist" 
            });
        }

        const updatedPassword = {
            password
        }

        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(updatedPassword.password, salt, (error, hash) => {
                if (error) {
                    console.log("Encrypting Password Error: ", error)
                }

                // Set Password To Hashed
                updatedPassword.password = hash

                // Update Password
                user = _.extend(user, updatedPassword)

                user.save((error, result) => {
                    if (error) {
                        return response.status(400).json({ 
                            success: false, 
                            error: "Update Password Error" 
                        })
                    } else {
                        return response.status(200).json({ 
                            success: true, 
                            message: "Password Has Been Updated Successfully" 
                        })
                    }
                })
            })
        })
    })
}


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
                })
                return response.redirect("/");
            }

            LoginUser.findOne({ resetToken: token }).exec((error, user) => {
                if (!user || error) {
                    console.log("User With This Token Doesn't Exist Or Has Already Been Used", error)
                    response.status(400).json({ 
                        success: false, 
                        error: "User With This Token Doesn't Exist Or Has Already Been Used"
                    })
                    return response.redirect("/")
                }

                console.log("You Can Now Set A New Password")
                response.status(200).json({ 
                    success: true, 
                    message: "You Can Now Set A New Password",
                    data: {
                        id: user._id,
                        email: user.email,
                        token
                    }
                });
                return response.redirect(`/benion-users/change-password/${token}`)
            });
        });
    } else {
        console.log("Authentication Error", error)
        response.status(400).json({
            success: false,
            error: "Authentication Error"
        })
        return response.redirect("/")
    }
};


// Register User
const registerUserActivate = (request, response) => {
    const { firstname, lastname, username, town, email, password, password2, gender, birthday } = request.body;

    if (password.trim() !== password2.trim()) {
        console.log("Passwords Do Not Match")
        return response.status(400).json({
            success: false,
            error: "Passwords Do Not Match"
        })
    }

    if (password.length < 8) {
        console.log("Passwords Should Be A Minimum of 8 Characters")
        return response.status(400).json({
            success: false,
            error: "Passwords Should Be A Minimum of 8 Characters"
        })
    }

    User.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            })
        } 
    })

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
            town,
            email,
            password,
            gender,
            birthday,
            role: "guest"
        }

        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(userData.password, salt, (error, hash) => {
                if (error) {
                    console.log("Hashing Password Error: ", error);
                    return response.status(400).json({ 
                        success: false, 
                        error: "Hashing Password Error"
                    });
                }

                // Set Password To Hashed
                userData.password = hash;

                // Send Activation Link
                const token = jwt.sign(userData, process.env.JWT_ACTIVATE_SECRET_USERS, { expiresIn: "24h" })
                const href = `${ host }/benion-users/benion-users-activate-email-link/${ token }`
                const subject = "Benion-Tech Account Activation Link"
                const successMessage = `Activation Link Has Been Sent to ${ userData.email }, Expires In 24 Hours`
                const errorMessage = "Activation Link Email Error"
                const html = `
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
                const message = `
                    Action Required Within 24 Hours !!!

                    copy the link below to your browser or you can click on this link below to activate the account

                    ${ href }

                    If you didn't do this just ignore as link expires in 24 hours
                `
        
                sendEmail(response, subject, userData.email, html, successMessage, errorMessage, message)
            })
        })
    })
}

// Register User Without Activation
const registerUser = (request, response) => {
    const { firstname, lastname, username, town, email, password, password2, gender, birthday } = request.body;

    if (password.trim() !== password2.trim()) {
        console.log("Passwords Do Not Match")
        return response.status(400).json({
            success: false,
            error: "Passwords Do Not Match"
        })
    }

    if (password.length < 8) {
        console.log("Passwords Should Be A Minimum of 8 Characters")
        return response.status(400).json({
            success: false,
            error: "Passwords Should Be A Minimum of 8 Characters"
        })
    }

    User.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            })
        } 
    })

    User.findOne({ email }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Email Already Exists"
            });
        } 
        
        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    console.log("Hashing Password Error: ", error);
                    return response.status(400).json({ 
                        success: false, 
                        error: "Hashing Password Error"
                    });
                }

                // Set Password To Hashed 
                const newUser = new User({
                    firstname,
                    lastname,
                    username,
                    town,
                    email,
                    password: hash,
                    role: "guest",
                    gender,
                    birthday
                })

                // Save New User
                newUser.save((error, success) => {
                    if (error) {
                        console.log("Error While Saving New User: ", error);
                        return response.status(400).json({ 
                            success: false, 
                            error: "Error While Saving New User"
                        });
                    }

                    console.log("Registeration Successfull, You Can Now Login");
                    return response.status(200).json({ 
                        success: true,
                        message: "Registeration Successfull, You Can Now Login"
                    })
                })
            })
        })
    })
}


// Forget Login Password
const forgetPassword = (request, response) => {
    const { email } = request.body

    User.findOne({ email }, (error, user) => {
        if (error || !user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With The Given Email Doesn't Exist" 
            })
        }

        const userData = {
            email
        }

        // Send Reset Link
        const token = jwt.sign(userData, process.env.JWT_RESET_SECRET_USERS, { expiresIn: "30m" })
        const href = `${ host }/benion-users/benion-users-reset-password-link/${ token }`
        const subject = "Benion-Tech Password Reset Link";
        const successMessage = `Reset Link Has Been Sent To ${ userData.email }, Expires In 30 Minutes`
        const errorMessage = "Reset Link Email Error"
        const html = `
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
                <p>click on this button below to reset the password for this account</p>
                <hr>
                <a href=${ href }><button 
                    style="
                    color: #020a0b;
                    background-color: transparent;
                    background-image: none;
                    border-color: #ea2b18;
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

        const message = `
            Action Required Within 30 Minutes !!!

            There was an attempt to reset an account's password with this email ${ userData.email }, if it was you

            copy the link below to your browser or you can click on this link below to reset password for the account

            ${ href }

            If you didn't do this just ignore as link expires in 30 minutes
        `

        return user.updateOne({resetToken: token }, (error, success) => {
            if (error || !user) {
                return response.status(401).json({ 
                    success: false, 
                    error: "Reset Password Link Error" 
                })
            } else {
                sendEmail(response, subject, userData.email, html, successMessage, errorMessage, message)
            }
        })
    })
}

// Update User
const updateUser = (request, response) => {
    const id = request.params.id
    const { firstname, lastname, username, town, email, role, amountBalance, gender, birthday, profile, job } = request.body

    User.findOne({ _id: id }, (error, user) => {
        if (error || !user) {
            return response.status(403).json({
                success: false, 
                error: "User  With The Given ID Doesn't Exist" 
            })
        }

        const updatedData = {
            firstname,
            lastname,
            username,
            town,
            email,
            role,
            amountBalance,
            gender,
            birthday,
            profile: profile ? profile : '',
            job: job ? job : ''
        }

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
                })
            }
        })
    })
}

// Update User
const updateGoogleUser = (request, response) => {
    const id = request.params.id
    const { firstname, lastname, username, role, amountBalance, profile, job } = request.body

    GoogleUser.findOne({ _id: id }, (error, user) => {
        if (error || !user) {
            return response.status(403).json({
                success: false, 
                error: "Google User  With The Given ID Doesn't Exist" 
            })
        }

        const updatedData = {
            firstname, 
            lastname, 
            username, 
            role, 
            amountBalance,
            profile: profile ? profile : '',
            job: job ? job : ''
        }

        // Update Password
        user = _.extend(user, updatedData);
        
        user.save((error, result) => {
            if (error) {
                console.log("Update Google User Error");
                return response.status(403).json({
                    success: false,
                    error: "Update Google User Error"
                });
            } else {
                console.log(`Google User ${username.toUpperCase()} Has Been Updated Successfully`);
                return response.status(200).json({
                    success: true,
                    message: `Google User ${username.toUpperCase()} Has Been Updated Successfully`
                })
            }
        })
    })
}

// Add A New User
const addUser = (request, response) => {
    const { firstname, lastname, username, town, email, password, role, gender, birthday } = request.body

    User.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            })
        } 
    })

    User.findOne({ email }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Email Already Exists"
            })
        } 

        const newUser = new User({
            firstname,
            lastname,
            username,
            town,
            email,
            password,
            role,
            gender,
            birthday
        })

        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error, hash) => {
                if (error) throw error

                // Set Password To Hashed
                newUser.password = hash

                // Save New User
                newUser.save()
                .then(user => {
                    return response.status(200).json({ 
                        success: true, 
                        message: `${ role.toUpperCase() } User '(${ username })' Added Successfully`
                    })
                })
                .catch(error => {
                    console.log(error);
                })
            })
        })
    })
}


// Handle Login
const handleLogin = (request, response, next) => {

    const generateUserLoginToken = () => {
        const userData = {
            id: this._id,
            username: this.username,
            role: this.role
        }

        return jwt.sign(userData, process.env.JWT_LOGIN_SECRET_USERS, { expiresIn: "59m" })
    }
	
	request.logout()

    passport.authenticate("local", (error, user, message) => {
        if (error) {
            return response.status(400).json({
                success: false,
                error
            });
        } else if (user) {
            console.log(`User ${user.username.toUpperCase()} Logged In Successfully`);
            return response.status(200).json({
                success: true,
                message: `User ${user.username.toUpperCase()} Logged In Successfully`,
                data: {
                    ..._.pick(user, ["firstname", "lastname", "email", "username", "role", "amountBalance"]),
                    token: generateUserLoginToken()
                }
            })
        } else {
            console.log("User Authentication Error", message)
            return response.status(404).json({
                success: false,
                error: message
            })
        }
    })(request, response, next)
}

// Handle Log Out
const handleLogOut = (request, response) => {
    request.logout()
    console.log("You Are Now Logged Out")
    response.status(200).json({
        success: true,
        message: "You Are Now Logged Out"
    })
    response.redirect("/login")
}

const depositAmount = (request, response) => {
    const { username, amount }  = request.body

    if (amount < 100) {
        console.log("Amount Should Not Be Less Than N100");
        return response.status(400).json({
            success: false,
            error: "Amount Should Not Be Less Than N100"
        })
    }

    if (typeof(amount) !== 'number') {
        console.log("Amount Should Be A Valid Number");
        return response.status(400).json({
            success: false,
            error: "Amount Should Be A Valid Number"
        })
    }

    User.findOne({ username }).exec((error, user) => {
        if (!user) {
            console.log("No Corresponding User Found With The Username")
            return response.status(400).json({ 
                success: false, 
                error: "No Corresponding User Found With The Username"
            })
        }

        // Set Deposited Balance
        previousBalance = user.amountBalance;
        currentBalance = previousBalance + amount;
        updatedBalance = {
            amountBalance: currentBalance
        }

        // Update Balance
        user = _.extend(user, updatedBalance)
        
        user.save((error, result) => {
            if (error) {
                console.log("Update User Balance Error", error)
                return response.status(403).json({
                    success: false, 
                    error: "Update User Balance Error"
                })
            } else {
                const subject = "Benion-Tech <Payment Notification>";
                const successMessage = `Success Notification Has Been Sent to ${ user.email } and User's Balance Has Been Updated Successfully`;
                const errorMessage = "User Balance Deposit Link Email Error";
                const html =  `
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

                const message = `
                    Account Credit Alert Successful !!!

                    A Deposit was made for the account with this email ${ user.email }, if it was you just ignore the message

                    Amount:   N${amount}
                    Reference:   Deposited By Admin --${request.username}
                    Previous Balance:   N${previousBalance}
                    Current Balance:   N${currentBalance}

                    The amount should reflect in your dashboard balance within 30 minutes
                `
        
                sendEmail(response, subject, user.email, html, successMessage, errorMessage, message)
            }
        })
    })
}

// User Authentication
const userAuthenticate = (request, response) => {
    if (request.isAuthenticated()) {
        return response.status(200).json({
            success: true,
            message: `User ${ request.username } Authenicated Successful`
        })
    }
    return response.status(400).json({
        success: false,
        error: "User Authenication Failed, Please Log In"
    })
}

// Contact Us
const userContact = (request, response) => {
    const { fullname, email, message }  = request.body

    if (fullname === '' && email === '' && message === '') {
        return response.status(400).json({
            success: false,
            error: "Please All Fields Are Required !!"
        })
    }

    const subject = "Benion-Tech <Contact Us Message>"
    const successMessage = `Dear ${fullname}, Your Message Has Been Sent To The Admin`
    const errorMessage = "Contact Us Email Error"
    const benionEmail = 'bernard.iorver28@gmail.com'
    const html =  `
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
            ">Contact Us Message Recieved</h4>
            <hr>
            <p>A message by ${fullname} was recieved with email address ${email}, with the message content below</p>
            <hr>
            <p><b>Name:   </b>${fullname}</p>
            <p><b>Email:   </b>${email}</p>
            <p><b>Message:   </b>${message}</p>
            <hr>
            <p>The user is expecting response from the admin</p>
        </div>
    `

    const telegramMessage = `
        Contact Us Message Recieved !!!
        
        A message by ${fullname} was recieved with email address ${email}, with the message content below
        
        Name:   ${fullname}
        Email:   ${email}
        Message:   ${message}
        
        The user is expecting response from the admin
    `
    const date = new Date()
    const object = {
        fullname,
        email,
        message,
        date: `${date.toLocaleDateString()}`,
        time: `${date.toLocaleTimeString()}`
    }

    firebaseDatabase.ref("contactMessages").push(object, error => {
        if (error) {
            console.log("User Contact Save Error", error)
        } else {
            console.log("User Contact Saved Successful")
        }
    })

    sendEmail(response, subject, benionEmail, html, successMessage, errorMessage, telegramMessage)
}

// Delete Contact Message
const deleteContactMessage = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`contactMessages/${key}`).remove(error => {
        if (error) {
            console.log("Delete Contact Message Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Delete Contact Message Error"
            })
        } else {
            console.log("Delete Contact Message Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Delete Contact Message Successfull"
            })
        }
    })
}

// Get All Contact Messages
const getContactMessages = (request, response) => {
	try {
        let contactMessages = []

        firebaseDatabase.ref("contactMessages").once("value", snapshot => {
            if (snapshot.val() !== null) {
                contactMessages =  []
                messages = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < messages.length; index++) {
                    contactMessages.push({
                        ...messages[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${messages.length} Contact Messages Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${messages.length} Contact Messages Fetched Successfully`,
                    count: messages.length,
                    data: [
                        keys,
                        messages,
                        snapshot.val(),
                        contactMessages.reverse()
                    ]
                })
            } else {
                console.log("No Contact Message Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Contact Message Fetched Successfully",
                    count: contactMessages.length,
                    data: [
                        [],
                        [],
                        {},
                        contactMessages
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

// Get Images
const getImages = (request, response) => {
	try {
        let galleryImages = []

        firebaseDatabase.ref("galleryImages").once("value", snapshot => {
            if (snapshot.val() !== null) {
                galleryImages =  []
                images = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < images.length; index++) {
                    galleryImages.push({
                        ...images[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${images.length} Gallery Images Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${images.length} Gallery Images Fetched Successfully`,
                    count: images.length,
                    data: [
                        keys,
                        images,
                        snapshot.val(),
                        galleryImages.reverse()
                    ]
                })
            } else {
                console.log("No GalleryImages Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Gallery Images Fetched Successfully",
                    count: galleryImages.length,
                    data: [
                        [],
                        [],
                        {},
                        galleryImages
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

// Add An Image
const addImage = (request, response) => {
    const { tag, image, caption, link, category } = request.body

    const object = {
        tag,
        image,
        caption,
        link,
        category
    }

    firebaseDatabase.ref("galleryImages").push(object, error => {
        if (error) {
            console.log("Add Image Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Add Image Error"
            })
        } else {
            console.log("Add Image Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Add Image Successfull",
                data: object
            })
        }
    })
}

// Edit Image
const editImage = (request, response) => {
    const { tag, image, caption, link, category } = request.body
    const key = request.params.key

    const object = {
        tag,
        image,
        caption,
        link,
        category
    }

    const data = {
        $key: request.params.key,
        tag,
        image,
        caption,
        link,
        category
    }

    firebaseDatabase.ref(`galleryImages/${key}`).set(object, error => {
        if (error) {
            console.log("Edit Image Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Edit Image Error"
            })
        } else {
            console.log("Edit Image Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Edit Image Successfull",
                data
            })
        }
    })
}

// Delete Image
const deleteImage = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`galleryImages/${key}`).remove(error => {
        if (error) {
            console.log("Delete Image Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Delete Image Error"
            })
        } else {
            console.log("Delete Image Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Delete Image Successfull"
            })
        }
    })
}

module.exports = {
    getUsers,
    deleteUser,
    deleteAllUsers,
    activatePage,
    activateUser,
    passwordChange,
    updatePassword,
    resetPasswordPage,
    registerUser,
    registerUserActivate,
    forgetPassword,
    updateUser,
    addUser,
    handleLogin,
    handleLogOut,
    depositAmount,
    userAuthenticate,
    userContact,
    deleteContactMessage,
    getContactMessages,
    getImages, 
    addImage, 
    editImage, 
    deleteImage,
    getGoogleUsers,
    deleteGoogleUser,
    deleteAllGoogleUsers,
    updateGoogleUser
}
