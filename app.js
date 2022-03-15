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
    let version = points[points.length - 3] + "."+points[points.length - 2]+"."+ deletRegularExpresion(points[points.length - 1])
    version.trim()
    
    for (let i = 0; i < 3; i++) {
        points.pop()
    }
    let name = points.join('.')

    let data = `<package id="`+name+`" version="`+version+`" targetFramework="net452" />\n`
    list.push(data)
   
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

getFolders()