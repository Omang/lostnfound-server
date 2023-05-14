const mongoose = require("mongoose");


const docSchema = new mongoose.Schema({
    doc_type:{type: mongoose.Schema.Types.ObjectId, ref:"Cat"},
    doc_description:{type: String, required:true},
    doc_owner:{type:String, required:true},
    doc_images:{type:Array},
    doc_fee: {type:String},
    doc_ref: {type:Date},
    doc_paydetails:{type: mongoose.Schema.Types.ObjectId, ref: "Payment"},
    doc_paid: {type: Boolean, default: false},
    collected:{type:Boolean, default: false},
    finder:{type: mongoose.Schema.Types.ObjectId, ref: "Finder"}
}, {timestamps:true});

module.exports = mongoose.model('Doc', docSchema);
