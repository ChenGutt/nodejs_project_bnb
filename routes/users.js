const express = require("express");
const bcrypt = require("bcrypt");
const {
    AppartmentModel,
    validAppartment,
    genRandNumber
} = require("../models/appartmentModel")
const {
    pick,
    random
} = require("lodash")

const {
    validUser,
    UserModel,
    validLogin,
    genToken,
    validFavotires
} = require("../models/userModel");
const {
    auth
} = require("../middlewares/auth");
const {
    route
} = require(".");

const router = express.Router();


router.get("/", (req, res) => {
    res.json({
        msg: "Users Route"
    })
})

router.post("/signup", async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        res.status(201).json(pick(user, ["name", "email", "_id", "createdAt"]));
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(401).json({
                msg: "user not found!"
            })
        }
        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                msg: "password not match!"
            });
        }
        let newToken = genToken(user._id);
        res.status(201).json({
            token: newToken
        })
    } catch (err) {
        console.log(err)
            res.status(400).json(err)
    }
})


router.get("/userinfo", auth, async (req, res) => {
    try {
        let user = await UserModel.findOne({
            _id: req.tokenData._id
        }, req.body);
        res.status(201).json(pick(user, ["name", "email", "_id", "createdAt"]));
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

//router not in use

// router.get("/addFavotires", (req, res) => {
//     res.json({
//         msg: "its working"
//     })
// })

// router.patch("/addFavotires", auth, async (req, res) => {
//     let validBody = validFavotires(req.body);
//     if (validBody.error) {
//         return res.status(400).json(validBody.error.details);
//     }
//     try {
//         let user = await UserModel.updateOne({
//             _id: req.tokenData._id
//         }, req.body);
//         res.json(user)
//     } catch (err) {
//         console.log(err)
//         res.status(400).json(err)
//     }

// })


// router.get("/yourfavs", auth, async (req, res) => {
//     try {
//         let user = await UserModel.findOne({
//             _id: req.tokenData._id
//         });
//         let fav_ar = user.favorites;
//         let userFavs = await AppartmentModel.find({
//             propertyNumber: {
//                 $in: fav_ar
//             }
//         });
//         res.json(userFavs)
//     } catch (err) {
//         console.log(err)
//         res.status(400).json(err)
//     }
// })


module.exports = router;