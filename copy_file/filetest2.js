// this file itself works fine 20161214 -- separate files by month
// c:\test> node copyfile.js

var execSync = require("child_process").execSync;
var ExifImage = require('exif').ExifImage;

// list files on the folder

//const testFolder = 'c:\\temp\\';
//const sourceFolder = 'H:\\DCIM\\100ANDRO\\';
//const sourceFolder = 'H:\\Pictures\\LINE_MOVIE\\';
//const sourceFolder = 'G:\\DCIM\\100ANDRO\\';
//const sourceFolder = 'D:\\photo_dump_from_phone\\frank_z5_sd\\100ANDRO\\'
const sourceFolder = 'D:\\photo_dump_from_phone\\frank_z5_internal\\100ANDRO\\'
const targetFolder = 'D:\\phone_photo\\';
const fs = require('fs');

var sourcefilelist = {};
var sourcefilemonth = {};
var sourcemonthdistinct = {};
var targetfilelist = {};


// get source file list
var sourcefiles = fs.readdirSync(sourceFolder)

sourcefiles.forEach(file => {

    var stats = fs.statSync(sourceFolder + file)
    var fileSizeInBytes = stats["size"]
    var fileChangeTime=""; // = stats["mtime"]


    try {
        new ExifImage({ image: sourceFolder + file }, function (error, exifData) {
            if (error) {
                //console.log('Error1: ' + error.message);
                fileChangeTime = stats["mtime"]
                sourcefilemonth[file] =  fileChangeTime.toISOString().substring(0, 7);
            }

            else {
                //console.log(exifData); // Do something with your data!
                //fileChangeTime = exifData.exif.CreateDate; // Do something with your data!
                sourcefilemonth[file] = exifData.exif.CreateDate.substring(0, 4) + "-" + exifData.exif.CreateDate.substring(5, 7);
            }
        });
    } catch (error) {
        console.log('Error2: ' + error.message);
    }
    sourcefilelist[file] = fileSizeInBytes;
    //sourcefilemonth[file] = fileChangeTime.substring(0, 4) + "-" + fileChangeTime.substring(5, 7);
    sourcemonthdistinct[sourcefilemonth[file]] = sourcefilemonth[file];

    while (sourcefilemonth[file] === undefined) {
        require('deasync').runLoopOnce();
    }
    console.log("source " + file + " " + fileSizeInBytes + " " + sourcefilemonth[file]);

});
