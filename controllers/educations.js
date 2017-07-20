"use strict";

var getOptionRemove = require("../helpers").getOptionRemove;

const Education = require('../models/education.schema');

const PARAM_ID = global.constants.PARAM.PARAM_ID_EDUCATION;

/* Educations page. */
exports.educations = {};
exports.educations.get = function (req, res, next) {
    //TODO : Educations - Handle options
    Education
        .find({})
        .limit(req.options.pagination.limit)
        .skip(req.options.pagination.skip)
        .exec(function (err, educations) {
            if (err) return next(new DatabaseFindError());
            res.json({data: educations});
        });
};
exports.educations.post = function (req, res, next) {
    //TODO : Educations - Create education
    console.log("test");
    return next(new NotImplementedError('Create a new education'));
};

exports.educations.put = function (req, res, next) {
    //TODO : Educations - Add Bulk update
    return next(new NotImplementedError('Bulk update of educations'));
};

exports.educations.delete = function (req, res, next) {
    Education
        .remove()
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            return res.status(200).json({error: false, message: `${JSON.parse(removed).n} deleted`});
        });
};

/* Education page. */
exports.education = {};
exports.education.get = function (req, res, next) {
    Education
        .findById(req.params[PARAM_ID])
        .exec(function (err, education) {
            if (err) return next(new DatabaseFindError());
            res.json({data: education});
        });
};
exports.education.post = function (req, res, next) {
    return next(new NotFoundError());
};
exports.education.put = function (req, res, next) {
    //TODO : Education - Update education
    return next(new NotImplementedError("Update details of education " + req.params[PARAM_ID]));
};
exports.education.delete = function (req, res, next) {
    var optionRemove = getOptionRemove(req.params[PARAM_ID], req.decoded);

    Education
        .remove(optionRemove)
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            return res.status(200).json({error: false, message: `${JSON.parse(removed).n} deleted`});
        });
};