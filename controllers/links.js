"use strict";

var getFilterEditData = require("../helpers").getFilterEditData,
    getRoleRank = require("../helpers").getRoleRank,
    getPageCount = require("../helpers").getPageCount;

const Link = require('../models/link.schema');

/* Links page. */
exports.links = {};
exports.links.get = function (req, res, next) {
    Link
        .find(req.queryParsed.filter)
        .select(req.queryParsed.select)
        .limit(req.queryParsed.cursor.limit)
        .skip(req.queryParsed.cursor.skip)
        .sort(req.queryParsed.cursor.sort)
        .exec(function (err, links) {
            if (err) return next(new DatabaseFindError());
            if (!links || links.length <= 0) return next(new NotFoundError(MODEL_NAME_LINK));
            Link
                .count(req.queryParsed.filter)
                .exec(function (err, count) {
                    if (err) return next(new DatabaseCountError());
                    res.json(new SelectDocumentsResponse(links, count, getPageCount(count, req.queryParsed.cursor.limit)));
                });
        });
};

exports.links.post = function (req, res, next) {
    var link = req.body.data;
    if (getRoleRank(req.loggedUser.role) < getRoleRank(ROLE_ADMIN)) link.user = req.loggedUser._id;
    link = new Link(link);

    link.save(function (err, linkSaved) {
        if (err) return next(new DatabaseCreateError(err.message)());
        res.json(new CreateDocumentResponse(linkSaved));
    });
};

exports.links.put = function (req, res, next) {
    const links = req.body.data;
    var linksUpdated = [];
    Async.eachOf(links, function (link, key, callback) {
        const filterUpdate = getFilterEditData(link._id, req.loggedUser);
        Link
            .findOneAndUpdate(filterUpdate, link, {new: true}, function (err, linkUpdated) {
                if (err) return callback(err);
                if (linkUpdated) linksUpdated.push(linkUpdated);
                callback();
            });
    }, function (err) {
        if (err) return next(new DatabaseUpdateError());
        res.json(new UpdateDocumentsResponse(linksUpdated));
    });
};

exports.links.delete = function (req, res, next) {
    Link
        .remove()
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            res.json(new DeleteDocumentsResponse(JSON.parse(removed).n));
        });
};

/* Link page. */
exports.link = {};
exports.link.get = function (req, res, next) {
    Link
        .findById(req.params[PARAM_ID_LINK])
        .exec(function (err, link) {
            if (err) return next(new DatabaseFindError());
            if (!link) return next(new NotFoundError(MODEL_NAME_LINK));
            res.json(new SelectDocumentResponse(link));
        });
};

exports.link.put = function (req, res, next) {
    var filterUpdate = getFilterEditData(req.params[PARAM_ID_LINK], req.loggedUser);
    Link
        .findOneAndUpdate(filterUpdate, req.body.data, {new: true}, function (err, linkUpdated) {
            if (err) return next(new DatabaseUpdateError());
            if (!linkUpdated) return next(new NotFoundError(MODEL_NAME_LINK));
            res.json(new UpdateDocumentResponse(linkUpdated));
        });
};

exports.link.delete = function (req, res, next) {
    var filterRemove = getFilterEditData(req.params[PARAM_ID_LINK], req.loggedUser);
    Link
        .findOneAndRemove(filterRemove, function (err, linkDeleted) {
            if (err) return next(new DatabaseRemoveError());
            if (!linkDeleted) return next(new NotFoundError(MODEL_NAME_LINK));
            res.json(new DeleteDocumentResponse(linkDeleted));
        });
};