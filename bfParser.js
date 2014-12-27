var fs = require('fs');
var util = require('util');

var writeWeightsFile = fs.readFileSync('./writeWeights.log');
var writeWeights = writeWeightsFile.toString().split('[');
var outputs = fs.readFileSync('./outputs.log').toString().split('\n')[0];
var numericOutputs = [[]];
	var tmp = [];
for(var i =0; i<outputs.length; i++){

	if(outputs[i]  === '[' || outputs[i] === ' ' || outputs[i]  === ']' ){
		
	}
	else {
		
		if(outputs[i] === ','){
			numericOutputs.push(tmp);
			tmp =[];
		}
		else{
			
			tmp.push(outputs[i]);

		}
	}
}
numericOutputs.push(tmp);
var tmpAgainLOL = [];
for(var iter =0 ; iter<numericOutputs.length; iter++){
	tmpAgainLOL.push(parseFloat(numericOutputs[iter].join('')));
}
tmpAgainLOL.shift();



var wr1 = writeWeights[1].split('\n');
var wr2 =writeWeights[2].split('\n');;
var wr3 =writeWeights[3].split('\n');;




var wr1N = [];
for(var iter =0; iter < wr1.length; iter++){
	if(parseFloat(wr1[iter]) >0){
		
		wr1N.push(parseFloat(wr1[iter]));
	}
}

var wr2N = [];

for(var iter =0; iter < wr2.length; iter++){

	if(parseFloat(wr2[iter]) >0){
		wr2N.push(parseFloat(wr2[iter]));
	}
}

var wr3N = [];
for(var iter =0; iter < wr3.length; iter++){
	if(parseFloat(wr3[iter])>0){
		wr3N.push(parseFloat(wr3[iter]));
	}
}



 var tmpMax1 = 0;
 var tmpMax1Index = 0;
 for(var blah = 0; blah < wr1N.length; blah++){
 	if(wr1N[blah]>tmpMax1){
 		tmpMax1 = wr1N[blah];
 		tmpMax1Index = blah;
 	}
 }


 var tmpMax2 = 0;
 var tmpMax2Index = 0;
 for(var blah = 0; blah < wr2N.length; blah++){
 	if(wr2N[blah]>tmpMax2){
 		tmpMax2 = wr2N[blah];
 		tmpMax2Index = blah;
 	}
 }


 var tmpMax3 = 0;
 var tmpMax3Index = 0;
 for(var blah = 0; blah < wr3N.length; blah++){
 	if(wr3N[blah]>tmpMax3){
 		tmpMax3 = wr3N[blah];
 		tmpMax3Index = blah;
 	}
 }

var indexArr = [];
indexArr.push(tmpMax1Index);
indexArr.push(tmpMax2Index);
indexArr.push(tmpMax3Index);
console.log(outBFInstructionSet(indexArr).join(''));

function outBFInstructionSet(indexArr){
	var instructionSet = [];
	for(var i =0; i < indexArr[0]; i++){
		instructionSet.push('>');
	}
	for(var i=0; i < tmpAgainLOL[0]; i++){
		instructionSet.push('+')
	}
	
	for(var i =indexArr[0]; i < indexArr[1]; i++){
		instructionSet.push('>');
	}
	for(var i=0; i < tmpAgainLOL[1]; i++){
		instructionSet.push('+')
	}
	
	for(var i =indexArr[1]; i < indexArr[2]; i++){
		instructionSet.push('>');
	}
	for(var i=0; i < tmpAgainLOL[2]; i++){
		instructionSet.push('+')
	}
	return instructionSet;
}
