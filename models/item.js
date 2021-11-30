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
        type: Array,
        default: []
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
    loop: {
        type: Boolean,

    },
    createdBy: {type: ObjectId},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},


});

const Item = new model("Item", itemSchema);

module.exports = Item;
