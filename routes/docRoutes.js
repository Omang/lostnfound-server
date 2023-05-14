const express = require("express");
const multer = require('multer');

const router = express.Router();

const {createDoc, updateDoc, collectDoc, allDocs, getDoc, paydoc,
    createCat, getCat, allCat, uploadPhoto, finderDocs, getfinderdocs,
processPayment, paymentDetails} = require('../controllers/docController');
const photosMiddleware = multer({dest:'uploads/'});
    router.post('/createdoc', createDoc);
    router.put('/update', updateDoc);
    router.get('/collectdoc/:id', collectDoc);
    router.get('/alldocs', allDocs);
    router.get('/getDoc/:id', getDoc);
    router.get('/paydoc/:id', paydoc);
    router.post('/createcat', createCat);
    router.get('/getCat/:id', getCat);
    router.get('/allcats', allCat);
    router.post('/upload',photosMiddleware.array('photos', 100), uploadPhoto);
    router.get('/finderdocs', finderDocs);
    router.get('/getfinderdocs/:id', getfinderdocs)
    router.get('/paymentdetails', paymentDetails);
    router.get('/processpayment/:id', processPayment);


    module.exports = router;


