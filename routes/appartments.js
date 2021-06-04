const express = require("express");
const {
    AppartmentModel,
    validAppartment,
    genRandNumber
} = require("../models/appartmentModel")
const {
    pick
} = require("lodash")

const {
    auth
} = require("../middlewares/auth");
const {
    route
} = require(".");

const router = express.Router();

// router.get("/", (req, res) => {
//     res.json({
//         GET: "endpoint - 'http://localhost:3000/appartments/api'",
//         POSTsignup: "users/signup - requires Name, Email and Password",
//         POSTlogin: "users/login - requires Email and Password",
//         POSTaddnew: "/addnew - Add your own property to our site. Must be logged in",
//         PUT: "/{idEdit} - edit property's info by user id",
//         DELETE: "/{idDel} - delete property by user id"

//     })
// })

// router.get("/", async (req, res) => {
//     let pageNum = (req.query.pageNum) ? Number(req.query.pageNum) : 0;
//     let perPage = (req.query.perPage) ? Number(req.query.perPage) : 3;
//     let sort = (req.query.sort) ? req.query.sort : "perNight";
//     let reverse = (req.query.reverse == "yes") ? 1 : -1;
//     try {
//         let data = {};
//         data.total = await AppartmentModel.countDocuments();
//         data.results = await AppartmentModel.find({})
//             .sort({
//                 [sort]: reverse
//             })
//             .limit(perPage)
//             .skip(pageNum * perPage)

//         res.json(data)
//     }catch(err){
//         console.log(err);
//          res.json(err)
//     }


// })

router.get("/", async (req, res) => {
    let pageNum = (req.query.pageNum) ? Number(req.query.pageNum) : 0;
    let perPage = (req.query.perPage) ? Number(req.query.perPage) : 3;
    let sort = (req.query.sort) ? req.query.sort : "perNight";
    let q = (req.query.q) ? req.query.q : "";
    let qReg = new RegExp(q, "i");
    let reverse = (req.query.reverse == "yes") ? 1 : -1;
    try {
        let data = {};
        data.total = await AppartmentModel.countDocuments();
        data.search_total = await AppartmentModel.countDocuments({
            $or: [{
                location: qReg
            }, {
                appartmentDesc: qReg
            }]
        })
        data.results = await AppartmentModel.find({
                $or: [{
                    location: qReg
                }, {
                    appartmentDesc: qReg
                }]
            })
            .sort({
                [sort]: reverse
            })
            .limit(perPage)
            .skip(pageNum * perPage)

        res.json(data)
    } catch (err) {
        console.log(err);
        res.json(err)
    }


})

// router.get("/search", async (req, res) => {
//     let pageNum = (req.query.pageNum) ? Number(req.query.pageNum) : 0;
//     let perPage = (req.query.perPage) ? Number(req.query.perPage) : 3;
//     let q = req.query.q;
//     let qReg = new RegExp(q, "i");
//     try {
//         let data = {};
//         data.results = await AppartmentModel.find({
//                 $or: [{
//                     location: qReg
//                 }, {
//                     appartmentDesc: qReg
//                 }]
//             }).limit(perPage)
//             .skip(pageNum * perPage);
//         data.total = await AppartmentModel.countDocuments({
//             $or: [{
//                 location: qReg
//             }, {
//                 appartmentDesc: qReg
//             }]
//         })
//         res.json(data);
//     } catch (err) {
//         console.log(err)
//         res.status(400).json(err)
//     }
// })


router.post("/addnew", auth, async (req, res) => {
    let validBody = validAppartment(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let appartment = new AppartmentModel(req.body);
        appartment.user_id = req.tokenData._id;
        appartment.propertyNumber = await genRandNumber(AppartmentModel);
        await appartment.save();
        res.status(201).json(appartment)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.put("/:idEdit", auth, async (req, res) => {
    let idEdit = req.params.idEdit;
    let validBody = validAppartment(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let data = await AppartmentModel.updateOne({
            _id: idEdit,
            user_id: req.tokenData._id
        }, req.body)
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }

})

router.delete("/:idDel", auth, async (req, res) => {
    let idDel = req.params.idDel;
    try {
        let data = await AppartmentModel.deleteOne({
            _id: idDel,
            user_id: req.tokenData._id
        })
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.get("/ownproperties", auth, async (req, res) => {
    try {
        let data = await AppartmentModel.find({
            user_id: req.tokenData._id
        })
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.get("/:id", auth, async (req, res) => {
    let id = req.params.id;
    try {
        let data = await AppartmentModel.findOne({
            user_id: req.tokenData._id,
            _id: id
        })
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})
module.exports = router;