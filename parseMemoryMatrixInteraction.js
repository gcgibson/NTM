
var fs = require('fs');

var data = fs.readFileSync("./debug.log");
var dataStr = data.toString('utf8');



var array = dataStr.split(" ");
console.log(array);