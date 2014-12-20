
var arg = process.argv[2];
var fs = require('fs');



//Train it on the letter A in brain fuck
if(arg === 'make'){
		var Astring = "++++++[>++++++++++<-]>+++++.";
		var numericA = [];
		for(var i =0; i < Astring.length; i++){
			numericA.push(interpreterToInput(Astring[i]));
		}



		var fs = require('fs');
		var jf = require('jsonfile')
		var util = require('util')

		var fileJSON= {};

		//COpy takse
		var sequenceLengthToCopy = Astring.length;
		var numSequencesToCopy = 1;
		var data  = [numericA];





		//populate test sequence
		var testSeq = "++++++[>++++++++++<-]>++-++.";
		var numericTest = [];
		for(var i =0; i < testSeq.length; i++){
			numericTest.push(interpreterToInput(testSeq[i]));
		}




		fileJSON.testSequence = numericTest;
		fileJSON.inputSequence = data;
		fileJSON.targetSequence = data;
		fileJSON.input_size = sequenceLengthToCopy;

		fileJSON.mem_width = sequenceLengthToCopy;
		fileJSON.output_size = sequenceLengthToCopy;

		fileJSON.mem_size= 20;
		fileJSON.shift_width =  3;
		fileJSON.layer_sizes = 20;
		fileJSON.no_heads= 1;









		jf.writeFile('configNew.json', fileJSON, function(err) {
		  
		});

}
else{

	var data = fs.readFileSync("./result.txt");
	var numStringArr = data.toString('utf8').split(",");
	var numarr = [];
	for(var i =0; i < numStringArr.length; i++){
		numarr.push(parseFloat(numStringArr[i]));
	}
	console.log(inputToInterpretArray(numarr).join(""));



}

function inputToInterpret(x){

	if(0.0 < parseFloat(x) && parseFloat(x) < 0.1){
		return ">";
	}
	else if(0.1 < parseFloat(x) && parseFloat(x)< 0.2){
		return "<";
	}
	else if(0.2 < parseFloat(x) && parseFloat(x)< 0.3){
		return "+";
	}
	else if(0.3 < parseFloat(x) && parseFloat(x)< 0.4){
		return "-";
	}
	else if(0.4 < parseFloat(x) && parseFloat(x)< .5){
		return "[";
	}
	else if(0.5 < parseFloat(x) && parseFloat(x)< .6){
		return "]";
	}
	else if(0.6 < parseFloat(x) && parseFloat(x)< .7){
		return ".";
	}
	else if(0.7 < parseFloat(x) && parseFloat(x)< .8){
		return ",";
	}



}
function inputToInterpretArray(x){
	var tmp = [];
	for(var i = 0; i < x.length; i++){
		tmp.push(inputToInterpret(x[i]));
	}
	return tmp;

}
function interpreterToInput(symbol){
	if(symbol === ">"){
		return .05;
	}
	else if(symbol === "<"){
		return .15;
	}
	else if(symbol === "+"){
		return .25;
	}
	else if(symbol === "-"){
		return .35;
	}
	else if(symbol === "["){
		return .45;
	}
	else if(symbol === "]"){
		return .55;
	}
	else if(symbol === "."){
		return .65;
	}
	else if(symbol === ","){
		return .75;
	}


}
module.exports = {
	interpreterToInput:interpreterToInput,
	inputToInterpret:inputToInterpret,
	inputToInterpretArray:inputToInterpretArray
};
