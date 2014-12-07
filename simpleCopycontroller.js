var synaptic = require('synaptic');
var memoryMatrix =require('./memoryMatrix');
//initial memory matrix 
var m_t = [[Math.random(),Math.random()],[Math.random(),Math.random()]];
var w_t = [.5,.5];
var r_t  =  readHeadConvolution(w_t,m_t);
var sequenceTocopy = [1];	
//train the neural network on the copy input task given a N=2 M=2 matrix
var inputLayer = new synaptic.Layer(r_t.concat(0).length);
var hiddenLayer = new synaptic.Layer(20);
var headLayer = new synaptic.Layer(11);
var outPutlayer = new synaptic.Layer(sequenceTocopy.length);
var learningRate = .3;
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(headLayer);
    headLayer.project(outPutlayer);

var myNetwork = new synaptic.Network({
    input: inputLayer,
    hidden: [hiddenLayer,headLayer],
    output: outPutlayer
});

 // connect the layers

for(var runTime = 0; runTime < sequenceTocopy.length; runTime++)
{	
    // when A activates 1
   	myNetwork.activate(r_t.concat(sequenceTocopy)); 

 	myNetwork.propagate(learningRate, sequenceTocopy);
 	

 	var emmitedHeadVector  = headLayer.activate();
 	

 	//Use the emmited heads 
 	//lets define emit head vector as [b_t, k_t, g_t, s_t,y_t,e_t,a_t]
 	var tmp1 = memoryMatrix.generateContentBasedNormalization(emmitedHeadVector[0],emmitedHeadVector.slice(1,3),m_t);
  	var tmp2 = memoryMatrix.interpolationGate(emmitedHeadVector.slice(3,4),tmp1,w_t);
 	var tmp3 = memoryMatrix.convolutionalShift(emmitedHeadVector.slice(4,6),tmp2,m_t);
	w_t = memoryMatrix.sharpening(tmp3,emmitedHeadVector.slice(6,7)*10,m_t);
	
	m_t= updateMemoryMatrix(m_t,w_t,emmitedHeadVector.slice(7,9),emmitedHeadVector.slice(9,11));
	r_t  =  readHeadConvolution(w_t,m_t);
	console.log('-------------------\n');
	   	console.log('New r_t vector ------> ' ,r_t); 
   	console.log('\n');
   	 console.log('New w_t vector ------> ' , w_t); 
   	console.log('\n');
   		console.log('M_T New------->  ',m_t);

 

	console.log('\n');
}
//in order to make the network differentiable you have to include the layers in 


console.log('FINAL -----> ' ,myNetwork.activate(r_t.concat(sequenceTocopy	))); 














//helper functions outlined in the paper 
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
function updateMemoryMatrix(m_t,w_t,e_t,a_t){
	var tmp=[];
	var ones = [];
	for(var i=0; i <w_t.length; i++){
		ones.push(1);
	}
	for(var i = 0; i < m_t.length; i++){
		var vec1 = m_t[i];
		var vec2 = numeric.sub(ones,numeric.mul(e_t,w_t[i]));
		tmp.push([vec1[0]*vec2[0],vec1[1]*vec2[1]]);
	}
	var finalMat = [];
	for(var i =0; i < tmp.length; i ++){
		finalMat.push([tmp[i][0]+w_t[i]*a_t[0]  ,tmp[i][1]+w_t[i]*a_t[1]    ]);

	}

	return finalMat;
}