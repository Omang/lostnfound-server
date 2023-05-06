const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    cat_name:{type:String, required:true},
    cat_description:{type:String, required:true}
});

module.exports = mongoose.model('Cat', catSchema);