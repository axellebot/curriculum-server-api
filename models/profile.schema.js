"use strict";

var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        default: "",
    },
    subtitle: {
        type: String,
        default: ""
    },
    body: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: MODEL_NAME_PART
        }],
        default: []
    },
    user: {
        type: Schema.Types.ObjectId,
        default: null,
        required: true,
        ref: MODEL_NAME_USER
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(MODEL_NAME_PROFILE, ProfileSchema, COLLECTION_NAME_PROFILE);