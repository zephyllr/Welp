const mongoose = require("mongoose");

require("../db");

const Tips = mongoose.model("Tip");
const Business = mongoose.model("Business")
const CheckIns = mongoose.model("Checkin")


module.exports = app => {
    app.get("/api/getTips", (req, res) => {
        Tips.findOne({}, (err, result) => {
            res.send(result);
        });
    });

    
    app.get("/api/getBusiness", (req, res) => {
        Business.findOne({}, (err, result) => {
            res.send(result);
        });
    });

    app.get("/api/getCheckin", (req, res) => {
        CheckIns.findOne({}, (req, result) => {
            res.send(result);
        });
    });
    
    app.get("/api/getTips/:ID", (req, res) => {
        Tips.findOne({business_id: req.params.ID}, (err, result) => {
            res.send(result);
        });
    });

    app.get("/api/getBusiness/:ID", (req, res) => {
        Business.findOne({business_id: req.params.ID}, (err, result) => {
            res.send(result);
        });
    });

    app.get("/api/getCheckin/:ID", (req, res) => {
        CheckIns.findOne({business_id: req.params.ID}, (err, result) => {
            res.send(result);
        });
    });
}