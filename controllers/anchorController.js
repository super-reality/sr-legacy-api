const {Anchor} = require("../models");

const {ERR_STATUS, ERR_CODE} = require("../constants/constant")
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createAnchor = async function (request, response) {
console.log(request)
    const {
        name,
        type,
        templates,
        anchorFunction,
        cvMatchValue,
        cvCanvas,
        cvDelay,
        cvGrayscale,
        cvApplyThreshold,
        cvThreshold,
        createdBy,
        createdAt,
        updatedAt,
    } = request.body;

    const anchorTypes = ['record', 'crop', 'url']

    if (type == undefined) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            msg: "Anchor type is required"
        })
    } else {
        const validItemType = anchorTypes.find(element => element === type);
        if (!validItemType) {
            response.status(statusCodes.BAD_REQUEST).send({
                err_code: statusCodes.BAD_REQUEST,
                msg: "Anchor type is not valid"
            })
        }
    }
    const session = await db.startSession();
    const responses = {};
    var anchor = Anchor()
    anchor.name = name
    anchor.type = type
    anchor.templates = templates ? templates : []
    anchor.anchorFunction = anchorFunction ? anchorFunction : anchor.anchorFunction
    anchor.cvMatchValue = cvMatchValue ? cvMatchValue : anchor.cvMatchValue
    anchor.cvCanvas = cvCanvas ? cvCanvas : anchor.cvCanvas
    anchor.cvDelay = cvDelay ? cvDelay : anchor.cvDelay
    anchor.cvGrayscale = cvGrayscale ? cvGrayscale : anchor.cvGrayscale
    anchor.cvApplyThreshold = cvApplyThreshold ? cvApplyThreshold : anchor.cvApplyThreshold
    anchor.cvThreshold = cvThreshold ? cvThreshold : anchor.cvThreshold
    anchor.createdBy = createdBy
    anchor.createdAt = new Date()
    anchor.updatedAt = new Date()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            const createdAnchor = await anchor.save({session})
            responses['anchor'] = createdAnchor
        }, transactionOptions)

        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {

            console.message("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this anchor"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: err,
            internalError: err
        })
    } finally {
        session.endSession();
    }
}
const getAnchorById = async function (request, response) {
    try {
        anchor = await Anchor.findById({ _id: request.params.id })
        if (anchor) {
            response.status(statusCodes.OK).send({ err_code: 0, anchor })
        }
        else {
            response.status(statusCodes.NOT_FOUND).send({ err_code: statusCodes.NOT_FOUND, chapters: {}, message: "This anchor does not exist" })
        }
    }
    catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({ err_code: statusCodes.INTERNAL_SERVER_ERROR, message: "Could not fetch anchor", internalError: error })
    }
}
const updateAnchorById = async function (request, response) {
    const {
        name,
        anchor_id,
        type,
        templates,
        anchorFunction,
        cvMatchValue,
        cvCanvas,
        cvDelay,
        cvGrayscale,
        cvApplyThreshold,
        cvThreshold,
    } = request.body;

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        var anchorUpdated = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentAnchor = await Anchor.findById({_id: anchor_id, session})
            if (currentAnchor) {
                currentAnchor.name = name ? name : currentAnchor.name
                currentAnchor.type = type ? type : currentAnchor.type
                currentAnchor.templates = templates ? templates : currentAnchor.templates
                currentAnchor.anchorFunction = anchorFunction ? anchorFunction : currentAnchor.anchorFunction
                currentAnchor.cvMatchValue = cvMatchValue ? cvMatchValue : currentAnchor.cvMatchValue
                currentAnchor.cvCanvas = cvCanvas ? cvCanvas : currentAnchor.cvCanvas
                currentAnchor.cvDelay = cvDelay ? cvDelay : currentAnchor.cvDelay
                currentAnchor.cvGrayscale = cvGrayscale
                currentAnchor.cvApplyThreshold = cvApplyThreshold
                currentAnchor.cvThreshold = cvThreshold ? cvThreshold : currentAnchor.cvThreshold
                currentAnchor.updatedAt = new Date()

                updatedAnchor = await currentAnchor.save({session})
                if (updatedAnchor) {
                    anchorUpdated = true
                    responses['anchor'] = updatedAnchor
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this anchor"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({
                    err_code: statusCodes.NOT_FOUND,
                    "message": "This anchor does not exist"
                })
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)
        } else {

            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Could not update this anchor"
            })

        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this anchor",
            internalError: err
        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const deleteAnchor = function (request, response) {
    const {Id} = request.params;
    Anchor.deleteOne({_id: Id}, function (err) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                msg: "Anchor deleted successfully"
            });
        }
    });
}

module.exports = {
    createAnchor, getAnchorById, updateAnchorById, deleteAnchor
}

















