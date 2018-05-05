"use strict";

var getFilterEditData = require("../helpers").getFilterEditData,
    getRoleRank = require("../helpers").getRoleRank,
    getPageCount = require("../helpers").getPageCount;

const Part = require('../models/part.schema');

/* Entities page. */
exports.parts = {};
exports.parts.get = function (req, res, next) {
    Part
        .find(req.queryParsed.filter)
        .select(req.queryParsed.select)
        .limit(req.queryParsed.cursor.limit)
        .skip(req.queryParsed.cursor.skip)
        .sort(req.queryParsed.cursor.sort)
        .exec(function (err, parts) {
            if (err) return next(new DatabaseFindError());
            if (!parts || parts.length <= 0) return next(new NotFoundError(MODEL_NAME_ENTITY));
            Part
                .count(req.queryParsed.filter)
                .exec(function (err, count) {
                    if (err) return next(new DatabaseCountError());
                    res.json(new SelectDocumentsResponse(parts, count, getPageCount(count, req.queryParsed.cursor.limit)));
                });
        });
};

exports.parts.post = function (req, res, next) {
    var part = req.body.data;
    if (getRoleRank(req.loggedUser.role) < getRoleRank(ROLE_ADMIN)) part.user = req.loggedUser._id;
    part = new Part(part);

    part.save(function (err, partSaved) {
        if (err) return next(new DatabaseCreateError(err.message)());
        res.json(new CreateDocumentResponse(partSaved));
    });
};

exports.parts.put = function (req, res, next) {
    const parts = req.body.data;
    var partsUpdated = [];
    Async.eachOf(parts, function (part, key, callback) {
        const filterUpdate = getFilterEditData(part._id, req.loggedUser);
        Part
            .findOneAndUpdate(filterUpdate, part, {new: true}, function (err, partUpdated) {
                if (err) return callback(err);
                if (partUpdated) partsUpdated.push(partUpdated);
                callback();
            });
    }, function (err) {
        if (err) return next(new DatabaseUpdateError());
        res.json(new UpdateDocumentsResponse(partsUpdated));
    });
};

exports.parts.delete = function (req, res, next) {
    Part
        .remove()
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            res.json(new DeleteDocumentsResponse(JSON.parse(removed).n));
        });
};

/* Part page. */
exports.part = {};
exports.part.get = function (req, res, next) {
    Part
        .findById(req.params[PARAM_ID_ENTITY])
        .exec(function (err, part) {
            if (err) return next(new DatabaseFindError());
            if (!part) return next(new NotFoundError(MODEL_NAME_ENTITY));
            res.json(new SelectDocumentResponse(part));
        });
};

exports.part.put = function (req, res, next) {
    const filterUpdate = getFilterEditData(req.params[PARAM_ID_ENTITY], req.loggedUser);
    Part
        .findOneAndUpdate(filterUpdate, req.body.data, {new: true}, function (err, partUpdated) {
            if (err) return next(new DatabaseUpdateError());
            if (!partUpdated) return next(new NotFoundError(MODEL_NAME_ENTITY));
            res.json(new UpdateDocumentResponse(partUpdated));
        });
};

exports.part.delete = function (req, res, next) {
    const filterRemove = getFilterEditData(req.params[PARAM_ID_ENTITY], req.loggedUser);
    Part
        .findOneAndRemove(filterRemove, function (err, partDeleted) {
            if (err) return next(new DatabaseRemoveError());
            if (!partDeleted) return next(new NotFoundError(MODEL_NAME_ENTITY));
            res.json(new DeleteDocumentResponse(partDeleted));
        });
};