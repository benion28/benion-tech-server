const _ = require("lodash")
const axios = require("axios")
const firebaseDatabase = require("../config/firebase")
const CbtUser = require("../models/CbtUser")

// Get All Cbt Exam Data
const getUtmeExamData = (request, response) => {
	try {
        let utmeExams = []

        firebaseDatabase.ref("utmeExams").once("value", snapshot => {
            if (snapshot.val() !== null) {
                utmeExams =  []
                exams = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < exams.length; index++) {
                    utmeExams.push({
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
                        utmeExams.reverse()
                    ]
                })
            } else {
                console.log("No Cbt Exam Data Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Cbt Exam Data Fetched Successfully",
                    count: utmeExams.length,
                    data: [
                        [],
                        [],
                        {},
                        utmeExams
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
const getUtmeExamQuestions = (request, response) => {
	try {
        let utmeQuestions = []

        firebaseDatabase.ref("utmeQuestions").once("value", snapshot => {
            if (snapshot.val() !== null) {
                utmeQuestions =  []
                questions = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < questions.length; index++) {
                    utmeQuestions.push({
                        ...questions[index],
                        $key: keys[index]
                    })
                }

                console.log(`All ${questions.length} Utme Exam Questions Fetched Successfully`)
                return response.status(200).json({
                    success: true,
                    message: `All ${questions.length} Utme Exam Questions Fetched Successfully`,
                    count: questions.length,
                    mathematics: questions.filter(item => item.subject === "mathematics").length,
                    english: questions.filter(item => item.subject === "english").length,
                    physics: questions.filter(item => item.subject === "physics").length,
                    chemistry: questions.filter(item => item.subject === "chemistry").length,
                    biology: questions.filter(item => item.subject === "biology").length,
                    government: questions.filter(item => item.subject === "government").length,
                    geography: questions.filter(item => item.subject === "geography").length,
                    accounting: questions.filter(item => item.subject === "accounting").length,
                    economics: questions.filter(item => item.subject === "economics").length,
                    history: questions.filter(item => item.subject === "history").length,
                    commerce: questions.filter(item => item.subject === "commerce").length,
                    data: [
                        keys,
                        questions,
                        snapshot.val(),
                        utmeQuestions.reverse()
                    ]
                })
            } else {
                console.log("No Utme Exam Questions Fetched Successfully")
                return response.status(200).json({
                    success: true,
                    message: "No Utme Exam Questions Fetched Successfully",
                    count: utmeQuestions.length,
                    data: [
                        [],
                        [],
                        {},
                        utmeQuestions
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
const addUtmeExamQuestion = (request, response) => {
    try {
        const { subject, status, data   } = request.body
        const object = {
            id: data.id ? data.id: "",
            question: data.question ? data.question: "",
            optionA: data.option.a ? data.option.a: "",
            optionB: data.option.b ? data.option.b: "",
            optionC: data.option.c ? data.option.c: "",
            optionD: data.option.d ? data.option.d: "",
            optionE: data.option.e ? data.option.e: "",
            answer: data.answer ? data.answer: "",
            status: status ? status: "",
            section: data.section ? data.section: "",
            subject: subject ? subject: "",
            image: data.image ? data.image: "",
            solution: data.solution ? data.solution: "",
            examType: data.examtype ? data.examtype : "",
            examYear: data.examyear ? data.examyear : ""
        }
        let utmeQuestions = []
        let exists = false
        console.log(object)
        // firebaseDatabase.ref("utmeQuestions").push(object, error => {
        //     if (error) {
        //         return response.status(500).json({
        //             success: false,
        //             error: "Add Utme Question Error",
        //             data: error
        //         })
        //     } else {
        //         return response.status(200).json({
        //             success: true,
        //             error: "Utme Question Added Successfully",
        //             data: object
        //         })
        //     }
        // })
    
        firebaseDatabase.ref("utmeQuestions").once("value", snapshot => {
            if (snapshot.val() !== null) {
                utmeQuestions =  []
                questions = Object.values(snapshot.val())
                keys = Object.keys(snapshot.val())

                for (let index = 0; index < questions.length; index++) {
                    utmeQuestions.push({
                        ...questions[index],
                        $key: keys[index]
                    })
                }

                for (let index = 0; index < utmeQuestions.length; index++) {
                    const question = utmeQuestions[index];
                    if (question.question.trim() === data.question.trim()) {
                        exists = true
                    }
                }

                if (!exists) {
                    firebaseDatabase.ref("utmeQuestions").push(object, error => {
                        if (error) {
                            return response.status(500).json({
                                success: false,
                                error: "Add Utme Question Error",
                                data: error
                            })
                        } else {
                            return response.status(200).json({
                                success: true,
                                message: "Utme Question Added Successfully",
                                count: [...utmeQuestions, object].length,
                                data: [...utmeQuestions, object]
                            })
                        }
                    })
                } else {
                    return response.status(500).json({
                        success: false,
                        error: "Utme Question Already Exist",
                        data: object
                    })
                }
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

// Test Area
const fetchUtmeQuestions = async (request, response) => {
    const { target, count } = request.body
    try {
        const utmeQuestionsHeaders = {
            "AccessToken": process.env.UTME_QUESTIONS_TOKEN
        }

        let errors = []
        let utmeQuestions = []
        let exists = false
        let index = 0

        while (!exists) {
            if (index < count) {
                const responseData = await axios({ url: `/api/v2/q?subject=${target}`, method: 'get', baseURL: process.env.UTME_QUESTIONS_BASEURL, headers: utmeQuestionsHeaders })
                const { subject, status, data   } = responseData.data
                const object = {
                    id: data.id ? data.id: "",
                    question: data.question ? data.question: "",
                    optionA: data.option.a ? data.option.a: "",
                    optionB: data.option.b ? data.option.b: "",
                    optionC: data.option.c ? data.option.c: "",
                    optionD: data.option.d ? data.option.d: "",
                    optionE: data.option.e ? data.option.e: "",
                    answer: data.answer ? data.answer: "",
                    status: status ? status: "",
                    section: data.section ? data.section: "",
                    subject: subject ? subject: "",
                    image: data.image ? data.image: "",
                    solution: data.solution ? data.solution: "",
                    examType: data.examtype ? data.examtype : "",
                    examYear: data.examyear ? data.examyear : ""
                }
                firebaseDatabase.ref("utmeQuestions").once("value", snapshot => {
                    if (snapshot.val() !== null) {
                        utmeQuestions =  []
                        questions = Object.values(snapshot.val())
                        keys = Object.keys(snapshot.val())

                        for (let index = 0; index < questions.length; index++) {
                            utmeQuestions.push({
                                ...questions[index],
                                $key: keys[index]
                            })
                        }

                        for (let index = 0; index < utmeQuestions.length; index++) {
                            const question = utmeQuestions[index];
                            if (question.question.trim() === data.question.trim()) {
                                exists = true
                            }
                        }

                        if (!exists) {
                            firebaseDatabase.ref("utmeQuestions").push(object, error => {
                                if (error) {
                                    errors.push({ error:  "Add Utme Question Error", data: error})
                                } else {
                                    utmeQuestions = [...utmeQuestions, object]
                                }
                            })
                        } else {
                            errors.push({ error:  "Utme Question Already Exist", data: object})
                        }
                    }
                })
            } else {
                break
            }
            index = index + 1
        }

        if (errors.length > 0) {
            return response.status(500).json({
                success: false,
                error: "Add Utme Encountered Error",
                count: errors.length,
                data: errors
            })
        } else {
            return response.status(200).json({
                success: true,
                message: `${count} Utme Questions Added Successfully`,
                count: utmeQuestions.length,
                data: utmeQuestions
            })
        }
    } catch (error) {
        console.log("Test Area Error", error)
        return response.status(500).json({ 
            success: false,
            error: "Test Area Error (Server Error)",
            data: error
        })
    }
}

// Add Exam Data
const addUtmeExamData = (request, response) => {
    const { id, examTime, username, answered, answers, completed, timeLimit, score, score1, score2, score3, score4, subject1, subject2, subject3, subject4 } = request.body

    const object = {
        id,
        examTime,
        username,
        answered,
        answers,
        completed,
        timeLimit,
		score,
        score1,
        score2,
        score3,
        score4,
        subject1,
        subject2,
        subject3,
        subject4
    }

    firebaseDatabase.ref("utmeExams").push(object, error => {
        if (error) {
            console.log("Add Exam Data Error", error)
            return response.status(500).json({ 
                success: false,
                error: "Add Exam Data Error"
            })
        } else {
            firebaseDatabase.ref("utmeExams").once("value", snapshot => {
                if (snapshot.val() !== null) {
                    utmeExams =  []
                    exams = Object.values(snapshot.val())
                    keys = Object.keys(snapshot.val())

                    for (let index = 0; index < exams.length; index++) {
                        utmeExams.push({
                            ...exams[index],
                            $key: keys[index]
                        })
                    }
                    const examData = utmeExams.filter(item => item.id === id)
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
                            score: 0,
                            score1: 0,
                            score2: 0,
                            score3: 0,
                            score4: 0,
                            subject1: null,
                            subject2: null,
                            subject3: null,
                            subject4: null
                        }
                    })
                }
            })
        }
    })
}

// Edit Exam Question
const editUtmeExamQuestion = (request, response) => {
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

    firebaseDatabase.ref(`utmeQuestions/${key}`).set(object, error => {
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
const editUtmeExamData = (request, response) => {
    const key = request.params.key
    const { id, examTime, username, answered, answers, completed, timeLimit, score, score1, score2, score3, score4, subject1, subject2, subject3, subject4 } = request.body

    const object = {
        id,
        examTime,
        username,
        answered,
        answers,
        completed,
        timeLimit,
		score,
		score1,
        score2,
        score3,
        score4,
        subject1,
        subject2,
        subject3,
        subject4
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
		score1,
        score2,
        score3,
        score4,
        subject1,
        subject2,
        subject3,
        subject4
    }

    firebaseDatabase.ref(`utmeExams/${key}`).set(object, error => {
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
const deleteUtmeExamQuestion = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`utmeQuestions/${key}`).remove(error => {
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
const deleteUtmeExamData = (request, response) => {
    const key = request.params.key

    firebaseDatabase.ref(`utmeExams/${key}`).remove(error => {
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
const deleteUtmeScore = (request, response) => {
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
const getUtmeScores = (request, response) => {
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
const addUtmeScore = (request, response) => {
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
const editUtmeScore = (request, response) => {
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
    getUtmeExamData,
    addUtmeExamQuestion,
    editUtmeExamQuestion,
    deleteUtmeExamQuestion,
    getUtmeExamQuestions,
    addUtmeExamData,
    deleteUtmeExamData,
    editUtmeExamData,
    fetchUtmeQuestions,
    deleteUtmeScore,
    getUtmeScores,
    addUtmeScore,
    editUtmeScore
}