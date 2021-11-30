const {Item, Anchor} = require("../models");
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

    const {
        name,
        anchor,
        description,
        relativePos,
        trigger,
        destination,
        transition,
        type,
        endOn
    } = request.body;
    const itemTypes = ['audio', 'video', 'focus_highlight', 'image', 'fx', 'dialog', 'youtube']

    if (type == undefined) {
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            msg: "Item type is required"
        })
    } else {
        const validItemType = itemTypes.find(element => element === type);
        if (!validItemType) {
            response.status(statusCodes.BAD_REQUEST).send({
                err_code: statusCodes.BAD_REQUEST,
                msg: "Item type is not valid"
            })
        }
    }
    const session = await db.startSession();

    const responses = {};

    const item = Item()
    item.type = type;

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {

        const transactionResults = await session.withTransaction(async () => {

            responses['item'] = createdItem
        }, transactionOptions)

        if (transactionResults) {

            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {

        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this item",
            internalError: err
        })

    } finally {
        session.endSession();
    }
}
const getItemById = async function (request, response) {
    try {
        item = await Item.findById({_id: request.params.id})
        if (item) {
            response.status(statusCodes.OK).send({err_code: 0, item})

        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: statusCodes.NOT_FOUND,
                item: {},
                message: "This item does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch item",
            internalError: error
        })
    }
}
const updateItemById = async function (request, response) {


                } else {
                    response.status(200).send({err_code: 0, "message": "This item does not exist"})
                }
            }, transactionOptions)
            if (transactionResults) {
                responses['err_code'] = 0
                response.status(statusCodes.OK).send(responses)
            } else {
                console.error("The transaction was intentionally aborted.");
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Could not update this item"
                })
            }
        } catch (err) {
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to update this item",
                internalError: err

            })
            console.error("The transaction was aborted due to an unexpected error: " + err);
        } finally {
            session.endSession();
        }
    }
}

        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This item does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this item",
            internalError: error
        })
    }
}
module.exports = {
    createItem, getItemById, updateItemById, deleteItemById
}



