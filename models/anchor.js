const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId

const anchorSchema = new Schema({

    name: {
        type: String,

    },
    templates: {
        type: Array,
    },
    anchorFunction: {
        type: String,
        default: "or"
    },
    cvMatchValue: {
        type: Number,

    },
    cvCanvas: {
        type: Number,
        default: 50
    },
    cvDelay: {
        type: Number,
        default: 100
    },
    cvGrayscale: {
        type: Boolean,
        default: true
    },
    cvApplyThreshold: {
        type: Boolean,
        default: false
    },
    cvThreshold: {
        type: Number,
        default: 127
    },
    createdBy: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},


});

const Anchor = new model("Anchor", anchorSchema);

module.exports = Anchor;
