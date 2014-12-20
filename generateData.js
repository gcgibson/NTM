var fs = require('fs');
var jf = require('jsonfile')
var util = require('util')


var buf = fs.readFileSync('./config.json', "utf8");
var fileJSON =JSON.parse(buf);

//COpy takse
var sequenceLengthToCopy = 4;
var numSequencesToCopy = 1000;
var data  =[[]];
for (var i =0 ; i < numSequencesToCopy; i++ ){
	var tmpData = [];
	for(var j=0; j < sequenceLengthToCopy; j++){
		tmpData.push(Math.random());
	}
	data.push(tmpData);
}
data.shift();
fileJSON.inputSequence = data;
fileJSON.targetSequence = data;
fileJSON.input_size = sequenceLengthToCopy;

fileJSON.mem_width = sequenceLengthToCopy;
fileJSON.output_size = sequenceLengthToCopy;


jf.writeFile('config.json', fileJSON, function(err) {
  console.log(err)
});