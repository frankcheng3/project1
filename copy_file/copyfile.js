// this file itself works fine 20161214 -- separate files by month
// c:\test> node copyfile.js

var execSync = require("child_process").execSync;
var ExifImage = require('exif').ExifImage;

// list files on the folder

//const testFolder = 'c:\\temp\\';
//const sourceFolder = 'H:\\DCIM\\100ANDRO\\';
//const sourceFolder = 'H:\\Pictures\\LINE_MOVIE\\';
//const sourceFolder = 'G:\\DCIM\\100ANDRO\\';
//const sourceFolder = 'D:\\photo_dump_from_phone\\frank_z2_sd\\100ANDRO\\'
//const sourceFolder = 'D:\\photo_dump_from_phone\\frank_z5_sd\\100ANDRO\\'
const sourceFolder = 'D:\\phone_photo\\undefined\\'
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
    var fileChangeTime; // = stats["mtime"]

    try {
        new ExifImage({ image: sourceFolder + file }, function (error, exifData) {
            if (error) {
                //console.log('Error1: ' + error.message);
                fileChangeTime = stats["mtime"];
                sourcefilemonth[file] = fileChangeTime.toISOString().substring(0, 7);
            }

            else {
                //console.log(exifData); // Do something with your data!
                //fileChangeTime = exifData.exif.CreateDate; // Do something with your data!
                //console.log(exifData);
                //console.log(exifData.exif);
                console.log(file);
                if (exifData.exif.CreateDate === undefined) {
                    fileChangeTime = stats["mtime"];
                    sourcefilemonth[file] = fileChangeTime.toISOString().substring(0, 7);
                }
                else {
                    sourcefilemonth[file] = exifData.exif.CreateDate.substring(0, 4) + "-" + exifData.exif.CreateDate.substring(5, 7);
                }

                //console.log(file);
            }
        });
    } catch (error) {
        console.log('Error2: ' + error.message);
    }

    while (sourcefilemonth[file] === undefined) {
        require('deasync').runLoopOnce();
    }

    sourcefilelist[file] = fileSizeInBytes;
    //sourcefilemonth[file] = fileChangeTime.substring(0, 4) + "-" + fileChangeTime.substring(5, 7);
    sourcemonthdistinct[sourcefilemonth[file]] = sourcefilemonth[file];

    //console.log("source " + file + " " + fileSizeInBytes + " " + sourcefilemonth[file]);
    process.stdout.write(".");

    //global.gc();

});

// list months for verify

Object.keys(sourcemonthdistinct).forEach(month => {

    //console.log(targetFolder + month);

    var command = "mkdir " + targetFolder + month;


    //exec(command, function (error, stdout, stderr) { content = stdout; });

    // all folders are created
    if (!fs.existsSync(targetFolder + month)) {
        console.log(command);
        execSync(command);
    }


    // get target file list
    var targetfiles = fs.readdirSync(targetFolder + month)

    targetfiles.forEach(file => {

        var stats = fs.statSync(targetFolder + month + "\\" + file)
        var fileSizeInBytes = stats["size"]

        targetfilelist[month + "\\" + file] = fileSizeInBytes;

        //console.log("target " + month + "\\" + file + " " + fileSizeInBytes);

    });

})

//console.log("sourcefilelist:" + JSON.stringify(sourcefilelist));
//console.log("targetfilelist:" + JSON.stringify(targetfilelist));
//console.log("sourcefilemonth: " + JSON.stringify(sourcefilemonth));

//console.log("Object.keys(sourcefilelist)):" + JSON.stringify(Object.keys(sourcefilelist)));
//console.log("Object.keys(sourcemonthdistinct):" + JSON.stringify(Object.keys(sourcemonthdistinct)));

// get copy file list
sourcefiles.forEach(file => {

    if (targetfilelist[sourcefilemonth[file] + "\\" + file] != undefined) {
        if (targetfilelist[sourcefilemonth[file] + "\\" + file] != sourcefilelist[file]) {
            //console.log("target contains NOT match file (conflicts): " + " " + sourcefilemonth[file] + "\\" + file + "." + sourcefilelist[file]);

            var command = "copy " + sourceFolder + file + " " + targetFolder + sourcefilemonth[file] + "\\" + file + "." + sourcefilelist[file] + file.substring(file.length - 4, file.length);
            //console.log(command);

            if (fs.existsSync(targetFolder + sourcefilemonth[file] + "\\" + file + "." + sourcefilelist[file] + file.substring(file.length - 4, file.length))) {
                ;
                console.log("conflicts but exists (skip) " + targetFolder + sourcefilemonth[file] + "\\" + file + "." + sourcefilelist[file] + file.substring(file.length - 4, file.length));
            }
            else {
                console.log(command);
                execSync(command);

            }
            //exec(command, function (error, stdout, stderr) { content = stdout; });
            //execSync(command);
        }
        else {
            ;
            console.log("target contains match file (skip): " + " " + file);
        }
    }
    else {
        //console.log("target NOT contains file (copy): " + " " + file);
        var command = "copy " + sourceFolder + file + " " + targetFolder + sourcefilemonth[file] + "\\" + file;

        //exec(command, function (error, stdout, stderr) { content = stdout; });
        console.log(command);
        execSync(command);

    }

});

