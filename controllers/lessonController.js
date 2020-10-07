const { Lesson, Skill } = require("../models")
const { ERR_STATUS, ERR_CODE, Lesson_Sort } = require("../constants/constant")

const fileupload = require("../utilities/upload")
const path = require('path')
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createLesson = async function (request, response) {
    const {
        subject,
        icon,
        name,
        shortDescription,
        description,
        cost,
        difficulty,
        medias,
        skills,
        visibility,
        entry,
        setupScreenshots,
        setupInstructions,
        setupFiles,
    } = request.body;

    // Name should be atleast 4 character
    if (name.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Name should be atleast 4 character"
        })
    }
    if (description.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Description should be atleast 4 character"
        })
    }
    // Short description should be atleast 4 character
    if (shortDescription.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Short description should be atleast 4 character"
        })
    }
    // Icon url should be atleast 4 character
    if (icon.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Icon url should be atleast 4 character"
        })
    }
    // atleast one media file is required
    if (medias.length == 0) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Atleast one media is required"
        })
    }

    const session = await db.startSession();
    const responses = {};

    var lesson = Lesson()
    lesson.subject = subject
    lesson.icon = icon
    lesson.name = name
    lesson.shortDescription = shortDescription
    lesson.description = description
    lesson.cost = cost
    lesson.difficulty = difficulty
    lesson.medias = medias
    lesson.skills = skills
    lesson.visibility = visibility
    lesson.entry = entry
    lesson.setupScreenshots = setupScreenshots
    lesson.setupInstructions = setupInstructions
    lesson.setupFiles = setupFiles
    lesson.rating = 0
    lesson.chapters = []
    lesson.createdBy = request.user._id

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            // save collection document
            const createdLesson = await lesson.save({ session })
            responses['lesson'] = createdLesson

            for (var i = 0; i < skills.length; i++) {
                const skillName = skills[i]
                result = await Skill.findOne({ name: skillName })
                if (result) {
                } else {
                    var skill = Skill()
                    skill.name = skills[i]
                    createdSkills = await skill.save({ session })
                }
            }
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)

        } else {
            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this lesson"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this lesson",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const updateLesson = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {

        var lessonUpdated = false
        var newSkillAdded = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

<<<<<<< HEAD
            const currentLesson = await Lesson.findById({ _id: request.body.lesson_id, session })
            if (currentLesson) {
=======
                        // save steps to Step table
                        var totalSteps = []
                        for (var i = 0; i < steps.length; i++) {
                            if (steps[i]._id) {
                                totalSteps.push(steps[i]._id)
                                const stepData = steps[i]
                                if (steps[i].name != null) {
                                    Step.findById(steps[i]._id, async function (err, step) {
                                        if (err == null && step) {
                                            step.images = stepData.images
                                            step.functions = stepData.functions
                                            step.name = stepData.name
                                            step.trigger = stepData.trigger
                                            step.description = stepData.description
                                            step.next = stepData.next
                                            step.createdBy = request.user._id
                                            step.cvMatchValue = stepData.cvMatchValue
                                            step.cvCanvas = stepData.cvCanvas
                                            step.cvDelay = stepData.cvDelay
                                            step.cvGrayscale = stepData.cvGrayscale,
                                                step.cvApplyThreshold = stepData.cvApplyThreshold,
                                                step.cvThreshold = stepData.cvApplyThreshold
                                            step.save()
                                        }
                                    })
                                }
                            } else {
                                var step = Step()
                                step.images = steps[i].images
                                step.functions = steps[i].functions
                                step.name = steps[i].name
                                step.trigger = steps[i].trigger
                                step.description = steps[i].description
                                step.next = steps[i].next
                                step.createdBy = request.user._id
                                step.cvMatchValue = steps[i].cvMatchValue
                                step.cvCanvas = steps[i].cvCanvas
                                step.cvDelay = steps[i].cvDelay
                                step.cvGrayscale = steps[i].cvGrayscale,
                                    step.cvApplyThreshold = steps[i].cvApplyThreshold,
                                    step.cvThreshold = steps[i].cvApplyThreshold
                                await step.save()
                                totalSteps.push(step._id)
                            }
                        }
>>>>>>> 622ceef... redis mechanism on hold

                currentLesson.icon = request.body.icon ? request.body.icon : currentLesson.icon
                currentLesson.name = request.body.name ? request.body.name : currentLesson.name
                currentLesson.subject = request.body.subject ? request.body.subject : currentLesson.subject
                currentLesson.shortDescription = request.body.shortDescription ? request.body.shortDescription : currentLesson.shortDescription
                currentLesson.description = request.body.description ? request.body.description : currentLesson.description
                currentLesson.cost = request.body.cost ? request.body.cost : currentLesson.cost
                currentLesson.skills = request.body.skills ? request.body.skills : currentLesson.skills
                currentLesson.difficulty = request.body.difficulty ? request.body.difficulty : currentLesson.difficulty
                currentLesson.medias = request.body.medias ? request.body.medias : currentLesson.medias
                currentLesson.visibility = request.body.visibility ? request.body.visibility : currentLesson.visibility
                currentLesson.entry = request.body.entry ? request.body.entry : currentLesson.entry
                currentLesson.setupScreenshots = request.body.setupScreenshots ? request.body.setupScreenshots : currentLesson.setupScreenshots
                currentLesson.setupInstructions = request.body.setupInstructions ? request.body.setupInstructions : currentLesson.setupInstructions
                currentLesson.setupFiles = request.body.setupFiles ? request.body.setupFiles : currentLesson.setupFiles
                currentLesson.rating = request.body.rating ? request.body.rating : currentLesson.rating
                currentLesson.chapters = request.body.chapters ? request.body.chapters : currentLesson.chapters
                currentLesson.updatedAt = new Date()

                updatedLesson = await currentLesson.save({ session })
                if (updatedLesson) {
                    lessonUpdated = true
                    responses['lesson'] = updatedLesson
                    if (request.body.skills) {
                        skills = request.body.skills
                        for (var i = 0; i < skills.length; i++) {
                            const skillName = skills[i]
                            result = await Skill.findOne({ name: skillName })

                            if (result) {
                            } else {
                                var skill = Skill()
                                skill.name = skills[i]
                                createdSkills = await skill.save({ session })
                                if (createdSkills) {
                                    newSkillAdded = true
                                }
                            }
                        }
                    }
                }
                else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not update this lesson" })
                }
            }
            else {
                response.status(200).send({ err_code: 0, "message": "This lesson does not exist" })
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            if (newSkillAdded) {
                responses['message'] = "New Skills were added"
            }
            response.status(statusCodes.OK).send(responses)
        } else {

            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not update this lesson" })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this lesson",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const searchLesson = function (request, response) {
    var {
        query,
        sort,
        fields,
    } = request.body;

    var sortField = { "name": 1 }
    var difficulty = 0
    if (sort == null) {
        sort = Lesson_Sort.Newest
    }

    switch (sort) {
        case Lesson_Sort.Newest:
            sortField = { "createdAt": -1 }
            break
        case Lesson_Sort.Oldest:
            sortField = { "createdAt": 1 }
            break
        case Lesson_Sort.Highest_Avg:
            sortField = { "rating": -1 }
            break
        case Lesson_Sort.Lowest_Avg:
            sortField = { "rating": 1 }
            break
        case Lesson_Sort.Intro:
            difficulty = Difficulty.Intro
            break
        case Lesson_Sort.Beginner:
            difficulty = Difficulty.Beginner
            break
        case Lesson_Sort.Intermediate:
            difficulty = Difficulty.Intermediate
            break
        case Lesson_Sort.Advanced:
            difficulty = Difficulty.Advanced
            break
    }

    var condition = {}
    if (query && query != "") {
        condition["name"] = { $regex: query, $options: 'i' }
    }
    if (difficulty) {
        condition["difficulty"] = difficulty
    }

    if (fields == null || fields == "") {
        fields = 'name shortDescription icon medias rating createdAt'
    }

    Lesson.find(condition, fields, { sort: sortField }).limit(100).find(function (err, lessons) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                lessons
            });
        }
    });
}
const deleteLessonById = async function (request, response) {
    try {
        lessons = await Lesson.findOne({ _id: request.params.id })
        if (lessons) {
            deletedLesson = await Lesson.deleteOne({ _id: request.params.id })
            if (deletedChapter) {
                response.status(statusCodes.OK).send({ err_code: 0, message: "The lesson was deleted successfully" })
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: 0, message: "Could not delete this lesson" })
            }

        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: 0, message: "This lesson does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not delete this lesson", internalError: error })
    }

}
const addChapterToLesson = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    responses = {}
    try {

        var chapterExistFlag = false
        const transactionResults = await session.withTransaction(async () => {

            const currentLesson = await Lesson.findById({ _id: request.body.lesson_id, session })
            if (currentLesson) {
                chapter = request.body.chapter_id
                const chapterExist = currentLesson.chapters.find(element => element === request.body.chapter_id);

                if (chapterExist) {
                    chapterExistFlag = true
                    session.endSession()
                    return
                }
                else {
                    currentLesson.chapters = currentLesson.chapters.concat(chapter)
                    updatedLesson = await currentLesson.save({ session });
                    if (updatedLesson) {
                        responses['lesson'] = updatedLesson
                    }
                }
            }
            else {
                response.status(200).send({ err_code: 0, "message": "This lesson does not exist" })
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)
        } else {
            if (chapterExistFlag) {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "This chapter already added to this lesson"

                })
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Sorry we were not able to update this lesson"
                })
            }
            console.error("The transaction was intentionally aborted.");
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this lesson",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
module.exports = {
    createLesson,
    updateLesson,
    searchLesson,
    addChapterToLesson,
    deleteLessonById
} 
