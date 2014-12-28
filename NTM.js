
var jf = require('jsonfile');
var testSequenceLength = 3;
var fs = require('fs');
var util = require('util');
var numeric = require('numeric');


var synaptic = require('synaptic');
function runModel(maxSequenceLength,testSequenceArray,actaulInputSequence,targetSequence){
var collectedTapeWeights = [[]];

var memoryTapelength = 8;
var memoryTape = [];
for(var i = 0 ; i <memoryTapelength; i++){
    memoryTape.push(Math.random());

}





// pprint("Intial memoryTape");
// pprint(memoryTape);
// pprint("\n");



 var readtapeWeights = initializeTapeWeights();
 var writetapeWeight = initializeTapeWeights();

var initialTapeWeights = initializeTapeWeights();
var instructionSequence = [];



//Define the sequences 
    var originalTargetSequenceLength = targetSequence.length;   



    var readVector =  (build_read(memoryTape,initialTapeWeights));

    var inputLayer = new synaptic.Layer(maxSequenceLength+readVector.length);
    var hiddenLayer = new synaptic.Layer(40);
    var headLayer = new synaptic.Layer(29);
    var outputLayer = new synaptic.Layer(targetSequence.length);

    inputLayer.project(hiddenLayer,synaptic.Layer.connectionType.ALL_TO_ALL);
    hiddenLayer.project(outputLayer,synaptic.Layer.connectionType.ALL_TO_ALL);  
    hiddenLayer.project(headLayer,synaptic.Layer.connectionType.ALL_TO_ALL);
    headLayer.project(outputLayer,synaptic.Layer.connectionType.ALL_TO_ALL);



    var learningRate = .01;

    /*------ TRAINING ----------*/
    for(var numOfRuns = 0; numOfRuns<200; numOfRuns++){
        for(var j= 0; j < testSequenceArray.length; j++){
      
            timeStep(testSequenceArray,false);        
        }

        outputLayer.propagate(learningRate,targetSequence);
        headLayer.propagate(learningRate);
        hiddenLayer.propagate(learningRate);


    }


/*------ RUNNING ----------*/
    var resultWeightingObject =[];
    var resultReadObject =[];
    var resultOutPutObject =[];


    for(var j= 0; j < originalTargetSequenceLength; j++){

         timeStep(targetSequence,true);        
    }

    var returnObject = [];
    returnObject.push(resultWeightingObject);
    returnObject.push(resultReadObject);
    returnObject.push(resultOutPutObject);
   
    console.log("NTM DONE");
    return returnObject;


function timeStep(input,run){


            var testSequence = padInput(input);
        

            
           
            var tmpmem = memoryTape;
            inputLayer.activate(readVector.concat(testSequence));

                  var hiddenLayerIActiv= hiddenLayer.activate();
                  /*--------------- READ WEIGHTINGS ------------------*/
                              var readHeadInputs = headLayer.activate().slice(0,14);
                      
                                var erase  = sigmoidSingle(readHeadInputs.slice(0,1));

                       
                                    var add = readHeadInputs.slice(1,2);

                                var key = sigmoidSingle(readHeadInputs.slice(2,3));
                                    var beta = softplus(readHeadInputs.slice(3,4));
                                    var gt = sigmoidSingle(readHeadInputs.slice(4,5));
                        //console.log(gt);
                             var gamma = Math.exp(readHeadInputs.slice(5,6))+10;
                                var shift = normalizeShift(readHeadInputs.slice(6,14));
                        
                           

                                var tmp = focus_by_content(memoryTape,key,beta);

                                var tmp2 = focus_by_location(tmp,readtapeWeights,gt)

                                var shift_convolveRes = softmax(shift_convolve(tmp2,shift));

                                    readtapeWeights = sharpen(shift_convolveRes,gamma);
                             readVector =  (build_read(memoryTape,readtapeWeights));
                                    
                    /*--------------- WRITE WEIGHTINGS ------------------*/

                         var writeHeadInputs = headLayer.activate().slice(14,29);
                                var erase  = sigmoidSingle(writeHeadInputs.slice(0,1));

                                    var add = writeHeadInputs.slice(1,2);

                                var key = sigmoidSingle(writeHeadInputs.slice(2,3));
                                    var beta = softplus(writeHeadInputs.slice(3,4));
                                    var gt = sigmoidSingle(writeHeadInputs.slice(4,5));
                        //console.log(gt);
                            var gamma = Math.exp(writeHeadInputs.slice(5,6))+10;
                                var shift = normalizeShift(writeHeadInputs.slice(6,14));
                        
                            

                                var tmp = focus_by_content(memoryTape,key,beta);
                           
                                var tmp2 = focus_by_location(tmp,writetapeWeight,gt)

                                var shift_convolveRes = softmax(shift_convolve(tmp2,shift));
                              
                                    writetapeWeight = sharpen(shift_convolveRes,gamma);
                            
                                    
                                 var erased = build_erase(memoryTape,writetapeWeight,erase);
                                 memoryTape = build_add(erased,writetapeWeight,add);
                   
                   





                   var res = outputLayer.activate();
                   if(run){
                   
               
                
                    resultWeightingObject.push(writetapeWeight);
                    resultReadObject.push(readtapeWeights);
                    resultOutPutObject.push(res);
                  
                   }
                
            //     
            

             
}




function normalizeShift(shift){

    var sum= 0; 
    for(var i=0; i < shift.length; i++){
        sum+=shift[i];
    }
    var tmp =[];
    for(var j=0; j < shift.length;j++){
        tmp.push(shift[j]/sum);
    }
  
    return tmp;
}


function insructionSequenceInterpreter(tape_curr,headActivates){
    for(var i =0; i < tape_curr.length; i++){
        if(tape_curr[i]  - headActivates[i] > 0){

            instructionSequence[i] = "+>";
            tape_curr[i] = headActivates[i];
        }
    }
    return tape_curr;
}

function initializeTapeWeights(){
    var weight_init = [];

    
    for (var i =0; i < memoryTape.length; i++){
        weight_init.push(Math.random());
    }
    var sum = 0;
    for(var i =0; i < weight_init.length; i++){
        sum+=Math.exp(weight_init[i]);
    }
    for(var i =0; i < weight_init.length; i++){
        weight_init[i]=Math.exp(weight_init[i])/sum;
    }
    //time to build the heads to connect to memory matrix
    
   return weight_init;
    
}

function tanh(x) {
  if(x === Infinity) {
    return 1;
  } else if(x === -Infinity) {
    return -1;
  } else {
    var y = Math.exp(2 * x);
    return (y - 1) / (y + 1);
  }
}

function focus_by_location(tmp,prev,gt){
    for(var i =0; i < tmp.length; i++){
        tmp[i]*=gt;
        prev[i] *=(1-gt);
    }
    var returnAr = [];
    for(var i=0; i < tmp.length; i++){
        returnAr.push(tmp[i]+prev[i]);
    }
    return returnAr;
}

function build_read(tape_curr,weight_curr,flag){
    var tmp =[];

    for(var i = 0; i <weight_curr.length;i++){
        var sum= 0;
       
         sum+=weight_curr[i]*tape_curr[i];
            if(flag){
                pprint(weight_curr[i]);
                pprint(tape_curr[i]);
            }

        tmp.push(sum);
    }
    var myTotal = 0;  //Variable to hold your total

    for(var i=0, len=tmp.length; i<len; i++){
        myTotal += tmp[i];  //Iterate over your first array and then grab the second element add the values up
    }
    return [myTotal];
}

function build_erase(tape_curr,weight_curr,erase){
    for(var i =0 ; i < tape_curr.length; i++){
        tape_curr[i] *=( 1-weight_curr[i]*erase);
    }

    return tape_curr;
}
function build_add(tape_curr,weight_curr,add){
    for(var i =0 ; i < tape_curr.length; i++){
        tape_curr[i] += weight_curr[i]*add;
    }

    return tape_curr;
}
function focus_by_content(tape_curr,key,beta){
    var returnTape = [];
    var sum = 0;
    for(var i =0; i < tape_curr.length; i++){
        sum+=Math.exp(beta*cosine_sim(key,tape_curr[i]));
    }
    for(var i =0; i < tape_curr.length; i++){
        returnTape.push(Math.exp(beta*cosine_sim(key,tape_curr[i]))/sum);
    }
    return returnTape;

}
function cosine_sim(a,b){
  return a*b;
}



function sharpen(tmpweight,gamma){
    var totalSum1 = 0;
    var weight_sharp =[];
    for(var i =0; i < tmpweight.length; i ++){
        totalSum1 += Math.pow(tmpweight[i],gamma);
    }
    for(var i =0; i < tmpweight.length; i ++){
        weight_sharp.push( Math.pow(tmpweight[i],gamma)/totalSum1);
    }
    return weight_sharp;
}
function shift_convolve(tape_curr,shift){
        shift[3]  = 0;
        shift[4]  = 0;
          shift[5]  = 0;
            shift[6]  = 0;
              shift[7]  = 0;

       var shiftMat = [
                    [shift[0],shift[7],shift[6],shift[5],shift[4],shift[3],shift[2],shift[1]],
                    [shift[1],shift[0],shift[7],shift[6],shift[5],shift[4],shift[3],shift[2]],
                    [shift[2],shift[1],shift[0],shift[7],shift[6],shift[5],shift[4],shift[3]],
                    [shift[3],shift[2],shift[1],shift[0],shift[7],shift[6],shift[5],shift[4]],
                    [shift[4],shift[3],shift[2],shift[1],shift[0],shift[7],shift[6],shift[5]],
                    [shift[5],shift[4],shift[3],shift[2],shift[1],shift[0],shift[7],shift[6]],
                    [shift[6],shift[5],shift[4],shift[3],shift[2],shift[1],shift[0],shift[7]],
                    [shift[7],shift[6],shift[5], shift[4],shift[3],shift[2],shift[1],shift[0]]
                    ];

     


   
       

        return numeric.dotMV(shiftMat,tape_curr);

    // var tmp = [];
    // for(var i = 0; i < tape_curr.length; i++){
    //     var res= 0;
    //     for(var j =0; j < tape_curr.length; j++){
    //         var moduloIndex= Math.abs((i-j)%tape_curr.length);
    //         if(moduloIndex < shift.length){
    //         res+=tape_curr[j]*shift[moduloIndex];
    //         }
    //         else{
    //             res+=0;
    //         }
            
    //     }
    //     tmp.push(res);
    // }

}
function sigmoidSingle(t) {
    return 1/(1+Math.pow(Math.E, -t));
}
function softmax(array){
    var tmpSoft = [];
    var sum= 0;
    for(var i =0 ; i < array.length; i++){
        sum+= Math.exp(array[i]);
    }
    for(var i =0 ; i < array.length; i++){
        tmpSoft.push( array[i]/sum);
    }
    return tmpSoft;
}
function softplus(x){
    return Math.log(1+Math.exp(x));
}

function sigmoid(array){
    var tmpSig= [];
    for(var i =0; i < array.length;i++){
        tmpSig.push(sigmoidSingle(array[i]));
    }
    return tmpSig;
}

function parseInstructions(memoryTape,erase,add,tapeWeights){
    for(var i =0; i < tapeWeights.length; i++){
        if(1-erase* tapeWeights[i] > .8){
            instructionSequence.push("-");
        }
        instructionSequence.push(">");
    }
    for(var i =0 ; i< tapeWeights.length; i++){
        instructionSequence.push("<");
    }
    //console.log(tapeWeights.length);
    var oLayer = outputLayer.activate();
    for(var i =0 ; i < oLayer.length; i++){
       // for(var k =0; k <insertSeq.length; k++){
            
            for(var iter = 0; iter <parseInt(oLayer[i]*10) ; iter++){
            instructionSequence.push("+");
            }
        //}        
         instructionSequence.push(">");
    }

}

function padInput(input){
    var iterLength = maxSequenceLength -input.length;
    for(var i =0; i < iterLength; i++ ){
            input.push(0);
    }
    return input;
}
}

module.exports.runModel = runModel;