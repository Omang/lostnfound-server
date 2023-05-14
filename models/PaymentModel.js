const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
	fullname:{type: String, default: 'LostNfound PTY'},
	number: {type:Number, default: 74489232},
	broker: {type: String, default: 'Orange Money'},
	ref_num: {type:Date, default: Date.now()}
});

module.exports = mongoose.model('Payment', PaymentSchema);