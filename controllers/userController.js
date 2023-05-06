const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const {validateMongodbId} = require('../utils/validateMongodb');
const  {generateRefreshToken} = require('../config/refreshToken');
const Finder = require('../models/finderModel');
//const { findById } = require('../models/productModel');

const registerUser =  asyncHandler(async(req, res)=>{

    const {email} = req.body;
    //console.log(datax);
    //res.json(datax);
     
 
     const findUser = await User.findOne({email: email});
     if (!findUser) {
         //create new user
         const newUser = await User.create(req.body);
         res.json(newUser).status(200);
     } else {
         //user exists
         throw new Error('user Already exists');
         
     }
 
 })

 const gateway = asyncHandler(async(req, res)=>{
     try{

      const getall = await Finder.find();

      res.json(getall);

     }catch(err){
      throw new Error(err);
     }
 });

 const loginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
    //check if user exists
    const findUser = await User.findOne({email:email});
    if(findUser && await findUser.isPasswordMatched(password))
    {
      const refreshtoken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser._id,{
        refreshToken: refreshtoken
      },{
        new: true
      });
      res.cookie("refreshToken", refreshtoken,{
        httpOnly: true,
        maxAge: 72*60*60*1000
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        token: generateToken(findUser?._id)
      });     

    }else{
        throw new Error("Invalid Credentials");
    }
 });

 const finderlog = asyncHandler(async(req, res)=>{
  const {email, password} = req.body;
    //check if user exists
    const findUser = await Finder.findOne({email:email});
    if(findUser && await findUser.isPasswordMatched(password))
    {
      const refreshtoken = await generateRefreshToken(findUser?._id);
      const updateuser = await Finder.findByIdAndUpdate(
        findUser._id,{
        refreshToken: refreshtoken
      },{
        new: true
      });
      res.cookie("refreshToken", refreshtoken,{
        httpOnly: true,
        maxAge: 72*60*60*1000
      });
      res.json({
        _id: findUser?._id,
        finder_name: findUser?.finder_name,
        email: findUser?.location,
        token: generateToken(findUser?._id)
      });     

    }else{
        throw new Error("Invalid Credentials");
    }
 });

 const handleRefreshToken = asyncHandler(async(req, res)=>{
       const cookie = req.cookies;
       if(!cookie?.refreshToken) throw new Error("No refresh Token in cookies");
       const refreshtoken = cookie.refreshToken;
       const user = await User.findOne({refreshtoken});
       if(!user) throw new Error("No refresh token present on db or matched");
       jwt.verify(refreshtoken, process.env.JWT_SECRET, (err, encoded)=>{
        if(err || user.id !== encoded.id){
          throw new Error("There is something wrong with refresh token");

        }
        const accessToken = generateRefreshToken(user?._id);
        res.json({accessToken});
       });

 });

 const logout = asyncHandler(async(req, res)=>{

  const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error("No refresh Token in cookies");
  const refreshtoken = cookie.refreshToken;
  const user = await User.findOne({refreshtoken}); 
  if(!user){
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true
    });
    return res.sendStatus(204) //forbidden
  }  
  await User.findOneAndUpdate(refreshtoken, {
    refreshToken: ""
  });
  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: true
  });
   res.sendStatus(204) //forbidden
  
    
 });

 const updateUser = asyncHandler(async(req, res)=>{
      const {_id} = req.user;
      validateMongodbId(id);
      try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
           company: req?.body?.company
        }, {
          new: true
        });
        res.json(updateUser);
      } catch (error) {

        throw new Error(error);
        
      }
 });

 const addfinder = asyncHandler(async(req, res)=>{

     const {email} = req.body;
      try{

        const findone = await Finder.findOne({email:email});

        if(findone){
          res.json({msg:"user exists"})
        }else{

          const addnew = await Finder.create(req.body);
          res.json(addnew);

        }
        
        

      }catch(err){
        throw new Error(err);
      }
 })


 const getallFinders = asyncHandler(async(req, res)=>{
    try {

      const getFinder = await Finder.find();
      res.json(getFinder);  
        
    } catch (error) {
      
        throw new Error(error);
    }
 });

 const getFinder = asyncHandler(async(req, res)=>{
     const {id} = req.params;
     validateMongodbId(id);
     try {
        const getfinder = await Finder.findById(id);
        res.json({
            getfinder
        })
        
     } catch (error) {
        throw new Error(error);
        
     }
 });

 const deleteFinder = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try {
       const deleteFinder = await Finder.findByIdAndDelete(id);
       res.json({
           deleteFinder
       })
       
    } catch (error) {
       throw new Error(error);
       
    }
});



const updatePassword = asyncHandler(async(req, res)=>{
      const {_id} = req.user;
      const {password} = req.body;
      validateMongodbId(_id);
      const user = await User.findById(_id);
      if(password){
        user.password = password;
        const updatedpassword = await user.save();
        res.json(updatedpassword);
      }else{
        res.json(user);
      }
});

const resetPassword = asyncHandler(async(req, res)=>{
  const {password} = req.body;
  const {token}  = req.params;

  const hashedToken = Crypto.createHash('sha256').update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}
  });
  if(!user) throw new Error("Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken= undefined;
  user.passwordResetExpires= undefined;
  await user.save();
  res.json(user);
});


module.exports = {addfinder, registerUser, deleteFinder, getFinder, 
                  getallFinders, resetPassword, updatePassword, logout,
                   updateUser, handleRefreshToken, loginUser, finderlog, gateway}