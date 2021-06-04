const mongoose = require("mongoose");
const Joi = require("joi");
const {random} = require("lodash")

const appartmentSchema = new mongoose.Schema({
    hostName: String,
    appartmentDesc: String,
    location: String,
    extras: Array,
    img: String,
    perNight: Number,
    propertyNumber: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user_id: String
});

exports.AppartmentModel = mongoose.model("appartments", appartmentSchema);

exports.validAppartment = (_dataBody) => {
    const schemaJoi = Joi.object({
        hostName: Joi.string().min(2).max(30).required(),
        appartmentDesc: Joi.string().min(2).max(70).required(),
        location: Joi.string().min(2).max(70).required(),
        extras: Joi.array().items(Joi.string(), Joi.any().strip()),
        img: Joi.string().min(2).max(200).optional().allow(''),
        perNight: Joi.number().min(2).max(500).required()
    })
    return schemaJoi.validate(_dataBody)
}

exports.genRandNumber = async (AppartmentModel) => {
    let randomNumber = random(1, 999999);
    let appartment = await AppartmentModel.findOne({
        propertyNumber: randomNumber
    });
    if (!appartment) {
        return randomNumber;
    }
}