const Doc = require('../models/docModel');
const Cat = require('../models/catModel');
const User = require('../models/userModel');
const Finder = require('../models/finderModel');
const asyncHandler = require('express-async-handler');


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


    try{

        const newdoc = await Doc.create(req.body);

        res.json(newdoc);

    }catch(err){
        throw new Error(err);
    }



});

const getDoc = asyncHandler(async(req, res)=>{

    const {id} = req.params ;

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

   const {doc_type, doc_id, doc_description, doc_owner, doc_fee, finder} = req.body;
    
   try{

    const updatedoc = await Doc.findByIdAndUpdate(doc_id, {

        doc_type: doc_type, doc_description: doc_description,
        doc_owner: doc_owner, doc_fee: doc_fee , finder: finder

    }, {new: true});

   res.json(updatedoc);

   }catch(err){
    throw new Error(err);
   }
   



});

const collectDoc = asyncHandler(async(req, res)=>{

    const {id} = req.body;

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
const allDocs = asyncHandler(async(req, res)=>{

    try{

        const docs = await Doc.find().populate('doc_type');
        res.json(docs);

    }catch(err){
        throw new Error(err);
    }

});

const paydoc = asyncHandler(async(req, res)=>{
    const {id} = req.body;
     
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

module.exports = {createDoc, updateDoc, collectDoc, allDocs, getDoc, paydoc,
                  createCat, getCat, allCat};
