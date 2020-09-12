const express = require("express");
const upload= require('../S3/service-s3');
const uploadRouter = express.Router();
const base64imag=require('../S3/base64-fileupload');
const { lchmod } = require("fs");
const singleUpload = upload.single('image');


// var fileFilter = (req , file, cb) =>{
//   console.log(file);
//   var ext = path.extname(file.originalname)
//   if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//     return cb(null, false)
//   }
//   return cb(null, true)
// }
// const upload = multer({ fileFilter, storage: multer.memoryStorage() }).single('image')

uploadRouter.post("/testImage",function(req,res){ 
  console.log(process.env.S3_ACCESS_KEY);
  singleUpload(req,res,function(err){
    if(!err){
      return res.json({"Image_url": req.file.location});
    }else {
      return res.send(err);
    }
  })
} );

uploadRouter.post("/base64Image", async function(req,res){
  const location = await base64imag.imageUpload(req.body.base64code);
  if(location){
    res.send(location);
  }else{
    res.send('error');
  }
})


module.exports = uploadRouter;