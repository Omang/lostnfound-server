const {default: mongoose} = require('mongoose');

const dbConnect = ()=>{
    try {
        const conn = mongoose.connect(process.env.MONGODBC);
       console.log('database connected successfull'); 
    } catch (err) {
      console.log('database error');
    }
}

module.exports = dbConnect;