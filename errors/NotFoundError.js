"use strict";

const messages = require('../constants/messages');
const statuses = require('../constants/statuses');

module.exports = class NotFoundError extends require('./AppError') {
  constructor(message, status) {
    var _message = messages.MESSAGE_ERROR_NOT_FOUND;
    if (message) {
      _message = message = message + " " + messages.MESSAGE_ERROR_NOT_FOUND;
    }
    this.status = status || statuses.HTTP_STATUS_NOT_FOUND;
    super(_message, status);
  }
};