var execSync = require("child_process").execSync;
const fs = require('fs');
const util = require('util');


var stats = fs.statSync('D:\\phone_photo\\2016-12\\DSC_0112_1.jpg')
var fileSizeInBytes = stats["size"]
var atime = stats["atime"]
var mtime = stats["mtime"]
var ctime = stats["ctime"]
var birthtime = stats["birthtime"]

console.log(stats);

console.log("atime=" + atime);
console.log("mtime=" + mtime);
console.log("ctime=" + ctime);
console.log("birthtime=" + birthtime);

var stats2 = fs.statSync("D:\\phone_photo\\2016-12\\DSC_0112_1.jpg");
var mtime2 = new Date(util.inspect(stats2.mtime));
console.log(mtime2);

var ExifImage = require('exif').ExifImage;

var str;

try {
    new ExifImage({ image: 'D:\\phone_photo\\2016-12\\DSC_0112_1.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: ' + error.message);
        else
        {
            console.log(exifData); // Do something with your data!
            console.log(exifData.exif.CreateDate); // Do something with your data!
            console.log(exifData.exif.CreateDate.substring(0, 4)+"-"+exifData.exif.CreateDate.substring(5, 7)); // Do something with your data!
            str = exifData.exif.CreateDate.substring(0, 4)+"-"+exifData.exif.CreateDate.substring(5, 7);
            //fileChangeTime.toISOString().substring(0, 7);
        }
    });
} catch (error) {
    console.log('Error: ' + error.message);
}

while(str === undefined) {
    require('deasync').runLoopOnce();
  }
console.log('log1');

console.log(str);
