const express = require("express");

const router = express.Router();

const {addfinder, registerUser, deleteFinder, getFinder, 
    getallFinders, resetPassword, updatePassword, logout,
     updateUser, loginUser, finderlog, gateway} = require('../controllers/userController');

     router.post('/addfinder', addfinder);
     router.post('/register', registerUser);
     router.delete('/deletefinder', deleteFinder);
     router.get('/getfinder/:id', getFinder);
     router.get('/getallfinders', getallFinders);
     router.put('/resetpassword', resetPassword);
     router.put('/updatepassword', updatePassword);
     router.get('/logout', logout);
     router.put('/updateuser', updateUser);
     router.put('/login', loginUser);
     router.put('/finderlog', finderlog);
     router.get('/findall', gateway);

     module.exports = router;