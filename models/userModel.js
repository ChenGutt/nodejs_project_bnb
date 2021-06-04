const mongoose = require("mongoose");
const Joi = require("joi");
const {
  config
} = require("../config/secData")
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  biz: Boolean,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  favorites: Array,
});

exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (_userId) => {
  let token = jwt.sign({
    _id: _userId
  }, config.secretJwt, {
    expiresIn: "60mins"
  });
  return token;
}

exports.validUser = (_dataBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(2).max(99).required()
  })

  return joiSchema.validate(_dataBody)
}

exports.validLogin = (_dataBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(2).max(99).required()
  })

  return joiSchema.validate(_dataBody)
}

exports.validFavotires = (_ar) => {
  let joiSchema = Joi.object({
    favorites: Joi.array().min(1).required()
  })
  return joiSchema.validate(_ar)
}