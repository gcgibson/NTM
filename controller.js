var brain = require('brain');
var synaptic = require('synaptic');
var memoryMatrix = require('./memoryMatrix');
var net = new brain.NeuralNetwork();
//console.log(memoryMatrix.memMat);
var w_t = [1,1];
var k_t =[.5,.5];
var b_t=1;
var m_t =  [[.5,.5],[.5,.5]];
var e_t= [0,0];
var g_t = .5;
var s_t=[.5,.5];

 //var tmp1 = memoryMatrix.generateContentBasedNormalization(1,k_t,m_t);
 //console.log(tmp1 + " " +g_t + " " + previousWeightVector);
 //var tmp2 = memoryMatrix.interpolationGate(g_t,tmp1,w_t)
 //console.log(tmp2);
 //var tmp3 = memoryMatrix.convolutionalShift(s_t,tmp2,m_t);
// //console.log(tmp3);
 //var tmp4 = memoryMatrix.sharpening(tmp3,g_t,m_t);
// //console.log(tmp4);
var r_t = readHeadConvolution(w_t,m_t);
console.log(r_t);
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


var myNetwork = new Perceptron(2,10,2);

var learningRate = .3;
for (var i = 0; i < 20000; i++)
{
    // memory copy function
    myNetwork.activate(r_t);
    myNetwork.propagate(learningRate, r_t);

}
console.log(myNetwork.activate(r_t));




