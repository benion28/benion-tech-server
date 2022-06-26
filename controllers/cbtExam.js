const firebaseDatabase = require("../config/firebase")

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
                message: "Edit Exam Question Successfull"
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

module.exports = {
    getCbtExamData,
    addExamQuestion,
    editExamQuestion,
    deleteExamQuestion,
    getCbtExamQuestions
}