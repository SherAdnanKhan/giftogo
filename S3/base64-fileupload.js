const imageUpload = async (base64) => {

    const AWS = require('aws-sdk');
  
    const { S3_ACCESS_KEY, S3_SECRET_KEY } = process.env;
  
    AWS.config.setPromisesDependency(require('bluebird'));
    AWS.config.update({ accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY, region: 'us-east-2' });
  
    const s3 = new AWS.S3();
  
    const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  
    const type = base64.split(';')[0].split('/')[1];
  
    const userId = 1;
    
    console.log(type);

    const params = {
      Bucket: 'giftogo-production',
      Key: `${userId}.${type}`, // type is not required
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64', // required
      ContentType: 'image/gif' // required. Notice the back ticks
    }

    console.log(params);
  
    let location = '';
    let key = '';
    try {
      const { Location, Key } = await s3.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
    }
  
    console.log(location, key);
  
    return location;
  
  }
  
  module.exports = {imageUpload};