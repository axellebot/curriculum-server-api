"use strict";

// Constants
const parameters = require('@constants/parameters');
const paths = require('@constants/paths');

// Middlewares
const authenticate = require('@middlewares/security/authentication');
const requireBodyData = require('@middlewares/body/data');
const requireBodyDataArray = require('@middlewares/body/dataArray');
const requireBodyDataObject = require('@middlewares/body/dataObject');
const parseQuerySelection = require('@middlewares/selection');

// Controllers
const ctrlAuthentication = require('@controllers/authentication.controller.js');

module.exports = (router) => {
//   router.post(paths.PATH_REGISTER, ctrlAuthentication.register);
//   router.all(paths.PATH_LOGIN + paths.PATH_OAUTH + paths.PATH_TOKEN_REFRESH, ctrlAuthentication.refreshToken);
};