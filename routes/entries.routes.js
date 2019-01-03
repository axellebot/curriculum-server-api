"use strict";

// Constants
const parameters = require('@constants/parameters');
const paths = require('@constants/paths');
const perms = require('@constants/permissions');

// Middlewares
const hasPerms = require('@middlewares/security/RBAC');
const requireAuthentication = require('@middlewares/security/authentication');
const requireBodyData = require('@middlewares/body/data');
const requireBodyDataArray = require('@middlewares/body/dataArray');
const requireBodyDataObject = require('@middlewares/body/dataObject');
const parseQuerySelection = require('@middlewares/selection');

// Controllers
const ctrlEntries = require('@controllers/entries.controller.js');

module.exports = (router) => {
  router.get('/', requireAuthentication.user({
    scope: "entries:read"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_READ), parseQuerySelection, ctrlEntries.findMany);
  router.post('/', requireAuthentication.user({
    scope: "entries:write"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_CREATE), requireBodyDataObject, ctrlEntries.createOne);
  router.put('/', requireAuthentication.user({
    scope: "entries:write"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_UPDATE), requireBodyDataArray, ctrlEntries.updateMany);
  router.delete('/', requireAuthentication.user({
    scope: "entries:delete"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_DELETE), ctrlEntries.deleteAll);

  router.get('/' + ':' + parameters.PARAM_ID_ENTRY, requireAuthentication.user({
    scope: "entries:read"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_READ), ctrlEntries.findOne);
  router.put('/' + ':' + parameters.PARAM_ID_ENTRY, requireAuthentication.user({
    scope: "entries:write"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_UPDATE), requireBodyDataObject, ctrlEntries.updateOne);
  router.delete('/' + ':' + parameters.PARAM_ID_ENTRY, requireAuthentication.user({
    scope: "entries:delete"
  }), hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_ACTION_DELETE), ctrlEntries.deleteOne);
};