const CbtUser = require("../models/CbtUser")
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const bcrypt = require("bcryptjs")

// Generate Cbt User Username
const generateCbtUsername = (role) => {
    let username = ""
    const date = new Date()

    username += `${date.getFullYear()}`

    if (role === "admin") {
        username += "/ADM"
    } else if (role === "moderator") {
        username += "/MDR"
    } else {
        username += "/SDT"
    }

    username += `/${date.getMonth()}${date.getDay()}${date.getMilliseconds()}`

    return username
}

// Register Cbt User
const registerCbtUser = (request, response) => {
    const { firstname, lastname, className, category, password, gender, school, accessCode, creator, role } = request.body

    const username = generateCbtUsername(role)

    CbtUser.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            })
        } 
    })

    CbtUser.findOne({ accessCode: creator }).exec((error, user) => {
        if (!user) {
            console.log("Access Code Is Not Valid")
            return response.status(400).json({ 
                success: false, 
                error: "Access Code Is Not Valid"
            })
        } 

        if (!(user.role !== "admin" || user.role !== "moderator")) {
            console.log("You Not Authorized With The Given Access Code")
            return response.status(400).json({ 
                success: false, 
                error: "You Not Authorized With The Given Access Code"
            })
        }
        
        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    console.log("Hashing Password Error: ", error)
                    return response.status(400).json({ 
                        success: false, 
                        error: "Hashing Password Error"
                    })
                }

                // Set Password To Hashed 
                const newUser = new CbtUser({
                    firstname,
                    lastname,
                    username,
                    className,
                    category,
                    password: hash,
                    gender,
                    accessCode,
                    school,
                    creator,
                    role
                })

                // Save New User
                newUser.save((error, success) => {
                    if (error) {
                        console.log("Error While Saving New Cbt User: ", error)
                        return response.status(400).json({ 
                            success: false, 
                            error: "Error While Saving New Cbt User"
                        })
                    }

                    console.log("Cbt Registeration Successfull, You Can Now Login")
                    return response.status(200).json({ 
                        success: true,
                        message: "Cbt Registeration Successfull, You Can Now Login"
                    })
                })
            })
        })
    })
}

// Add Cbt User
const addCbtUser = (request, response) => {
    const { firstname, lastname, className, category, password, gender, school, accessCode, creator, role } = request.body

    const username = generateCbtUsername(role)

    CbtUser.findOne({ username }).exec((error, user) => {
        if (user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Already Exists"
            })
        } 
        
        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    console.log("Hashing Password Error: ", error)
                    return response.status(400).json({ 
                        success: false, 
                        error: "Hashing Password Error"
                    })
                }

                // Set Password To Hashed 
                const newUser = new CbtUser({
                    firstname,
                    lastname,
                    username,
                    className,
                    category,
                    password: hash,
                    role,
                    gender,
                    accessCode,
                    creator,
                    school,
                    regType: 'add'
                })

                // Save New User
                newUser.save((error, success) => {
                    if (error) {
                        console.log("Error While Saving New Cbt User: ", error)
                        return response.status(400).json({ 
                            success: false, 
                            error: "Error While Adding New Cbt User"
                        })
                    }

                    console.log("Cbt Registeration Successfull");
                    return response.status(200).json({ 
                        success: true,
                        message: "Cbt Registeration Successfull"
                    })
                })
            })
        })
    })
}

