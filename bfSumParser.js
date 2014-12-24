var fs = require('fs');
var util = require('util');

var sumFile = fs.readFileSync('./resCatOn1.txt');
var stringNumAr = sumFile.toString().split('\n');
var numAr = [];
var sum= 0;
for(var i =0; i < stringNumAr.length-1; i++){
	sum+=parseInt(stringNumAr[i]);
}

console.log(sum/(stringNumAr.length-1));


