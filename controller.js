var brain = require('brain');
var synaptic = require('./synaptic');
var memoryMatrix = require('./memoryMatrix');
var net = new brain.NeuralNetwork();
//console.log(memoryMatrix.memMat);
//input 
var w_t = {'0':Math.random(),'1':Math.random()};
var k_t ={'0':1,'1':1};
var b_t={'0':10};
var m_t =  [[2,3],[4,5]];
var e_t= {'0':1,'1':1};
var g_t = {'0':1};
var s_t={'0':0,'1':1};
var a_t={'0':0,'1':0};
var y_t= {'0':1};


//experiments with LSTM

function updateMemoryMatrix(m_t,w_t,e_t){
	var tmp=[];
	var ones = [];
	for(var i=0; i <w_t.length; i++){
		ones.push(1);
	}
	for(var i = 0; i < m_t.length; i++){
		tmp.push(numeric.dotVV(m_t[i], numeric.sub(ones,numeric.mul(e_t,w_t))));
	}

	return tmp;
}
function readHeadConvolution(w_t,m_t){
	var tmp =[];
	for(var i = 0; i <w_t.length;i++){
		var sum= 0;
		for(var j= 0; j<m_t.length; j++){
			sum+=w_t[i]*m_t[i][j];
		}
		tmp.push(sum);
	}
	return tmp;
}
function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new synaptic.Layer(input);
    var hiddenLayer = new synaptic.Layer(hidden);
    var outputLayer = new synaptic.Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}

// extend the prototype chain
Perceptron.prototype = new synaptic.Network();
Perceptron.prototype.constructor = Perceptron;

var target = length(e_t)+ length(a_t)+ length(k_t) + length(s_t) + length(b_t) + length(g_t) + length(y_t);	
var input = [1];
var r_t ={'0':1,'1':1};
var myNetwork = new Perceptron(length(r_t),50,target);
var learningRate = .3;
//construct input 

r_t[length(r_t)-1] = input[0];
console.log(inputToArray(r_t));
// test the network
var outputVector = myNetwork.activate(inputToArray(r_t));


var count = 0;
new_e_t = (outputVector.slice(0,length(e_t)));
count += length(e_t);
new_a_t =(outputVector.slice(count,count+length(a_t)));
count += length(a_t);
new_k_t = (outputVector.slice(count,count+length(k_t)));
count += length(k_t);
new_s_t = (outputVector.slice(count,count+length(s_t)));
count += length(s_t);
new_b_t = (outputVector.slice(count,count+length(b_t)));
count += length(b_t);
new_g_t = (outputVector.slice(count,count+length(g_t)));
count += length(g_t);
new_y_t = (outputVector.slice(count,count+length(y_t)));
console.log('New e_t ---> ', new_e_t);
console.log('New a_t ---> ',new_a_t);
console.log('New k_t ---> ',new_k_t);
console.log('New s_t ---> ',new_s_t);
console.log('New b_t ---> ',new_b_t);
console.log('New g_t ---> ',new_g_t);
console.log('New y_t ---> ',new_y_t);
console.log('M_T OLd------->  ',m_t);

 var tmp1 = memoryMatrix.generateContentBasedNormalization(new_b_t,new_k_t,m_t);
  var tmp2 = memoryMatrix.interpolationGate(new_g_t,tmp1,inputToArray(w_t));
 var tmp3 = memoryMatrix.convolutionalShift(arrayToInput(new_s_t),tmp2,m_t);
w_t = memoryMatrix.sharpening(tmp3,new_g_t,m_t);
 console.log(w_t);
r_t = readHeadConvolution(w_t,m_t);
m_t= updateMemoryMatrix(m_t,w_t,new_e_t)
console.log('M_T New------->  ',m_t);



function length(json){
	sum= 1;
	for(var key in json)
	{
  		sum+=1;
	}
	return sum-1;
}
function inputToArray(json){
	var array= [];
	for(var key in json)
	{
  		array.push(json[key]);
	}
	return array;
}

function arrayToInput(array){
	return {
		'-1':array[0],
		'0':array[1],
		'1':array[2]
	}


}




