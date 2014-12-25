

var testSequenceLength = 1;
var fs = require('fs');
var util = require('util');

var synaptic = require('synaptic');
var inputLayer = new synaptic.Layer(testSequenceLength+4);
var hiddenLayer = new synaptic.Layer(20);
var headLayer = new synaptic.Layer(11);
var outputLayer = new synaptic.Layer(1);

inputLayer.project(hiddenLayer,synaptic.Layer.connectionType.ALL_TO_ALL);
hiddenLayer.project(outputLayer,synaptic.Layer.connectionType.ALL_TO_ALL);
hiddenLayer.project(headLayer,synaptic.Layer.connectionType.ALL_TO_ALL);
headLayer.project(outputLayer,synaptic.Layer.connectionType.ALL_TO_ALL);

var sumFile = fs.readFileSync('./resCatOnpoint5.txt');
 var log_file = fs.createWriteStream(__dirname + '/debug2.log', {flags : 'w'});
 var log_stdout = process.stdout;


  pprint = function(d) { //
     log_file.write(util.format(d) + '\n');
//  //  // log_stdout.write(util.format(d) + '\n');
   };

 inputLayer.set({
     squash: synaptic.Neuron.squash.TANH
 })
 hiddenLayer.set({
     squash: synaptic.Neuron.squash.TANH
 })
 headLayer.set({
     squash: synaptic.Neuron.squash.TANH
 })
 outputLayer.set({
    squash: synaptic.Neuron.squash.TANH
})



var memoryTape = [Math.random(),Math.random(),Math.random(),Math.random()];
var tapeWeights = initializeTapeWeights();
var initialTapeWeights = tapeWeights;
var instructionSequence = [];

var testSequenceArray= [0,1];
var learningRate = .01;
var runLength =2000;
var learningRate = .3;


  
    
        
for (var i = 0; i < 2000; i++)
    {   



            train(testSequenceArray[0]);
            train(testSequenceArray[1]);

          
         
}
   

// test it



var negWeights = 0;
for(var i =0; i <outputLayer.list.length; i++){
     var connectionList = outputLayer.list[i]['connections'];
     for(var j =0; j<Object.keys(connectionList.inputs).length;j++){
        if(connectionList.inputs[Object.keys(connectionList.inputs)[j]]['weight'] < 0){
            negWeights+=1;
        }

        
     }
}

// var input = [0].concat(build_read(memoryTape,tapeWeights));

// inputLayer.activate();
//   hiddenLayer.activate();
//   headLayer.activate();
var actaulInputSequence = [0,1];
for(var iter3 =0; iter3 < actaulInputSequence.length; iter3++){

     var testSequence = actaulInputSequence[iter3];
        

            
            var input = build_read(memoryTape,tapeWeights);
            var tmpmem = memoryTape;

            inputLayer.activate(input.concat(testSequence));
            hiddenLayer.activate();
            headLayer.activate();

           
            // when A activates [1, 0, 1, 0, 1]
            // train B to activate [0,0]
            console.log(outputLayer.activate());




}







     
           
      





function train(input){


            var testSequence = input;
        

            
            var input = build_read(memoryTape,tapeWeights);
            var tmpmem = memoryTape;

            inputLayer.activate(input.concat(testSequence));
            hiddenLayer.activate();
            var headInputs = headLayer.activate();
           
          
            var erase  = headInputs.slice(0,1);

           
            var add = headInputs.slice(1,2);

            var key = sigmoidSingle(headInputs.slice(2,3));
            var beta = softplus(headInputs.slice(3,4));
            var gt = sigmoidSingle(headInputs.slice(4,5));
            var shift = headInputs.slice(5,8);
            var gamma = softplus(headInputs.slice(8,9))+1;

            var tmp = focus_by_content(memoryTape,key,beta);

            var tmp2 = focus_by_location(tmp,memoryTape,gt)


            var shift_convolveRes = softmax(shift_convolve(tmp2,shift));
            tapeWeights = sharpen(shift_convolveRes,gamma);

            var erased = build_erase(memoryTape,tapeWeights,erase);
            memoryTape = build_add(erased,tapeWeights,erase);

           
            // when A activates [1, 0, 1, 0, 1]
            // train B to activate [0,0]
                outputLayer.activate();
              outputLayer.propagate(learningRate, [testSequence]);

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
    return tmp;
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

    var tmp = [];
    for(var i = 0; i < tape_curr.length; i++){
        var res= 0;
        for(var j =0; j < tape_curr.length; j++){
            var moduloIndex= Math.abs((i-j)%tape_curr.length);
            if(moduloIndex < shift.length){
            res+=tape_curr[j]*shift[moduloIndex];
            }
            else{
                res+=0;
            }
            
        }
        tmp.push(res);
    }

    return tmp;
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