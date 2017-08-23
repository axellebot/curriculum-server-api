"use strict";

var getFilterEditData = require("../helpers").getFilterEditData,
    getRoleRank = require("../helpers").getRoleRank,
    getPageCount = require("../helpers").getPageCount;

const Interest = require('../models/interest.schema');

/* Interests page. */
exports.interests = {};
exports.interests.get = function (req, res, next) {
    Interest
        .find(req.queryParsed.filter)
        .select(req.queryParsed.select)
        .limit(req.queryParsed.cursor.limit)
        .skip(req.queryParsed.cursor.skip)
        .sort(req.queryParsed.cursor.sort)
        .exec(function (err, interests) {
            if (err) return next(new DatabaseFindError());
            if (!interests || interests.length <= 0) return next(new NotFoundError(MODEL_NAME_INTEREST));
            Interest
                .count(req.queryParsed.filter)
                .exec(function (err, count) {
                    if (err) return next(new DatabaseCountError());
                    res.json(new SelectDocumentsResponse(interests, count, getPageCount(count, req.queryParsed.cursor.limit)));
                });
        });
};

exports.interests.post = function (req, res, next) {
    var interest = req.body.data;
    if (getRoleRank(req.loggedUser.role) < getRoleRank(ROLE_ADMIN)) interest.user = req.loggedUser._id;
    interest = new Interest(interest);

    interest.save(function (err, interestSaved) {
        if (err) return next(new DatabaseCreateError(err.message)());
        res.json(new CreateDocumentResponse(interestSaved));
    });
};

exports.interests.put = function (req, res, next) {
    const interests = req.body.data;
    var interestsUpdated = [];
    Async.eachOf(interests, function (interest, key, callback) {
        const filterUpdate = getFilterEditData(interest._id, req.loggedUser);
        Interest
            .findOneAndUpdate(filterUpdate, interest, {new: true}, function (err, interestUpdated) {
                if (err) return callback(err);
                if (interestUpdated) interestsUpdated.push(interestUpdated);
                callback();
            });
    }, function (err) {
        if (err) return next(new DatabaseUpdateError());
        res.json(new UpdateDocumentsResponse(interestsUpdated));
    });
};

exports.interests.delete = function (req, res, next) {
    Interest
        .remove()
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            res.json(new DeleteDocumentsResponse(JSON.parse(removed).n));
        });
};

/* Interest page. */
exports.interest = {};
exports.interest.get = function (req, res, next) {
    Interest
        .findById(req.params[PARAM_ID_INTEREST])
        .exec(function (err, interest) {
            if (err) return next(new DatabaseFindError());
            if (!interest) return next(new NotFoundError(MODEL_NAME_INTEREST));
            res.json(new SelectDocumentResponse(interest));
        });
};

exports.interest.put = function (req, res, next) {
    var filterUpdate = getFilterEditData(req.params[PARAM_ID_INTEREST], req.loggedUser);
    Interest
        .findOneAndUpdate(filterUpdate, req.body.data, {new: true}, function (err, interestUpdated) {
            if (err) return next(new DatabaseUpdateError());
            if (!interestUpdated) return next(new NotFoundError(MODEL_NAME_INTEREST));
            res.json(new UpdateDocumentResponse(interestUpdated));
        });
};

exports.interest.delete = function (req, res, next) {
    var filterRemove = getFilterEditData(req.params[PARAM_ID_INTEREST], req.loggedUser);
    Interest
        .findOneAndRemove(filterRemove, function (err, interestDeleted) {
            if (err) return next(new DatabaseRemoveError());
            if (!interestDeleted) return next(new NotFoundError(MODEL_NAME_INTEREST));
            res.json(new DeleteDocumentResponse(interestDeleted));
        });
};