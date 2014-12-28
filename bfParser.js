var fs = require('fs');
var util = require('util');
var jf = require('jsonfile');
var NTM = require('./NTM.js');
var ss = require('simple-statistics');
var numeric = require('numeric');


var maxSequenceLength  = 10;
var testSequenceArrayOne= [1,1,1];
var copyOftestSequenceArrayOne = JSON.parse(JSON.stringify(testSequenceArrayOne));
var actaulInputSequenceOne = [1,1,1];
var targetSequenceOne = [1,1,1];
var firstRunObject = NTM.runModel(maxSequenceLength,testSequenceArrayOne,actaulInputSequenceOne,targetSequenceOne);


var maxSequenceLength  = 10;
var testSequenceArrayTwo= [1,1,1,1];
var copyOftestSequenceArrayTwo = JSON.parse(JSON.stringify(testSequenceArrayTwo));

var actaulInputSequenceTwo = [1,1,1,1];
var targetSequenceTwo = [1,1,1,1];
var secondRunObject = NTM.runModel(maxSequenceLength,testSequenceArrayTwo,actaulInputSequenceTwo,targetSequenceTwo);

var inputOututPairs = [];
inputOututPairs.push(copyOftestSequenceArrayOne,firstRunObject[firstRunObject.length-1][firstRunObject.length-1]);
inputOututPairs.push(copyOftestSequenceArrayTwo,secondRunObject[secondRunObject.length-1][secondRunObject.length-1]);

var vectorOfCoefficients = linearRegressionOverVectors(inputOututPairs);

console.log("Abstracted");
console.log(abstract([1,1,1,1,1],vectorOfCoefficients));

function abstract(input, vectorOfCoefficients){
	var probabalisitcAbstractionVector = pca(input,vectorOfCoefficients);
	return numeric.mul(input,probabalisitcAbstractionVector);
}

function pca(input,vector){
	var tmp = [];
	for(var i = 0; i < input.length; i++){
		tmp.push(vector[0])
	}
	return tmp;
}
function linearRegressionOverVectors(inputOututPairs){
	var finalResultVector= [];

	for (var k =0; k < inputOututPairs.length-1; k++){
		var pwDataResult = constructPairWiseData(inputOututPairs[k],inputOututPairs[k+1]);
		var linear_regression = ss.linear_regression()
    	.data(pwDataResult);
		finalResultVector.push(linear_regression.m());
	}
	return finalResultVector;
}


function constructPairWiseData(vec1,vec2){
	var pw  = [[]];
	for (var  i =0; i < vec1.length; i ++){
		//use temporary random offset
		pw.push([vec1[i] + i,vec2[i]+i]);
	}
	pw.shift();
	return pw;
}

function linearRegression(ipoppw){
	var linear_regression_line = ss.linear_regression()
    .data(ipoppw).line();
			
    return linear_regression_line;
} 


function neuralTuringMachineMarkovModel(sequence){
var bayes = require('bayes')

var classifier = bayes()

// teach it positive phrases

	classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive')
	classifier.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive')

// teach it a negative phrase

	classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative')

	// now ask it to categorize a document it has never seen before

	classifier.categorize('awesome, cool, amazing!! Yay.')
// => 'positive'

// serialize the classifier's state as a JSON string.
	var stateJson = classifier.toJson()

// load the classifier back from its JSON representation.
	var revivedClassifier = bayes.fromJson(stateJson)
}




function buildBFForLoop(indexArr){
	for(var i =0; i < indexArr.length; i++){
		instructionSequence.push('+');
	}
	instructionSequence.push('[');
}

function outBFInstructionSet(indexArr){
	var instructionSet = [];

			if(resultOutPutObject[0]>.5){
				instructionSet.push('+');
			}
	for(var k =1; k <resultOutPutObject.length;k++){		
			
			
			for(var i =indexArr[k-1]; i < indexArr[k]; i++){
				instructionSet.push('>');
			}
			if(resultOutPutObject[k]>.5){
				instructionSet.push('+');
			}

	
	}
	return instructionSet.join('');
}



