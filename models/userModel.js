const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstname:{type:String},
    lastname:{type:String},
    role:{type:String, default:'admin'},
    email: {type:String, unique: true},
    password: {type:String, unique:true}
}, {timestamps: true});
userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
    next();
})
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compareSync(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);