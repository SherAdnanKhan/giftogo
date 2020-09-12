const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
 
aws.config.update({
    secretAccessKey:process.env.S3_SECRET_KEY,
    accessKeyId:process.env.S3_ACCESS_KEY,
    region:'us-east-2'
})

const s3 = new aws.S3()

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/gif' || file.mimetype==='image/jpg'  ){
    cb(null,true)
  }else{
    cb(new Error("Invalid Mime Type, Only JPEG JPG PNG"),false)
  }
}


const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'giftogo-production',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports=upload;



