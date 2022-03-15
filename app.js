const { exec } = require("child_process");
var fs = require('fs');
let body =`
<?xml version="1.0" encoding="utf-8"?>
<packages>
 replace
</packages>
!`
let list = []


// SET THE PATH OF THE PACKAGE FOLDERS IN THE NEXT VARIABLE
let FOLDER_PATH = "packeges"

function operateRow(row){
    let extract = row.substring(39,row.length);
    let points = extract.split(".")

    let versionPosition = extract.search(/.[1-9]/,".x")
    let version_ = extract.slice(versionPosition)
    let versionArr = version_.split(".")
    

    switch (versionArr.length) {
        case 1:
            //zero version number
            zeroNumbersVersion(points)
            break;
        case 2:
            //one version number
            oneNumbersVersion(points)
            break;
        case 3:
            //two version number
            twoNumbersVersion(points)
            break;

        case 4:
            //three version number
            threeNumbersVersion(points)
            break;

        case 5:
            //four version number
            fourNumbersVersion(points)
            break;
        default:

            break;
    }
   
   
}

function getFolders() { 
    exec(" dir "+FOLDER_PATH, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            
            return;
        }
        arr = stdout.split("\n") 

        for (let i = 0; i < arr.length; i++) {
            
            if (i > 6) {
                operateRow(arr[i])
            }if (i == arr.length - 4) {
                break
            } else {
                
            }
            
        }

        let packages = ``
        list.forEach(row => {
            packages += row
        });

        let cofigInfo = body.replace("replace",packages)
        createConfigFile(cofigInfo)
        //console.log(cofigInfo);
    });
}


function deletRegularExpresion(text){
    return text.slice(0, text.length- 1)
}

function createConfigFile(info){
    fs.writeFile('packages.config', info, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}

function threeNumbersVersion(points) {
    let version = points[points.length - 3] + "."+points[points.length - 2]+"."+ deletRegularExpresion(points[points.length - 1])
    version.trim()
    
    for (let i = 0; i < 3; i++) {
        points.pop()
    }
    let name = points.join('.')

    let data = `<package id="`+name+`" version="`+version+`" targetFramework="net452" />\n`
    list.push(data)
}

function fourNumbersVersion(points) {
    let version = points[points.length - 4] + "."+ points[points.length - 3] + "."+points[points.length - 2]+"."+ deletRegularExpresion(points[points.length - 1])
    version.trim()
    
    for (let i = 0; i < 4; i++) {
        points.pop()
    }
    let name = points.join('.')

    let data = `<package id="`+name+`" version="`+version+`" targetFramework="net452" />\n`
    list.push(data)
}

function twoNumbersVersion(points) {
    let version = points[points.length - 2]+"."+ deletRegularExpresion(points[points.length - 1])
    version.trim()
    
    for (let i = 0; i < 2; i++) {
        points.pop()
    }
    let name = points.join('.')

    let data = `<package id="`+name+`" version="`+version+`" targetFramework="net452" />\n`
    list.push(data)
}


function oneNumbersVersion(points) {
    let version =  deletRegularExpresion(points[points.length - 1])
    version.trim()
    
    for (let i = 0; i < 1; i++) {
        points.pop()
    }
    let name = points.join('.')

    let data = `<package id="`+name+`" version="`+version+`" targetFramework="net452" />\n`
    list.push(data)
}

function zeroNumbersVersion(points) {
    
    let name = points.join('.')

    let data = `<package id="`+ deletRegularExpresion(name)+`" version="" targetFramework="net452" />\n`
    list.push(data)
}

getFolders()