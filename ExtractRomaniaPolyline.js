const fs = require('fs'); 
const csv = require('fast-csv');

let pathToData = './ro.csv';
let stream =fs.createReadStream(pathToData); 
csv.parseStream(stream, {headers:true}).on("data", function(data){
    if(parseFloat(data.latitude) !== null){
    data.latitude = parseFloat(data.latitude);
    data.longitude = parseFloat(data.longitude);
    fs.appendFileSync('./output.txt', JSON.stringify(data) + ', \n');
    }
}).on("end", function(){
    // end callback for script
});

