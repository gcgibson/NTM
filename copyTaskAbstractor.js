var fs = require('fs');
var util = require('util');
var jf = require('jsonfile');
var NTM = require('./NTM.js');
var ss = require('simple-statistics');
var numeric = require('numeric');

// ABLE TO USE LINEAR EXTRACTION OVER VECTORS

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
console.log("Abstracting length function");
var lengthFunction = lengthRegression(inputOututPairs).line();

//create test sequnce to test abstraction

var testAbstractedInput = [];
for(var iter2 = 0; iter2 <  100; iter2++){
	testAbstractedInput.push(Math.random());
}

//abstracting the length 

//abstract over index 
console.log("INPUT \n");
console.log(testAbstractedInput);



//   how do you abstract index commands?
//  are all shifts relatvie to length? 

//for the copy task integer shifts are 
var firstShifting = extractShifting(firstRunObject[1]);
var secondShifting = extractShifting(secondRunObject[1]);
var shiftingArray = [firstShifting,actaulInputSequenceOne,secondShifting,actaulInputSequenceTwo];
var shiftFunction = averageShift(shiftRegression(shiftingArray));

// Find length to shift Ratio 
var lengthToShiftRatio  = findLengthToShiftRatio(copyOftestSequenceArrayOne,firstShifting,copyOftestSequenceArrayTwo,secondShifting);
//do regression on input to shifting 
//are shifts unique per task? --something to look into
//like on sort task do the sihfting 
parseInt(lengthFunction(testAbstractedInput.length));


console.log("OUTPUT \n");

console.log(stripNaNs(abstract(testAbstractedInput,vectorOfCoefficients)));



function abstract(input, vectorOfCoefficients){
	var probabalisitcAbstractionVector = pca(input,vectorOfCoefficients);
	return numeric.mul(input,probabalisitcAbstractionVector);
}

function pca(input,vector){
	
	var tmp = [];

	for(var i = 0; i < lengthToShiftRatio*parseInt(lengthFunction(input.length)); i+=averageShift(testAbstractedInput)){
		tmp.push(vector[0]);
	}
	return tmp;
}
function shiftRegression(shiftingArray){
	//construct input output pairs for regression based on shifting array
	var localIOPairs = [];
	
	for(var i =0; i < shiftingArray.length; i+=2){
		var tmp = [];
		for (var j =0; j <shiftingArray[i].length; j++){
			tmp.push([shiftingArray[i][j],shiftingArray[i+1][j]]);
		}
		localIOPairs.push(tmp);
	}

	var finalResultVector= [];
	
	for(var iter = 0; iter < localIOPairs.length; iter++){
		var linear_regression_line = ss.linear_regression()
    	.data(localIOPairs[0]);
    	finalResultVector.push(linear_regression_line.m() + linear_regression_line.b()) ;
	}

	return finalResultVector;
}
function lengthRegression(inputOututPairs){
	
	var lengthRegressionInput = [[]];
	for(var  i=0; i < inputOututPairs.length-1; i+=2){
		lengthRegressionInput.push([inputOututPairs[i].length,inputOututPairs[i+1].length]);
	}
	lengthRegressionInput.shift();

	var linear_length_regression = ss.linear_regression()
    	.data(lengthRegressionInput);
	return linear_length_regression;
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

function extractShifting(shiftArray){
	var shifts = []; 
	for (var i=0; i < shiftArray.length; i++){
		var max = 0;
		var maxIndex=0;
		for (var j=0; j < shiftArray[i].length; j++ ){
			if(shiftArray[i][j]>max){
				max = shiftArray[i][j];
				maxIndex= j;
			}

		}
		shifts.push(maxIndex);
	}

	//normalize shifts 

	var normalizedShifts =[];
		if(shifts[0] >0){	
			for(var k=0; k < shifts.length; k++){
				normalizedShifts.push(shifts[k]-shifts[0]);
			}
		}
		else{
			normalizedShifts = shifts;
		}
	return normalizedShifts;
}
function averageShift(array){
	
	return ss.mean(array);
}

function findLengthToShiftRatio(testSequenceArrayOne,firstShifting,testSequenceArrayTwo,secondShifting){
		var f1 =  testSequenceArrayOne.length/firstShifting.length;
		var f2 = testSequenceArrayTwo.length/secondShifting.length;
		return Math.round(ss.mean([f1,f2]));

}

function stripNaNs(array){
	var tmp =[];
	
	for (var i = 0; i < array.length; i++ ){

		if(!isNaN(array[i])){

			tmp.push(array[i]);
		}
	}
	return tmp;

}