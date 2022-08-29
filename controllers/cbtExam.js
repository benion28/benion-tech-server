const _ = require("lodash")
const firebaseDatabase = require("../config/firebase")
const CbtUser = require("../models/CbtUser")

// Get All Cbt Exam Data
const getCbtExamData = (request, response) => {
	try {
        let cbtExams = []

        firebaseDatabase.ref("cbtExams").once("value", snapshot => {
            if (snapshot.val() !== null) {
                cbtExams =  []
                exams = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < exams.length; index++) {
                    cbtExams.push({
                        ...exams[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${exams.length} Cbt Exam Data Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${exams.length} Cbt Exam Data Fetched Successfully`,
                    count: exams.length,
                    data: [
                        keys,
                        exams,
                        snapshot.val(),
                        cbtExams.reverse()
                    ]
                })
            } else {
                console.log("No Cbt Exam Data Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Cbt Exam Data Fetched Successfully",
                    count: cbtExams.length,
                    data: [
                        [],
                        [],
                        {},
                        cbtExams
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


// Get All Cbt Exam Questions
const getCbtExamQuestions = (request, response) => {
	try {
        let cbtQuestions = []

        firebaseDatabase.ref("cbtExamQuestions").once("value", snapshot => {
            if (snapshot.val() !== null) {
                cbtQuestions =  []
                questions = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < questions.length; index++) {
                    cbtQuestions.push({
                        ...questions[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${questions.length} Cbt Exam Questions Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${questions.length} Cbt Exam Questions Fetched Successfully`,
                    count: questions.length,
                    data: [
                        keys,
                        questions,
                        snapshot.val(),
                        cbtQuestions.reverse()
                    ]
                })
            } else {
                console.log("No Cbt Exam Questions Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Cbt Exam Questions Fetched Successfully",
                    count: cbtQuestions.length,
                    data: [
                        [],
                        [],
                        {},
                        cbtQuestions
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

// Add Exam Question
const addExamQuestion = (request, response) => {
    const { question, optionA, optionB, optionC, optionD, answer, category, className, subject, term, creator } = request.body

    const object = {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        answer,
        category,
        className,
        subject,
        term,
        creator
    }

    firebaseDatabase.ref("cbtExamQuestions").push(object, error => {
        if (error) {
            console.log("Add Exam Question Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Add Exam Question Error"
            })
        } else {
            console.log("Add Exam Question Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Add Exam Question Successfull",
                data: object
            })
        }
    })
}

// Test Area
const testArea = (request, response) => {
	const { name, email, message, title } = request.body
    const data = { name, email, message, title }
    console.log("Test Area Data Recieved", data)
    return response.status(200).json({ 
        success: true,
        message: "Test Area Data Recieved",
        data
    })
}

// Add Exam Data
const addExamData = (request, response) => {
    const { id, examTime, username, answered, answers, completed, timeLimit, score, subject, term, className, category } = request.body

    const object = {
        id,
        examTime,
        username,
        answered,
        answers,
        completed,
        timeLimit,
		score,
		subject,
        term,
        className,
        category
    }

    firebaseDatabase.ref("cbtExams").push(object, error => {
        if (error) {
            console.log("Add Exam Data Error", error)
            return response.status(500).json({ 
                success: false,
                error: "Add Exam Data Error"
            })
        } else {
            firebaseDatabase.ref("cbtExams").once("value", snapshot => {
                if (snapshot.val() !== null) {
                    cbtExams =  []
                    exams = Object.values(snapshot.val())
                    keys = Object.keys(snapshot.val())

                    for (let index = 0; index < exams.length; index++) {
                        cbtExams.push({
                            ...exams[index],
                            $key: keys[index]
                        })
                    }
                    const examData = cbtExams.filter(item => item.id === id)
                    CbtUser.findOne({ username }).exec((error, user) => {
                        if (error || !user) {
                            return response.status(400).json({ 
                                success: false, 
                                error: "User With This Username Don't Exists"
                            })
                        }
                        const updatedData = {
                            activeExam: id,
                            completed
                        }
                        user = _.extend(user, updatedData)
                        user.save((error, result) => {
                            if (error) {
                                console.log("Update Cbt User Exam Error");
                                return response.status(400).json({
                                    success: false,
                                    error: "Update Cbt User Exam Error"
                                });
                            } else {
                                console.log("Add Exam Data Successfull")
                                return response.status(200).json({ 
                                    success: true,
                                    message: "Add Exam Data Successfull",
                                    data: examData[0]
                                })
                            }
                        })
                    })
                } else {
                    console.log("Add Exam Data Error")
                    return response.status(500).json({ 
                        success: true,
                        message: "Add Exam Data Error",
                        data: {
                            $key: null,
                            category: null,
                            id: null,
                            className: null,
                            examTime: 1,
                            subject: null,
                            username: null,
                            answered: '',
                            answers: '',
                            term: null,
                            completed: true,
                            score: 0
                        }
                    })
                }
            })
        }
    })
}

// Edit Exam Question
const editExamQuestion = (request, response) => {
    const { question, optionA, optionB, optionC, optionD, answer, category, className, subject, term, creator } = request.body
    const key = request.params.key

    const object = {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        answer,
        category,
        className,
        subject,
        term,
        creator
    }

    const data = {
        $key: request.params.key,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        answer,
        category,
        className,
        subject,
        term,
        creator
    }

    firebaseDatabase.ref(`cbtExamQuestions/${key}`).set(object, error => {
        if (error) {
            console.log("Edit Exam Question Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Edit Exam Question Error"
            })
        } else {
            console.log("Edit Exam Question Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Edit Exam Question Successfull",
                data
            })
        }
    })
}

// Edit Exam Data
const editExamData = (request, response) => {
    const key = request.params.key
    const { id, examTime, username, answered, answers, completed, timeLimit, score, subject, term, className, category } = request.body

    const object = {
        id,
        examTime,
        username,
        answered,
        answers,
        completed,
        timeLimit,
		score,
		subject,
        term,
        className,
        category
    }

    const data = {
        $key: request.params.key,
        id,
        examTime,
        username,
        answered,
        answers,
        completed,
        timeLimit,
		score,
		subject,
        term,
        className,
        category
    }

    firebaseDatabase.ref(`cbtExam/${key}`).set(object, error => {
        if (error) {
            console.log("Edit Exam Data Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Edit Exam Data Error"
            })
        } else {
            CbtUser.findOne({ username }).exec((error, user) => {
                if (error || !user) {
                    return response.status(400).json({ 
                        success: false, 
                        error: "User With This Username Don't Exists"
                    })
                }
                const updatedData = {
                    activeExam: id,
                    completed
                }
                user = _.extend(user, updatedData)
                user.save((error, result) => {
                    if (error) {
                        console.log("Update Cbt User Exam Error");
                        return response.status(400).json({
                            success: false,
                            error: "Update Cbt User Exam Error"
                        });
                    } else {
                        console.log("Edit Exam Data Successfull")
                        return response.status(200).json({ 
                            success: true,
                            message: "Edit Exam Data Successfull",
                            data
                        })
                    }
                })
            })
        }
    })
}

// Delete Exam Question
const deleteExamQuestion = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`cbtExamQuestions/${key}`).remove(error => {
        if (error) {
            console.log("Delete Exam Question Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Delete Exam Question Error"
            })
        } else {
            console.log("Delete Exam Question Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Delete Exam Question Successfull"
            })
        }
    })
}

