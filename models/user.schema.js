"use strict";

// Constants
const messages = require('../constants/messages');
const statuses = require('../constants/statuses');
const models = require('../constants/models');
const collections = require('../constants/collections');
const roles = require('../constants/roles');
const parameters = require('../constants/parameters');

// Helpers
var saltPassword = require('../helpers').saltPassword;
var verifyPassword = require('../helpers').verifyPassword;

var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================

var UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstName: {
    type: String,
    default: "",
    required: true
  },
  lastName: {
    type: String,
    default: "",
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [roles.ROLE_MEMBER, roles.ROLE_ADMIN],
    default: roles.ROLE_MEMBER,
    required: true
  }
}, {
  timestamps: true
});

//= ===============================
// User ORM Methods
//= ===============================

//add middleware to salt password
UserSchema.pre('save', saltPassword);
//add middleware to verify the password
UserSchema.methods.verifyPassword = verifyPassword;

module.exports = mongoose.model(models.MODEL_NAME_USER, UserSchema, collections.COLLECTION_NAME_USER);