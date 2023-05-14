const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const finderSchema = new mongoose.Schema({
    finder_name:{type:String},
    cipa: {type: String},
    location:{type:String, required:true},
    nearby_places:{type:String, required: true},
    cars_way: {type:String},
    transport_way: {type:String},
    password: {type:String},
    contact: {type:Number},
    email: {type:String},
    refreshToken: {type:String},
    role: {type: String, default:"user"}
    
}, {timestamps: true});

finderSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
finderSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('Finder', finderSchema);
