const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId
const enumType = {
    values: ['focus_highlight', 'audio', 'video', 'image', 'dialogue']
    , message: 'Type must have value of focus_highlight, audio, video or dialogue.'
}
const enumFocus = {
    values: ['Mouse Point', 'Rectangle', 'Area Highlight']
    , message: 'Type must have value of Mouse Point, Rectangle or Area Highlight.'
}

const itemSchema = new Schema({


    },
    anchor: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    },
    focus: {
        type: String,
        enum: enumFocus,
        required: [
            function (value) {
                if (this.type === 'video') {
                    return true;
                } else {
                    return false;
                }
            },"You must provide a Focus Value for a video item"
        ]
    },
    relativePos: {
        vertical: {
            type: Number,

    },
    effect: {
        type: String,
    },
    showPopup: {
        type: Boolean,
    },
    url: {
        type: String,
    },
    text: {
        type: String,
    },
    focus: {
        type: String,
    },
    fullScreen: {
        type: Boolean,
    },
    loop: {
        type: Boolean,

    },
    parameters: {
        type: Object,
        default: {}
    },
    endOn: {
        type: Array,
        default: []
    },
    source: {
        type: String,
        default: ''
    },
    muted: {
        type: Boolean,
        default: false

    },
    createdBy: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},


}, {minimize: false});

const Item = new model("Item", itemSchema);


module.exports = Item;
