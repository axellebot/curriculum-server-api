"use strict";

var getFilterEditData = require("../helpers").getFilterEditData,
    getRoleRank = require("../helpers").getRoleRank,
    getPageCount = require("../helpers").getPageCount;

const Entry = require('../models/entry.schema');

/* Entrys page. */
exports.entries = {};
exports.entries.get = function (req, res, next) {
    Entry
        .find(req.queryParsed.filter)
        .select(req.queryParsed.select)
        .limit(req.queryParsed.cursor.limit)
        .skip(req.queryParsed.cursor.skip)
        .sort(req.queryParsed.cursor.sort)
        .exec(function (err, entries) {
            if (err) return next(new DatabaseFindError());
            if (!entries || entries.length <= 0) return next(new NotFoundError(MODEL_NAME_LANGUAGE));
            Entry
                .count(req.queryParsed.filter)
                .exec(function (err, count) {
                    if (err) return next(new DatabaseCountError());
                    res.json(new SelectDocumentsResponse(entries, count, getPageCount(count, req.queryParsed.cursor.limit)));
                });
        });
};

exports.entries.post = function (req, res, next) {
    var entry = req.body.data;
    if (getRoleRank(req.loggedUser.role) < getRoleRank(ROLE_ADMIN)) entry.user = req.loggedUser._id;
    entry = new Entry(entry);

    entry.save(function (err, entrySaved) {
        if (err) return next(new DatabaseCreateError(err.message)());
        res.json(new CreateDocumentResponse(entrySaved));
    });
};

exports.entries.put = function (req, res, next) {
    const entries = req.body.data;
    var entriesUpdated = [];
    Async.eachOf(entries, function (entry, key, callback) {
        const filterUpdate = getFilterEditData(entry._id, req.loggedUser);
        Entry
            .findOneAndUpdate(filterUpdate, entry, {new: true}, function (err, entryUpdated) {
                if (err) return callback(err);
                if (entryUpdated) entriesUpdated.push(entryUpdated);
                callback();
            });
    }, function (err) {
        if (err) return next(new DatabaseUpdateError());
        res.json(new UpdateDocumentsResponse(entriesUpdated));
    });
};

exports.entries.delete = function (req, res, next) {
    Entry
        .remove()
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            res.json(new DeleteDocumentsResponse(JSON.parse(removed).n));
        });
};

/* Entry page. */
exports.entry = {};
exports.entry.get = function (req, res, next) {
    Entry
        .findById(req.params[PARAM_ID_LANGUAGE])
        .exec(function (err, entry) {
            if (err) return next(new DatabaseFindError());
            if (!entry) return next(new NotFoundError(MODEL_NAME_LANGUAGE));
            res.json(new SelectDocumentResponse(entry));
        });
};

exports.entry.put = function (req, res, next) {
    var filterUpdate = getFilterEditData(req.params[PARAM_ID_LANGUAGE], req.loggedUser);
    Entry
        .findOneAndUpdate(filterUpdate, req.body.data, {new: true}, function (err, entryUpdated) {
            if (err) return next(new DatabaseUpdateError());
            if (!entryUpdated) return next(new NotFoundError(MODEL_NAME_LANGUAGE));
            res.json(new UpdateDocumentResponse(entryUpdated));
        });
};

exports.entry.delete = function (req, res, next) {
    var filterRemove = getFilterEditData(req.params[PARAM_ID_LANGUAGE], req.loggedUser);
    Entry
        .findOneAndRemove(filterRemove, function (err, entryDeleted) {
            if (err) return next(new DatabaseRemoveError());
            if (!entryDeleted) return next(new NotFoundError(MODEL_NAME_LANGUAGE));
            res.json(new DeleteDocumentResponse(entryDeleted));
        });
};