// Delete Exam Data
const deleteExamData = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`cbtExam/${key}`).remove(error => {
        if (error) {
            console.log("Delete Exam Data Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Delete Exam Data Error"
            })
        } else {
            console.log("Delete Exam Data Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Delete Exam Data Successfull"
            }) 
        }
    })
}

// Delete Score
const deleteScore = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`cbtScores/${key}`).remove(error => {
        if (error) {
            console.log("Delete Cbt Score Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Delete Cbt Score Error"
            })
        } else {
            console.log("Delete Cbt Score Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Delete Cbt Score Successfull"
            }) 
        }
    })
}

// Get All Cbt Scores
const getScores = (request, response) => {
	try {
        let cbtScores = []

        firebaseDatabase.ref("cbtScores").once("value", snapshot => {
            if (snapshot.val() !== null) {
                cbtScores =  []
                scores = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < scores.length; index++) {
                    cbtScores.push({
                        ...scores[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${scores.length} Cbt Scores Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${scores.length} Cbt Scores Fetched Successfully`,
                    count: scores.length,
                    data: [
                        keys,
                        scores,
                        snapshot.val(),
                        cbtScores.reverse()
                    ]
                })
            } else {
                console.log("No Cbt Score Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Cbt Scores Fetched Successfully",
                    count: cbtScores.length,
                    data: [
                        [],
                        [],
                        {},
                        cbtScores
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

// Add Cbt Score
const addScore = (request, response) => {
    const { fullname, session, username, exam, total, grade, comment, className, subject, term, examiner, firstCA, secondCA } = request.body

    const object = {
        fullname,
        session,
        className,
        username,
        subject,
        term,
        exam,
        total,
        grade,
        comment,
        firstCA,
        secondCA,
        examiner
    }

    firebaseDatabase.ref("cbtScores").push(object, error => {
        if (error) {
            console.log("Add Cbt Score Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Add Cbt Score Error"
            })
        } else {
            console.log("Add Cbt Score Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Add Cbt Score Successfull",
                data: object
            })
        }
    })
}

// Edit Cbt Score
const editScore = (request, response) => {
    const { fullname, session, username, exam, total, grade, comment, className, subject, term, examiner, firstCA, secondCA } = request.body
    const key = request.params.key

    const object = {
        fullname,
        session,
        className,
        username,
        subject,
        term,
        exam,
        total,
        grade,
        comment,
        firstCA,
        secondCA,
        examiner
    }

    const data = {
        $key: request.params.key,
        fullname,
        session,
        className,
        username,
        subject,
        term,
        exam,
        total,
        grade,
        comment,
        firstCA,
        secondCA,
        examiner
    }

    firebaseDatabase.ref(`cbtScores/${key}`).set(object, error => {
        if (error) {
            console.log("Edit Cbt Score Error", error)
            return response.status(500).json({ 
                success: false,
                message: "Edit Cbt Score Error"
            })
        } else {
            console.log("Edit Cbt Score Successfull")
            return response.status(200).json({ 
                success: true,
                message: "Edit Cbt Score Successfull",
                data
            })
        }
    })
}

module.exports = {
    getCbtExamData,
    addExamQuestion,
    editExamQuestion,
    deleteExamQuestion,
    getCbtExamQuestions,
    addExamData,
    deleteExamData,
    editExamData,
    testArea,
    deleteScore,
    getScores,
    addScore,
    editScore
}