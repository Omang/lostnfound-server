const Doc = require('../models/docModel');
const Cat = require('../models/catModel');
const User = require('../models/userModel');
const Finder = require('../models/finderModel');
const Payment = require('../models/PaymentModel');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const paymentDetails = asyncHandler(async(req, res)=>{
    try{
        
        paydetails = await Payment.find();
        res.json(paydetails);

    }catch(err){
        throw new Error(err);
    }
})

const processPayment = asyncHandler(async(req, res)=>{
       const {id} = req.params;
       
       try{

        
        const doc = await Doc.findByIdAndUpdate(id,{
            doc_ref:Date.now()
        },{new:true});
        res.json(doc);

       }catch(err){
        throw new Error(err);
       }
})
const createCat = asyncHandler(async(req, res)=>{
    try{

        const cat = await Cat.create(req.body);
        res.json(cat);

    }catch(err){
        throw new Error(err);
    }
})
const getCat = asyncHandler(async(req, res)=>{

    const {id}= req.params;

    try{

        const getcat = await Cat.findById(id);
        res.json(getcat);

    }catch(err){
        throw new Error(err);
    }
    
});

const allCat = asyncHandler(async(req, res)=>{
    try{

        const cats = await Cat.find();

        res.json(cats);

    }catch(err){
        throw new Error(err);
    }
})

const createDoc = asyncHandler(async(req, res)=>{
   const{refreshToken} = req.cookies;
   const {doc_type, doc_description, doc_owner
          , doc_fee, doc_images, finder} = req.body;

    try{

        const newdoc = await Doc.create({
            doc_type:doc_type,
            doc_description: doc_description,
            doc_owner: doc_owner,
            doc_images: doc_images,
            doc_fee: doc_fee,
            finder: finder});

        res.json(newdoc);

    }catch(err){
        throw new Error(err);
    }



});

const getDoc = asyncHandler(async(req, res)=>{

    const {id} = req.params;

    try{

        const getdoc = await Doc.findById(id).populate("doc_type");
       if(getdoc.doc_paid){
        const getadoc = await Doc.findById(id).populate("doc_type").populate("finder");
        res.json(getadoc);
       }else{
        res.json(getdoc);
       }

    }catch(err){
        throw new Error(err);
    }

})

const updateDoc = asyncHandler(async(req, res)=>{

   const {doc_type, doc_id, doc_description, doc_images, doc_owner, doc_fee} = req.body;
    
   try{

    const updatedoc = await Doc.findByIdAndUpdate(doc_id, {

        doc_type: doc_type, doc_description: doc_description,
        doc_owner: doc_owner, doc_fee: doc_fee ,doc_images: doc_images, finder: finder

    }, {new: true});

   res.json(updatedoc);

   }catch(err){
    throw new Error(err);
   }
   



});

const collectDoc = asyncHandler(async(req, res)=>{

    const {id} = req.params;

    try{

        const getdoc = await Doc.findById(id);

        if(getdoc.doc_paid){

            const doc = await Doc.findByIdAndUpdate(id,{
                 collected: true
            }, {new: true});
            res.json(doc);

        }else{
            res.json("Fees not paid");
        }

    }catch(err){
        throw new Error(err);
    }

});
const finderDocs = asyncHandler(async(req, res)=>{
    const {id} = req.params;
   try{



    const alldata = await Doc.find({finder:{"$in" : [id]}}).populate("doc_type");
     
     res.json(alldata);


   }catch(err){
    throw new Error(err);
   }

})

const getfinderdocs = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const docs = await Doc.find({finder:{"$in" : [id]}}).populate("doc_type");

        res.json(docs);

    }catch(error){
        throw new Error(error);
    }
})

const allDocs = asyncHandler(async(req, res)=>{

    try{

        const docs = await Doc.find().populate('doc_type').populate("finder");
        res.json(docs);

    }catch(err){
        throw new Error(err);
    }

});

const paydoc = asyncHandler(async(req, res)=>{
    
    const {id} = req.params;
     
    try{

        const pay = await Doc.findByIdAndUpdate(id, {
           doc_paid: true 
        }, {new:true});

        if(pay.doc_paid){
            const getdoc = await Doc.findById(id).populate("doc_type").populate("finder");

            res.json(getdoc);
        }


    }catch(err){

        throw new Error(err)
    }

});

const uploadPhoto = asyncHandler(async(req,res)=>{
    const uploadedFiles = [];
   for (var i = 0; i < req.files.length; i++) {
      const {path, originalname}= req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.'+ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads\\', ''));

   }
    res.json(uploadedFiles);  
})

module.exports = {createDoc, updateDoc, collectDoc, allDocs, getDoc, paydoc,
                  createCat, processPayment, paymentDetails, getCat, allCat, uploadPhoto, finderDocs, getfinderdocs};