// Handle Delete A Cbt User
const deleteCbtUser = async (request, response) => {
    const id = request.params.id;
    try {
        const user = await CbtUser.findById(id);
        if (!user) {
            return response.status(404).json({
                success: false,
                error: "Cbt User Not Found"
            })
        }
        await user.remove();
        return response.status(200).json({
            success: true,
            message: `Cbt User ${ user.username } Deleted Successful`
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Handle Delete All Cbt Users
const deleteAllCbtUsers = async (request, response) => {
    const deleteUsers = async (id) => {
        const user = await CbtUser.findById(id)
        await user.remove()
    }

    try {
        const allUsers = await CbtUser.find()
        totalUsers = 0

        allUsers.forEach(object => {
            deleteUsers(object._id);
            totalUsers += 1;
        })
        return response.status(200).json({
            success: true,
            message: `${ totalUsers } Cbt Users Deleted Successful`
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Update Cbt User
const updateCbtUser = (request, response) => {
    const id = request.params.id
    const { firstname, lastname, className, category, gender, school, role } = request.body

    CbtUser.findOne({ _id: id }, (error, user) => {
        if (error || !user) {
            return response.status(400).json({
                success: false, 
                error: "Cbt User  With The Given ID Doesn't Exist" 
            })
        }

        const updatedData = {
            firstname,
            lastname,
            className,
            category,
            role,
            gender,
            school
        }

        // Update Password
        user = _.extend(user, updatedData);
        
        user.save((error, result) => {
            if (error) {
                console.log("Update Cbt User Error");
                return response.status(400).json({
                    success: false,
                    error: "Update Cbt User Error"
                });
            } else {
                console.log(`User ${username.toUpperCase()} Has Been Updated Successfully`);
                return response.status(200).json({
                    success: true,
                    message: `User ${firstname.toUpperCase()}(${username}) Has Been Updated Successfully`
                })
            }
        })
    })
}

// Handle Get Users
const getCbtUsers = async (request, response) => {
    try {
        const allCbtUsers = await CbtUser.find()
        const students = allCbtUsers.filter(user => user.role === "student")
        const moderators = allCbtUsers.filter(user => user.role === "moderator")
        const admins = allCbtUsers.filter(user => user.role === "admin")

        return response.status(200).json({
            success: true,
            message: `All ${ allCbtUsers.length } Cbt Users Retrieved Successfully`,
            count: allCbtUsers.length,
            data: {
                allCbtUsers,
                students,
                moderators,
                admins
            }
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Update Cbt User
const findCbtUsername = async (request, response) => {
    const { firstname, lastname, className,  school, role } = request.body

    const allCbtUsers = await CbtUser.find()
    const roleFilter = allCbtUsers.filter(user => user.role === role)
    const classFilter = roleFilter.filter(user => user.className === className)
    const schoolFilter = classFilter.filter(user => user.school === school)
    const lastnameFilter = schoolFilter.filter(user => user.lastname.trim() === lastname.trim())
    const firstnameFilter = lastnameFilter.filter(user => user.firstname.trim() === firstname.trim())
    const foundUser = firstnameFilter

    if (foundUser.length < 1) {
        console.log("No Cbt User Was Found With The Given Details")
        return response.status(400).json({
            success: false, 
            error: "No Cbt User Was Found With The Given Details"
        })
    }

    console.log("No Cbt User Was Found With The Given Details")
    return response.status(200).json({
        success: true, 
        message: `A Cbt User Was Found With The Username (${foundUser[0].username})`,
        data: foundUser[0]
    })
}

// Handle Cbt Log Out
const handleCbtLogOut = (request, response) => {
    request.logout()
    console.log("You Are Now Logged Out")
    response.status(200).json({
        success: true,
        message: "You Are Now Logged Out"
    })
    response.redirect("/benion-cbt")
}

// Handle Cbt Login
const handleCbtLogin = (request, response) => {

    const { username, password } = request.body
    request.logout()

    CbtUser.findOne({ username }).exec((error, user) => {
        if (!user) {
            console.log("User With This Username Don't Exists")
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Don't Exists"
            })
        }

        // Handle Error
        if (error) {
             console.log(error, "User Authentication Error")
            return response.status(500).json({ 
                success: false, 
                error: `User Authentication Error (${error})`
            })
        }

        // Match Password
        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (!isMatch) {
                console.log("Incorrect Password")
                return response.status(400).json({ 
                    success: false, 
                    error: "Incorrect Password"
                })
            } else {
                // Generate Token
                const generateUserLoginToken = () => {
                    const userData = {
                        id: user._id,
                        username: user.username,
                        role: user.role
                    }

                    return jwt.sign(userData, process.env.JWT_LOGIN_SECRET_USERS, { expiresIn: "59m" })
                }

                console.log(`Cbt User ${user.username.toUpperCase()} Logged In Successfully`);
                return response.status(200).json({
                    success: true,
                    message: `Cbt User ${user.username.toUpperCase()} Logged In Successfully`,
                    data: {
                        ..._.pick(user, ["firstname", "lastname", "className", "username", "category", "role", "school", "accessCode", "regType", "activeExam", "examTime", "completed"]),
                        token: generateUserLoginToken()
                    }
                })
            }
        })
    })
}

// Update Cbt User Password
const updateCbtUserPassword = (request, response) => {
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

    CbtUser.findOne({ username }).exec((error, user) => {
        if (error || !user) {
            return response.status(400).json({ 
                success: false, 
                error: "User With This Username Don't Exists"
            })
        }
        
        // Hash Password
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    console.log("Hashing Password Error: ", error)
                    return response.status(400).json({ 
                        success: false, 
                        error: "Hashing Password Error"
                    })
                }

                // Set Password To Hashed 
                 const updatedData = {
                    password: hash
                }

                // Update Password
                user = _.extend(user, updatedData)
                
                user.save((error, result) => {
                    if (error) {
                        console.log("Update Cbt User Password Error");
                        return response.status(400).json({
                            success: false,
                            error: "Update Cbt User Password Error"
                        });
                    } else {
                        console.log(`Cbt User ${username.toUpperCase()} Password Has Been Updated Successfully`);
                        return response.status(200).json({
                            success: true,
                            message: `Cbt User ${username.toUpperCase()} Password Has Been Updated Successfully`
                        })
                    }
                })
            })
        })
    })
}

module.exports = {
    getCbtUsers,
    deleteCbtUser,
    deleteAllCbtUsers,
    findCbtUsername,
    registerCbtUser,
    updateCbtUser,
    addCbtUser,
    handleCbtLogin,
    handleCbtLogOut,
    updateCbtUserPassword
}