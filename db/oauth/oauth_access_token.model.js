"use strict";

// Others
const config = require('@config');
const mongoose = require('@mongoose');
const models = require('@constants/models');
const utils = require('@utils');

// Create Schema
var Schema = mongoose.Schema;

var OAuthAccessTokenSchema = new Schema({
  token: {
    type: String,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  scopes: {
    type: [String],
    required: true,
    default: []
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: models.MODEL_NAME_USER,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: models.MODEL_NAME_OAUTH_CLIENT,
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

OAuthAccessTokenSchema.methods.isExpired = async function(){
  return Date.now() > this.expires
}

module.exports = mongoose.model(models.MODEL_NAME_OAUTH_ACCESS_TOKEN, OAuthAccessTokenSchema, "oauthAccessTokens");