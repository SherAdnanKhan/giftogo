const gm = require('gm'); // Require the GraphicsMagick wrapper for node
const fs = require('fs');
const imageDownloader = require('node-image-downloader');

const processImage=(imageUrl)=>{
    console.log("can i process this image");
    console.log(imageUrl);
    
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    var str = 'Image';  
  
    // Joining the strings together  
    var value = str.concat(hours,minutes,seconds);  

    var str2='./emailScrapedImages/';
    var value2=str2.concat('barcode',hours,minutes,seconds,'.png');

    console.log(value);
    imageDownloader({
    imgs: [
        {
            uri: imageUrl,
            filename: value
        },

    ],
    dest: './emailScrapedImages', //destination folder
    })
    .then((info) => {
        console.log('all done', info);
        const url=info[0].path;
        var address="./"+url;
        console.log(address,value2);
        cropBarCode(address,value2);
        appendImage(value2);
    })
    .catch((error, response, body) => {
        console.log('something goes bad!')
        console.log(error)
    })
}

const cropBarCode = (address,value2)=>{
    gm(address)
    .crop(115, 125,540,470)
    .write(value2, (err) => {
    if (err) {
        console.log(err); 
    } else {
        console.log('Processing success');
    }
    })
}

const appendImage=(change_image_url,base_image_url,output_file)=>{

    // var change_image_url='./barcode4472.png';
    // var base_image_url='./Addbarcode.png';
    // var output_file='./final2.png';
    gm()
    .command("composite") 
    .in("-gravity", "center")
    .in('-page', '+55+70')
    .in(change_image_url)
    .in(base_image_url)
    .write( output_file, function (err) {
    if (!err) 
        console.log(' hooray! ');
    else
        console.log(err);
    });
}

const createImage=(width,height,name,color)=>{
    gm(width,height, color)
    .write(name, function (err) {
        if(!err){console.log("Image created")}
    });
}

const writeText= (x,y,text,fill,font,fontsize,url)=>{
    gm(url)
    .fill(fill)
    .font(font, fontsize)
    .drawText(x, y, text)
    .write("new"+url,function (err) {
        if(!err){console.log("Text Written")}
    });
}

const resizeImage=(x,y,url)=>{
    gm(url)
    .resize(x, y)
    .write(url,function (err) {
        if(!err){console.log("Image resized")}
    })
}

const mergetwo=(file1,file2,output)=>{
    gm(file1).append(file2)
    .write(output,function (err){
        if(!err){
            console.log("merged images");
        }
    })

}

module.exports={
    processImage,
    appendImage,
    createImage,
    writeText,
    resizeImage,
    mergetwo,
}