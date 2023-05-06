const express = require("express");

const router = express.Router();

const {createDoc, updateDoc, collectDoc, allDocs, getDoc, paydoc,
    createCat, getCat, allCat} = require('../controllers/docController');


    router.post('/createdoc', createDoc);
    router.put('/update', updateDoc);
    router.get('/collectdoc', collectDoc);
    router.get('/alldocs', allDocs);
    router.get('/getDoc/:id', getDoc);
    router.get('/paydoc', paydoc);
    router.post('/createcat', createCat);
    router.get('/getCat/:id', getCat);
    router.get('/allcats', allCat);


    module.exports = router;


